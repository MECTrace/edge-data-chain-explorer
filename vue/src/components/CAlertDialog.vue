<template>
  <!--    <v-dialog class="rounded-card"-->
  <!--              v-model="open"-->
  <!--              max-width="350"-->
  <!--    >-->
  <!--        <v-card >-->
  <!--            <div class="rounded-red">-->
  <!--                <span>Title</span>-->
  <!--                <v-divider></v-divider>-->
  <!--                <span>body</span>-->
  <!--                <v-divider></v-divider>-->
  <!--                <span>footer</span>-->
  <!--            </div>-->
  <!--        </v-card>-->
  <!--    </v-dialog>-->

  <v-dialog
    v-model="openFlag"
    width="500"
  >
    <v-card>
      <!--class="headline grey lighten-2"-->
      <v-card-title v-if="err">
        <v-icon color="red">warning</v-icon>
        <span class="pl-1">Error</span>
      </v-card-title>
      <v-card-title v-else>
        <v-icon color="blue">check_circle</v-icon>
        <span class="pl-1">Info</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-5">
        <span>{{msg}}</span>
        <div v-if="timeout? true : false" class="pt-5 text-center">
          <br/>
          <span>it will disappear in {{getTimeout}} seconds!</span>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions v-if="timeout ? false : true">
        <v-spacer></v-spacer>
        <c-btn
          color="blue"
          text
          @click="closeDialog"
        >
          OK
        </c-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  let timeoutEvent = null;
  export default {
    data: () => ({
      openFlag: false,
    }),
    props: {
      open: {
        type: Boolean,
        default: false
      },
      timeout: {
        type: Number,
        default: undefined
      },
      err: {
        type: Boolean,
        default: false
      },
      info: {
        type: Boolean,
        default: true
      },
      msg: {
        type: String,
        default: ""
      },
      persistent: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      getTimeout() {
        return this.timeout/1000;
      }
    },
    watch: {
      open() {
        if (!(this.persistent) && this.open) {
          document.addEventListener('mousedown', this.closeDialog);
        } else {
          clearTimeout(timeoutEvent);
          timeoutEvent = null;
          document.removeEventListener('mousedown', this.closeDialog);
        }
      }
    },
    methods: {
      closeDialog() {
        this.openFlag = false;
        this.$store.commit('alert', {open: false});
      }
    },
    created() {
    },
    updated() {
      if(this.openFlag === !(this.open))
        this.openFlag = this.open;
      if(this.timeout) {
        timeoutEvent = setTimeout(() => this.closeDialog(), this.timeout);
      }
    },
    mounted() {
    }

  }
</script>
<style lang="scss" scoped>
  .rounded-red {
    border-radius: 30px;
    border-color: #f87979;
    border-style: solid;
    width: 100%;
    height: 200px;
  }
</style>
