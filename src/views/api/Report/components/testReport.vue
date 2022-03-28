<template>
  <el-container class="container">
    <!-- <el-header  class="header">
      <div class="header-left">
        <strong>测试报告:</strong>
      </div>
      <div class="header-left">
        <strong >测试报告:</strong>
        <strong >Test Report:</strong>
        <strong >Test Report:</strong>
        <strong >Test Report:</strong>
      </div>
    </el-header> -->
    <el-main class="main">
      <el-row class="main-start">
        <el-row>
          <el-col :span="12">
            <div class="test-polar">
              <v-chart theme="ovilia-green" :options="getpolardata()" style="width: 480px; height: 100px;"/>
              <div class="tip">
                <p>{{ reportData.stat.successes }} 用例成功 {{ reportData.stat.failures }} 用例失败</p>
                <p>{{ reportData.stat.errors }} 用例错误 {{ reportData.stat.skipped }} 用例跳过</p>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="test-polar">
              <v-chart theme="ovilia-green" :options="getsuitesdata()" style="width: 480px; height: 100px;"/>
              <div class="tip">
                <p>{{ test_suite_success }} 套件通过</p>
                <p>{{ test_suite_fail }} 套件失败</p>
              </div>
            </div>
          </el-col>
        </el-row>
        <div style=" display: flex;">
          <div class="subview-left left">
            <div class="view-summary">
              <h5>Suites</h5>
              <ul id="test-collection" class="test-collection">
                <li
                    :class="{'active':suites_index === index}"
                    style="cursor:pointer"
                    v-for="(test_suite_summary, index) in details"
                    :key="guid2() + index + 'test_suite_summary'"
                    @click="getDetails(test_suite_summary, index)">
                  <div class="test-heading">
                    <span class="test-name">{{ test_suite_summary.name }}</span>
                    <span class="test-time">base_url: {{ test_suite_summary.base_url }}</span>
                    <span class="test-status right pass" v-if="test_suite_summary.success === true">pass</span>
                    <span class="test-status right fail" v-else>fail</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- subview left -->

          <div class='subview-right left'>
            <div class='view-summary'>
              <div class="view-summary">
                <div id="test-collection" class="test-collection">
                  <div>
                    <div class="test-heading">
                      <h5 class="test-name">{{ reportdata.name }}</h5>
                      <div class="test-time-info'">
                        <span class="label start-time">执行时间 {{ reportdata.time.start_at }}</span>
                        <span class="label end-time">执行用时 {{ reportdata.time.duration | interceptdate }}  秒</span>
                      </div>
                      <div class="test-desc">
                        <el-tag type="success" style="margin-right: 10px;">Pass: {{
                            reportdata.stat.successes
                          }}
                        </el-tag>
                        <el-tag type="warning" style="margin-right: 10px;">Fail: {{ reportdata.stat.failures }}</el-tag>
                        <el-tag type="danger" style="margin-right: 10px;">Error: {{ reportdata.stat.errors }}</el-tag>
                        <el-tag type="info" style="margin-right: 10px;">Skip: {{ reportdata.stat.skipped }}</el-tag>
                      </div>
                    </div>

                    <div class="test-content">

                      <div class="collapsible node-list" v-for="(record, index) in reportdata.records"
                           :key="guid2() + index + 'records' ">
                        <span v-if="record.status === 'success'" class="node level-1 leaf pass"></span>
                        <span v-if="record.status === 'failure'" class="node level-1 leaf fail"></span>
                        <span v-if="record.status === 'error'" class="node level-1 leaf error"></span>
                        <span v-if="record.skipped === 'error'" class="node level-1 leaf skip"></span>
                      </div>
                    </div>
                    <div>
                      <div>
                        <el-collapse Vlaue="1" accordion>
                          <template>
                            <el-collapse-item :name="index" v-for="(record, index) in reportdata.records"
                                              :key="guid2() + index + 'records1' ">
                              <div slot="title" style="width: 100%; padding: 5px 0px;">
                                <div>
                                  <div>
                                    <div v-if="record.status === 'success'" style="font-size: 16px; padding: 3px 0;">
                                      {{ record.name }}
                                      <el-tag type="success">pass</el-tag>
                                    </div>
                                    <div v-if="record.status === 'failure'" style="font-size: 16px; padding: 3px 0;">
                                      {{ record.name }}
                                      <el-tag type="danger">fail</el-tag>
                                    </div>
                                    <div v-if="record.status === 'error'" style="font-size: 16px; padding: 3px 0;">
                                      {{ record.name }}
                                      <el-tag type="danger">error</el-tag>
                                    </div>
                                    <div v-if="record.status === 'skipped'" style="font-size: 16px; padding: 3px 0;">
                                      {{ record.name }}
                                      <el-tag type="info">skip</el-tag>
                                    </div>
                                  </div>
                                  <div class="node-header">
                                    <div class="node-header-left">
                                      <span class='node-time'>{{ record.start_timestamp }}</span>
                                      <span class='node-duration'>response_time: {{
                                          record.meta_data.response.response_time_ms
                                        }} ms</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class='collapsible-body'>

                                <div class='node-steps'>
                                  <table class='bordered table-results' style="width: 100%;">
                                    <thead>
                                    <tr>
                                      <th>状态</th>
                                      <th>参数</th>
                                      <th>详情</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                      <td></td>
                                      <td><strong style="color: coral;">Request</strong></td>
                                      <td></td>
                                    </tr>

                                    <tr class='info' status='info'>
                                      <td class='status info' title='info' alt='info' align="center"><i
                                          class='el-icon-pie-chart'></i></td>
                                      <td class='timestamp'>url</td>
                                      <td class='step-details'>{{ record.meta_data.request.url }}</td>
                                    </tr>

                                    <tr class='info' status='info'>
                                      <td class='status info' title='info' alt='info' align="center"><i
                                          class='el-icon-pie-chart'></i></td>
                                      <td class='timestamp'>method</td>
                                      <td class='step-details'>{{ record.meta_data.request.method }}</td>
                                    </tr>

                                    <tr class='info' status='info'>
                                      <td class='status info' title='info' alt='info' align="center"><i
                                          class='el-icon-pie-chart'></i></td>
                                      <td class='timestamp'>status_code</td>
                                      <td class='step-details'>{{ record.meta_data.response.status_code }}</td>
                                    </tr>
                                    <template v-for="(value, key, index) in record.meta_data.request">
                                      <tr v-if="key!=='url' && key !== 'method' && key !== 'start_timestamp'"
                                          :key="guid2() + index + 'request'">
                                        <td class='status debug' title='debug' alt='debug' align="center"><i
                                            class='el-icon-pie-chart'></i></td>
                                        <td class='timestamp'>{{ key }}</td>
                                        <td class='step-details' v-if="key === 'headers'">
                                          <div v-for="(header_value, header_key) in record.meta_data.request.headers"
                                               :key="guid2() + header_key + 'headers'">
                                            <strong>{{ header_key }}</strong>: {{ header_value }}
                                          </div>
                                        </td>
                                        <td class='step-details' v-else-if="key === 'json'">
                                          <json-viewer
                                              :value="record.meta_data.request.json"
                                              :expand-depth="5"
                                              :copyable="copyable"
                                              :boxed="true"
                                              sort
                                          />
                                          <!--                                                <pre>{{ record.meta_data.request.json }}</pre>-->
                                        </td>
                                        <td v-else>{{ value }}</td>
                                      </tr>
                                    </template>
                                    <tr>
                                      <td></td>
                                      <td><strong style="color: coral;">Response</strong></td>
                                      <td></td>
                                    </tr>
                                    <template v-for="(value, key, index) in record.meta_data.response">
                                      <tr v-if="key!=='content' &&
                                            key !== 'start_timestamp' &&
                                            key !== 'response_time_ms' &&
                                            key !== 'content_size' &&
                                            key !== 'content_type' &&
                                            key !== 'status_code' &&
                                            key !== 'reason' &&
                                            key !== 'ok' &&
                                            key !== 'encoding' &&
                                            key !== 'url'"
                                          :key="guid2() + index+'response'">
                                        <td class='status debug' title='debug' alt='debug' align="center"><i
                                            class='el-icon-pie-chart'></i></td>
                                        <td class='timestamp'>{{ key }}</td>
                                        <td class='step-details' v-if="key === 'headers'">
                                          <div v-for="(header_value, header_key) in record.meta_data.response.headers"
                                               :key="guid2() + header_key + 'headers'">
                                            <strong>{{ header_key }}</strong>: {{ header_value }}
                                          </div>
                                        </td>
                                        <td class='step-details'
                                            v-else-if="key === 'json' && record.meta_data.response.json!=null">
                                          <img v-if="record.meta_data.response.content_type === 'image'"
                                               :src="record.meta_data.response.content" alt="">
                                          <json-viewer
                                              :value="record.meta_data.response.json"
                                              :expand-depth="5"
                                              :copyable="copyable"
                                              boxed
                                              sort
                                          />
                                          <!--                                                <pre v-else>{{ record.meta_data.response.json }}</pre>-->
                                        </td>
                                        <td class='step-details' v-else-if="key === 'text'">
                                          <img v-if="record.meta_data.response.content_type === 'image'"
                                               :src="record.meta_data.response.content" alt="">
                                          <json-viewer
                                               v-else
                                              :value="record.meta_data.response.text"
                                              :expand-depth="1"
                                              :copyable="copyable"
                                              boxed
                                              sort
                                          />
