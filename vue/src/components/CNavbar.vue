<template>
  <nav>
    <v-app-bar id="AppBar" class="app-bar" app height="110">
      <v-container class="pt-0 mt-1">
        <!-- Desktop version -->
        <v-row align="center" class="hidden-sm-and-down" style="cursor: pointer;">
          <v-col cols="5">
            <v-row>
              <v-img
                class="logo-img"
                :src="require('../assets/amo_white.png')"
                @click="$router.push('/')"></v-img>
              <v-toolbar-title @click="$router.push('/')" class="logo-title ml-2 white--text">
                AMO Blockchain Explorer
              </v-toolbar-title>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-select
              @change="selectEvent"
              class="ml-3"
              item-color="teal"
              label="network"
              single-line outlined hide-details dark dense
              :items="networks"
              :menu-props="{ top: false, offsetY: true, color : '#ffffff' }"
              v-model="network"

            ></v-select>

          </v-col>
          <v-col cols="4">
            <v-text-field
              label="block, account, tx, validator"
              single-line outlined rounded hide-details dense dark clearable
              prepend-inner-icon="search"
              v-model="search"
              @keyup.enter="searchByKeyword"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Mobile version -->
        <v-row class="hidden-md-and-up">
          <v-col cols="12">
            <v-row class="pt-5" align="center">
              <!--<v-col cols="1">-->
              <!--<v-app-bar-nav-icon style="color: white;padding-right: 20px" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>-->
              <!--</v-col>-->
              <v-col cols="7" style="cursor: pointer">
                <v-row align="center">
                  <v-img
                    class="logo-img"
                    :src="require('../assets/amo_white.png')"
                    @click.stop="drawer = !drawer"
                  />
                  <div @click="$router.push('/')">
                    <div class="logo-title white--text ml-2">AMO</div>
                    <div class="logo-sub-title white--text ml-2">Blockchain Explorer</div>
                  </div>

                </v-row>
              </v-col>

              <v-col cols="5">
                <v-row class="select-wrapper"  justify="end">
                  <v-select
                    @change="selectEvent"
                    v-model="network"
                    item-color="coinTeal"
                    label="network"
                    single-line outlined hide-details dark dense
                    :items="networks"
                    :menu-props="{ top: false, offsetY: true, color : '#ffffff' }"
                  ></v-select>
                </v-row>
              </v-col>
            </v-row>
            <v-text-field
              single-line outlined rounded hide-details search dark
              label="block, account, tx, validator"
              prepend-inner-icon="search"
              v-model="search"
              @keyup.enter="searchByKeyword"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="hidden-sm-and-down">
          <v-tabs background-color="transparent" grow slider-color="coinYellow" class="tab-option" slider-size="3">
            <v-tab v-for="page in routes" :key="page.name" :to="page.path" @click="currentPage = page"
                   class="white--text tabs-item-font">
              {{ page.name || page.children[0].name }}
            </v-tab>
          </v-tabs>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app class="app-navibar" temporary>
      <v-list flat>
        <v-list-item class="app-menu-item" v-for="page in routes" :key="page.name" :to="page.path"
                     active-class="border" @click="currentPage = page">
          <v-list-item-action>
            <v-icon>{{page.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="app-menu-item-text">{{page.name || page.children[0].name}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
<script>
  import routes from '../router/routes';

  export default {
    data: () => ({
      drawer: false,
      routes: routes,
      currentPage: {},
      networks: [],
      search: '',
      network: '',
    }),
    components: {
      // Popup
    },
    // computed: {
    //     network() {
    //         return this.$store.state.network
    //     }
    // },
    created() {
      this.getNetworks();
    },
    mounted() {
      console.debug('current page', this.$route);
      this.currentPage = this.$route;
    },
    watch: {
      search: function(newVal, oldVal) {
        if(newVal === 'a') {
          this.search = 'account:'
        }
        if(newVal === 'b') {
          this.search = 'block:'
        }
        if(newVal === 't') {
          this.search = 'tx:'
        }
        if(newVal === 'v') {
          this.search = 'validator:'
        }
      }

    },
    methods: {
      async getNetworks() {
        var res = await this.$api.getNetworks();
        var items = [];
        for (var i = 0; i < res.length; i++) {
          items.push(res[i].chainId);
        }
        this.networks = items;
        this.network = items[0];
        this.$store.commit('network', this.network);
      },
      searchByKeyword(evt) {
          if(evt.keyCode === 13){
            this.$router.push(this.$resolveSearch(this.search));
          }

      },
      selectEvent() {
        console.debug('network item',this.network);

        // network값 변경 후 vuex에 반영
        this.$store.commit('network', this.network);

      }
    }
  }
</script>
<style scoped>
  .border {
    /*border-radius: 4px;*/
    /*background-color: #e91e63 !important;*/
    color: #ff9117 !important;
  }

  .app-navibar {
    /*top: 64px !important;*/
    background-color: #ffffff !important;
  }

  .app-bar {
    /*left: 0px !important;*/
    color: black !important;
    box-shadow: 0 0 0 0 !important;

    border-style: solid;
    border-top: hidden;
    border-left: hidden;
    border-right: hidden;
    border-width: thin;
    border-bottom-color: #e6dbdb;

    background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(24,40,52,1) 60%);
  }

  .app-menu-item {
    margin: 10px 10px;
    color: #535659;
  }

  .app-menu-item-text {
    font-weight: 400;
    font-size: 15px;
  }

  .tabs-item-font {
    font-weight: normal;
  }

  @media (max-width: 960px) {
    .logo-img {
      max-width: 23px;
      max-height: 23px;
      width: 23px;
      height: 23px;
    }

    .logo-title {
      font-size: 0.9rem !important;
      font-weight: 400;
      letter-spacing: 0.16em !important;
    }

    .logo-sub-title {
      font-size: 0.7rem !important;
      font-weight: 400;
      letter-spacing: 0.16em !important;
    }

    .select-wrapper {
      margin-bottom: -10px;
    }
  }

  @media (min-width: 960px) {
    .logo-img {
      max-width: 25px;
      max-height: 25px;
      height: 25px;
      width: 25px;
      top: 2px;
    }

    .logo-title {
      font-size: 1.3rem !important;
      font-weight: 400;
      letter-spacing: 0.16em !important;

    }
  }

  @media (min-width: 840px) and (max-width: 1400px){
    .tab-option {
      width: 110% !important;
      margin-left: -24px;
    }

  }
</style>
