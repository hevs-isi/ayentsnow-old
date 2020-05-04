<template>
    <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions"></highcharts>
</template>

<script>
    const alertBattery = 2.625;
    export default {
        props : [
            'dataBatteryChart',

        ],
        data () {
            return {
                stockOptions: {
                    title:{
                        text : "Niveau de batterie"
                    },
                    chart:{
                        style:{
                            fontFamily: 'Roboto'
                        }
                    },


                    yAxis: [{ // Primary yAxis
                        title: {
                            text: 'Niveau de batterie',
                            style : {
                                color :  '#7cb5ec'
                            },
                        },
                        labels: {
                            format: '{value} V',
                        },

                        opposite : true,
                        plotLines:[{
                            value : alertBattery,
                            color: 'red',
                            dashStyle:'shortdash',
                            width: 2,
                            label:{
                                text: 'Alert batterie'
                            }
                        }]

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
                    series: this.dataBatteryChart,

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
            dataBatteryChart (newValue) {
                this.stockOptions.series = newValue
            },
        }
    }
</script>
<style scoped>
    .stock {
        width: 70%;
        margin: 0 auto
    }
</style>