<!--                                          <pre v-else>{{ record.meta_data.response.text }}</pre>-->
                                        </td>
                                        <td v-else>{{ value }}</td>
                                      </tr>
                                    </template>

                                    <tr class='log' status='pass'>
                                      <td class='status pass' title='pass' alt='pass' align="center"><i
                                          class='el-icon-pie-chart'></i></td>
                                      <td class='timestamp'>Validators</td>
                                      <td class='timestamp' v-if="record.meta_data.validators.length < 1">无校验</td>
                                      <td class='step-details' v-else>
                                        <div v-for="validator in record.meta_data.validators"
                                             :key="guid2() + validator.check_result + 'validators'">
                                          <el-tag :type="validator.check_result === 'pass'? 'success':'danger'"
                                                  effect="dark">
                                            {{ validator.check_result }}
                                          </el-tag>
                                          <strong> {{ validator.check }} {{ validator.comparator }}:</strong>
                                          {{ [validator.expect, validator.check_value] }}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr class='info' status='info'>
                                      <td class='status info' title='info' alt='info' align="center"><i
                                          class='el-icon-pie-chart'></i></td>
                                      <td class='timestamp'>Statistics</td>
                                      <td class='step-details'>
                                        <div>请求内容大小(bytes): {{ record.meta_data.response.content_size }}</div>
                                        <div>响应时间(ms): {{ record.meta_data.response.response_time_ms }}</div>
                                        <div>用时(ms): {{ record.meta_data.response.elapsed_ms }}</div>
                                      </td>
                                    </tr>
                                    <tr v-if="record.attachment.length > 0" class='log' status='fail'>
                                      <td class='status fail' title='fail' alt='fail' align="center"><i
                                          class='el-icon-pie-chart'></i></td>
                                      <td class='timestamp'>exception:</td>
                                      <td class='step-details'>
                                        <pre>{{ record.attachment }}</pre>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td></td>
                                      <td>变量</td>
                                      <td>
                                        <!--                                            <pre> {{ reportdata.output[index]? reportdata.output[index]['in']: '' }}</pre>-->
                                        <json-viewer
                                            :value="reportdata.output[index]? reportdata.output[index]['in']: ''"
                                            :expand-depth="5"
                                            :copyable="copyable"
                                            boxed
                                            sort
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td></td>
                                      <td>输出变量</td>
                                      <td>
                                        <!--                                            <pre>{{ reportdata.output[index]? reportdata.output[index]['out']: '' }}</pre>-->
                                        <json-viewer
                                            :value="reportdata.output[index]? reportdata.output[index]['out']: '' "
                                            :expand-depth="5"
                                            :copyable="copyable"
                                            boxed
                                            sort
                                        />
                                      </td>
                                    </tr>

                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </el-collapse-item>
                          </template>
                        </el-collapse>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {runTest} from '@/api/case'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/graphic'
