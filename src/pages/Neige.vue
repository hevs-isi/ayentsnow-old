<template>
    <div class="neige">
        <h3>{{sectorName}}</h3>

        <b-row class="m-4">
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Hauteur de neige il y a 1 heure"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text v-if = "last1h_snow.length != 0" class="h1">{{last1h_snow}} cm</b-card-text>
                    <b-card-text v-if = "last1h_snow.length == 0" class="h1">{{lastSnowValue}} cm</b-card-text> <!--test if there is a value saved or not -->

                </b-card>
            </b-col>
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Hauteur de neige il y a 30 minutes"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text v-if = "last30min_snow.length != 0 " class="h1">{{last30min_snow}} cm</b-card-text>
                    <b-card-text v-if = "last30min_snow.length == 0 " class="h1">{{lastSnowValue}} cm</b-card-text> <!-- test if there is a value saved or not -->

                </b-card>
            </b-col>
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Hauteur de neige maintenant"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text class="h1">{{lastSnowValue}} cm</b-card-text>
                </b-card>
            </b-col>
        </b-row>
        <b-row class="m-4">
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Delta sur 1 heure"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text class="">
                        <span class="h1 mr-3 align-middle">{{delta_snow}} cm</span>
                        <img src="../assets/svg/diagonal-arrow-up.svg" style="max-width: 2%" class="align-middle"/>
                    </b-card-text>
                </b-card>
            </b-col>
        </b-row>
        <br><br>
        <b-row align-v="center" class="text-center">
            <b-col sm="2">
                <img src="../assets/svg/snowflake.jpg" class="my-auto" style="max-width: 50%"/>
            </b-col>
            <b-col sm>
                <SnowChart :dataSnowChart="series_snow"/>
            </b-col>
            <b-col sm="2"></b-col>
        </b-row>



    </div>

</template>

<script>
    import Influx from 'influx'
    import moment from 'moment'
    import NProgress from 'nprogress'
    import credInflux from "../constants/influx";
    import SnowChart from "../components/SnowChart";

    var newPath;                                                    //new path taken from the URl
    var oldPath;                                                    //old path taken from the URL


    const client = new Influx.InfluxDB({
        database: credInflux.database,
        host: credInflux.host,
        port: credInflux.port,
        protocol: credInflux.protocol,
        username: credInflux.username,
        password: credInflux.password
    });

    export default {
        props : [
            'sectorName'
        ],
        name: 'neige',
        components: {
            SnowChart,

        },
        mounted () {
            newPath = this.sectorName
            NProgress.start();


            this.loadActualSnowData(this.createQuerySnow(newPath));
            this.load30minSnowData(this.createQuerySnow(newPath));
            this.load1hSnowData(this.createQuerySnow(newPath));

            oldPath=newPath;

        },
        // done when before the page updated
        beforeUpdate() {
            this.reloadPage()                                   // function to reload the page
        },
        updated() {
            this.calculate_delta_snow();

        },

        methods : {
            /**
             * reload de page when the user switch the room
             */
            reloadPage : function(){
                newPath = this.sectorName
                if(newPath !== oldPath){
                    console.log(newPath)
                    location.reload()
     //               this.loadActualSnowData(this.createQuery(newPath));
     //               this.load30minSnowData(this.createQuery(newPath));
     //               this.load1hSnowData(this.createQuery(newPath));
                }
            },
            /**
             * return the query in function of the path (sectorname)
             * @param page
             * @returns {string}
             */
            createQuerySnow : function(page){
                let returnQuery
                switch(page.toString()){
                    case "Télécabine":
                        returnQuery = 'select "payload_fields_Air humidity_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/ambient_sensor_2/up' + "'"
                        break;
                    case "Pralan":
                        returnQuery = 'select "payload_fields_Air humidity_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/70b3d57ba0000bd0/up' + "'"
                        break;

                    default :
                        console.log("returnQuery : switch default case")
                        break;
                }

                return returnQuery
            },

            /**
             * load actual snow data
             */
            loadActualSnowData: function(paramQuery) {

                console.log("query : " + paramQuery)

                Promise.all([
                    client.query(paramQuery), //
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastSnowValue = arr[arr.length-1]['payload_fields_Air humidity_value'].toFixed(2); //to fixed: fix number of digit

                        return Object.assign({}, {
                            name: "neige",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['payload_fields_Air humidity_value']
                            }))
                        });
                    });
                    this.series_snow = mutatedArray;
                    NProgress.done();
                }).catch(error => console.log(error))
            },
            /**
             * load snow data 30min ago
             */
            load30minSnowData: function(paramQuery) {
                Promise.all([
                    client.query(paramQuery + ' AND time>now()-30m order by time asc limit 1' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.last30min_snow = arr[arr.length-1]['payload_fields_test_neige'].toFixed(2); //to fixed: fix number of digit
                    });

                    console.log(this.last30min_snow)
                }).catch(error => console.log(error))
            },
            /**
             * load snow data 1hour ago
             */
            load1hSnowData: function(paramQuery) {
                Promise.all([
                    client.query(paramQuery + ' AND time>now()-1h order by time asc limit 1' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.last1h_snow = arr[arr.length-1]['payload_fields_test_neige'].toFixed(2); //to fixed: fix number of digit

                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },

            /**
             * calculate the difference in snowfall between now and an hour ago
             */
            calculate_delta_snow : function(){
                if(this.last1h_snow != ""){
                    this.delta_snow = this.lastSnowValue - this.last1h_snow
                }else{
                    this.delta_snow = 0;
                }

                console.log(this.delta_snow)
            },

        },
        data () {
            return {
                series_snow : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],

                lastSnowValue:"",
                last30min_snow:"",
                last1h_snow:"",
                delta_snow:"",

            }

        }

    }
</script>

<style scoped>

</style>
