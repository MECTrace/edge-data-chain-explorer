<template>
  <div id="page-governance">
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Governance stat">
            <v-row>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> # of drafts</span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span>
                      {{ this.governanceStat.value1.toLocaleString() }}
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6" class="py-0 pl-lg-12 text-left">
                    <span> Pass rate for far </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ Number(this.governanceStat.value2.toFixed(2)).toLocaleString() }} %</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="8">
                <v-row>
                  <v-col cols="12" md="6" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Current voting configuration </span>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="12" md="6" sm="6" class="py-0 px-lg-12 text-right subtitle-3">
                    <div>
                      <span> waiting period (open_count) : </span>
                      <span>  {{ this.governanceStat.value3.toLocaleString() }} blks </span>
                    </div>
                    <div>
                      <span> voting period (close_count) : </span>
                      <span> {{ this.governanceStat.value3.toLocaleString() }} blks </span>
                    </div>
                    <div>
                      <span> grace period (apply_count) : </span>
                      <span> {{ this.governanceStat.value3.toLocaleString() }} blks </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Current active draft">
            <v-row v-if="activeDraft">
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Draft ID </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <router-link :to="{path: '/inspect/draft/'+ this.currentActiveDraft.value1, params: {draftId: this.currentActiveDraft.value1}}">
                      {{ this.currentActiveDraft.value1.toLocaleString() }}
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="4" class="py-0 pl-lg-12 pr-0 text-left">
                    <span> Proposer </span>
                  </v-col>
                  <v-col cols="12" md="8" class="py-0 px-lg-10 text-right subtitle-3">
                    <router-link :to="{path:'/inspect/account/'+ this.currentActiveDraft.value2, params:{account: this.currentActiveDraft.value2}}"
                                 class="truncate-option">
                      {{this.currentActiveDraft.value2}}
                    </router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="3" class="py-0 px-lg-12 text-left">
                    <span> Stage </span>
                  </v-col>
                  <v-col cols="12" md="9" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.arg1 }} ( {{ this.arg2.toLocaleString() }} blks remaining) </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Projected YEA : </span>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="12" md="6" class="py-0 px-lg-4 text-right subtitle-3">
                      <span> {{ this.$amoHuman(this.currentActiveDraft.value4) }} AMO </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Projected NAY : </span>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="12" md="6" class="py-0 px-lg-4 text-right subtitle-3">
                    <span> {{ this.$amoHuman(this.currentActiveDraft.value5) }} AMO </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Projected ABSENT : </span>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="12" md="6"class="py-0 px-lg-4 text-right subtitle-3">
                    <span> {{ this.$amoHuman(this.currentActiveDraft.value6) }} AMO </span>
                    <span>  <br class="hidden-md-and-up"> (would be counted as BAY when closing vote)</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </c-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Scroll Table -->
    <v-container>
      <v-row justify="center" >
        <v-col cols="12">
          <c-card class="text-center" title="Draft history" outlined>
            <c-scroll-table
              :headers="draftHistoryTable.headers"
              itemKey="name"
              :items="draftHistoryTable.histories"
              height="500"
              @loadMore="reqData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #id="{item}">
                <router-link :to="{path: '/inspect/draft/'+ item.id, params: {draftId: item.id}}" class="truncate-option" >{{item.id}}</router-link>
              </template>
              <template #proposer="{item}">
                <router-link :to="{path: '/inspect/account/' + item.proposer, params: {account: item.proposer}}" class="truncate-option"> {{item.proposer}} </router-link>
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
      activeDraft: true,
      arg:100,
      arg1 : 'applied',
      arg2 : 405123,
      governanceStat:{
        value1 : 123456 ,
        value2: 33.33 ,
        value3: 124664,
        value4: 234124,
        value5: 594064
      },
      currentActiveDraft:{
        value1: 123,
        value2: '73bae62d33bb942c914d85f9ed612ec8f5a0fa62',
        value4: 1223231231233.45,
        value5: 4522223235.45,
        value6: 991231231231231239.45,
      },
      pageNum: 1,
      perPage: 50,
      draftHistoryTable: {
        headers: [
          { text: 'id', align: 'center', value: 'id'},
          { text: 'status', align: 'center', value: 'status'},
          { text: 'proposer', align: 'center', value: 'proposer'},
        ],
        histories: [],

      },
    }),
    watch: {
      '$store.state.network'() {
        console.log('[Governance Page] 변경 된 network value', this.$store.state.network);
        this.getPageData()
      },
    },
    computed:{
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
      this.reqData();
      this.getPageData();
    },
    methods: {
      async getPageData(){
        // 데이터 바인딩
        console.log('network val',this.network);
      },
      async reqData() {
        // call api
        // try {
        //     const res = await axios.get('http://192.168.23.50:3000/api/test2', {params: {pagenum: this.pageNum, perpage: this.perPage}});
        //     console.log(res);
        //     if(res.data && res.data.result && res.data.result.length > 0) {
        //         this.draftHistoryTable.histories = this.draftHistoryTable.histories.concat(res.data.result);
        //         this.pageNum++;
        //     }
        // } catch(err) {
        //     console.log('err: ', err);
        // }

        // add data
        const startIdx = (this.pageNum-1) * this.perPage;
        const endIdx = parseInt(startIdx) + parseInt(this.perPage);
        let newData = [];
        for(let i=startIdx; i<endIdx; i++) {
          newData.push({
            id: 674,
            status: 'applied',
            proposer: 'a3c338a54bea46c64bdde35e72b6d271c16dedf2',
          });
        }
        this.draftHistoryTable.histories = this.draftHistoryTable.histories.concat(newData);
        this.pageNum++;
      },
      selectEvent(data){
        console.log('select arg : ',data);
        this.getPageData();
      }
    }
  }
</script>
<style scoped>

  @media(max-width: 600px) {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 100px !important;
    }
  }
  @media(min-width: 600px) and (max-width: 750px)  {
    .truncate-option{
      white-space: nowrap!important;
      overflow: hidden!important;
      text-overflow: ellipsis!important;
      display: inline-block!important;
      max-width: 200px !important;
    }
  }
</style>
