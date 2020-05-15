<template>
    <div class="neige" id="neige">
        <h1> Hauteur de neige : {{sectorName}}</h1>

        <b-row class="m-4">
            <b-col>
                <b-card class="card flex-fill"
                        header="Il y a 1 heure"
                        align="center"
                > <!--border-variant="secondary" AND header-border-variant="secondary" for border black -->
                    <b-card-text v-if = "last1h_snow.length != 0" class="h1">{{last1h_snow}}cm</b-card-text>
                    <b-card-text v-if = "last1h_snow.length == 0" class="h1" >{{lastSnowValue}}cm</b-card-text> <!--test if there is a value saved or not -->

                </b-card>
            </b-col>
            <b-col>
                <b-card
                        header="Il y a 30 minutes"
                        align="center"
                >
                    <b-card-text v-if = "last30min_snow.length != 0 " class="h1" >{{last30min_snow}}cm</b-card-text>
                    <b-card-text v-if = "last30min_snow.length == 0 " class="h1" >{{lastSnowValue}}cm</b-card-text> <!-- test if there is a value saved or not -->

                </b-card>
            </b-col>
            <b-col>
                <b-card
                        header="Actuellement"
                        align="center"
                >
                    <b-card-text class="h1">{{lastSnowValue}}cm</b-card-text>
                </b-card>
            </b-col>
        </b-row>
        <b-row class="m-4">
            <b-col>
                <b-card
                        header="Delta sur 1 heure"
                        align="center"
                >
                    <b-card-text class="">
                        <span class="h1 mr-3 align-middle">{{delta_snow}}cm</span>

                        <img v-if = "delta_snow < 0 " src="../assets/svg/diagonal-arrow-down.svg" style="max-width: 2%" class="align-middle"/>
                       <!-- <span  v-if = "delta_snow < 0 " class="h1 mr-3 align-middle">down </span> -->

                        <img v-if = "delta_snow > 0 " src="../assets/svg/diagonal-arrow-up.svg" style="max-width: 2%" class="align-middle"/>
                       <!-- <span v-if = "delta_snow > 0 " class="h1 mr-3 align-middle">up </span> -->

                    </b-card-text>
                </b-card>
            </b-col>
        </b-row>
        <br><br>
        <b-row class="m-4" v-if="window.width>windowLimitWidth">
                <SnowChart :dataSnowChart="series_snow"/>
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

        /**
         * Get the windows size
         */
        created() {
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
        },
        /**
         * destroy listener for windows size
         */
        destroyed() {
            window.removeEventListener('resize', this.handleResize);

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

                console.log("paramQuerry actual")
                console.log("query : " + paramQuery)

                Promise.all([
                    client.query(paramQuery), //
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastSnowValue = arr[arr.length-1]['payload_fields_Air humidity_value'].toFixed(2); //to fixed: fix number of digit

                        return Object.assign({}, {
                            name: "Hauteur de neige",
                            color : '#4285f4',
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['payload_fields_Air humidity_value']
                            })),


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
                console.log("paramQuerry 30min")
                console.log("query : " + paramQuery+ ' AND time>now()-30m order by time asc limit 1')

                Promise.all([
                    client.query(paramQuery + ' AND time>now()-30m order by time asc limit 1' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.last30min_snow = arr[arr.length-1]['payload_fields_Air humidity_value'].toFixed(2); //to fixed: fix number of digit
                    });

                    console.log(this.last30min_snow)
                }).catch(error => console.log(error))
            },
            /**
             * load snow data 1hour ago
             */
            load1hSnowData: function(paramQuery) {
                console.log("paramQuerry 1h")
                console.log("query : " + paramQuery + ' AND time>now()-1h order by time asc limit 1')
                Promise.all([
                    client.query(paramQuery + ' AND time>now()-1h order by time asc limit 1' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.last1h_snow = arr[arr.length-1]['payload_fields_Air humidity_value'].toFixed(2); //to fixed: fix number of digit

                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },

            /**
             * calculate the difference in snowfall between now and an hour ago
             */
            calculate_delta_snow : function(){
                if(this.last1h_snow != ""){
                    this.delta_snow = (this.lastSnowValue - this.last1h_snow).toFixed(2)
                }else{
                    this.delta_snow = 0;
                }

                console.log(this.delta_snow)
            },

            //----------------------------------WINDOW PART --------------------------------------------------------------------

            handleResize : function(){
                this.window.width = window.innerWidth;
                this.window.height = window.innerHeight;
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

                //----------Window
                window:{
                    width:0,
                    height:0,
                },
                windowLimitWidth : 700,
            }

        }

    }
</script>

<style >
    #neige {
        font-family: Roboto;
    }
    body{
        background-color: #f4f7fc;
    }

</style>
