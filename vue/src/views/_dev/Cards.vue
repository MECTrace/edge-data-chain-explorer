<template>
    <div id="page-dev-cards">
        <v-container>
            <v-row class="py-8" align="center" justify="center">
                <v-col cols="12" class="text-center">
                    <span class="display-1 font-weight-light">Custom Card Slot</span>
                    <br/>
                    <span class="subtitle-1 font-weight-light deepOrange--text">Custom Card Slot 구조</span>
                </v-col>

                <!-- SLOT TEMPLATE -1 -->
                <v-col cols="12" md="6">
                    <c-card title="title">
                        <template #headItems>
                            <span class="blue--text">[#headItems] slot</span>
                        </template>
                        <template #footer>
                            <span class="deepOrange--text">[#footer] slot</span>
                        </template>
                        <span class="green--text">contents</span>
                    </c-card>
                </v-col>

                <!-- SLOT TEMPLATE -2 -->
                <v-col cols="12" md="6">
                    <c-card>
                        <template #head>
                            <span class="red--text">[#head] slot</span>
                        </template>
                        <template #headItems>
                            <span class="blue--text">[#headItems] slot</span>
                        </template>
                        <template #footer>
                            <span class="deepOrange--text">[#footer] slot</span>
                        </template>
                        <span class="green--text">contens</span>
                    </c-card>
                </v-col>
            </v-row>

            <v-row class="py-8" align="center" justify="center">
                <v-col cols="12" class="text-center">
                    <span class="display-1 font-weight-light">Custom Card Examples</span>
                    <br/>
                    <span class="subtitle-1 font-weight-light deepOrange--text">Custom Card 예제</span>
                </v-col>

                <!-- EXAMPLE -1 -->
                <v-col cols="12" md="5">
                    <c-card title="Custom Card">
                        <template #headItems>
                            <v-icon color='grey'>sentiment_dissatisfied</v-icon>
                            <v-icon color='grey'>sentiment_satisfied</v-icon>
                            <v-icon color='grey'>sentiment_very_dissatisfied</v-icon>
                            <v-icon color='grey'>sentiment_very_satisfied</v-icon>
                        </template>
                        <template #footer>
                            <div class="text-center">
                                <v-icon color='grey'>star</v-icon>
                                <v-icon color='grey'>star_border</v-icon>
                                <v-icon color='grey'>star_half</v-icon>
                            </div>
                            <v-spacer/>
                            <v-icon color='grey'>error</v-icon>
                            <v-icon color='grey'>notification_important</v-icon>
                            <v-icon color='grey'>warning</v-icon>
                        </template>
                        <div class="text-center green">contents</div>
                    </c-card>
                </v-col>

                <v-col cols="12">
                    <!-- EXAMPLE -2 -->
                    <c-card title="Card Border">
                        <v-row justify="center">
                            <v-col cols="12" sm="6" md="6" lg="3">
                                <c-card title="Outlined" outlined>
                                    content
                                </c-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" lg="3">
                                <c-card title="Raised" raised>
                                    content
                                </c-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" lg="3">
                                <c-card title="Shaped" shaped>
                                    content
                                </c-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" lg="3">
                                <c-card title="Tile" tile>
                                    content
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
            alert('onClickRed');

        },
        onClickGreen: function(e) {
            alert('onClickGreen')
        }
    }
}
</script>
