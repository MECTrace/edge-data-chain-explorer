<script>
import {HorizontalBar } from 'vue-chartjs'
export default {
    extends: HorizontalBar,
    props: {
        // chartData properties
        labels: { // x Axes labels
            type: Array,
            default: () => []
        },
        datasets: { // chart data array
            type: Array,
            default: () => []

            // dataset properties
            // {
            //     label: String
            //     backgroundColor: String
            //     data: Array
            // }
        },

        // options properties
        scales: { // yAxes, xAxes properties
            type: Object,
        },
        legend: { // legend properties
            type: Object
        }
    },
    // data() {
    //     return {
    //         datacollection: {
    //             //Data to be represented on x-axis
    //             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    //             datasets: [
    //                 {
    //                     label: 'Data One',
    //                     backgroundColor: '#f87979',
    //                     data: ['40', '20', '12', '11', '10', '40', '39', '80', '40', '20', '12', '11']
    //                 }
    //             ]
    //         },
    //         //Chart.js options that controls the appearance of the chart
    //         options: {
    //             scales: {
    //                 yAxes: [{
    //                     gridLines: {
    //                         display: true
    //                     }
    //                 }],
    //                 xAxes: [ {
    //                     ticks: {
    //                         beginAtZero: true
    //                     },
    //                     gridLines: {
    //                         display: false
    //                     }
    //                 }]
    //             },
    //             legend: {
    //                 display: true
    //             },
    //             responsive: true,
    //             maintainAspectRatio: false
    //         }
    //     }
    // },
    computed: {
        chartData() {
            return ({
                labels: this.labels,
                datasets: this.datasets
            });
        },
        options() {
            return ({
                scales: this.scales
                    ||
                    {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    },
                legend: this.legend
                    ||
                    {
                        display: true,
                        align: 'center', // [start, center(default), end]
                        position: 'top', // [top(default) | left | bottom | right]

                        //legend label configuration
                        labels: {
                            boxWidth: 40, //default 40
                            fontSize: 12, //default 12
                        },
                    },
                responsive: true,
                maintainAspectRatio: false
            });
        },
    },
    watch: {
        datasets() {
            this.changeDatasetsColors();
            this.renderChart(this.chartData, this.options);
        }
    },
    methods: {
        changeDatasetsColors() {
            let datasets = this.datasets;
            for(let idx in datasets) {
                for(let key in datasets[idx]) {
                    if(key.indexOf("color") > -1 || key.indexOf("Color") > -1) {
                        const themeColor = this.$vuetify.theme.themes.light[datasets[idx][key]];
                        datasets[idx][key] =  themeColor || datasets[idx][key];
                    }
                }
            }
        }
    },
    created() {
    },
    mounted() {
        this.changeDatasetsColors();
        this.renderChart(this.chartData, this.options);
    }
}
</script>
