<template>
  <div id="page-inspect-storage">
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Storage information">
            <v-row class="">
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span>ID</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{Number(this.param.storageId).toLocaleString()}}</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span>Own account</span>
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
                    <span>URL</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <a :href=this.value3 target="_blank"> {{this.value3}} </a>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span>Registration fee</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{this.$amoHuman(this.value4)}} AMO</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span>Hosting fee</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{this.$amoHuman(this.value5)}} AMO</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span>Status</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{this.value6}}</span>
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
        param : this.$route.params,
        value2: 'ad16f4c1bbcaa40fdba158a486210de350474c14',
        value3: 'http://naver.com',
        value4: 121113.234,
        value5: 123.234,
        value6: 'active'
      }
    },
    watch: {
      '$store.state.network'() {
        console.log('[InspectStorage Page] 변경 된 network value', this.$store.state.network);
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
