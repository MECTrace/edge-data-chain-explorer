<script>
//Importing Line class from the vue-chartjs wrapper
import {Line} from 'vue-chartjs'
//Exporting this so it can be used in other components
export default {
    extends: Line,
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
    // data () {
    //     return {
    //         chartData: {
    //             //Data to be represented on x-axis
    //             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    //                 'August', 'September', 'October', 'November', 'December'],
    //             datasets: [
    //                 {
    //                     label: 'Data One',
    //
    //                     // curve tension [0..1] default: 0.4
    //                     tension: 0,
    //
    //                     // line fill & color
    //                     fill: false,
    //                     backgroundColor: '#ffb35e',//'green',
    //
    //                     // line stroke
    //                     borderColor: '#ffb35e',//'rgba(0,0,0,0.1)',
    //                     borderWidth: 3,
    //
    //                     // point radius
    //                     // radius: 2, //default 3
    //                     // pointBackgroundColor: 'blue',
    //                     // pointBorderColor: 'blue',
    //
    //
    //                     //Data to be represented on y-axis
    //                     data: [40, 20, 30, 50, 90, 10, 20, 40, 50, 70, 90, 100]
    //                 },
    //                 {
    //                     label: 'Data two',
    //
    //                     fill: false,
    //                     backgroundColor: '#58deb6',
    //
    //                     // line stroke
    //                     borderColor: '#58deb6',//'rgba(0,0,0,0.1)',
    //                     borderWidth: 3,
    //                     //
    //                     // // point radius
    //                     // radius: 2, //default 3
    //                     // pointBackgroundColor: 'grey',
    //                     // pointBorderColor: 'grey',
    //
    //
    //                     data: [50, 30, 40, 60, 100, 20, 30, 50, 60, 80, 100, 110]
    //                 }
    //             ]
    //         },
    //         //Chart.js options that controls the appearance of the chart
    //         options: {
    //             scales: {
    //                 yAxes: [{
    //                     ticks: {
    //                         beginAtZero: true
    //                     },
    //                     gridLines: {
    //                         display: true
    //                     }
    //                 }],
    //                 xAxes: [ {
    //                     gridLines: {
    //                         display: false
    //                     }
    //                 }]
    //             },
    //             legend: {
    //                 //legend configuration
    //                 display: true,
    //                 align: 'end', // [start, center(default), end]
    //                 position: 'bottom', // [top(default) | left | bottom | right]
    //
    //                 //legend label configuration
    //                 labels: {
    //                     boxWidth: 40, //default 40
    //                     fontSize: 12, //default 12
    //                 },
    //
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
                        xAxes: [ {
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
