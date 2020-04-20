<template>
    <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions" id="temperaturechart"></highcharts>

</template>

<script>
    export default {
        props : [
            'dataTemperatureChart',

        ],
        data () {
            return {
                stockOptions: {
                    title:{
                      text : "Temperature"
                    },

                    chart:{
                      style:{
                          fontFamily: 'Roboto'
                      }
                    },

                    yAxis: [{ // Primary yAxis
                        title: {
                            text: 'Temperature du sol',
                            style : {
                                color :  '#7cb5ec'
                            },
                        },
                        labels: {
                            format: '{value}°C',
                        },

                        opposite : true

                    }, { // Secondary yAxis
                        title: {
                            text: 'Temperature du capteur',
                            style:{
                                color : 'black'
                            },
                        },
                        labels: {
                            format: '{value} °C',
                        },

                        opposite: true
                    }],



                    rangeSelector: {
                        selected: 'all',
                        buttons: [{
                            type: 'hour',
                            count: 6,
                            text: '6h',
                        }, {
                            type: 'hour',
                            count: 24,
                            text: '24h'
                        }, {
                            type: 'day',
                            count: 7,
                            text: '7d'
                        }, {
                            type: 'month',
                            count: 1,
                            text: '1m'
                        }, {
                            type: 'month',
                            count: 3,
                            text: '3m'
                        }, {
                            type: 'all',
                            text: 'All'
                        }]
                    },
                    series: this.dataTemperatureChart,

                    legend :{
                        enabled : true,
                        layout: 'vertical',
                        align: 'left',
                        x: 30,
                        verticalAlign: 'top',
                        y: 65,
                        floating: true,

                    },




                }
            }
        },


        watch: {
            dataTemperatureChart (newValue) {
                this.stockOptions.series = newValue


            },



        }
    }
</script>
<style scoped>
    .stock {
        width: 70%;
        margin: 0 auto;
    }


</style>
