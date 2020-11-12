<template>
  <div id="page-block">
    <!-- Block stat -->
    <v-container>
       <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center">
            <div class="card-title mb-4">Block stat <br class="hidden-sm-and-up"> in last
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
              blocks
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average interval </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ Number(this.blockStat.avgInterval.toFixed(2)).toLocaleString() }} sec / blk</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average incentive </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <!--span> {{ this.$amoLong(this.blockStat.avgIncentive)  }} AMO / blk</span-->
                      <span> - AMO / blk</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average # of txs </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ Number(this.blockStat.avgNumTxs.toFixed(2)).toLocaleString() }} txs / blk </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Average tx bytes </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <div>
                      <span> {{ this.$byteHuman(this.blockStat.avgBlkTxBytes) + 'B' }} / blk</span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>

    <!--Table-->
    <v-container>
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Recent blocks" outlined>
            <c-scroll-table
              :headers="blockTable.headers"
              itemKey="name"
              :items="blockTable.blockList"
              height="500"
              @loadMore="reqBlockTableData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #time="{item}">
                <span class="font-option">
                  {{$formatTime(item.time)}} </span>
              </template>
              <template #height="{item}">
                <router-link :to="{ path: '/inspect/block/' + item.height, params : {block: item.height } }">{{ item.height }}</router-link>
              </template>
              <template #proposer="{item}">
                <router-link class="d-inline-block text-truncate truncate-option"
                             :to="{ path: '/inspect/validator/' + item.proposer, params: {account : item.proposer }}">{{ item.proposer }}</router-link>
              </template>
              <template #ofTxs="{item}">
                <span> {{item.ofTxs.toLocaleString()}}</span>
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
      blockStat: {
        lastHeight: 0,
        avgInterval: 0,
        avgIncentive: 0,
        avgNumTxs: 0,
        avgBlkTxBytes: 0,
      },
      statRange:100,
      blockTable: {
        headers: [
          {
            text: 'height',
            value: 'height',
            align: 'center', // 'start' | 'center' | 'end'
          },
          { text: 'time',align: 'center',  value: 'time' },
          { text: 'proposer', align: 'center',  value: 'proposer' },
          { text: '# of txs', align: 'center', value: 'num_txs' },
        ],
        blockList: [],
        anchor: 0,
        bulkSize: 20,
      },
    }),
    watch: {
      '$store.state.network'() {
        this.blockTable.anchor = 0;
        this.blockTable.blockList = [];
        if (this.network) this.getPageData();
      },
      'blockStat.lastHeight'() {
        this.blockTable.anchor = this.blockStat.lastHeight;
        if (this.network) this.reqBlockTableData();
      },
    },
    computed:{
      // tableBreakpoint, args -> vuex에서 선언된 데이터 사용하기 위함.
      tableBreakpoint(){
        return this.$store.state.tableBreakpoint
      },
      args(){
        return this.$store.state.args
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
          this.blockStat = await this.$api.getBlockStat(this.network, this.statRange);
        } catch (e) {
          console.log(e);
        }
      },
      async reqBlockTableData() {
        var l = this.blockTable.blockList;
        if (this.blockTable.anchor == 0) {
          return;
        }
        try {
          const res = await this.$api.getBlocks(this.network, 
            this.blockTable.anchor, this.blockTable.bulkSize, 'desc');
          l = l.concat(res);
          this.blockTable.blockList = l;
          this.blockTable.anchor = l[l.length-1].height - 1;
        } catch (e) {
          console.log(e);
        }
      },
      selectEvent(){
        if (this.network) this.getPageData()
      }
    }
  }
</script>

<style scoped>
  @media(max-width: 600px) {
    .truncate-option{
      max-width: 100px !important;
    }
  }
  @media(min-width: 600px) and (max-width: 750px)  {
    .truncate-option{
      max-width: 200px !important;
    }
  }
</style>
