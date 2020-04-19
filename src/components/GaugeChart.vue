<template>
    <highcharts class="stock" :constructor-type="'chart'" :options="gaugeOptions"></highcharts>
</template>


<script>

    export default {
        props : [
            'dataGaugeChart',


        ],
        data () {
            return {
                gaugeOptions: {
                    chart: {
                        type: 'solidgauge'
                    },

                    title: null,

                    pane: {
                        center: ['50%', '85%'],
                        size: '140%',
                        startAngle: -90,
                        endAngle: 90,
                        background: {
                            backgroundColor:'red',
                            innerRadius: '60%',
                            outerRadius: '100%',
                            shape: 'arc'
                        }
                    },

                    exporting: {
                        enabled: false
                    },

                    tooltip: {
                        enabled: false
                    },

                    // the value axis
                    yAxis: {
                        stops: [
                            [0.1, '#55BF3B'], // green
                            [0.5, '#DDDF0D'], // yellow
                            [0.9, '#DF5353'] // red
                        ],
                        lineWidth: 0,
                        tickWidth: 0,
                        minorTickInterval: null,
                        tickAmount: 2,
                        title: {
                            y: -70
                        },
                        labels: {
                            y: 16
                        }
                    },




                    series: this.dataGaugeChart,

                }
            }
        },


        watch: {
            dataGaugeChart (newValue) {
                console.log("gauge new value")
                console.log(newValue)
                this.gaugeOptions.series = newValue
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
