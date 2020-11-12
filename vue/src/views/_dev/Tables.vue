<template>
    <div id="page-dev-tables">
        <v-container>
            <v-row justify="center" class="py-8">
                <v-col cols="12" class="text-center">
                    <span class="display-1 font-weight-light">Custom Table Slot</span>
                    <br/>
                    <span class="subtitle-1 font-weight-light deepOrange--text">Custom Table Slot 구조</span>
                </v-col>

                <!-- SLOT TEMPLATE -1 -->
                <v-col cols="12" md="6">
                    <c-card title="Table Slot">
                        <c-table
                            :headers="tableData.headers"
                            itemKey="id"
                            :items="tableData.data"

                            showExpand
                        >
                            <template #header2="{ item }">
                                <span class="deepGreen--text">[#column of target header] slot</span>
                                <br/>
                                <span>data: {{item.header2}}</span>
                            </template>

                            <template #expanded="{item}">
                                <span class="blue--text">[#expaned] slot</span>
                                <br/>
                                <br/>
                                <span>row item: </span>
                                <br/>
                                <span>{{item}}</span>
                            </template>
                        </c-table>
                    </c-card>
                </v-col>
            </v-row>


            <v-row justify="center" class="py-8">
                <v-col cols="12" class="text-center">
                    <span class="display-1 font-weight-light">Custom Table Examples</span>
                    <br/>
                    <span class="subtitle-1 font-weight-light deepOrange--text">Custom Table 예제</span>
                </v-col>

                <!-- EXAMPLE -1 -->
                <v-col cols="12">
                    <c-card title="Default table (has click event)" outlined>
                        <c-table
                            :headers="tableData1.headers"
                            itemKey="name"
                            :items="tableData1.desserts"
                            @click="onClickTableRow"
                        />
                    </c-card>
                </v-col>

                <!-- EXAMPLE -2 -->
                <v-col cols="12">
                    <c-card title="Selectable rows" outlined>
                        <c-table
                            :headers="tableData2.headers"
                            itemKey="name"
                            :items="tableData2.desserts"

                            showSelect
                            :selected.sync="tableData2.selected"
                        />
                    </c-card>
                </v-col>


                <!-- EXAMPLE -3 -->
                <v-col cols="12">
                    <c-card title="Single selectable rows" outlined>
                        <c-table
                            :headers="tableData3.headers"
                            itemKey="name"
                            :items="tableData3.desserts"

                            showSelect
                            singleSelect
                            :selected.sync="tableData3.selected"
                        />
                    </c-card>
                </v-col>


                <!-- EXAMPLE -4 -->
                <v-col cols="12">
                    <c-card title="Expandable rows" outlined>
                        <c-table
                            :headers="tableData4.headers"
                            itemKey="name"
                            :items="tableData4.desserts"

                            showExpand
                            :selected.sync="tableData4.selected"
                        >
                            <template v-slot:expanded="item">
                                <div>
                                    {{item}}
                                </div>
                            </template>
                        </c-table>
                    </c-card>
                </v-col>

                <!-- EXAMPLE -5 -->
                <v-col cols="12">
                    <c-card title="Single expandable rows" outlined>
                        <c-table
                            :headers="tableData5.headers"
                            itemKey="name"
                            :items="tableData5.desserts"

                            showExpand
                            singleExpand
                            :selected.sync="tableData5.selected"
                        >
                            <template v-slot:expanded="item">
                                <div>
                                    {{item}}
                                </div>
                            </template>
                        </c-table>
                    </c-card>
                </v-col>

                <!-- EXAMPLE -6 -->
                <v-col cols="12">
                    <c-card title="Custom item slot" outlined>
                        <c-table
                            :headers="tableData1.headers"
                            itemKey="name"
                            :items="tableData1.desserts"
                        >
                            <template #calories="{ item }">
                                <v-chip color="green" dark>{{ item.calories }}</v-chip>
                            </template>

                            <template #protein="{ item }">
                                <v-chip color="blue" dark>{{ item.protein }}</v-chip>
                            </template>
                        </c-table>
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

export default {
    data () {
        return {
            snackFlag: false,
            snackText: '',
            tableData: {
                headers: [
                    {
                        text: 'Header1',
                        value: 'header1',
                        align: 'center', // 'start' | 'center' | 'end'
                        sortable: false,
                    },
                    {
                        text: 'Header2',
                        value: 'header2',
                        align: 'center', // 'start' | 'center' | 'end'
                        sortable: false,
                    },
                    {
                        text: 'Header3',
                        value: 'header3',
                        align: 'center', // 'start' | 'center' | 'end'
                        sortable: false,
                    }
                ],
                data: [
                    {
                        id: 'id1',
                        header1: 159,
                        header2: 6.0,
                        header3: 6.0,
                    },
                    {
                        id: 'id2',
                        header1: 159,
                        header2: 6.0,
                        header3: 6.0,
                    },
                ]
            },
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
                    { text: 'Protein (g)', value: 'protein' },
                    { text: 'Iron (%)', value: 'iron' },
                ],
                desserts: [
                    {
                        name: 'Frozen Yogurt',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        iron: '1%',
                    },
                    {
                        name: 'Ice cream sandwich',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%',
                    },
                    {
                        name: 'Eclair',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%',
                    }
                ]
            },
            tableData2 : {
                selected: [],
                headers: [
                    {
                        text: 'Dessert (100g serving)',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    { text: 'Calories', value: 'calories' },
                    { text: 'Fat (g)', value: 'fat' },
                    { text: 'Carbs (g)', value: 'carbs' },
                    { text: 'Protein (g)', value: 'protein' },
                    { text: 'Iron (%)', value: 'iron' },
                ],
                desserts: [
                    {
                        name: 'Frozen Yogurt',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        iron: '1%',
                    },
                    {
                        name: 'Ice cream sandwich',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%',
                    },
                    {
                        name: 'Eclair',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%',
                    }
                ],
            },
            tableData3 : {
                selected: [],
                headers: [
                    {
                        text: 'Dessert (100g serving)',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    { text: 'Calories', value: 'calories' },
                    { text: 'Fat (g)', value: 'fat' },
                    { text: 'Carbs (g)', value: 'carbs' },
                    { text: 'Protein (g)', value: 'protein' },
                    { text: 'Iron (%)', value: 'iron' },
                ],
                desserts: [
                    {
                        name: 'Frozen Yogurt',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        iron: '1%',
                    },
                    {
                        name: 'Ice cream sandwich',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%',
                    },
                    {
                        name: 'Eclair',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%',
                    }
                ],
            },
            tableData4 : {
                selected: [],
                headers: [
                    {
                        text: 'Dessert (100g serving)',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    { text: 'Calories', value: 'calories' },
                    { text: 'Fat (g)', value: 'fat' },
                    { text: 'Carbs (g)', value: 'carbs' },
                    { text: 'Protein (g)', value: 'protein' },
                    { text: 'Iron (%)', value: 'iron' },
                ],
                desserts: [
                    {
                        name: 'Frozen Yogurt',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        iron: '1%',
                    },
                    {
                        name: 'Ice cream sandwich',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%',
                    },
                    {
                        name: 'Eclair',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%',
                    }
                ],
            },
            tableData5 : {
                singleExpand: false,
                showSelect: true,
                selected: [],
                headers: [
                    {
                        text: 'Dessert (100g serving)',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    { text: 'Calories', value: 'calories' },
                    { text: 'Fat (g)', value: 'fat' },
                    { text: 'Carbs (g)', value: 'carbs' },
                    { text: 'Protein (g)', value: 'protein' },
                    { text: 'Iron (%)', value: 'iron' },
                ],
                desserts: [
                    {
                        name: 'Frozen Yogurt',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        iron: '1%',
                    },
                    {
                        name: 'Ice cream sandwich',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%',
                    },
                    {
                        name: 'Eclair',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%',
                    }
                ],
            },
            tableData6 : {
                singleExpand: false,
                showSelect: true,
                selected: [],
                headers: [
                    {
                        text: 'Dessert (100g serving)',
                        align: 'left',
                        sortable: false,
                        value: 'name',
                    },
                    { text: 'Calories', value: 'calories' },
                    { text: 'Fat (g)', value: 'fat' },
                    { text: 'Carbs (g)', value: 'carbs' },
                    { text: 'Protein (g)', value: 'protein' },
                    { text: 'Iron (%)', value: 'iron' },
                ],
                desserts: [
                    {
                        name: 'Frozen Yogurt',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        iron: '1%',
                    },
                    {
                        name: 'Ice cream sandwich',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%',
                    },
                    {
                        name: 'Eclair',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%',
                    }
                ],
            },
        }
    },
    created() {
    },
    mounted() {
        this.$nextTick(function () {
            // 모든 화면이 렌더링된 후 실행합니다.
        })
    },
    computed: {
    },
    methods: {
        onClickTableRow: function(e) {
            this.snackFlag = true;
            this.snackText = `clicked '${e.name}'`;
            console.log('onClickTableRow : ', e)
        }
    }
}
</script>

