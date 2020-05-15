<template>
    <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions" id="dataTemperatureGlobalChart"></highcharts>

</template>

<script>
    const alertTemperature = 200;
    export default {
        props : [
            'dataTemperatureGlobalChart',

        ],
        data () {
            return {
                stockOptions: {
                    title:{
                        text : ""
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
                            text: 'Télécabine',
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
                            text: 'Pralan',
                            style:{
                                color : '#f4b400'
                            },
                        },
                        labels: {
                            format: '{value} °C',
                        },

                        opposite: true


                    },{ // third yAxis
                        title: {
                            text: 'Pro de Savioz',
                            style:{
                                color : '#006600'
                            },
                        },
                        labels: {
                            format: '{value} °C',
                        },

                        opposite: true
                    }],



                    rangeSelector: false,

                    series: this.dataTemperatureGlobalChart,

                    legend :{
                        enabled : true,
                        layout: 'vertical',
                        align: 'left',
                        x: 30,
                        verticalAlign: 'top',
                        y: 0,
                        floating: true,

                    },
                    tooltip:{
                        pointFormat : '{series.name}: <b>{point.y:.2f}°C</b><br/>'
                    }





                }
            }
        },


        watch: {
            dataTemperatureGlobalChart (newValue) {
                this.stockOptions.series = newValue


            },



        }
    }
</script>
<style scoped>
    .stock {
        width: 70%;
        margin: 0 auto;
        padding-left: 0;
        padding-right: 0;
    }


</style>
