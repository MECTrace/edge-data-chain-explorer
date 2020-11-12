<template>
    <div class="page-dev-charts">
        <v-container>
            <v-row class="py-8" align="center" justify="start">
                <v-col cols="12" class="text-center">
                    <span class="display-1 font-weight-light">Custom Chart Examples</span>
                    <br/>
                    <span class="subtitle-1 font-weight-light deepOrange--text">Custom Chart 예제</span>
                </v-col>

                <!-- EXAMPLES -1 -->
                <v-col cols="12" lg="6">
                    <c-card title="line chart">
                        <c-chart-line
                            :labels="lineChartData.labels"
                            :datasets="lineChartData.datasets"
                        />
                    </c-card>
                </v-col>

                <!-- EXAMPLES -2 -->
                <v-col cols="12" lg="6">
                    <c-card title="bar chart">
                        <c-chart-bar
                            :labels="barChartData.labels"
                            :datasets="barChartData.datasets"
                        />
                    </c-card>
                </v-col>

                <!-- EXAMPLES -3 -->
                <v-col cols="12" lg="6">
                    <c-card title="Doughnut Chart">
                        <c-chart-doughnut
                            :labels="doughnutChartData.labels"
                            :datasets="doughnutChartData.datasets"
                        />
                    </c-card>
                </v-col>
                <v-col cols="12" lg="6">
                    <c-card title="pie chart">
                        <c-chart-pie
                            :labels="pieChartData.labels"
                            :datasets="pieChartData.datasets"
                        />
                    </c-card>
                </v-col>
                <v-col cols="12" lg="6">
                    <c-card title="horizontal bar chart">
                        <c-chart-horizontal-bar
                            :labels="horizontalChartData.labels"
                            :datasets="horizontalChartData.datasets"
                        />
                    </c-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data: () => ({
        lineChartData: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Data One',

                    fill: false,
                    backgroundColor: 'orange',
                    borderColor: 'orange',
                    borderWidth: 3,

                    data: [40, 20, 30, 50, 90, 10, 20, 40, 50, 70, 90, 100]
                },
                {
                    label: 'Data two',

                    fill: false,
                    backgroundColor: 'green',
                    borderColor: 'green',
                    borderWidth: 3,

                    data: [50, 30, 40, 60, 100, 20, 30, 50, 60, 80, 100, 110]
                }
            ]
        },
        barChartData: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Data One',
                    backgroundColor: 'red',
                    //Data to be represented on y-axis
                    data: [40, 20, 30, 50, 90, 10, 20, 40, 50, 70, 90, 100]
                }
            ]
        },
        doughnutChartData: {
            labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
            datasets: [
                {
                    backgroundColor: [
                        'grey',
                        'orange',
                        'green',
                        'blue'
                    ],
                    data: [40, 20, 80, 10]
                }
            ]
        },
        pieChartData: {
            labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
            datasets: [
                {
                    backgroundColor: [
                        'grey',
                        'orange',
                        'green',
                        'blue'
                    ],
                    data: [40, 20, 80, 10]
                }
            ]
        },
        horizontalChartData: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Data One',
                    backgroundColor: 'lightRed',
                    data: ['40', '20', '12', '11', '10', '40', '39', '80', '40', '20', '12', '11']
                }
            ]
        }
    }),
    mounted() {
        // setTimeout(()=> {
        //     // this.barChartData.datasets.data = [50, 60, 40, 60, 100, 20, 30, 40, 50, 70, 90, 100]
        //     this.barChartData = {
        //         labels: [...this.barChartData.labels],
        //         datasets: [{
        //             label: 'Data One',
        //             backgroundColor: 'green',
        //             data: [50, 60, 40, 60, 100, 20, 30, 40, 50, 70, 90, 100]
        //         }]
        //     }
        // }, 3000);
    },
    methods: {
    },
    watch: {
    }
}
</script>
