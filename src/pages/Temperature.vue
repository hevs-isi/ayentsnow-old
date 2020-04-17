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
                <StockChart :data="series_temperatureFloor"/>
            </b-col>

            <b-col cols="2">
                <div class = "" style="...">Temperature actuelle du sol</div>
                <div class = "" style="..."> {{lastTemperatureFloorValue}} °C</div>
            </b-col>
        </b-row>

        <br><br>
        <!-- sensor temperature -->
        <b-row align-v="center" class="text-center">
            <b-col sm="2">
                <div class="mb-4" style="font-size: 130%">Temperature du capteur </div>
                <img src="../assets/svg/temperature.svg" class="my-auto" style="max-width: 50%"/>
            </b-col>
            <b-col sm>
                <StockChart :data="series_temperatureSensor"/>
            </b-col>

            <b-col cols="2">
                <div class = "" style="...">Temperature actuelle du capteur</div>
                <div class = "" style="..."> {{lastTemperatureSensorValue}} °C</div>
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
                <StockChart :data="series_battery" />
            </b-col>

            <b-col cols="2">
                <div class = "" style="...">Niveau actuel de la batterie</div>
                <div class = "" style="..."> {{lastTemperatureSensorValue/10}} V</div>
            </b-col>
        </b-row>

        <br><br>


        <!-- dual chart-->
        <b-row align-v="center" class="text-center">
            <b-col sm="2">
                <div class="mb-4" style="font-size: 130%">test dual courbe </div>
            </b-col>
            <b-col sm>
                <TemperatureChart :dataTemperatureChart="series_dual"/>
            </b-col>

            <b-col cols="2">

            </b-col>
        </b-row>

    </div>

</template>

<script>
    import Influx from 'influx'
    import moment from 'moment'
    import NProgress from 'nprogress'
    import StockChart from '../components/StockChart.vue'
    import credInflux from "../constants/influx"
    import TemperatureChart from "../components/TemperatureChart";

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
            TemperatureChart,
            StockChart,
        },
        mounted () {
            newPath = this.sectorName                               //save the new path to know witch page to load
            console.log("sectorname : " + this.sectorName)
            NProgress.start();

            this.loadTemperatureFloorData(this.createQueryTemperatureFloor(newPath));
            this.loadBatterySensorData(this.createQueryBattery(newPath));
            this.loadTemperatureSensorData(this.createQueryTemperatureSensor(newPath));

            this.dualData(this.createQueryTemperatureFloor(newPath))

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
                }
            },

    //----------------------------------------------------------------------------------------------------------

            /**
             * return the query in function of the path (sectorname) in real life this is the illuminance_value
             * @param page
             * @returns {string}
             */
            createQueryTemperatureFloor : function(page){
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
             * return the query in function of the path (sectorname) in real life this is the Air temperature_value
             * @param page
             * @returns {string}
             */
            createQueryTemperatureSensor : function(page){
                let returnQuery
                switch(page.toString()){
                    case "Télécabine":
                        returnQuery = 'select "payload_fields_Air temperature_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/ambient_sensor_2/up' + "'"
                        break;
                    case "Pralan":
                        returnQuery = 'select "payload_fields_Air temperature_value" from mqtt_consumer WHERE topic = ' + "'" + 'ayent_monitoring/devices/70b3d57ba0000bd0/up' + "'"
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
            createQueryBattery : function(page){
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
    //----------------------------------------------------------------------------------------------------------
            /**
             * load temperature of the floor data from the database
             * @param paramQuery
             */
            loadTemperatureFloorData: function(paramQuery) {

                console.log("query : " + paramQuery)

                Promise.all([
                    client.query(paramQuery),
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastTemperatureFloorValue = arr[arr.length-1]['payload_fields_Illuminance_value'].toFixed(2); //to fixed: fix number of digit


                        return Object.assign({}, {

                            name: "Temperature au sol", // name on the chart
                            turboThreshold:60000,
                            tooltip: {
                                valueSuffix: ' °C'
                            },
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['payload_fields_Illuminance_value']
                            }))
                        });

                    });
                    this.series_temperatureFloor = mutatedArray;
                    NProgress.done();
                }).catch(error => console.log(error))
            },

            /**
             * load temperature of the sensor data from the database
             * @param paramQuery
             */
            loadTemperatureSensorData: function(paramQuery) {

                console.log("query : " + paramQuery)

                Promise.all([
                    client.query(paramQuery),
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastTemperatureSensorValue = arr[arr.length-1]['payload_fields_Air temperature_value'].toFixed(2); //to fixed: fix number of digit


                        return Object.assign({}, {

                            name: "Temperature sensor", // name on the chart
                            turboThreshold:60000,
                            tooltip: {
                                valueSuffix: ' °C'
                            },
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['payload_fields_Air temperature_value']
                            }))
                        });

                    });
                    this.series_temperatureSensor = mutatedArray;
                    NProgress.done();
                }).catch(error => console.log(error))
            },

            /**
             * load Battery data from the database
             * @param paramQuery
             */
            loadBatterySensorData: function(paramQuery) {

                console.log("query : " + paramQuery)
                Promise.all([
                    client.query(paramQuery),
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastBatteryValue = arr[arr.length-1]['payload_fields_Battery voltage_value'].toFixed(2); //to fixed: fix number of digit


                        return Object.assign({}, {

                            name: "Niveau de batterie", // name on the chart
                            turboThreshold:60000,
                            tooltip: {
                                valueSuffix: ' V'
                            },
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['payload_fields_Battery voltage_value']
                            }))
                        });

                    });
                    this.series_battery = mutatedArray;
                    NProgress.done();
                }).catch(error => console.log(error))
            },


            /**
             * load Battery data from the database
             * @param paramQuery
             */
            dualData: function(paramQuery1) {

                console.log("query : " + paramQuery1)
                Promise.all([
                    client.query(paramQuery1),
                ]).then(parsedRes => {
                    const mutatedArray1 = parsedRes.map( arr => {
                        this.dualValue = arr[arr.length-1]['payload_fields_Illuminance_value'].toFixed(2); //to fixed: fix number of digit


                        return Object.assign({}, {


                            name: "Temperature du sol", // name on the chart
                            turboThreshold:60000,
                            tooltip: {
                                valueSuffix: ' °C'
                            },
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['payload_fields_Illuminance_value']
                            }))
                        });

                    });






                    this.series_dual= mutatedArray1


                    NProgress.done();
                }).catch(error => console.log(error))
            },


        },





        data () {
            return {


                series_temperatureFloor : [{
                  //  turboThreshold:60000,
                    data: [],

                }],

                series_temperatureSensor: [{
                   // turboThreshold:60000,
                    data: [],

                }],

                series_battery : [{
                  //  turboThreshold:60000,
                    data: [],

                }],




                lastTemperatureFloorValue:"",
                lastTemperatureSensorValue:"",
                lastBatteryValue:"",

                series_dual:[{
                    data: [],
                }],

                dualValue:"",



            }

        },








    }



</script>

<style scoped>

</style>
