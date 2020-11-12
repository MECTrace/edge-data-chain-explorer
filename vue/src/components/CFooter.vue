<template>
  <v-footer
    app
    padless
    absolute
    class="black"
  >
    <v-container class="py-1 my-1">
      <v-row class="align-center">
        <v-tooltip top v-for="(item, i) in items" v-bind:key="item.name">
          <template v-slot:activator="{ on }">
            <c-btn class="mx-1" icon :iconName="item.icon" iconColor="white" :href="item.link" target="_blank" v-on="on"></c-btn>
          </template>
          <span>{{ item.name}}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <span class="white--text body-2">&copy; AMO Labs 2020 </span>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      show: false,
      items: [
        {
          name:'AMO labs',
          link:'https://www.facebook.com/amoblockchain',
          icon: 'mdi-alpha-a-circle-outline'
        },
        {
          name:'testnet',
          link:'https://testnet.amolabs.io',
          icon: 'mdi-alpha-t-box-outline'
        },
        {
          name:'medium',
          link:'https://medium.com/amo-blockchain',
          icon: 'mdi-alpha-m-box-outline'
        },
        {
          name : 'facebook',
          link:'https://www.facebook.com/amoblockchain',
          icon: 'mdi-facebook'
        }
      ]
    })
  }
</script>
<style lang="scss" scoped>
</style>
