<template>
    <div class="temperature">
        <h3>{{sectorName}}</h3>
            <b-row align-v="center" class="text-center">

            <b-col sm="2">
                <div class="mb-4" style="font-size: 130%">Temperature</div>
                <img src="../assets/svg/temperature.svg" class="my-auto" style="max-width: 50%"/>
            </b-col>

            <b-col sm>
                <StockChart :data="series_temperature"/>
            </b-col>

            <b-col cols="2">
                <div class = "" style="...">Temperature actuelle</div>
                <div class = "" style="..."> {{lastTemperatureValue}} °C</div>
            </b-col>
        </b-row>




    </div>

</template>

<script>
    import Influx from 'influx'
    import moment from 'moment'
    import NProgress from 'nprogress'
    import StockChart from '../components/StockChart.vue'
    import credInflux from "../constants/influx";

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
        name: 'temperature',
        components: {
            StockChart,
        },
        mounted () {
            newPath = this.sectorName                               //save the new path to know witch page to load
            console.log("sectorname : " + this.sectorName)
            NProgress.start();

            this.loadTemperatureData(this.createQueryTemperatureCatpeur(newPath));
            oldPath=newPath;
        },

        // done when before the page updated
        beforeUpdate() {
            this.reloadPage()                                   // function to reload the page
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
                    //this.loadTemperatureData(this.createQuery(newPath));

                }
            },

            /**
             * return the query in function of the path (sectorname) in real life this is the illuminance_value
             * @param page
             * @returns {string}
             */
            createQueryTemperatureCatpeur : function(page){
                let returnQuery
                switch(page.toString()){
                    case "Télécabine":
                        returnQuery = 'select "payload_fields_Illuminance_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/ambient_sensor_2/up' + "'"
                        break;
                    case "Pralan":
                        returnQuery = 'select "payload_fields_Illuminance_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/70b3d57ba0000bd0/up' + "'"
                        break;
                    case "Pro de Savioz":
                        returnQuery = ''
                        break;
                    default :
                        console.log("returnQuery : switch default case")
                        break;
                }

                return returnQuery
            },


            /**
             * load data from the database
             * @param paramQuery
             */
            loadTemperatureData: function(paramQuery) {

                console.log("query : " + paramQuery)

                Promise.all([
                    client.query(paramQuery),
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastTemperatureValue = arr[arr.length-1]['payload_fields_Illuminance_value'].toFixed(2)/10; //to fixed: fix number of digit

                        console.log(mutatedArray)

                        return Object.assign({}, {
                            name: "temperature capteur", // name on the chart
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['payload_fields_Illuminance_value']
                            }))
                        });
                    });
                    this.series_temperature = mutatedArray;
                    NProgress.done();
                }).catch(error => console.log(error))
            },

        },



        data () {
            return {

                series_temperature : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],
                lastTemperatureValue:"",

            }

        }

    }



</script>

<style scoped>

</style>
