const px = v => v + 'px'

export const ProgressBarMixin = {
  created () {
    // this.defaultOptions = {
    //     text: {
    //         color: '#485158',
    //         shadowEnable: false,
    //         shadowColor: 'rgba(0,0,0,0.5)',
    //         fontSize: 14,
    //         fontFamily: 'Helvetica',
    //         dynamicPosition: true,
    //         hideText: false
    //     },
    //     progress: {
    //         color: 'orange',
    //         backgroundColor: '#e7e7e7'
    //     },
    //     layout: {
    //         verticalTextAlign: 65,
    //         horizontalTextAlign: 43,
    //         zeroOffset: 0,
    //         strokeWidth: 30,
    //         progressPadding: 0,
    //     }
    // };
    this.defaultOptions = {
      text: {
        color: this.fontColor || 'black',
        fontSize: this.fontSize,
        dynamicPosition: this.fontDynamicPosition,
        hideText: this.fontHidden,

        fontFamily: 'Helvetica',
        shadowEnable: false,
        shadowColor: 'rgba(0,0,0,0.5)'
      },
      progress: {
        color: this.color,
        backgroundColor: this.backgroundColor || '#e7e7e7'
      },
      layout: {
        strokeWidth: this.strokeWidth,
        verticalTextAlign: 66,
        horizontalTextAlign: 43,
        zeroOffset: 0,
        progressPadding: 0,
      }
    };
    
  },
  mounted () {
    this.mergeDefaultOptionsWithProp();
    // if (this.options !== null && this.options !== undefined) {
    //     this.mergeDefaultOptionsWithProp(this.options)
    // }
    this.updateValue(this.value);
  },
  data () {
    return {
      defaultOptions: Object,
      rectHeight: 0,
      rectY: 90,
      topCy: -20,
      radiusCircle: 54,
      strokeCircle: 0,
      strokeCircleOffset: 0
    }
  },
  computed: {
    // ProgressBar Type
    cylinder () {
      return this.shape === 'cylinder';
    },
    line () {
      return this.shape === 'line';
    },
    circle () {
      return this.shape === 'circle';
    },
    battery () {
      return this.shape === 'battery';
    },
    progressBarType () {
      if (this.cylinder) {
        return 'ProgressBarCylinder';
      } else if (this.line) {
        return 'ProgressBarLine';
      } else if (this.circle) {
        return 'ProgressBarCircle';
      } else if (this.battery) {
        return 'ProgressBarBattery';
      }
      return 'ProgressBarLine';
    },
    // ProgressBar Size
    // width () {
    //     return this.defaultOptions.layout.width
    // },
    // height () {
    //     return this.defaultOptions.layout.height
    // },
    viewBoxCircle () {
      return '0 0' + ' ' + this.height + ' ' + this.width;
    },
    verticalTextAlignP () {
      return this.defaultOptions.layout.verticalTextAlign + '%';
    },
    batteryStyleFrame () {
      return this.lineStyleSvgFrame;
    },
    lineProgressHeight () {
      return px(this.height - this.defaultOptions.layout.progressPadding)
    },
    batteryProgress () {
      return {
        height: px(this.height - this.defaultOptions.layout.progressPadding),
        width: px(this.value * ((this.width - this.defaultOptions.layout.progressPadding) / 100))
      }
    },
    lineStyleSvgFrame () {
      return {
        height: px(this.height),
        width: px(this.width)
      }
    },
    batteryStyleSvgFrame () {
      return {
        height: px(this.height),
        width: px(this.width + (this.width / 16))
      }
    },
    // Dynamic position of text horizontal
    horizontalTextAlignP () {
      if (this.defaultOptions.text.dynamicPosition) {
        let dynamicHorizontalTextAlign = 0
        if (this.battery) {
          if (this.value > 62) {
            dynamicHorizontalTextAlign = 65
          } else {
            dynamicHorizontalTextAlign = this.value
            dynamicHorizontalTextAlign += 3
          }
        } else {
          if (this.value > 72) {
            dynamicHorizontalTextAlign = 80
          } else {
            dynamicHorizontalTextAlign = this.value
            dynamicHorizontalTextAlign += 5
          }
        }
        return dynamicHorizontalTextAlign + '%'
      } else {
        if (this.value === 0 && this.line) {
          return (this.defaultOptions.layout.horizontalTextAlign + this.defaultOptions.layout.zeroOffset) + '%'
        } else {
          return this.defaultOptions.layout.horizontalTextAlign + '%'
        }
      }
    },
    // ProgressBar Colors
    cylinderProgressColor () {
      if (this.value === 0) {
        return this.defaultOptions.progress.backgroundColor
      } else {
        return this.color
      }
    },
    cylinderBackgroundColor () {
      if (this.value === 100) {
        return this.color
      } else {
        return this.defaultOptions.progress.backgroundColor
      }
    },
    cylinderBackgroundColorStroke () {
      return this.LightenColor(this.cylinderBackgroundColor, 25)
    },
    cylinderColorStroke () {
      return this.LightenColor(this.cylinderProgressColor, 5)
    },
    textStyle () {
      return {
        display: this.defaultOptions.text.hideText ? 'none' : 'inherit',
        fill: this.defaultOptions.text.color,
        fontSize: px(this.defaultOptions.text.fontSize),
        fontFamily: this.defaultOptions.text.fontFamily,
        textShadow: this.defaultOptions.text.shadowEnable ? '1px 1px 1px ' + this.defaultOptions.text.shadowColor : 'none'
      }
    },
    textStyleCircle () {
      return {
        color: this.defaultOptions.text.color,
        fontSize: px(this.defaultOptions.text.fontSize),
        fontFamily: this.defaultOptions.text.fontFamily,
        textShadow: this.defaultOptions.text.shadowEnable ? '1px 1px 1px ' + this.defaultOptions.text.shadowColor : 'none',
        top: px(this.defaultOptions.layout.verticalTextAlign),
        left: px(this.defaultOptions.layout.horizontalTextAlign),
        position: 'relative'
      }
    },
    progressBackgroundColor () {
      return this.$vuetify.theme.themes.light[this.backgroundColor] || this.defaultOptions.progress.backgroundColor;
    },
    progressColor () {
      return this.$vuetify.theme.themes.light[this.color];
    },
    // ProgressBar Value
    progressValue () {
      return this.value + '%';
    }
  },
  methods: {
    mergeDefaultOptionsWithProp: function () {
      let result = this.defaultOptions

      // let result = this.defaultOptions
      // for (let option in options) {
      //     if (options[option] !== null && typeof (options[option]) === 'object') {
      //         for (let subOption in options[option]) {
      //             if (options[option][subOption] !== undefined && options[option][subOption] !== null) {
      //                 result[option][subOption] = options[option][subOption]
      //             }
      //         }
      //     } else {
      //         result[option] = options[option]
      //     }
      // }
    },
    updateValue (val) {
      let invertedVal = 100 - val
      if (this.cylinder) {
        this.rectHeight = (80 - (invertedVal * 0.8))
        this.rectY = (invertedVal * 0.8) + 20
        this.topCy = ((-invertedVal * -0.8) + 20)
        this.cylText = (100 - (invertedVal) + '%')
      } else if (this.circle) {
        this.strokeCircle = 2 * Math.PI * this.radiusCircle
        this.strokeCircleOffset = this.strokeCircle * ((100 - val) / 100)
      }
    },
    // Used for cylinder
    LightenColor: function (color, level) {
      var usePound = false
      if (color[0] === '#') {
        color = color.slice(1)
        usePound = true
      }

      var num = parseInt(color, 16)
      var r = (num >> 16) + level

      if (r > 255) r = 255
      else if (r < 0) r = 0

      var b = ((num >> 8) & 0x00FF) + level

      if (b > 255) b = 255
      else if (b < 0) b = 0

      var g = (num & 0x0000FF) + level

      if (g > 255) g = 255
      else if (g < 0) g = 0

      return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
    }
  },
  watch: {
    value: function (val) {
      this.updateValue(val)
    },
    options: function (val) {
      if (val !== null && val !== undefined) {
        this.mergeDefaultOptionsWithProp(val)
      }
    }
  }
}
