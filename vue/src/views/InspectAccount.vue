<template>
  <div id="page-inspect-account">
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Account information">
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Address </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option-box"> {{ this.account.address }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> AMO balance </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{this.$amoLong(this.account.balance)}} AMO</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="12" v-if="this.account.valAddr">
                <v-row align="center">
                  <v-col cols="12" md="2" class="py-0 px-lg-12 text-left">
                    <span> Stake </span>
                  </v-col>
                  <v-col cols="12" md="10" class="py-0 px-lg-12 text-left subtitle-2">
                    <span> {{ this.$amoLong(this.account.stake)}} AMO for validator <br/>
                      <router-link :to="{name: 'InspectValidator', params: { address: this.account.valAddr}}">{{ this.account.valAddr }}
                      </router-link>
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="12" v-if="this.account.delAddr">
                <v-row align="center">
                  <v-col cols="12" md="2" class="py-0 px-lg-12 text-left">
                    <span> Delegate </span>
                  </v-col>
                  <v-col cols="12" md="10" class="py-0 px-lg-12 text-left subtitle-2">
                    <span> {{this.$amoLong(this.account.delegate)}} AMO for account <br/>
                      <router-link :to="{name: 'InspectAccount', params: { address: this.account.delAddr}}">{{ this.account.delAddr }}
                      </router-link>
                    </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Table -->
    <v-container>
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Transmitted txs" outlined>
            <c-scroll-table
              :headers="txTable.headers"
              itemKey="name"
              :items="txTable.txList"
              height="500"
              @loadMore="reqTxTableData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #hash="{item}">
                <router-link class="truncate-option"
                             :to="{ path: '/inspect/tx/' + item.hash, params : {hash: item.hash} }">{{ item.hash }}</router-link>
              </template>
              <template #sender="{item}">
                <router-link class="truncate-option"
                             :to="{ path: '/inspect/account/' + item.sender, params: {account : item.sender }}">{{ item.sender }}</router-link>
              </template>
            </c-scroll-table>
          </c-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>

<script>
  export default {
    data: () => ({
      account: {
        address: null,
        balance: 0,
        stake: 0,
        valAddr: null,
        delegate: 0,
        delAddr: null,
      },
      txTable: {
        headers: [
          { text: 'height', align: 'center', value: 'height'},
          { text: 'index', align: 'center', value: 'index'},
          { text: 'hash',align: 'center',  value: 'hash' },
          { text: 'sender',align: 'center',  value: 'sender' },
          { text: 'type', align: 'center',  value: 'type' },
          { text: 'result', align: 'center', value: 'info' },
        ],
        txList: [],
        topHeight: 0,
        anchor: 0,
        bulkSize: 20,
      },
    }),
    watch: {
      $route(to, from) {
        if (to != from) {
          this.txTable.anchor = 0;
          this.txTable.txList = [];
          if (this.network) this.getPageData()
          if (this.network) this.reqTxTableData();
        }
      },
      network() {
        this.txTable.anchor = 0;
        this.txTable.txList = [];
        if (this.network) this.getPageData()
        if (this.network) this.reqTxTableData();
      },
      'txTable.topHeight'() {
        this.txTable.anchor = 0;
        this.txTable.txList = [];
        if (this.network) this.reqTxTableData();
      },
    },
    computed: {
      tableBreakpoint(){
        return this.$store.state.tableBreakpoint
      },
      network() {
        return this.$store.state.network
      }
    },
    mounted() {
      if (this.network) this.getPageData();
    },
    methods: {
      async getPageData(){
        try {
          this.account = await this.$api.getAccount(this.network, this.$route.params.address);
          var stat = await this.$api.getTxStat(this.network, 100);
          this.txTable.topHeight = stat.txHeight;
        } catch(err) {
          console.debug(err);
          this.account = {
            address: this.$route.params.address,
            balance: 0,
            stake: 0,
            valAddr: null,
            delegate: 0,
            delAddr: null,
          };
        }
      },
      async reqTxTableData() {
        try {
          const res = await this.$api.getTxsBySender(this.network,
            this.$route.params.address, this.txTable.topHeight,
            this.txTable.anchor, this.txTable.bulkSize);
          this.txTable.txList = this.txTable.txList.concat(res);
          this.txTable.anchor = this.txTable.txList.length;
        } catch (e) {
          console.log(e);
        }
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
    .truncate-option {
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 100px !important;
    }
  }

  @media(min-width: 600px) and (max-width: 750px)  {
    /*.truncate-option-box{*/
      /*max-width: 300px !important;*/
    /*}*/
    .truncate-option {
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 200px !important;
    }
  }

   /* 아이패드, 아이패드 프로 */
  @media(min-width: 750px) and (max-width: 1260px)  {
    /*.truncate-option-box{*/
      /*max-width: 350px !important;*/
    /*}*/
    .truncate-option {
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 200px !important;
    }
  }

   @media(min-width: 940px)  and (max-width: 1260px) {
     /*.truncate-option-box{*/
       /*max-width: 200px !important;*/
     /*}*/
   }
   /* 큰화면 */
  @media(min-width: 1260px) {
    /*.truncate-option-box {*/
      /*max-width: 280px !important;*/
    /*}*/
  }
</style>
