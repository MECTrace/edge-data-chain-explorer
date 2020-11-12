<template>
    <div id="page-dev-buttons">
        <v-container>
            <v-row class="py-8" align="center" justify="center">
                <v-col cols="12" class="text-center">
                    <span class="display-1 font-weight-light">Custom Button</span>
                    <br/>
                    <span class="subtitle-1 font-weight-light deepOrange--text">Custom Button Examples</span>
                </v-col>

                <!-- EXAMPLE -1 -->
                <v-col cols="12">
                    <c-card title="Button Color">
                        <v-row justify="space-around">
                            <c-btn color="red" @click="onClickRed">Red</c-btn>
                            <c-btn color="green" @click="onClickGreen">Green</c-btn>
                            <c-btn color="blue">Blue</c-btn>
                            <c-btn color="orange">Orange</c-btn>
                            <c-btn disabled>Disable</c-btn>
                        </v-row>
                    </c-card>
                </v-col>

                <!-- EXAMPLE -2 -->
                <v-col cols="12">
                    <c-card title="Size">
                        <v-row justify="space-around">
                            <c-btn color="red" small>Small</c-btn>
                            <c-btn color="green">Default</c-btn>
                            <c-btn color="blue" large>Large</c-btn>
                        </v-row>
                        <v-row justify="space-around">
                            <c-btn color="orange" block>block</c-btn>
                        </v-row>
                    </c-card>
                </v-col>

                <!-- EXAMPLE -3 -->
                <v-col cols="12">
                    <c-card title="Text Button">
                        <v-row justify="space-around">
                            <c-btn color="red" text>Text Button</c-btn>
                            <c-btn color="green" text>Text Button</c-btn>
                        </v-row>
                    </c-card>
                </v-col>

                <!-- EXAMPLE -4 -->
                <v-col cols="12">
                    <c-card title="Icon Button">
                        <v-row justify="space-around">
                            <c-btn color="red" icon iconName="favorite"/>
                            <c-btn color="blue" fab iconName="favorite"/>
                            <c-btn color="blue" iconName="favorite">Button</c-btn>
                        </v-row>
                    </c-card>
                </v-col>

                <!-- EXAMPLE -5 -->
                <v-col cols="12">
                    <c-card title="Outlined">
                        <v-row justify="space-around">
                            <c-btn color="blue" outlined fab icon iconName="favorite"/>
                            <c-btn color="blue" outlined iconName="favorite">Button</c-btn>
                            <c-btn color="blue" outlined>Button</c-btn>
                        </v-row>
                    </c-card>
                </v-col>

                <!-- EXAMPLE -6 -->
                <v-col cols="12">
                    <c-card title="Rounded">
                        <v-row justify="space-around">
                            <c-btn color="blue" rounded iconName="favorite">Button</c-btn>
                            <c-btn color="blue" rounded>Button</c-btn>
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
        },
    }
}
</script>
