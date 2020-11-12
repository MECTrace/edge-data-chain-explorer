<template>
  <div id="page-dev-common-alert">
    <v-container>
      <v-row class="py-8" align="center" justify="center">
        <v-col cols="12" class="text-center">
          <span class="display-1 font-weight-light">Common Alert</span>
          <br/>
          <span class="subtitle-1 font-weight-light deepOrange--text">Custom Common Alert Examples</span>
        </v-col>

        <!-- EXAMPLE -1 -->
        <v-col cols="12">
          <c-card title="Default Dialog">
            <v-row justify="space-around">
              <c-btn color="blue" @click="onInfoDialogOpen">Info</c-btn>
              <c-btn color="red" @click="onErrDialogOpen">Error</c-btn>
            </v-row>
          </c-card>
        </v-col>

        <!-- EXAMPLE -2 -->
        <v-col cols="12">
          <c-card title="Persistent Dialog">
            <v-row justify="space-around">
              <c-btn color="blue" @click="onInfoDialogOpen2">Persistent Dialog</c-btn>
            </v-row>
          </c-card>
        </v-col>

        <!-- EXAMPLE -3 -->
        <v-col cols="12">
          <c-card title="Set Timeout Dialog">
            <v-row justify="space-around">
              <c-btn color="blue" @click="onInfoDialogOpen3">Timout Dialog</c-btn>
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
      onInfoDialogOpen: function(e) {
        this.$store.commit('alert', {open: true, msg: "info message"});
      },
      onErrDialogOpen: function(e) {
        this.$store.commit('alert', {open: true, err: true, msg: "err message"});

      },

      onInfoDialogOpen2: function(e) {
        this.$store.commit('alert', {open: true, persistent: true, msg: "info message"});
      },

      onInfoDialogOpen3: function(e) {
        this.$store.commit('alert', {open: true, timeout: 3000, msg: "info message"});
      },
    }
  }
</script>
