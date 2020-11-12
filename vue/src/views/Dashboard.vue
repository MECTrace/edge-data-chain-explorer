<template>
  <div id="page-dashboard">
    <v-container>
      <!--Network overview-->
      <v-row align="center" justify="space-between">
        <v-col cols="12">
          <c-card class="text-center" title="Network Overview">
            <v-row>
              <v-col cols="12" md="6" class="py-2">
                <v-row align="start">
                  <v-col class="py-0 px-md-5 px-sm-5 text-right mobile-title" cols="12" sm="4" md="6">
                    <span>Genesis Block</span>
                  </v-col>
                  <v-col class="py-0 px-md-5 px-sm-5 text-left subtitle-2 mobile-content" cols="12" sm="8" md="6">
                    <div>
                      height <router-link :to="{path: '/inspect/block/' + this.networkOverview.genesisHeight, param : {height : this.networkOverview.genesisHeight}}"> {{this.networkOverview.genesisHeight.toLocaleString()}} </router-link>
                    </div>
                    <div>
                      <span> ({{this.$formatTime(this.networkOverview.genesisTime)}})</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="py-2">
                <v-row align="start">
                  <v-col class="py-0 px-md-5 px-sm-5 text-right mobile-title" cols="12" sm="4" md="6">
                    <span class="">Last Block</span>
                  </v-col>
                  <v-col class="py-0 px-md-5 px-sm-5 text-left subtitle-2  mobile-content" cols="12" sm="8" md="6">
                    <div>
                      height <router-link :to="{path: '/inspect/block/' + this.networkOverview.lastHeight, param : {height : this.networkOverview.lastHeight}}"> {{this.networkOverview.lastHeight.toLocaleString()}}</router-link>
                    </div>
                    <div>
                      <span> ({{this.$formatTime(this.networkOverview.lastTime)}})</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="12" class="py-2">
                <v-row align="start">
                  <v-col class="py-0 px-md-5 px-sm-5 text-right mobile-title" cols="12" sm="4" md="3">
                    <span>Average Stat</span>
                  </v-col>
                  <v-col class="py-0 px-md-5 px-sm-5 text-left subtitle-2 mobile-content " cols="12" sm="8" md="9" lg="6">
                    <div>
                      <span> block interval : </span>
                      <span class="ml-3"> {{Number(this.networkOverview.avgInterval.toFixed(2)).toLocaleString()}} sec </span>
                    </div>
                    <div>
                      <span> no. of txs per block : </span>
                      <span class="ml-3"> {{Number(this.networkOverview.numTxsPerBlock.toFixed(5)).toLocaleString()}} /blk </span>
                    </div>
                    <div >
                      <span> transaction fee : </span>
                      <span class="ml-3">  {{ this.$amoLong(this.networkOverview.avgTxFee) }} AMO</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>

      <v-row class="text-center">

        <!-- Validators-->
        <v-col cols="12" md="6">
          <c-card title="Validators" class="text-center">
            <v-row align="center">
              <v-col cols="8" class="pl-lg-12 py-0">

                <!-- 색상 : plugins/vuetify.js 에서 정의-->
                <c-progress-line
                  type="1"
                  :value="100"
                  color="deepBlueGrey1"
                  height="10"
                  title="Eff. Stake Total"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <router-link :to="{path: '/validators'}"> {{this.$amoShort(this.validators.effStakes)}} AMO (100%)</router-link>
                <span>
                  <!-- TODO 증감표시가 필요한 모든 영역에는 v-icon 태그 적용이 필요-->
                  <v-icon small> {{this.validators.effStakes_change}}</v-icon>
                </span>
              </v-col>
              <v-col cols="8" class="pl-lg-12 py-0">
                <c-progress-line
                  type="1"
                  :value="this.validators.stakeOnline/ this.validators.effStakes * 100"
                  color="deepBlueGrey2"
                  height="10"
                  title="On-line"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <router-link :to="{path: '/validators'}">{{this.$amoShort(this.validators.stakeOnline)}} AMO ({{this.validators.stakeOnline_ratio.toFixed(2)}}%)</router-link>
              </v-col>
              <v-col cols="8" class="pl-lg-12 py-0">
                <c-progress-line
                  type="1"
                  :value="this.validators.stakeOffline_ratio"
                  color="deepLightGrey"
                  height="10"
                  title="Off-line"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <router-link :to="{path:'/validators'}">
                  {{this.$amoShort(this.validators.stakeOffline)}} AMO ({{this.validators.stakeOffline_ratio.toFixed(2)}}%)</router-link>
              </v-col>
            </v-row>
          </c-card>
        </v-col>

        <!--Coins and Stakes-->
        <v-col cols="12" md="6">
          <c-card title="Coins and Stakes" class="text-center">
            <v-row align="center">
              <v-col cols="8" class="pl-lg-12 py-0">
                <c-progress-line
                  type="1"
                  :value="100"
                  color="deepBlueGrey1"
                  height="10"
                  title="Coin Total"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <span> {{this.$amoShort(this.coinsAndStakes.coinTotal)}} AMO (100%)</span>
                <span>
                  <!-- arrow_upward / arrow_downward-->
                  <!--<v-icon>remove</v-icon>-->
                </span>
              </v-col>
              <v-col cols="8" class="pl-lg-12 py-0">
                <c-progress-line
                  type="1"
                  :value="this.coinsAndStakes.stakes_percentage"
                  color="deepLightGrey"
                  height="10"
                  title="Stakes"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <span>  {{this.$amoShort(this.coinsAndStakes.stakes)}} AMO ({{this.coinsAndStakes.stakes_percentage.toFixed(2)}}%)</span>
              </v-col>
              <v-col cols="8" class="pl-lg-12 py-0">
                <c-progress-line
                  type="1"
                  :value="this.coinsAndStakes.delegates_percentage"
                  color="deepBlueGrey2"
                  height="10"
                  title="Delegated stakes"
                >
                </c-progress-line>
              </v-col>
              <v-col cols="4" class="pl-0 py-0">
                <span> {{this.$amoShort(this.coinsAndStakes.delegates)}} AMO ({{this.coinsAndStakes.delegates_percentage.toFixed(2)}}%)</span>
              </v-col>
            </v-row>
          </c-card>
        </v-col>

        <!--Goverance overview-->
        <v-col cols="12" md="6">
          <c-card title="Governance Overview" class="card-height">
            <v-row>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title" cols="12" sm="6">
                    <span>Last Draft</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-left subtitle-2 mobile-content" cols="12" sm="6">
                    <router-link :to="{path: '`' + this.governanceOverview.value14_arg1, params: {draftId: this.governanceOverview.value14_arg1}}">
                      #{{this.governanceOverview.value14_arg1.toLocaleString() }} (
                      {{this.governanceOverview.value14_arg2}}, {{
                      Number(this.governanceOverview.value14_arg3.toFixed(2)).toLocaleString()}} % approval)
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title" cols="12" sm="6">
                    <span>Draft States</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-left subtitle-2 mobile-content" cols="12" sm="6">
                    <span> {{this.governanceOverview.value15_arg1.toLocaleString()}} / {{this.governanceOverview.value15_arg2.toLocaleString()}} drafts passed </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title" cols="12" sm="6">
                    <span>Current voting config</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-left subtitle-2 mobile-content" cols="12" sm="6">
                    <!--span>
                      {{this.governanceOverview.value16_arg1.toLocaleString()}} waiting <br>
                      {{this.governanceOverview.value16_arg2.toLocaleString()}} voting <br>
                      {{this.governanceOverview.value16_arg3.toLocaleString()}} grace period
                    </span-->
                    <span>
                      waiting period: -<br/>
                      voting period: -<br/>
                      grace period: -<br/>
                    </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>

        <!--Data trade overview-->
        <v-col cols="12" md="6">
          <c-card title="Data Trade Overview" class="card-height">
            <v-row>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title"  cols="12" sm="6" md="6">
                    <span># of storage services</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12  text-left subtitle-2 mobile-content" cols="12" sm="6" md="6">
                    <!--router-link :to="{path: '/storages'}"> {{this.dataTradeOverview.value17.toLocaleString()}}</router-link-->
                    <span> -</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title" cols="12" sm="6">
                    <span># of Parcels</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-left subtitle-2 mobile-content" cols="12" sm="6">
                    <!--router-link :to="{path: '/parcels'}"> {{this.dataTradeOverview.value18.toLocaleString()}}</router-link-->
                    <span> -</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="pb-0 pt-3">
                <v-row align="start">
                  <v-col class="py-0 px-lg-12 text-right mobile-title" cols="12" sm="6">
                    <span>Trade value in 1 month</span>
                  </v-col>
                  <v-col class="py-0 px-lg-12 text-left subtitle-2 mobile-content" cols="12" sm="6">
                    <!--span> {{ this.$amoShort(this.dataTradeOverview.value19) }}  AMO </span-->
                    <span> -  AMO </span>
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
    data: () => ({
      networkOverview: {
        genesisHeight: 0,
        genesisTime: null,
        lastHeight: 0,
        lastTime: null,
        avgInterval: 0,
        numTxsPerBlock: 0,
        avgTxFee: 0,
      },
      validators: {
        effStakes : 1,
        effStakes_change: '',
        stakeOnline : 0,
        stakeOnline_ratio : 0,
        stakeOffline : 0,
        stakeOffline_ratio : 0,
      },
      coinsAndStakes: {
        coinTotal: 1,
        stakes: 0,
        stakes_percentage: 0,
        delegates: 0,
        delegates_percentage: 0,
      },
      governanceOverview: {
        value14_arg1: 0,
        value14_arg2: '-',
        value14_arg3: 0,
        value15_arg1: 0,
        value15_arg2: 0,
        value16_arg1: 0,
        value16_arg2: 0,
        value16_arg3: 0,
      },
      dataTradeOverview: {
        value17: 0,
        value18: 0,
        value19: 0,
      },
      testVal: '',
    }),
    computed: {
      // vuex의 데이터를 사용하기 위해서는 computed 영역에 함수를 선언해야한다.
      network() {
        return this.$store.state.network
      }
    },
    watch: {
      network() {
        if (this.network) this.getPageData();
      },

      'validators.effStakes'(newVal, oldVal) {
        let result = '';
        if(oldVal > newVal) {
          result = 'arrow_drop_down'
        } else if(oldVal < newVal) {
            result = 'arrow_drop_up'
        } else {
          result =  'remove'
        }
        this.validators.effStakes_change = result;
      }
    },
    mounted() {
      if (this.network) this.getPageData();
      console.debug('starting timer');
      this.intervalId = setInterval(() => {
        console.debug('timer tick');
        if (this.network) this.getPageData();
      }, 10000)
    },
    destroyed() {
      console.debug('clearing timer');
      clearInterval(this.intervalId);
    },
    methods: {
      async getPageData() {
        try {
          var res;
          var stat = await this.$api.getChainStat(this.network, 1000);
          var height = stat.height;
          this.networkOverview.avgInterval = stat.avgInterval;
          this.networkOverview.numTxsPerBlock = stat.numTxs / height;
          this.networkOverview.avgTxFee = stat.avgTxFee;

          this.validators.effStakes
            = Number(stat.stakes) + Number(stat.delegates);
          this.validators.stakeOnline
            = Number(stat.stakes) + Number(stat.delegates);
          this.validators.stakeOffline = 0;
          this.validators.stakeOnline_ratio =
            this.validators.stakeOnline / this.validators.effStakes * 100;
          this.validators.stakeOffline_ratio =
            this.validators.stakeOffline / this.validators.effStakes * 100;

          this.coinsAndStakes.coinTotal
            = Number(stat.activeCoins) + Number(stat.stakes)
            + Number(stat.delegates);
          this.coinsAndStakes.stakes = Number(stat.stakes);
          this.coinsAndStakes.delegates = Number(stat.delegates);
          this.coinsAndStakes.stakes_percentage =
            this.coinsAndStakes.stakes / this.coinsAndStakes.coinTotal * 100;
          this.coinsAndStakes.delegates_percentage =
            this.coinsAndStakes.delegates / this.coinsAndStakes.coinTotal * 100;

          res = await this.$api.getBlock(this.network, 1);
          this.networkOverview.genesisHeight = res.height;
          this.networkOverview.genesisTime = res.time;

          res = await this.$api.getBlock(this.network, height);
          this.networkOverview.lastHeight = res.height;
          this.networkOverview.lastTime = res.time;

        } catch (e) {
          console.log('error', e);
        }
      },
    }
  }
</script>


<style lang="scss" scoped>
  .overview-card {
    margin: -10px !important;
  }

  .card-option {
    height: 100px
  }

  .border-left {
    border-left-style: dashed;
    border-left-width: medium;
  }

  /* 모바일화면 CSS */
  @media (max-width: 600px) {

    .mobile-title {
      font-weight: bold;
      text-align: center !important;
    }

    .mobile-content {
      text-align: center !important;
    }
  }

  /* 패드, 중간화면 CSS*/
  @media (min-width: 600px) and (max-width: 950px) {
    .middle-content {
      text-align: right !important;
    }
  }

  @media (min-width: 965px)and (max-width: 1300px) {
    .card-height {
      height: 325px
    }
  }

  @media (min-width: 1300px) {
    .card-height {
      height: 285px !important;
    }
  }

  @media (min-width: 1900px) {
    .lg-padding {
      /*padding-left: 111px !important;*/
    }
  }
</style>
