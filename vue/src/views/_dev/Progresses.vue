<template>
    <div id="page-dev-progresses">
        <v-container>
            <v-row justify="center" class="py-8">
                <v-col cols="12" class="text-center">
                    <span class="display-1 font-weight-light">Custom Progress Slot</span>
                    <br/>
                    <span class="subtitle-1 font-weight-light deepOrange--text">Custom Progress Slot 구조</span>
                </v-col>

                <!-- SLOT TEMPLATE -1 -->
                <v-col cols="12" md="5" class="text-center">
                    <c-card title="Circle Progress Type1">
                        <c-progress-circle
                            type="1"
                            :value="50"
                            color="red"
                        >
                            <span class="display-1">SLOT</span>
                        </c-progress-circle>
                    </c-card>
                </v-col>

                <!-- SLOT TEMPLATE -2 -->
                <v-col cols="12" md="5" class="text-center">
                    <c-card title="Circle Progress Type2">
                        <c-progress-circle
                            type="2"
                            :value="50"
                            color="blue"
                        >
                            <span class="display-1">SLOT</span>
                        </c-progress-circle>
                    </c-card>
                </v-col>
            </v-row>


            <v-row justify="center" class="py-8">
                <v-col cols="12" class="text-center">
                    <span class="display-1 font-weight-light">Custom Progress Examples</span>
                    <br/>
                    <span class="subtitle-1 font-weight-light deepOrange--text">Custom Progress 예제</span>
                </v-col>

                <v-col cols="12">
                    <c-card title="Line Progress" shaped>
                        <v-row justify="center">

                            <!-- EXAMPLE -1 -->
                            <v-col cols="12" md="5" class="text-center">
                                <c-card title="Type1">
                                    <c-progress-line
                                        type="1"
                                        :value="65"
                                        color="orange"
                                        height="10"
                                        strokeWidth="30"
                                        fontColor="red"
                                        fontSize="14"
                                        :fontHidden="false"
                                        title="title"
                                    />
                                </c-card>
                            </v-col>

                            <!-- EXAMPLE -2 -->
                            <v-col cols="12" md="5" class="text-center">
                                <c-card title="Type2">
                                    <c-progress-line
                                        type="2"
                                        :value="20"
                                        color="blue"
                                        height="20"
                                        strokeWidth="30"
                                        fontColor="black"
                                        fontSize="13"
                                        :fontDynamicPosition="false"
                                        :fontHidden="false"
                                    />
                                </c-card>
                            </v-col>
                        </v-row>
                    </c-card>
                </v-col>


                <v-col cols="12" class="pt-10">
                    <c-card title="Circle Progress" shaped>
                        <v-row justify="center">

                            <!-- EXAMPLE -3 -->
                            <v-col cols="12" md="5" class="text-center">
                                <c-card title="Type1 - none slot">
                                    <c-progress-circle
                                        radius="200"
                                        strokeWidth="10"
                                        :value="50"
                                        type="1"
                                    />
                                </c-card>
                            </v-col>

                            <!-- EXAMPLE -4 -->
                            <v-col cols="12" md="5" class="text-center">
                                <c-card title="Type1 - slot">
                                    <c-progress-circle
                                            :value="50"
                                            type="1"
                                    >
                                        <span class="display-1">%</span>
                                        <br/>
                                        <span class="overline">content</span>
                                    </c-progress-circle>
                                </c-card>
                            </v-col>

                            <v-col cols="12" md="5" class="text-center">
                                <c-card title="Type2 - none slot">
                                    <c-progress-circle
                                            :value="50"
                                            type="2"
                                    />
                                </c-card>
                            </v-col>

                            <v-col cols="12" md="5" class="text-center">
                                <c-card title="Type2 - slot">
                                    <c-progress-circle
                                            :value="50"
                                            type="2"
                                    >
                                        <span class="display-1">%</span>
                                        <br/>
                                        <span class="overline">content</span>
                                    </c-progress-circle>
                                </c-card>
                            </v-col>
                        </v-row>
                    </c-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        data: () => ({
        }),
        methods: {
            onClickRed: function(e) {
                alert('onClickRed')
            },
            onClickGreen: function(e) {
                alert('onClickGreen')
            }
        }
    }
</script>
