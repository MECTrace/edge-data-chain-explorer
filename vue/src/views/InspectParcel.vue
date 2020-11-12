<template>
  <div id="page-inspect-parcel">
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
                    <span class="truncate-option-box"> {{this.param.parcelId}}</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span>Owner</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <router-link :to="{path:'/inspect/account/' + this.value2, params: {account : this.value2} }" class="truncate-option-box">
                      {{this.value2}}
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span>Proxy(if any)</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <router-link :to="{path:'/inspect/account/' + this.value3, params: {account : this.value3} }" class="truncate-option-box">
                      {{this.value3}}
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span>Extra info</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12">
                    <div>
                      <pre class="text-right subtitle-2" style="white-space: pre-wrap;">
                        {{ JSON.stringify(this.value4,null,2)}}
                      </pre>
                    </div>
                    <!--<span> {{this.value4}} </span>-->
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
        value2: '1c288b4619abd39538ad0e5bd683016863b7468b',
        value3: '1c288b4619abd39538ad0e5bd683016863b7468b',
        value4: {'firstName':'John','lastName':'Smith','createdDate':'2016-12-18@07:53:34.740+0000'},
      }
    },
    watch: {
      '$store.state.network'() {
        console.log('[InspectParcel Page] 변경 된 network value', this.$store.state.network);
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
      async getPageData() {
        // 데이터 바인딩
        console.log(this.param.parcelId);
        console.log('network val', this.network);
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

  @media(min-width: 600px) and (max-width: 750px)  {
    .truncate-option-box{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 300px !important;
    }
  }

  /* 아이패드, 아이패드 프로 */
  @media(min-width: 750px) and (max-width: 800px)  {
    .truncate-option-box{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 350px !important;
    }
  }
</style>