import 'echarts/lib/component/title'
import light from 'echarts/lib/theme/light.js'
import JsonViewer from '@/utils/vue-json-viewer'
import 'vue-json-viewer/style.css'

ECharts.registerTheme('ovilia-green', light) //引入主题 
export default {
  name: 'testReport',
  components: {
    'v-chart': ECharts,
    JsonViewer
  },
  props: {
    reportData: Object
  },
  filters: {
    interceptdate: function (value) {
      return value.toFixed(3)
    }
  },
  data() {
    return {
      suites_index: 0,
      reportdata: {},
      details: [],
      detaildata: [],
      test_suite_success: 0,
      test_suite_fail: 0,
      uuid: this.guid2(),
      copyable: {copyText: '复制', copiedText: '复制成功'}
    }
  },
  mounted() {
    this.gettest()
  },
  created() {
    this.reportData.details.forEach(detail => {
      this.details.push(detail)
    })
    this.reportdata = this.details[0]
  },
  methods: {
    getpolardata() {
      let polar = {
        title: {
          text: '用例结果',
          subtext: '动态数据',
          x: 'left',
          textStyle: {
            color: '#111'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show: true,
          orient: 'vertical',
          left: 'right',
          data: ['成功', '失败'],
          textStyle: {
            fontSize: 12,
            color: '#111'
          }
        },
        series: [
          {
            name: '测试结果',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '60%'],
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: this.reportData.stat.successes, name: '成功', itemStyle: {color: '#00af00'}},
              {value: this.reportData.stat.failures, name: '失败', itemStyle: {color: '#F7464A'}},
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      return polar
    },
    getsuitesdata() {
      let suitesdata = {
        title: {
          text: '套件结果',
          subtext: '动态数据',
          x: 'left',
          textStyle: {
            color: '#111'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show: true,
          orient: 'vertical',
          left: 'right',
          data: ['成功', '失败'],
          textStyle: {
            fontSize: 12,
            color: '#111'
          }
        },
        series: [
          {
            name: '测试结果',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '60%'],
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: this.test_suite_success, name: '成功', itemStyle: {color: '#00af00'}},
              {value: this.test_suite_fail, name: '失败', itemStyle: {color: '#F7464A'}},
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      return suitesdata
    },

    gettest() {
      this.reportData.details.forEach(test_suite_summary => {
        if (test_suite_summary.success == true) {
          this.test_suite_success += 1
        }
      })
      this.test_suite_fail = this.reportData.details.length - this.test_suite_success
    },

    getDetails(data, index) {
      this.reportdata = data
      this.suites_index = index
    },

    guid2() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }

      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
    }
  }
}
</script>

<style scoped src='@/styles/extent.css'></style>

<style lang="scss" scoped>
.container {
  background: #fff;
}

.header {
  color: #111;
  background-color: #f5f5f5 !important;
  display: flex;
  justify-content: space-between;

  .header-left {
    line-height: 55px;
    display: flex;
  }
}

.el-main {
  padding: 0;
  // background:#fff ;
}

.main {
  .main-start {
    .subview-right {
      width: 100%;
      height: 615px;
      border-right: 1px solid #eee;
    }

    .subview-left {
      resize: horizontal;
      height: 615px;
      width: 276px;
      border-right: 1px solid #eee;
      border-left: 1px solid #eee;
      max-width: 80%;
      min-width: 10%;
      resize: horizontal;
      width: 27%;
      display: block;
      overflow-y: auto;
      padding: 0 20px;

      .view-summary {
        height: 300px;
      }

      ul {
        padding: 0;

        li {
          list-style-type: none;
          border-bottom: 1px solid #eee;
          margin: 0 -20px;
          padding: 10px 20px;

          &:active {
            // background: #f7f7f7;
            font-weight: 600;
          }

          &:first-child {
            border-top: 1px solid #eee;
          }

          .test-heading {
            .test-name {
              font-size: 16px;
              // width: 100% !important;
              display: inline-block;
              word-break: break-all;
            }

            .test-time {
              font-size: 12px;
              font-weight: 400;
            }

            .test-status {
              text-transform: capitalize;
              font-size: 13px;
              float: right
            }

            .pass {
              color: #32cd32;
            }

            .fail {
              color: red;
            }
          }

        }

        li.active {
          background: #f7f7f7;
          font-weight: 600;
        }
      }
    }

    .main-start-tag {
      height: 40px;
      padding: 10px 10px;

      .tag {
        margin-left: 10px;
      }
    }

    .test-polar {
      padding: 10px;
      border: 1px solid #ddd;
    }
  }
}

.start-time {
  background: #00c853;
  color: #fff;
}

.label {
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 90%;
  font-weight: 600;
}

.end-time, .category-status > .fail {
  background: #ef5350;
  color: #fff;
}

.test-desc {
  padding-top: 7px;
  font-size: 14px;
}

.hide {
  display: none;
}

.tip {
  padding: 4px 4px;
  font-size: 70%;
  color: #111;

  p {
    margin: 0;
  }
}

.node-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

::v-deep .el-collapse-item__header {
  line-height: normal;
  // border: 1px solid #EBEEF5;
  height: 60px;
  border-top: 1px solid #EBEEF5;
  border-left: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
  padding: 8px;
}

::v-deep .el-collapse-item__wrap {
  line-height: normal;
  border-left: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
}

::v-deep .el-collapse-item {
  margin-top: 10px;
}

::v-deep .el-collapse {
  // margin-top: 10px;
  border: none;
}
</style>