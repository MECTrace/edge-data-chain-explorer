<template>
  <div id="page-inspect-validator">
    <v-container>
      <v-row justify="space-between" align="center">
        <v-col cols="12">
          <c-card class="text-center" title="Validator information">
            <v-row>
              <v-col cols="12">
                <v-row align="center">
                  <v-col cols="12" md="4" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Address </span>
                  </v-col>
                  <v-col cols="12" md="8" sm="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option-box"> {{ this.validator.address }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col cols="12" md="4" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Public key </span>
                  </v-col>
                  <v-col cols="12" md="8" sm="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span class="truncate-option-box"> {{ this.validator.pubkey }} </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col cols="12" md="4" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Control account </span>
                  </v-col>
                  <v-col cols="12" md="8" sm="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <router-link class="truncate-option-box"
                                 :to="{ path: '/inspect/account/' + this.validator.owner , params : {account: this.validator.owner } }">{{ this.validator.owner }}</router-link>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row align="center">
                  <v-col cols="12" md="4" sm="6" class="py-0 px-lg-12 text-left">
                    <span> Effective stake </span>
                  </v-col>
                  <v-col cols="12" md="8" sm="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.$amoLong(this.validator.effStake) }} AMO </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Voting power </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.validator.power.toLocaleString() }} </span>
                    <!-- span> {{ this.validator.power.toLocaleString() }} ( {{this.validator.powerRatio.toFixed(2).toLocaleString() }} %) </span -->
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row align="center">
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-left">
                    <span> Activity </span>
                  </v-col>
                  <v-col cols="12" md="6" class="py-0 px-lg-12 text-right subtitle-2">
                    <span> {{ this.validator.activity.toFixed(2).toLocaleString() }} % </span>
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
          <c-card class="text-center" title="Delegators" outlined>
            <c-scroll-table
              :headers="delTable.headers"
              itemKey="name"
              :items="delTable.delList"
              height="500"
              @loadMore="reqTableData"
              :mobile-breakpoint="tableBreakpoint"
            >
              <template #address="{item}">
                <router-link class="truncate-option"
                             :to="{ path: '/inspect/account/' + item.address, params : {hash: item.address} }">{{ item.address }}</router-link>
              </template>
              <template #delegate="{item}">
                <span> {{ $amoShort(item.delegate) }} AMO</span>
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
      validator: {
        address: null,
        pubkey: null,
        power: 0,
        owner: null,
        effStake: 0,
        powerRatio: 0,
        activity: 0,
      },
      delTable: {
        headers: [
          { text: 'address',align: 'center',  value: 'address' },
          { text: 'amount', align: 'center', value: 'delegate' },
        ],
        delList: [],
        anchor: 0,
        bulkSize: 20,
      },
    }),
    watch: {
      $route(to, from) {
        if (to != from) {
          this.delTable.anchor = 0;
          this.delTable.delList = [];
          if (this.network) this.getPageData()
          if (this.network) this.reqTableData();
        }
      },
      network() {
        this.delTable.anchor = 0;
        this.delTable.delList = [];
        if (this.network) this.getPageData()
        if (this.network) this.reqTableData();
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
      if (this.network) this.reqTableData();
    },
    methods: {
      async getPageData(){
        try {
          var res = await this.$api.getValidator(this.network, this.$route.params.address);
          this.validator.address = res.address;
          this.validator.pubkey = res.pubkey;
          this.validator.power = res.power;
          this.validator.owner = res.owner;
          this.validator.effStake = res.effStake;
          this.validator.powerRatio = 0; // TODO
          this.validator.activity = 0; // TODO
        } catch(e) {
          console.debug(e);
          this.validator = {
            address: this.$route.params.address,
            pubkey: null,
            power: 0,
            owner: null,
            effStake: 0,
            powerRatio: 0,
            activity: 0,
          };
        }
      },
      async reqTableData() {
        try {
          const res = await this.$api.getDelegators(this.network,
            this.$route.params.address,
            this.delTable.anchor, this.delTable.bulkSize);
          this.delTable.delList = this.delTable.delList.concat(res);
          this.delTable.anchor = this.delTable.delList.length;
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
  }

  /*@media(min-width: 600px) and (max-width: 750px)  {*/
    /*.truncate-option-box{*/
      /*max-width: 300px !important;*/
    /*}*/
  /*}*/

  /*!* 아이패드, 아이패드 프로 *!*/
  /*@media(min-width: 750px) and (max-width: 940px)  {*/
    /*.truncate-option-box{*/
      /*max-width: 320px !important;*/
    /*}*/
  /*}*/

  /*!* 큰화면 *!*/
  /*@media(min-width: 940px)  and (max-width: 1260px) {*/
    /*.truncate-option-box{*/
      /*max-width: 420px !important;*/
    /*}*/
  /*}*/

</style>
