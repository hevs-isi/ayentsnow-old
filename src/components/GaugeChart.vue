<template>
    <highcharts class="gauge" :constructor-type="'solidgauge'" :options="gaugeOptions"></highcharts>
</template>


<script>

    export default {

        data() {
            return {
                gaugeOptions: {
                    chart: {
                        type: 'solidgauge',
                        enabled : true
                    },

                    title: null,

                    pane: {
                        center: ['50%', '85%'],
                        size: '140%',
                        startAngle: -90,
                        endAngle: 90,
                        background: {
                            backgroundColor: 'red',
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

                    credits: {
                        enabled: true
                    },
                    //  series: this.dataGaugeChart,


                    series: [{
                        name: 'Speed',
                        type : 'gauge',
                        data: [80],
                        dataLabels: {
                            format:
                                '<div style="text-align:center">' +
                                '<span style="font-size:25px">{y}</span><br/>' +
                                '<span style="font-size:12px;opacity:0.4">km/h</span>' +
                                '</div>'
                        },
                        tooltip: {
                            valueSuffix: ' km/h'
                        }

                    }]

                }
            }

        }
    }

</script>
<style scoped>
    .stock {
        width: 70%;
        margin: 0 auto
    }
</style>
