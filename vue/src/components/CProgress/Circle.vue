<template>
  <div id="progress-bar-circle" class="progress-bar">
    <div v-if="type === '1'">
      <div class="percent">
        <slot v-if="this.$slots.default" />
        <span v-else :style="textStyle">{{value}}%</span>
      </div>
      <svg
        class="svg__progress"
        :width="radius"
        :height="radius"
        viewBox="0 0 120 120"
      >
        <circle
          class="circle__progress--fill"
          cx="60"
          cy="60"
          :r="radiusCircle"
          fill="none"
          :stroke="progressBackgroundColor"
          :stroke-width="strokeWidth"
        />
        <circle
          cx="60"
          cy="60"
          :r="radiusCircle"
          fill="none"
          :stroke="progressColor"
          :stroke-width="strokeWidth"
          :stroke-dasharray="strokeCircle"
          :stroke-dashoffset="strokeCircleOffset"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <div v-if="type === '2'">
      <div class="percent">
        <slot v-if="this.$slots.default" />
        <span v-else :style="textStyle">{{value}}%</span>
      </div>
      <svg
        class="svg__progress"
        :width="radius"
        :height="radius"
        viewBox="0 0 120 120"
      >
        <circle
          class="circle__progress--fill"
          cx="60"
          cy="60"
          :r="radiusCircle"
          fill="none"
          :stroke="progressBackgroundColor"
          :stroke-width="strokeWidth/2"
        />
        <circle
          cx="60"
          cy="60"
          :r="radiusCircle"
          fill="none"
          :stroke="progressColor"
          :stroke-width="strokeWidth"
          :stroke-dasharray="strokeCircle"
          :stroke-dashoffset="strokeCircleOffset"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </div>
</template>

<script>
  import { ProgressBarMixin } from './Mixin'
  export default {
    mixins: [ProgressBarMixin],
    props: {
      shape: { // fixed prop
        type: String,
        default: "circle"
      },
      type: { // line progress type ["1" | "2"]
        type: String,
        default: "1"
      },
      value: { // progress value
        type: Number,
        default: 0
      },
      radius: { // progress width, height
        type: String,
        default: "200"
      },
      strokeWidth: { // progress stroke width
        type: String,
        default: "10"
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
        default: "30"
      },
      fontHidden: { // hide progress value
        type: Boolean,
        default: false
      },

    }
  }
</script>
<style lang="scss" scoped>
  .progress-bar {
    display: inline-block;
    position: relative;
  }
  .svg__progress {
    transform: rotate(-90deg);
  }
  .percent {
    width: 100%;
    top: 45%;
    left: 50%;
    position: absolute;
    font-weight: bold;
    text-align: center;
    transform: translate(-50%, -50%);
  }
</style>
