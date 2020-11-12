<template>
  <v-btn
    style="text-transform: none"
    class="font-weight-regular"
    :class="getClasses"

    :disabled="disabled"
    :color="color"

    :outlined="outlined"
    :text="text"
    :fab="fab"
    :icon="icon"
    :rounded="rounded"

    :small="small"
    :large="large"
    :block="block"

    :href="href"
    target="target"

    v-on="$listeners"
  >
    <v-icon v-if="iconName&&!(this.$slots.default)" :color="iconColor">{{iconName}}</v-icon>
    <v-icon v-else-if="iconName&&this.$slots.default" left :color="iconColor">{{iconName}}</v-icon>
    <slot></slot>
  </v-btn>
</template>

<script>
  export default {
    props: {
      classes: {
        type: String,
        default: undefined
      },
      color: { // button color
        type: String,
        default: undefined
      },
      disabled: { // disable click event
        type: Boolean,
        default: false
      },
      iconName: { // icon name
        type: String,
        default: undefined
      },
      iconColor: {
        type: String,
        default : undefined
      },

      // style
      text: { // Removes the button background color
        type: Boolean,
        default: false
      },
      fab: { // Makes button round
        type: Boolean,
        default: false
      },
      outlined: { // Button will have an outline
        type: Boolean,
        default: false
      },
      icon: { // Designates the button as icon - round and flat(text)
        type: Boolean,
        default: false
      },
      rounded: { // Makes button round
        type: Boolean,
        default: false
      },


      // size
      small: {
        type: Boolean,
        default: false
      },
      large: {
        type: Boolean,
        default: false
      },
      block: { // Expands the button to 100% of available space
        type: Boolean,
        default: false
      },

      //etc
      href: {
        type: String,
        default: undefined
      },
      link: {
        type: Boolean,
        default: false
      },
      target: {
        type: String,
        default: undefined
      }
    },
    methods: {
    },
    computed: {
      getClasses() {
        if(this.text || this.icon || this.outlined) {
          return `${this.color}--text ${this.classes}`
        } else {
          return `white--text  ${this.classes}`
        }
      },
    },
  }
</script>

