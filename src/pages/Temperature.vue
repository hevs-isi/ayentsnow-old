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
    let myTopic;

    let myQuery;


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

            this.refresh(newPath)                                   //refresh chart if sector name has changed

            myTopic = this.findTopic(newPath)
            myQuery = 'select payload_fields_test_temp from mqtt_consumer WHERE topic = ' + "'" + myTopic + "'"
            this.loadTemperatureData(myQuery);

        },

        methods : {
            /**
             * function to refresh the page with in function of the sector
             * refresh only the chart not all the page
             */
            refresh: function(page){
                switch (page.toString()) {
                    case "Télécabine":
                        this.loadTemperatureData();
                        break;
                    case "Pralan":
             //to do : query this sector temperature
                        break;
                    case "Pro de Savioz":
             //to do : query this sector temperature
                        break;
                }
            },

            /**
             * return the right topic in function of the sectorname
             */
            findTopic : function(page){
                let returnTopic
                switch(page.toString()){
                    case "Télécabine":
                        returnTopic = 'mayentest/devices/id_test_location1/up'
                        break;
                    case "Pralan":
                        returnTopic = 'mayentest/devices/id_test_location2/up'
                        break;
                    case "Pro de Savioz":
                        returnTopic = ''
                        break;
                    default :
                        console.log("findtopic : switch default case")
                        break;
                }

                return returnTopic
            },
            loadTemperatureData: function(paramQuery) {

                console.log("query : " + paramQuery)

                Promise.all([
                    client.query(paramQuery),
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastTemperatureValue = arr[arr.length-1]['payload_fields_test_temp'].toFixed(2); //to fixed: fix number of digit

                        console.log(mutatedArray)

                        return Object.assign({}, {
                            name: "temperature", // name on the chart
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['payload_fields_test_temp']
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
