<template>
  <el-card class="box-card" style="height: 100%">
    <v-chart theme="ovilia-green" :options="option" style="height: 100%; width: 100%;"/>
  </el-card>
</template>

<script>
import * as ECharts from 'vue-echarts/components/ECharts.vue'
import light from 'echarts/lib/theme/light.js'
import {defineComponent, reactive, toRefs} from "vue";

ECharts.registerTheme('ovilia-green', light) //引入主题
export default defineComponent({
  name: 'moduleStatistic',
  props: {
    data: Object
  },
  setup() {
    const state = reactive({
      option: this.initOption()
    })

    const initOption = () => {
      let module_list = []
      let coverage_rate_list = []
      let successes_rate_list = []
      let pass_rate_list = []
      this.data.product_statistic.forEach(e => {
        module_list.push(e.product_name)
        coverage_rate_list.push(e.coverage_rate ? e.coverage_rate : 0)
        successes_rate_list.push(e.successes_rate ? e.successes_rate : 0)
        pass_rate_list.push(e.pass_rate ? e.pass_rate : 0)
      })
      return {
        tooltip: {
          confine: true,
          trigger: 'axis',

          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          text: '产品数据统计',
          textStyle: {
            fontSize: 16
          },
        },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '1%',
          containLabel: true
        },
        legend: {
          data: ['成功率', '通过率', '覆盖率']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: module_list,
            axisLabel: {
              interval: 0,
              formatter: function (params, index) {
                if (index % 2 !== 0) {
                  return '\n\n' + params
                } else {
                  return params
                }
              },
              textStyle: {
                fontSize: '10'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              interval: 'auto',
              formatter: '{value}%'
            },
          }
        ],
        series: [
          {
            name: '成功率',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: successes_rate_list
          },
          {
            name: '通过率',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: pass_rate_list
          },
          {
            name: '覆盖率',
            type: 'bar',
            barGap: 0,
            // label: labelOption,
            emphasis: {
              focus: 'series'
            },
            data: coverage_rate_list
          },
        ]
      }
    };
    return {
      initOption,
      ...toRefs(state),
    };
  }
});
</script>

<style scoped>
.box-card {
  padding: 5px;
}

::v-deep .el-card__body {
  padding: 8px;
  height: 100%;
}

</style>