<template>
    <div class="level">
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
                <div class = "" style="...">Temperature</div>
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
            NProgress.start();
            this.loadLevelData();
            this.loadBatteryData();
        },
        methods : {
            loadLevelData: function() {
                Promise.all([
                    client.query('SELECT * FROM temperature_cuisine WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastTemperatureValue = arr[arr.length-1]['temperature'];

                        return Object.assign({}, {
                            name: "temperature",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['temperature']
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
