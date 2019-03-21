// components/slider/slider.js
const {windowWidth} = wx.getSystemInfoSync()
const proportion = (val) => {
  return val / (750 / windowWidth)
}
// ballsize 球的宽高
let ballSize = 80
// 滑块的高度
let boxHeight = 400
// 可以移动的高度 为滑块的高度-球在顶部时上半块的高度+球在底部下半块的高度
let canMovedSize = 400-80/2*2
// 分几段
let period = 3
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ballSize: {
      type: Number,
      value: 60
    },
    ballColor: {
      type: String,
      value: 'linear-gradient(129deg,rgba(117,116,228,1) 0%,rgba(186,148,253,1) 100%)'
    },
    boxHeight: {
      type: Number,
      value: 500
    },
    boxWeight: {
      type: Number,
      value: 30
    },
    // 背部条高度
    allBoxHeight: {
      type: Number,
      value: 560
    },
    // 背部条颜色
    bgColor: {
      type: String,
      value: '#eee'
    },
    period: {
      type: Number,
      value: 3
    },
    textFontSize: {
      type: Number,
      value: 18
    },
    textFontColor: {
      type: String,
      value: '#4a4a4a'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    movedY: 0,
    x: 0,
    y: 0,
    canMovedSize: 0,
    periodStyleTop: 0,
    dockIndex: 0,
    extraSizePx: 0
  },
  ready() {
    let {boxHeight, ballSize, period, allBoxHeight} = this.data
    let oneSize = (boxHeight-ballSize)/(period-1)
    this.setData({
      canMovedSize: boxHeight-ballSize,
      periodArray: new Array(period).fill(0),
      // 一段的距离 单位rpx
      oneSize,
      // 每一段之间的点距离 是(总长度-背部条高度/2)+球的高度/2-小点的高度/2 就是class 为list-step 的style top
      // 小点的高度为16，所以这里没有更改 如果需要更改小点的高度
      // 需要在这里也进行配置
      // 这里没有减去 最后小点的高度8，在页面上减的，因为+了新的需求
      periodStyleTop: (allBoxHeight-boxHeight)/2+ballSize/2,
      // 因为在滑动过程中 使用的是px，所以要计算顶部和底部的px高度
      // 如果没有球的高度 底部会有radius 所以需要+上球的高度/2
      extraSizePx: proportion((allBoxHeight-boxHeight)/2+ballSize/2),
      // 最后一段的比例
      lastPercent: (oneSize+(allBoxHeight-boxHeight)/2)/oneSize
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(val) {
      // 记录移动的高度
      // 单位是px
      // 所以 有颜色的块 为了方便 也使用px为单位
      this.setData({
        movedY: val.detail.y
      })
    },
    chooseMove(val) {
      console.log(val)
      let {index} = val.currentTarget.dataset
      if(index!==this.data.dockIndex) {
        this.setData({
          y: proportion(this.data.oneSize)*index,
          dockIndex: index
        })
      }
    },
    testtouchend() {
      // 设置 事件传递的size
      let sendSize
      // 一段的距离 px
      // 因为传递的距离就是px
      const oneSize = proportion(this.data.oneSize)
      console.log(oneSize)
      // 方便理解 写为if
      // 是否超过一段的2/5 超过回退
      const dockIndex = this.data.movedY%oneSize<oneSize*0.4?Math.floor(this.data.movedY/oneSize):Math.ceil(this.data.movedY/oneSize)
      sendSize = oneSize*dockIndex
      this.setData({
        y: sendSize,
        dockIndex
      })
      // 传递停止 第一块的index为0，传递+1
      this.triggerEvent("dock", dockIndex+1)
    }
  }
})
