<template>
  <div id="progress-bar-line"
       :style="{ width: this.width.indexOf('%') == -1? this.width+'px' : this.width}"
  >
    <v-container v-if="type === '1'" class="top-text">
      <v-layout row fill-height >
        <span :style="{fontSize: this.fontSize}"> {{title}}</span>
        <v-spacer></v-spacer>
        <!--<span :style="{fontSize: this.fontSize}">{{ value }}</span>-->
      </v-layout>
      <v-layout row fill-height>
        <svg
          class="svg"
          id="line-progress"
          :style="lineStyleSvgFrame"
        >
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            :stroke="progressBackgroundColor"
            :stroke-width="height"
          />
          <line
            x1="0"
            y1="50%"
            :x2="progressValue"
            y2="50%"
            :stroke="progressColor"
            :stroke-width="lineProgressHeight"
            stroke-linecap="round"
          />
        </svg>
      </v-layout>
    </v-container>
    <v-container v-if="type === '2'" class="middle-text">
      <v-layout row fill-height>
        <svg
          class="svg"
          id="line-progress"
          :style="lineStyleSvgFrame"
        >
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            :stroke="progressBackgroundColor"
            :stroke-width="height"
          />
          <line
            x1="0"
            y1="50%"
            :x2="progressValue"
            y2="50%"
            :stroke="progressColor"
            :stroke-width="lineProgressHeight"
            stroke-linecap="round"
          />
          <text
            :style="textStyle"
            :x="horizontalTextAlignP"
            :y="verticalTextAlignP"
          >
            {{ value }}%
          </text>
        </svg>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import { ProgressBarMixin } from './Mixin'
  export default {
    mixins: [ProgressBarMixin],
    props: {
      shape: { // fixed prop
        type: String,
        default: "line"
      },
      type: { // line progress type ["1" | "2"]
        type: String,
        default: "1"
      },
      value: { // progress value
        type: Number,
        default: 0
      },
      height: { // progress height
        type: String,
        default: "30"
      },
      width: { // progress width
        type: String,
        default: "300px"
      },
      strokeWidth: { // progress stroke width
        type: String,
        default: "30"
      },
      color: { // progress color
        type: String,
        default: "orange"
      },
      backgroundColor: { // progress background color
        type: String,
        default: undefined
      },
      fontColor: { // progress value font color
        type: String,
        default: "black"
      },
      fontSize: { // progress value font size
        type: String,
        default: "14px"
      },
      fontDynamicPosition: { // progress value position
        type: Boolean,
        default: false
      },
      fontHidden: { // hide progress value
        type: Boolean,
        default: false
      },
      title: {
        type: String, // line progress title
        default: undefined
      },
    }
  }
</script>
<style lang="scss" scoped>
  .svg {
    border-radius: 25px;
  }
  .bg {
    margin: 0 auto;
    display: inline-block;
  }
</style>
