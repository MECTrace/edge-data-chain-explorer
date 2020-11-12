<template>
  <div class="text-center">
    <v-data-table
      :headers="headers"

      :item-key="itemKey"
      :items="items"

      :show-expand="showExpand"
      :single-expand="singleExpand"

      :show-select="showSelect"
      :single-select="singleSelect"
      v-model="selectedRows"

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
    <!--<v-pagination
        v-model="page"
        :circle="circle"
        :length="length"
        :page="page"
        :total-visible="totalVisible"
    />-->
  </div>
</template>
<script>
  export default {
    props: {
      // pagination: { // ..ing
      //     type: Object
      // },

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
      }
    },
    data: () => {
      return {
        selectedRows: [],
        page: 1
      }
    },
    created() {
      if(this.showExpand) {
        this.headers.push({text: '', value: 'data-table-expand'})
      }
    },
    methods: {
      onClickRow: function(e) {
        this.$emit('click', e)
      }
    },
    computed: {
      getItemSlotHeaders: function() {
        return this.showExpand ? this.headers.slice(0, this.headers.length-1) : this.headers
      }
    },
    watch: {
      selectedRows: function(value) {
        this.$emit('update:selected', value)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .v-data-footer__select {
    flex-basis: auto;

    .v-select {
      flex-basis: 50px;

      .v-select__selections {
        flex-basis: auto;
      }
    }
  }

  .v-list-item__content {
    flex: 1 1 auto;
    min-width: 40px;
  }
</style>
