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
                    <b-card-text class="h1">{{last1h_snow}} cm</b-card-text>
                </b-card>
            </b-col>
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Hauteur de neige il y a 30 minutes"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text class="h1">{{last30min_snow}} cm</b-card-text>
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

        <StockChart :data="series_snow"/>

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
        name: 'neige',
        components: {

            StockChart,
        },
        mounted () {
            NProgress.start();
            this.loadActualSnowData();
            this.load30minSnowData();
            this.load1hSnowData();
            this.calculate_delta_snow();
            console.log(this.delta_snow);

        },
        methods : {
            /**
             * load actual snow data
             */
            loadActualSnowData: function() {
                Promise.all([
                    client.query('SELECT * FROM temperature_cuisine WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastSnowValue = arr[arr.length-1]['temperature'].toFixed(2); //to fixed: fix number of digit

                        return Object.assign({}, {
                            name: "temperature",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['temperature']
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
            load30minSnowData: function() {
                Promise.all([
                    client.query('SELECT * FROM temperature_cuisine WHERE time>now()-30m' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.last30min_snow = arr[arr.length-1]['temperature'].toFixed(2); //to fixed: fix number of digit
                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },
            /**
             * load snow data 1hour ago
             */
            load1hSnowData: function() {
                Promise.all([
                    client.query('SELECT * FROM temperature_cuisine WHERE time>now()-1h' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.last1h_snow = arr[arr.length-1]['temperature'].toFixed(2); //to fixed: fix number of digit
                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },

            /**
             * calculate the difference in snowfall between now and an hour ago
             */
            calculate_delta_snow : function(){
                this.delta_snow= this.lastSnowValue - this.last1h_snow
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
