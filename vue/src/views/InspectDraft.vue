<template>
<div id="page-inspect-draft">
  <v-container>
    <v-row justify="space-between" align="center">
      <v-col cols="12">
        <c-card class="text-center" title="Draft information">
          <v-row class="">
            <v-col cols="12" md="6">
              <v-row align="start">
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                  <span>ID</span>
                </v-col>
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                  <span> {{this.param.draftId.toLocaleString()}}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row align="start">
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                  <span>Proposer</span>
                </v-col>
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                  <router-link :to="{path:'/inspect/account/' + this.value2, params: {account : this.value2} }" class="truncate-option-box">
                    {{this.value2}}
                  </router-link>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row align="center">
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                  <span>Description</span>
                </v-col>
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                  <span> {{this.value3}}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                  <span>Proposed change</span>
                </v-col>
                <v-col cols="12" md="6" class="py-0 px-lg-12">
                  <div >
                    <pre style="white-space: pre-wrap;" class="text-right subtitle-2"> {{JSON.stringify(this.value4, null, 2)}}</pre>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row align="center">
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                  <span>Current stage</span>
                </v-col>
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                  <span>
                    {{this.value5_arg1}} ( {{Number(this.value5_arg2.toFixed(2)).toLocaleString()}} blks remaining )
                  </span>

                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row align="center">
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                  <span>Tally</span>
                </v-col>
                <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                  <span v-if="value5_arg1 === 'waiting' || value5_arg1 ==='voting'"> vote not closed yet</span>
                  <span v-else>
                    {{this.$amoHuman(this.value6_arg1)}} AMO approved, <br>
                    {{this.$amoHuman(this.value6_arg2)}} AMO rejected, <br>
                    {{this.$amoHuman(this.value6_arg3)}} AMO absent
                  </span>
                </v-col>
              </v-row>
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
    data() {
      return {
        param: this.$route.params,
        value2:'fcbbd77d50b5d788a9b85b14f05c569e7362aa32',
        value3 : 'hello',
        value4 : {'firstName':'John','lastName':'Smith','createdDate':'2016-12-18@07:53:34.740+0000'},
        value5_arg1: 'passed',
        value5_arg2: 1231434,
        value6_arg1 : 123.345,
        value6_arg2: 2314.23,
        value6_arg3:  123.41234,
      }
    },
    watch: {
      '$store.state.network'() {
        console.log('[InspectDraft Page] 변경 된 network value', this.$store.state.network);
        this.getPageData()
      },
    },
    computed: {
      network() {
        return this.$store.state.network
      }
    },
    mounted() {
      this.getPageData();
    },
    methods: {
      async getPageData(){
        // 데이터 바인딩
        console.log(this.param.draftId);
        console.log('network val',this.network);
      },
    }
  }
</script>

<style scoped>
  /*  모바일 */
  @media(max-width: 600px) {
    .truncate-option-box {
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 100px !important;
    }
  }
</style>
