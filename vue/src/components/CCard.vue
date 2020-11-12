<template>
  <v-card class="card"
          :outlined="outlined"
          :raised="raised"
          :shaped="shaped"
          :tile="tile"

          :elevation="elevation"
  >
    <v-list-item v-if="title || this.$slots.head || this.$slots.headItems">
      <v-list-item-title v-if="title" class="card-title">{{title}}</v-list-item-title>
      <slot name="head" v-else />
      <v-spacer/>
      <slot name="headItems"/>
    </v-list-item>

    <v-card-text v-if="this.$slots.default">
      <slot />
    </v-card-text>

    <v-card-actions v-if="this.$slots.footer">
      <slot name="footer"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    inheritAttrs: false,

    props: {
      /// outline style
      outlined: {
        type: Boolean,
        default: false
      },
      raised: {
        type: Boolean,
        default: false
      },
      shaped: {
        type: Boolean,
        default: false
      },
      tile: {
        type: Boolean,
        default: false
      },

      /// outline shadow
      elevation: {
        type: [Number, String],
        default: undefined
      },

      /// title
      title: {
        type: String,
        default: undefined
      }
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
  .card {
    padding: 8px;
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>
<style>
  .card-title {
    color: #485158;
    font-size: 20px;
    font-wigth: 400;
  }
</style>
