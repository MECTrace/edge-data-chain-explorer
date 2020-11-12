<script>
import {Pie} from 'vue-chartjs';
export default {
    extends: Pie,
    props: {
        // chartData properties
        labels: { // data labels
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
        legend: { // legend properties
            type: Object
        }
    },
    // data() {
    //     return {
    //         datacollection: {
    //             //Data to be represented on x-axis
    //             labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    //             datasets: [
    //                 {
    //                     backgroundColor: [
    //                         '#41B883',
    //                         '#E46651',
    //                         '#00D8FF',
    //                         '#DD1B16'
    //                     ],
    //                     data: [40, 20, 80, 10]
    //                 }
    //             ]
    //         },
    //         //Chart.js options that controls the appearance of the chart
    //         options: {
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
                for(let cIdx in datasets[idx]['backgroundColor']) {
                    let color = datasets[idx]['backgroundColor'][cIdx];
                    datasets[idx]['backgroundColor'][cIdx] = this.$vuetify.theme.themes.light[color] || color;
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
