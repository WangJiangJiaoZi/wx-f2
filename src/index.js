
import F2 from '@antv/f2';

F2.Global.fontFamily = 'sans-serif';

Component({
  properties: {
    // 数据
    data: {
      type: Array,
      value: [],
      observer(data) {
        const { chart, node, triggerEvent } = this;
        if (chart) {
          chart.changeData(data);
          triggerEvent('update', { chart, node });
        } else if (data && data.length) {
          this.init();
        }
      }
    },
    // 图表绘图区域和画布边框的间距，用于显示坐标轴文本、图例
    padding: {
      type: null,
      value: 'auto'
    },
    // 图表画布区域四边的预留边距，即我们会在 padding 的基础上，为四边再加上 appendPadding 的数值
    appendPadding: {
      type: null,
      value: 0
    }
  },

  ready() {
    const { data } = this.data;
    if (data && data.length) {
      this.init();
    }
  },

  methods: {
    /** 初始化 */
    init() {
      const query = wx.createSelectorQuery().in(this);
      query.select('.f2-canvas')
        .fields({
          node: true,
          size: true
        })
        .exec(res => {
          const { data: { data, padding, appendPadding }, triggerEvent } = this;
          const { node, width, height } = res[0];
          const context = node.getContext('2d');
          const pixelRatio = wx.getSystemInfoSync().pixelRatio;
          // 高清设置
          node.width = width * pixelRatio;
          node.height = height * pixelRatio;

          const config = {
            context,
            width,
            height,
            pixelRatio,
            padding,
            appendPadding
          };
          triggerEvent('init', { F2, pixelRatio });

          const chart = new F2.Chart(config);
          chart.source(data);

          triggerEvent('draw', { chart, node });

          chart.render();
          triggerEvent('reload', { chart, node });

          this.chart = chart;
          this.canvasEl = chart.get('el');
          this.node = node;
        });
    },

    dispatch(event) {
      const canvasEl = this.canvasEl;
      if (!event.preventDefault) {
        event.preventDefault = function() {};
      }
      canvasEl.dispatchEvent(event.type, event);
    }
  }
});
