<template>
    <div class="temperature" id="temperature">
        <h1>{{sectorName}}</h1>

        <!-- dual chart big screen-->
        <br><br>
        <b-row align-v="center" class="m-4" v-if="window.width>windowLimitWidth" >

            <b-col sm> <!---->
                <TemperatureChart :dataTemperatureChart="series_dual"/>
            </b-col>

            <b-col cols="2" >
                <b-card class="card flex-fill" header="Capteur" align="center" >
                    <b-card-text  class="h2">{{dualSensorTemp}}°C</b-card-text>
                </b-card>
                <br>
                <b-card class="card flex-fill" header="Sol" align="center" >
                    <b-card-text  class="h2">{{dualFloorTemp}}°C</b-card-text>
                </b-card>

            </b-col>
        </b-row>
        <!-- dual chart small screen-->
        <div v-if="window.width<=windowLimitWidth">
            <h2>Température</h2>

            <b-card class="card flex-fill" header="Capteur" align="center" >
                <b-card-text  class="h2">{{dualSensorTemp}}°C</b-card-text>
            </b-card>
            <br>
            <b-card class="card flex-fill" header="Sol" align="center" >
                <b-card-text  class="h2">{{dualFloorTemp}}°C</b-card-text>
            </b-card>

        </div>




        <br><br>
        <!-- battery big screen-->
        <b-row align-v="center" class="text-center" v-if="window.width>windowLimitWidth">

            <!--battery chart-->
            <b-col sm >
                <BatteryChart :dataBatteryChart="series_battery" />
            </b-col>
            <!--Battery gauge-->
            <b-col cols="2">
                <GaugeChart  :dataGaugeChart="parseFloat(lastBatteryValue)"/>
            </b-col>
        </b-row>
        <!-- battery small screen-->
        <div v-if="window.width<=windowLimitWidth">
            <h2>Niveau de Batterie</h2>
            <b-card class="card flex-fill" header="Actuel" align="center" >
                <b-card-text  class="h2">{{lastBatteryValue}}V</b-card-text>
            </b-card>

        </div>




         </div>

     </template>

     <script>
         import Influx from 'influx'
         import moment from 'moment'
         import NProgress from 'nprogress'
         import credInflux from "../constants/influx"
         import TemperatureChart from "../components/TemperatureChart";
         import BatteryChart from "../components/BatteryChart";
         import GaugeChart from "../components/GaugeChart";


         import exportingInit from "highcharts/modules/exporting";

         import ChartModuleMore from 'highcharts/highcharts-more';
         import HCSolidGauge from 'highcharts/modules/solid-gauge'
         import Highcharts from "highcharts";

         exportingInit(Highcharts);
         ChartModuleMore(Highcharts);
         HCSolidGauge(Highcharts);


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
                 GaugeChart,
                 BatteryChart,
                 TemperatureChart,
             },
             mounted () {
                 newPath = this.sectorName                               //save the new path to know witch page to load
                 console.log("sectorname : " + this.sectorName)
                 NProgress.start();

       //          this.loadTemperatureFloorData(this.createQueryTemperatureFloor(newPath));

       //          this.loadTemperatureSensorData(this.createQueryTemperatureSensor(newPath));

                 this.dualData(this.createQueryTemperatureFloor(newPath), this.createQueryTemperatureSensor(newPath))
                 this.loadBatterySensorData(this.createQueryBattery(newPath));


                 oldPath=newPath;
             },


             /**
              * Done before the page updates
              * @param none
              */
             beforeUpdate() {
                 this.reloadPage()                                   // function to reload the page
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
                  * load temperature floor AND temperature Sensor data from the database
                  * @param paramQuery1
                  * @param paramQuerry2
                  */
                 dualData: function(paramQuery1,paramQuerry2) {
                     let serie1;
                     let serie2;
                     Promise.all([
                         client.query(paramQuery1),
                     ]).then(parsedRes => {
                          serie1 = parsedRes.map( arr => {
                             this.dualFloorTemp = arr[arr.length-1]['payload_fields_Illuminance_value'].toFixed(2); // temperature sol

                             return Object.assign({}, {
                                 data: arr.map( obj => Object.assign({}, {
                                     x: (moment(obj.time).unix())*1000,
                                     y: obj['payload_fields_Illuminance_value']
                                 }))
                             });

                         });

                         Promise.all([
                             client.query(paramQuerry2),
                         ]).then(parsedRes => {
                             serie2 = parsedRes.map( arr => {
                                 this.dualSensorTemp = arr[arr.length-1]['payload_fields_Air temperature_value'].toFixed(2); //temperature capteur

                                 return Object.assign({}, {
                                     data: arr.map( obj => Object.assign({}, {
                                         x: (moment(obj.time).unix())*1000,
                                         y: obj['payload_fields_Air temperature_value']
                                     }))
                                 });

                             });

                             //build final objet to send to chart
                             let serieFinal = [{
                                     name : 'Température du sol',
                                     color : '#4285f4', //bleu
                                     type : 'spline',
                                     turboThreshold:60000,           // if no data displayed : augmented it
                                     data : serie1[0].data
                             },{
                                     name : 'Température du capteur',
                                     color : '#f4b400', //orange
                                     type : 'spline',
                                     turboThreshold:60000,           // if no data displayed : augmented it
                                     data :serie2[0].data,
                             }]

                             this.series_dual = serieFinal
                             NProgress.done();
                         }).catch(error => console.log(error))
                     }).catch(error => console.log(error))
                 },

                 //----------------------------------WINDOW PART --------------------------------------------------------------------

                 handleResize : function(){
                     this.window.width = window.innerWidth;
                     this.window.height = window.innerHeight;
                 },

             },

             data () {
                 return {

                     series_battery : [{
                         turboThreshold: 60000,
                         data: [],

                     }],

                     lastTemperatureFloorValue:"",
                     lastTemperatureSensorValue:"",
                     lastBatteryValue:"",

                     series_dual:[{
                         data: [],
                     }],

                     dualFloorTemp:"",
                     dualSensorTemp:"",

                     //----------Window
                     //----------Window
                     window:{
                         width:0,
                         height:0,
                     },
                     windowLimitWidth : 900,


                 }
             },
         }



     </script>

     <style scoped>
         #temperature {
             font-family: Roboto;
         }

         body{
             background-color: #f4f7fc;
         }

     </style>
