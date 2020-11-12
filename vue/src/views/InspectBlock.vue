<template>
  <div id="page-inspect-block">
    <v-container>
      <!-- Block information -->
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Block Information">
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Height </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ block.height.toLocaleString() }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Time </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.$formatTime(block.time) }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="4" class="py-0 px-lg-12 text-left">
                    <span> Block hash </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option-box"> {{ block.hash }}</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="start">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Tx bytes </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{$byteHuman(block.txBytes) + 'B'}} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="4" class="py-0 px-lg-12 text-left">
                    <span> Proposer </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 px-lg-12 text-right subtitle-2">
                    <router-link class="truncate-option-box"
                      :to="{ path: '/inspect/validator/' + block.proposer, params : {address: block.proposer } }">{{ block.proposer }}</router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="4" class="py-0 px-lg-12 text-left">
                    <span> # of txs </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 px-lg-12 text-right subtitle-2">
                    <span>{{ block.numTxs.toLocaleString() }} ({{block.numTxsValid.toLocaleString()}} valid + {{block.numTxsInvalid.toLocaleString()}} invalid)</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <!-- Included txs -->
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Included txs" outlined>
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
                  :to="{ path: '/inspect/tx/' + item.hash, params : {hash: item.hash } }">{{ item.hash }}</router-link>
              </template>
              <template #sender="{item}">
                <router-link class="truncate-option"
                  :to="{ path: '/inspect/account/' + item.sender, params : {proposer: item.hash }  }">{{ item.sender }}</router-link>
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
      // NOTE: don't use 'this' in here.
      block: {
        height: 0,
        time: null,
        hash: '-',
        txBytes: 0,
        proposer: '-',
        numTxs: 0,
        numTxsValid: 0,
        numTxsInvalid: 0,
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
      'block.height'() {
        if (this.block.height > 0) {
          if (this.network) this.reqTxTableData();
        }
      },
    },
    computed:{
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
      async getPageData() {
        try {
          this.block = await this.$api.getBlock(this.network, this.$route.params.height);
        } catch (e) {
          console.debug(e);
          this.block = {
            height: 0,
            time: '-',
            hash: '-',
            txBytes: 0,
            proposer: '-',
            numTxs: 0,
            numTxsValid: 0,
            numTxsInvalid: 0,
          };
          this.block.height = this.$route.params.height;
        }
      },
      async reqTxTableData() {
        try {
          const res = await this.$api.getTxsByBlock(this.network,
            this.block.height,
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
  /* 모바일 */
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

  /* Responsive web */
  @media(min-width: 600px) and (max-width: 1260px)  {

    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 200px !important;
    }
  }

  @media(min-width: 900px) and (max-width: 1260px)  {
    /*.truncate-option-box{*/
      /*max-width: 270px !important;*/
    /*}*/
  }

  @media(min-width: 1260px) {
    /*.truncate-option-box {*/
      /*max-width: 320px !important;*/
    /*}*/
  }
</style>
