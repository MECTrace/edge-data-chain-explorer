<template>
  <div id="page-transaction">
    <!-- Tx state -->
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center">

            <!-- title-->
            <div class="card-title mb-4">TX stat <br class="hidden-sm-and-up">  in last
              <span class="mx-2">
                <v-select
                  style="max-width:90px;display:inline-flex"
                  :items="args"
                  v-model="statRange"
                  menu-props="offsetY"
                  dense
                  class="pa-0"
                  color="teal lighten-2"
                  @change="selectEvent"
                ></v-select>
              </span>
              txs
            </div>

            <!-- stat -->
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average tx bytes </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ this.$byteHuman(this.txStat.avgTxBytes) }}B</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average tx fee </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ this.$amoLong(this.txStat.avgTxFee) }} AMO / tx </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="4" class="py-0 pl-lg-12 text-left">
                    <span> Average binding lag </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 pr-lg-12 text-right subtitle-2">
                    <div>
                      <span>{{ Number(this.txStat.avgBindingLag.toFixed(2)).toLocaleString() }} blks / <br class="hidden-sm-and-up">max {{ this.txStat.maxBindingLag.toLocaleString() }} blks</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="4" class="py-0 px-lg-12 text-left">
                    <span> Invalid tx ratio </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ this.txStat.numTxsInvalid.toLocaleString()}} / {{ this.txStat.numTxs.toLocaleString() }} ( {{ this.txStat.ratioInvalid.toFixed(2) }} % ) </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Recent txs table-->
    <v-container>
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Recent txs" outlined>
            <c-scroll-table
              :headers="txTable.headers"
              itemKey="name"
              :items="txTable.txList"
              height="500"
              @loadMore="reqTxTableData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #height="{item}">
                <router-link :to="{ name: 'InspectBlock', params: { height: item.height} }">{{ item.height }}</router-link>
              </template>
              <template #hash="{item}">
                <router-link class="truncate-option"
                             :to="{ name: 'InspectTx', params: {hash : item.hash }}">{{ item.hash }}</router-link>
              </template>
              <template #sender="{item}">
                <router-link class="truncate-option"
                             :to="{ name: 'InspectAccount', params: {address : item.sender }}">{{ item.sender }}</router-link>
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
      txStat: {
        txHeight: 0,
        txIndex: 0,
        avgTxBytes : 0,
        avgTxFee : 0,
        avgBindingLag: 0,
        maxBindingLag: 0,
        numTxsInvalid: 0,
        numTxs: 0,
        ratioInvalid: 0,
      },
      statRange:100,
      txTable: {
        headers: [
          { text: 'height', align: 'center', value: 'height'},
          { text: 'index', align: 'center', value: 'index'},
          { text: 'hash', align: 'center', value: 'hash'},
          { text: 'sender', align: 'center', value: 'sender'},
          { text: 'type', align: 'center', value: 'type'},
          { text: 'result', align: 'center', value: 'info'},
        ],
        txList: [],
        topHeight: 0,
        anchor: 0,
        bulkSize: 20,
      },
    }),
    watch: {
      network() {
        if (this.network) this.getPageData()
      },
      'txTable.topHeight'() {
        this.txTable.anchor = 0;
        this.txTable.txList = [];
        if (this.network) this.reqTxTableData();
      },
    },
    computed:{
      tableBreakpoint(){
        return this.$store.state.tableBreakpoint
      },
      args() {
        return this.$store.state.args
      },
      network() {
        return this.$store.state.network
      },
    },
    mounted() {
      if (this.network) this.getPageData()
    },
    methods: {
      async getPageData(){
        try {
          this.txStat = await this.$api.getTxStat(this.network, this.statRange);
          this.txStat.ratioInvalid = 100 *
            Number(this.txStat.numTxsInvalid) / Number(this.txStat.numTxs);
          this.txTable.topHeight = this.txStat.txHeight;
        } catch (e) {
          console.log(e);
        }
      },
      async reqTxTableData() {
        try {
          const res = await this.$api.getTxs(this.network,
            this.txTable.topHeight,
            this.txTable.anchor, this.txTable.bulkSize);
          this.txTable.txList = this.txTable.txList.concat(res);
          this.txTable.anchor = this.txTable.txList.length;
        } catch (e) {
          console.log(e);
        }
      },
      selectEvent(data){
        if (this.network) this.getPageData();
      }
    }
  }
</script>
<style scoped>

  /* 모바일 */
  @media(max-width: 600px) {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 120px !important;
    }
  }
  /* Responsive web */
  /* 작은화면 */
  @media(min-width: 600px) and (max-width: 750px)  {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 250px !important;
    }
  }

  /* 아이패드 */
  @media(min-width: 750px) and (max-width: 940px)  {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 140px !important;
    }
  }

  /*  아이패드 프로, 중간화면 */
  @media(min-width: 940px)  and (max-width: 1300px) {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 200px !important;
    }
  }

   /*큰 화면*/
  @media(min-width: 1300px) and (max-width: 1900px){
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 500px !important;
      /*max-width: 500px !important;*/
    }
  }
</style>
