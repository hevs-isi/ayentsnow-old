<template>
    <div class="temperature">
        <h3>{{sectorName}}</h3>
        <!-- floor temperature -->
        <b-row align-v="center" class="text-center">

            <b-col sm="2">
                <div class="mb-4" style="font-size: 130%">Temperature du sol </div>
                <img src="../assets/svg/temperature.svg" class="my-auto" style="max-width: 50%"/>
            </b-col>

            <b-col sm>
                <StockChart :data="series_temperature"/>
            </b-col>

            <b-col cols="2">
                <div class = "" style="...">Temperature actuelle du sol</div>
                <div class = "" style="..."> {{lastTemperatureFloorValue}} °C</div>
            </b-col>
        </b-row>


        <br><br>
        <!-- Batterie level -->
        <b-row align-v="center" class="text-center">
            <b-col sm="2">
                <div class="mb-4" style="font-size: 130%">Niveau de batterie </div>
                <img src="../assets/svg/battery.svg" class="my-auto" style="max-width: 50%"/>
            </b-col>
            <b-col sm>
                <StockChart :data="series_batterie"/>
            </b-col>

            <b-col cols="2">
                <div class = "" style="...">Niveau de batterie actuel</div>
                <div class = "" style="..."> {{lastBatteryValue}} V</div>
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

            this.loadTemperatureCapteurData(this.createQueryTemperatureCapteur(newPath));
            this.loadBatteryCapteurData(this.createQueryBatteryCapteur(newPath));
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
  //                  this.loadTemperatureData(this.createQuery(newPath));

                }
            },

            /**
             * return the query in function of the path (sectorname) in real life this is the illuminance_value
             * @param page
             * @returns {string}
             */
            createQueryTemperatureCapteur : function(page){
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
             * return the query in function of the path (sectorname) in real life this is the battery voltage_value
             * @param page
             * @returns {string}
             */
            createQueryBatteryCapteur : function(page){
                let returnQuery
                switch(page.toString()){
                    case "Télécabine":
                        returnQuery = 'SELECT "payload_fields_Battery voltage_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/ambient_sensor_2/up' + "'"
                        break;
                    case "Pralan":
                        returnQuery = 'SELECT "payload_fields_Battery voltage_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/70b3d57ba0000bd0/up' + "'"
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
             * load temperature data from the database
             * @param paramQuery
             */
            loadTemperatureCapteurData: function(paramQuery) {

                console.log("query : " + paramQuery)

                Promise.all([
                    client.query(paramQuery),
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastTemperatureFloorValue = arr[arr.length-1]['payload_fields_Illuminance_value'].toFixed(2)/10; //to fixed: fix number of digit

                        console.log(mutatedArray)

                        return Object.assign({}, {
                            name: "Temperature capteur", // name on the chart
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
            /**
             * load Battery data from the database
             * @param paramQuery
             */
            loadBatteryCapteurData: function(paramQuery) {

                console.log("query : " + paramQuery)
                Promise.all([
                    client.query(paramQuery),
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastBatteryValue = arr[arr.length-1]['payload_fields_Battery voltage_value'].toFixed(2); //to fixed: fix number of digit

                        console.log(mutatedArray)

                        return Object.assign({}, {
                            name: "Niveau de batterie", // name on the chart
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['payload_fields_Battery voltage_value']
                            }))
                        });

                    });
                    this.series_batterie = mutatedArray;
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
                series_batterie : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],
                lastTemperatureFloorValue:"",
                lastBatteryValue:"",

            }

        }

    }



</script>

<style scoped>

</style>
