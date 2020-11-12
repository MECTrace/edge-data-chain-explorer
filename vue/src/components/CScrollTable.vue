<template>
  <v-container>
    <v-layout column class="layout" :style="tableHeight">
      <v-flex class="table_wrapper" id="infinite-list">
        <v-data-table
          hide-default-footer
          disable-pagination

          :headers="headers"

          :item-key="itemKey"
          :items="items"

          :show-expand="showExpand"
          :single-expand="singleExpand"

          :show-select="showSelect"
          :single-select="singleSelect"
          v-model="selectedRows"

          :mobile-breakpoint="mobileBreakpoint"
          :dense="dense"

          class="elevation-1"

          @click:row="onClickRow($event)"
        >
          <!-- column item -->
          <template v-for="(header, idx) in getItemSlotHeaders" v-slot:[`item.${headers[idx].value}`]="{ item }">
            <slot :name="headers[idx].value" :item="item">
              {{ item[headers[idx].value] }}
            </slot>
          </template>


          <!-- expanded item/row -->
          <template #expanded-item="{ item, headers }">
            <td :colspan="headers.length">
              <slot name="expanded" :item="item">
              </slot>
            </td>
          </template>
        </v-data-table>
      </v-flex>
      <!--            <transition name="fade" class="loading_wrapper">-->
      <!--                <div class="loading" v-show="loading">-->
      <!--                    &lt;!&ndash;                        <span class="fa fa-spinner fa-spin"></span> Loading&ndash;&gt;-->
      <!--                    <v-progress-circular-->
      <!--                            :size="40"-->
      <!--                            :width="2"-->
      <!--                            color="orange"-->
      <!--                            indeterminate-->
      <!--                    ></v-progress-circular>-->
      <!--                </div>-->
      <!--            </transition>-->
      <transition name="fade">
        <div class="loading2" v-show="loading">
          <span class="fa fa-spinner fa-spin"></span> Loading
        </div>
      </transition>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios';
  export default {
    props: {
      headers: { // table header columns
        type: Array,
        //properties
        // {
        //     text: string // describe data
        //     value: string // header value (key)
        //     align?: 'start' | 'center' | 'end'
        //     sortable?: boolean
        //     filterable?: boolean
        //     divider?: boolean
        //     class?: string | string[]
        //     width?: string | number
        //     filter?: (value: any, search: string, item: any) => boolean
        //     sort?: (a: any, b: any) => number
        // }
      },
      itemKey: { // unique key
        type: String,
      },
      items: { // items
        type: Array,
      },
      showExpand: { // Shows the expand
        type: Boolean,
        default: false
      },
      singleExpand: { // single expand
        type: Boolean,
        default: false
      },
      showSelect: {// Shows the select
        type: Boolean,
        default: false
      },
      singleSelect: { // single select
        type: Boolean,
        default: false
      },
      dense: { // decrease the height of row
        type: Boolean,
        default : false
      },
      selected: { // selected rows, bind with selectedRows
        type: Array,
        default: () => []
      },

      height: {
        type: [Number, String],
        default: "500"
      },

      mobileBreakpoint: {
        type: [Number, String],
        default: "500"
      },
    },
    data: () => ({
      listElm: null,
      loading: false,

      selectedRows: [],
    }),
    created() {
      if(this.showExpand) {
        this.headers.push({text: '', value: 'data-table-expand'})
      }
    },
    mounted() {
      this.listElm = document.querySelector('#infinite-list');
      this.listElm.addEventListener('scroll', this.scrollEvent);

    },
    beforeDestroy() {
      this.listElm.removeEventListener('scroll', this.scrollEvent);
      this.listElm = null;
    },

    methods: {
      onClickRow: function(e) {
        this.$emit('click', e);
      },
      scrollEvent() {
        if(this.listElm.scrollTop + this.listElm.clientHeight + 2 >= this.listElm.scrollHeight) {
          this.loadMore();
        }
      },
      loadMore() {
        this.loading = true;
        setTimeout(async() => {
          await this.$emit('loadMore');
          this.loading = false;
        }, 500);
      },
    },
    computed: {
      getItemSlotHeaders: function() {
        return this.showExpand ? this.headers.slice(0, this.headers.length-1) : this.headers;
      },
      tableHeight() {
        return `height: ${this.height}px;`
      }
    },
    watch: {
      selectedRows: function(value) {
        this.$emit('update:selected', value);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .layout {
    position: relative;
  }
  .table_wrapper {
    overflow-y: scroll;
    flex: 1 1 auto;
  }
  .loading_wrapper {
    position: absolute;
  }
  .loading {
    text-align: center;
    position: absolute;
    color: #fff;
    z-index: 9;
    padding: 8px 18px;
    border-radius: 5px;
    left: calc(50% - 45px);
    bottom: 20px;
    /*top: calc(50% - 18px);*/
  }
  .loading2 {
    text-align: center;
    position: absolute;
    color: #fff;
    z-index: 9;
    background: orange;
    padding: 8px 18px;
    border-radius: 5px;
    left: calc(50% - 45px);
    bottom: 20px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
