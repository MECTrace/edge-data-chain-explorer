<template>
    <div id="page-dev-tables">
        <v-container>
            <v-row justify="center" class="py-8">
                <v-col cols="12" class="text-center">
                    <span class="display-1 font-weight-light">Custom Table Examples</span>
                    <br/>
                    <span class="subtitle-1 font-weight-light deepOrange--text">Custom Scroll Table 예제</span>
                </v-col>

                <!-- EXAMPLE -1 -->
                <v-col cols="12">
                    <c-card title="Infinite Scroll Table (has click event)" outlined>
                        <c-scroll-table
                            :headers="tableData1.headers"
                            itemKey="name"
                            :items="tableData1.desserts"
                            height="500"
                            @click="onClickTableRow"
                            @loadMore="reqData"
                        />
                    </c-card>
                </v-col>
            </v-row>

            <v-snackbar v-model="snackFlag" :timeout="3000" color="deepOrange">
                {{ snackText }}
                <v-btn text @click="snackFlag = false">Close</v-btn>
            </v-snackbar>
        </v-container>
    </div>
</template>
<script>
// import axios from 'axios';
export default {
    data () {
        return {
            pageNum: 1,
            perPage: 50,
            snackFlag: false,
            snackText: '',
            tableData1: {
                headers: [
                    {
                        text: 'Dessert (100g serving)',
                        value: 'name',
                        align: 'center', // 'start' | 'center' | 'end'
                        sortable: false,
                    },
                    { text: 'Calories', value: 'calories' },
                    { text: 'Fat (g)', value: 'fat' },
                    { text: 'Carbs (g)', value: 'carbs' },
                ],
                desserts: []
            },
        }
    },
    created() {
    },
    mounted() {
        this.reqData();
    },
    computed: {
    },
    methods: {
        onClickTableRow: function(e) {
            this.snackFlag = true;
            this.snackText = `clicked '${e.name}'`;
            console.log('onClickTableRow : ', e)
        },
        async reqData() {
            // call api
            // try {
            //     const res = await axios.get('http://192.168.23.50:3000/api/test2', {params: {pagenum: this.pageNum, perpage: this.perPage}});
            //     console.log(res);
            //     if(res.data && res.data.result && res.data.result.length > 0) {
            //         this.tableData1.desserts = this.tableData1.desserts.concat(res.data.result);
            //         this.pageNum++;
            //     }
            // } catch(err) {
            //     console.log('err: ', err);
            // }

            // add data
            const startIdx = (this.pageNum-1) * this.perPage;
            const endIdx = parseInt(startIdx) + parseInt(this.perPage);
            let newData = [];
            for(let i=startIdx; i<endIdx; i++) {
                newData.push({name: "test"+i, calories: i, fat: i+20, carbs: i+50});
            }
            this.tableData1.desserts = this.tableData1.desserts.concat(newData);
            this.pageNum++;
        },
    }
}
</script>

