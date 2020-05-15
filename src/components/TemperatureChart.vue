<template>
    <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions" id="temperaturechart"></highcharts>

</template>

<script>
    const alertTemperature = 200;
    export default {
        props : [
            'dataTemperatureChart',

        ],
        data () {
            return {
                stockOptions: {
                    title:{
                      text : "Température"
                    },

                    chart:{
                      style:{
                          fontFamily: 'Roboto'
                      },
                        backgroundColor:'#f4f7fc'
                    },
                    scrollbar: {
                        barBackgroundColor: '#cccccc',
                        barBorderRadius: 7,
                        barBorderWidth: 0,
                        buttonBackgroundColor: '#cccccc',
                        buttonBorderWidth: 0,
                        buttonBorderRadius: 7,
                        trackBackgroundColor: 'none',
                        trackBorderWidth: 1,
                        trackBorderRadius: 8,
                        trackBorderColor: '#CCC'
                    },

                    yAxis: [{ // Primary yAxis
                        title: {
                            text: 'Température du sol',
                            style : {
                                color :  '#4285f4'
                            },
                        },
                        labels: {
                            format: '{value}°C',
                        },

                        opposite : true,
                        plotLines:[{
                            value : alertTemperature,
                            color: 'red',
                            dashStyle:'shortdash',
                            width: 2,
                            label:{
                                text: 'Alert gel'
                            }
                        }]

                    }, { // Secondary yAxis
                        title: {
                            text: 'Température du capteur',
                            style:{
                                color : '#f4b400'
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
                    tooltip:{
                        pointFormat : '{series.name}: <b>{point.y:.2f}°C</b><br/>'
                    }





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
