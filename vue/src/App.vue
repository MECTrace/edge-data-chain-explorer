<template>
  <v-app>
    <c-navbar></c-navbar>
    <v-content class="content-main">
      <div style="padding: 20px;">
        <router-view></router-view>
      </div>
    </v-content>
    <c-footer></c-footer>
    <c-alert-dialog
      :open="alert.open"
      :timeout="alert.timeout"
      :msg="alert.msg"
      :err="alert.err"
      :info="alert.info"
      :persistent="alert.persistent"
    ></c-alert-dialog>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),
  computed: {
    alert() {
      return this.$store.state.alert;
    },
  }
};
</script>
<style lang="scss">
@import './styles/index.scss';
.content-main {
  background-color: #f9f9f9;
  font-family: 'Montserrat';
}
</style>
