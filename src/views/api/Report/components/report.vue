<template>
  <div class="">
    <el-card shadow="hover" style="height: 100%;">

      <el-row>
        <el-col :span="12" style="padding-left: 5px; padding-right: 5px; width: 100%">
          <div style="border: 1px solid rgb(220, 218, 226); padding: 10px; border-radius: 4px; width: 100%">
            <div class="suites_chart" ref="suitesChartRef" style="width: 100%; height: 100px;"></div>
            <div class="tip">
              <p>{{ reportTestCaseData.testcase.stat.testcases.success }} 套件通过</p>
              <p>{{ reportTestCaseData.testcase.stat.testcases.fail }} 套件失败</p>
            </div>
          </div>
        </el-col>
        <el-col :span="12" style="padding-left: 5px; padding-right: 5px; width: 100%">
          <div style="border: 1px solid rgb(220, 218, 226); padding: 10px; border-radius: 4px; width: 100%">
            <div ref="stepChartRef" style="width: 100%; height: 100px;"></div>
            <div class="tip">
              <p>{{ reportTestCaseData.testcase.stat.teststeps.successes }} 用例通过</p>
              <p>{{ reportTestCaseData.testcase.stat.teststeps.failures }} 用例失败</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row style="padding-top: 5px">
        <!-- 测试用例 -->
        <el-col :span="6" style="padding-left: 5px; padding-right: 5px;">

          <div style="border: 1px solid rgb(220, 218, 226); padding: 10px; border-radius: 4px;">

            <div style="position: relative;">
              <!--            <h3 class="block-title">报告详情</h3>-->
              <el-tag type="success" style="margin-right: 10px; background-color: #e7faf0; color: #13ce66;">
                total:{{ reportTestCaseData.testcase.stat.teststeps.total }}
              </el-tag>
              <el-tag type="success" style="margin-right: 10px; background-color: #e7faf0; color: #13ce66;">
                Pass:{{ reportTestCaseData.testcase.stat.teststeps.successes }}
              </el-tag>
              <el-tag type="warning" style="margin-right: 10px;">
                Fail:{{ reportTestCaseData.testcase.stat.teststeps.failures }}
              </el-tag>
              <!--            <el-tag type="danger" style="margin-right: 10px;">-->
              <!--              Error: {{ reportBody.stat.teststeps.errors }}-->
              <!--            </el-tag>-->
            </div>

            <div class="sys-list box-height">
              <el-tree
                  :data="reportTestCaseData.testcase.details"
                  node-key="id"
                  :props="{children: 'step_datas', label:'name' }"
                  ref="tree"
                  @node-click="reportNodeClick"
                  :highlight-current='true'
              >
                <template #default="scope">
                  <div class="custom-node">
                    <span>
                      <el-icon v-if="!scope.data.step_datas && scope.data.success"
                               style="color: #67c23a;  vertical-align:bottom; height: 100%; display: inline-block;">
                        <ele-CircleCheckFilled></ele-CircleCheckFilled>

                      </el-icon>
                      <el-icon v-if="!scope.data.step_datas && !scope.data.success"
                               style="color: #ee422e;  vertical-align:bottom; height: 100%; display: inline-block;">
                        <ele-CircleCloseFilled></ele-CircleCloseFilled>
                      </el-icon>
                      <span v-if="!scope.data.step_datas" style="padding-left: 5px">{{ scope.data.name }}</span>
                      <span v-else style="padding-left: 5px; font-weight: bold">{{ scope.data.name }}</span>
                    </span>
                  </div>
                </template>
              </el-tree>
            </div>
          </div>
        </el-col>

        <el-col v-show="nodeStepData.name" :span="18" style="padding-left: 5px; padding-right: 5px;">
          <div style="border: 1px solid rgb(220, 218, 226); padding: 10px; border-radius: 4px;">
            <div class="box-height">
              <!--      step title        -->
              <div class="step">
                <h2 class="step__header">
                  <div class="step__header__tab">
                    <el-tag class="ml-2" :type="nodeStepData.success? 'success': 'danger'">
                      {{ nodeStepData.success ? '通过' : '不通过' }}
                    </el-tag>
                  </div>
                  <div class="step__header__name">
                    <span>{{ reportTestCaseData.step.name }}</span>
                  </div>
                </h2>
              </div>
              <!--   request       -->
              <div class="request">
                <div class="request__header">
                  <h3 class="request__header__name title">请求[request]</h3>
                </div>
                <div class="request__body">
                  <table class="table">
                    <tbody>
                    <!--                <tr>-->
                    <!--                  <th>222</th>-->
                    <!--                  <th>33</th>-->
                    <!--                </tr>-->
                    <tr>
                      <td class="table__parameter">url</td>
                      <td class="table__content">
                        {{ reportTestCaseData.step.request.url }}
                      </td>
                    </tr>

                    <tr>
                      <td class="table__parameter">method</td>
                      <td class="table__content">
                        {{ reportTestCaseData.step.request.method }}
                      </td>
                    </tr>
                    <tr>
                      <td class="table__parameter">status_code</td>
                      <td class="table__content">
                        {{ reportTestCaseData.step.response.status_code }}
                      </td>
                    </tr>

                    <tr>
                      <td class="table__parameter">headers</td>
                      <td class="table__content">
                        <div v-for="(header_value, header_key) in reportTestCaseData.step.request.headers"
                             :key="guid2() + header_key + 'headers'">
                          <strong>{{ header_key }}</strong>: {{ header_value }}
                        </div>
                        <!--                    {{ reportTestCaseData.step.request.headers }}-->
                      </td>
                    </tr>

                    <tr>
                      <td class="table__parameter">json</td>
                      <td class="table__content">
                        <json-viewer
                            :value="reportTestCaseData.step.request.json"
                            :expand-depth="5"
                            copyable
                            :boxed="true"
                            sort
                        />
                      </td>
                    </tr>

                    <tr>
                      <td class="table__parameter">body</td>
                      <td class="table__content">
                        <json-viewer
                            :value="reportTestCaseData.step.request.body"
                            :expand-depth="5"
                            copyable
                            :boxed="true"
                            sort
                        />
                      </td>
                    </tr>


                    </tbody>
                  </table>
                </div>
              </div>

              <!--            response-->
              <div class="response">
                <div class="response__header">
                  <h3 class="response__header__name title">响应[Response]</h3>
                </div>
                <div class="response__body">
                  <table>
                    <tbody>

                    <tr>
                      <td class="table__parameter">headers</td>
                      <td class="table__content">
                        <div v-for="(header_value, header_key) in reportTestCaseData.step.response.headers"
                             :key="guid2() + header_key + 'headers'">
                          <strong>{{ header_key }}</strong>: {{ header_value }}
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td class="table__parameter">cookies</td>
                      <td class="table__content">
                        {{ reportTestCaseData.step.request.cookies }}
                      </td>
                    </tr>
                    <tr>
                      <td class="table__parameter">text</td>
                      <td class="table__content">
                        <json-viewer
                            :value="reportTestCaseData.step.response.text"
                            :expand-depth="5"
                            copyable
                            :boxed="true"
                            sort
                        />
                      </td>
                    </tr>

                    <tr>
                      <td class="table__parameter">json</td>
                      <td class="table__content">
                        <json-viewer
                            :value="reportTestCaseData.step.response.json"
                            :expand-depth="5"
                            copyable
                            :boxed="true"
                            sort
                        />
                      </td>
                    </tr>

                    <tr>
                      <td class="table__parameter">body</td>
                      <td class="table__content">
                        <json-viewer
                            :value="reportTestCaseData.step.response.body"
                            :expand-depth="5"
                            copyable
                            :boxed="true"
                            sort
                        />
                      </td>
                    </tr>


                    </tbody>
                  </table>
                </div>

              </div>

              <!--            用例校验-->
              <div class="case_info">
                <div class="case_info__header">
                  <h3 class="case_info__header__name title">详细信息[case_info]</h3>
                </div>
                <div class="case_info__body">
                  <table>
                    <tbody>

                    <tr>
                      <td class="table__parameter">错误[error_massage]</td>
                      <td class="table__content">
                        <pre>{{ reportTestCaseData.step.message }}</pre>
<!--/*                        <span style="color: red">{{ reportTestCaseData.step.message }}</span>*/-->
<!--                        <json-viewer-->
<!--                            :value="reportTestCaseData.step.message"-->
<!--                            :expand-depth="5"-->
<!--                            copyable-->
<!--                            style="color: red"-->
<!--                            :boxed="true"-->
<!--                            sort-->
<!--                        />-->
                      </td>
                    </tr>

                    <tr>
                      <td class="table__parameter">校验[validators]</td>
                      <!--                      <td class="table__content">-->

                      <td class='timestamp' v-if="!reportTestCaseData.step.validators.validate_extractor">无校验</td>
                      <td class='step-details' v-else>
                        <div v-for="validator in reportTestCaseData.step.validators.validate_extractor"
                             :key="guid2() + validator.check_result + 'validators'">
                          <el-tag :type="validator.check_result === 'pass'? 'success':'danger'"
                                  effect="dark">
                            {{ validator.check_result }}
                          </el-tag>
                          <strong> {{ validator.check }} {{ validator.comparator }}:</strong>
                          {{ [validator.expect, validator.check_value] }}
                        </div>
                        <!--                        <json-viewer-->
                        <!--                            :value="reportTestCaseData.step.validators"-->
                        <!--                            :expand-depth="5"-->
                        <!--                            copyable-->
                        <!--                            :boxed="true"-->
                        <!--                            sort-->
                        <!--                        />-->
                      </td>
                    </tr>

                    <tr>
                      <td class="table__parameter">变量[variables]</td>
                      <td class="table__content">
                        <json-viewer
                            :value="reportTestCaseData.step.variables"
                            :expand-depth="5"
                            copyable
                            :boxed="true"
                            sort
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="table__parameter">输出变量[export_vars]</td>
                      <td class="table__content">
                        <json-viewer
                            :value="reportTestCaseData.step.export_vars"
                            :expand-depth="5"
                            copyable
                            :boxed="true"
                            sort
                        />
                      </td>
                    </tr>
                    <!--                <tr>-->
                    <!--                  <td>Statistics</td>-->
                    <!--                  <td>-->
                    <!--                    {{ reportTestCaseData.step.Statistics}}-->
                    <!--                  </td>-->
                    <!--                </tr>-->


                    </tbody>
                  </table>
                </div>

                <!--            {{ reportTestCaseData }}-->
              </div>
            </div>
          </div>
        </el-col>

      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
import "vue3-json-viewer/dist/index.css"
import {JsonViewer} from 'vue3-json-viewer'
import * as ECharts from 'echarts'
import {defineComponent, onMounted, reactive, ref, toRefs, nextTick} from "vue";


export default defineComponent({
  name: 'testReport',
  components: {
    JsonViewer,
  },
  props: {
    reportBody: {
      type: Object,
      required: true
    }
  },

  created() {
    if (this.$props.reportBody) {
      this.initReportData()
    }
  },

  setup(props) {
    const suitesChartRef = ref()
    const stepChartRef = ref()
    const state = reactive({
      suites_index: 0,
      reportData: {},
      nodeStepData: {},  // 选中的用例步骤数据
      reportTestCaseData: {
        testcase: {
          success: '',
          stat: {},
          time: {},
          platform: {},
          details: {},
        },
        step: {
          success: '',
          name: '',
          case_id: '',
          message: '',
          variables: {},
          request: {},
          response: {},
          stat: {},
          address: {},
          validators: {},
          export_vars: {},
        }
      },
      test_suite_success: 0,
      test_suite_fail: 0,
      // uuid: guid2(),
      copyable: {copyText: '复制', copiedText: '复制成功'},
      test_data: {
        "code": 0,
        "msg": "OK",
        "data": {
          "success": true,
          "stat": {
            "testcases": {
              "total": 1,
              "success": 1,
              "fail": 0
            },
            "teststeps": {
              "total": 2,
              "failures": 0,
              "successes": 2
            }
          },
          "time": {
            "start_at": 1649322086.6407778,
            "duration": 0.4742701053619385
          },
          "platform": {
            "httprunner_version": "3.1.6",
            "python_version": "CPython 3.9.6",
            "platform": "Windows-10-10.0.18363-SP0"
          },
          "details": [
            {
              "name": "获取文章列表222",
              "success": false,
              "case_id": "fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c",
              "time": {
                "start_at": 1649322086.642773,
                "start_at_iso_format": "2022-04-07T09:01:26.642773",
                "duration": 0.47127532958984375
              },
              "in_out": {
                "config_vars": {
                  "code222": 0,
                  "a_id2": 35,
                  "code": 100201
                },
                "export_vars": {}
              },
              "message": "",
              "log": "D:\\project\\zero-auto\\zero_autotest_backend\\suite\\1649322085026\\577\\logs\\fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c.run.log",
              "step_datas": [
                {
                  "success": false,
                  "name": "获取文章列表222",
                  "case_id": "testcase2d4bcd",
                  "message": "",
                  "variables": {
                    "code222": 0,
                    "a_id2": 50,
                    "code": 100201,
                    "sort": "default",
                    "request": {
                      "params": {},
                      "headers": {
                        "Content-Type": "application/json;charset=UTF-8",
                        "HRUN-Request-ID": "HRUN-fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c-086643"
                      },
                      "data": null,
                      "cookies": {},
                      "timeout": 120,
                      "allow_redirects": true,
                      "verify": false,
                      "json": {
                        "page": 1,
                        "pageSize": 10,
                        "sort": "default"
                      }
                    },
                    "response": "<autotest.httprunner.response.ResponseObject object at 0x000002101680DB20>"
                  },
                  "data": {
                    "success": true,
                    "req_resps": [
                      {
                        "request": {
                          "method": "POST",
                          "url": "https://www.xiaobaicodes.com/api/blog/getlist",
                          "headers": {
                            "User-Agent": "python-requests/2.27.1",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "*/*",
                            "Connection": "keep-alive",
                            "Content-Type": "application/json;charset=UTF-8",
                            "HRUN-Request-ID": "HRUN-fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c-086643",
                            "Content-Length": "46"
                          },
                          "cookies": {},
                          "body": {
                            "page": 1,
                            "pageSize": 10,
                            "sort": "default"
                          }
                        },
                        "response": {
                          "status_code": 200,
                          "headers": {
                            "Server": "nginx/1.14.2",
                            "Date": "Thu, 07 Apr 2022 09:01:26 GMT",
                            "Content-Type": "application/json",
                            "Content-Length": "9007",
                            "Connection": "keep-alive",
                            "X-Powered-By": "CAS Server"
                          },
                          "cookies": {},
                          "encoding": "utf-8",
                          "content_type": "application/json",
                          "body": {
                            "code": 0,
                            "msg": "OK",
                            "data": {
                              "rows": [
                                {
                                  "id": 50,
                                  "title": " jmeter jmx脚本操作，以及返回结果处理",
                                  "views": 49,
                                  "create_date": "2021-03-31 15:18:40",
                                  "category_id": 14,
                                  "tag_id": 10,
                                  "update_date": "2022-04-07 14:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/Blue%20ocean11.png",
                                  "summary": " jmeter jmx脚本操作，以及返回结果处理",
                                  "comment_count": 1,
                                  "category_name": "tools",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 48,
                                  "title": "SQLAlchemy 的封装使用",
                                  "views": 27,
                                  "create_date": "2021-03-09 16:24:16",
                                  "category_id": 11,
                                  "tag_id": 8,
                                  "update_date": "2022-03-10 19:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1615278537674/file.png",
                                  "summary": "sqlalchemy 的封装使用",
                                  "comment_count": 0,
                                  "category_name": "Python Package",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 47,
                                  "title": "前后端分离部署，nginx配置",
                                  "views": 31,
                                  "create_date": "2021-02-21 14:52:29",
                                  "category_id": 13,
                                  "tag_id": 9,
                                  "update_date": "2022-03-02 20:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/Blue%20ocean11.png",
                                  "summary": "前后端分离部署，nginx配置",
                                  "comment_count": 0,
                                  "category_name": "nginx",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 46,
                                  "title": "python中的进程和线程",
                                  "views": 24,
                                  "create_date": "2021-02-21 14:29:18",
                                  "category_id": 12,
                                  "tag_id": 8,
                                  "update_date": "2021-11-02 11:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1613888955125/file.png",
                                  "summary": "今天我们使用的计算机早已进入多CPU或多核时代，而我们使用的操作系统都是支持“多任务”的操作系统，这使得我们可以同时运行多个程序，也可以将一个程序分解为若干个相对独立的子任务...",
                                  "comment_count": 0,
                                  "category_name": "Python 基础",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 45,
                                  "title": "python中对字符串的操作",
                                  "views": 20,
                                  "create_date": "2021-02-21 14:21:36",
                                  "category_id": 12,
                                  "tag_id": 8,
                                  "update_date": "2022-03-10 18:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/Blue%20ocean11.png",
                                  "summary": "python中对字符串的操作",
                                  "comment_count": 0,
                                  "category_name": "Python 基础",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 44,
                                  "title": "python arrow时间库的使用",
                                  "views": 23,
                                  "create_date": "2021-01-28 10:17:39",
                                  "category_id": 11,
                                  "tag_id": 8,
                                  "update_date": "2021-08-08 23:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1611800257170/file.png",
                                  "summary": "Python针对日期时间的处理提供了大量的package，类和方法，但在可用性上来看非常繁琐和麻烦\n\n第三方库Arrow提供了一个合理的、人性化的方法来创建、操作、格式转换的日期，时间，和时间戳，帮助我们使用较少的导入和更少的代码来处理日期和时间。",
                                  "comment_count": 0,
                                  "category_name": "Python Package",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 42,
                                  "title": "异步邮件发送的两种实现方式",
                                  "views": 43,
                                  "create_date": "2021-01-18 15:29:53",
                                  "category_id": 1,
                                  "tag_id": 2,
                                  "update_date": "2021-12-01 22:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959535975file.png",
                                  "summary": "Flask-Mail 使用同步模式发送电子邮件。\n从电子邮件发送开始，直到电子邮件交付后，给浏览器发回其响应，在整个过程中，Web服务器会一直阻塞。如果我们试图发送电子邮件到一个服务器是缓慢的，甚至更糟糕的，暂时处于脱机状态，所以使用多线程异步发送电子邮件可以避免处理请求过程中不必要的延迟，将发送电子邮件的函数移到后台线程中，能够使程序更加流畅！但实际上...",
                                  "comment_count": 0,
                                  "category_name": "Python Wab",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 41,
                                  "title": "Celery 基于Flask 的定时任务实现 (二)",
                                  "views": 19,
                                  "create_date": "2021-01-18 14:43:33",
                                  "category_id": 10,
                                  "tag_id": 7,
                                  "update_date": "2022-03-25 19:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610958626660file.png",
                                  "summary": "我们需要调用celery当然就要先初始化elery，因为celery启动的时候需要自己配置，当时我们通过flask启动任务的话，配置都统一写在一起，所以这里要通过flask的app注册来把celery给注册上，才能celery启动的时候读取统一的配置文件",
                                  "comment_count": 0,
                                  "category_name": "Celery",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 40,
                                  "title": "爬虫框架 scrapy 的 初使用",
                                  "views": 50,
                                  "create_date": "2021-01-18 11:51:56",
                                  "category_id": 9,
                                  "tag_id": 6,
                                  "update_date": "2022-04-06 12:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959258262file.png",
                                  "summary": "当系统中同时存在Python 2、Python 3时，孤的电脑直接执行scrapy命令使用的是Python 2，此时，需要在scrapy命令前添加“python3 -m”才可以使用Python 3，因此，请使用virtualenv建立虚拟环境运行scrapy等各种程序。",
                                  "comment_count": 0,
                                  "category_name": "爬虫",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 39,
                                  "title": "Git常用命令",
                                  "views": 56,
                                  "create_date": "2020-11-11 16:55:31",
                                  "category_id": 8,
                                  "tag_id": 5,
                                  "update_date": "2022-03-23 23:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959091642file.png",
                                  "summary": "Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。\nGit 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。\nGit 与常用的版本控制工具 CVS, Subversion 等不同，它采用了分布式版本库的方式，不必服务器端软件支持。",
                                  "comment_count": 1,
                                  "category_name": "GIT",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                }
                              ],
                              "rowTotal": 13,
                              "pageSize": 10,
                              "page": 1,
                              "pageTotal": 2
                            },
                            "success": true
                          }
                        }
                      }
                    ],
                    "stat": {
                      "content_size": 0,
                      "response_time_ms": 327.66,
                      "elapsed_ms": 325.996
                    },
                    "address": {
                      "client_ip": "10.32.109.179",
                      "client_port": 59032,
                      "server_ip": "42.192.38.108",
                      "server_port": 443
                    },
                    "validators": {}
                  },
                  "export_vars": {
                    "code222": 0,
                    "a_id2": 50
                  }
                },
                {
                  "success": true,
                  "name": "获取文章列表222",
                  "case_id": "testcase2d4bcd",
                  "message": "",
                  "variables": {
                    "code222": 0,
                    "a_id2": 35,
                    "code": 100201,
                    "sort": "test",
                    "request": {
                      "params": {},
                      "headers": {
                        "Content-Type": "application/json;charset=UTF-8",
                        "HRUN-Request-ID": "HRUN-fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c-086980"
                      },
                      "data": null,
                      "cookies": {},
                      "timeout": 120,
                      "allow_redirects": true,
                      "verify": false,
                      "json": {
                        "page": 1,
                        "pageSize": 10,
                        "sort": "test"
                      }
                    },
                    "response": "<autotest.httprunner.response.ResponseObject object at 0x00000210167D3D00>"
                  },
                  "data": {
                    "success": true,
                    "req_resps": [
                      {
                        "request": {
                          "method": "POST",
                          "url": "https://www.xiaobaicodes.com/api/blog/getlist",
                          "headers": {
                            "User-Agent": "python-requests/2.27.1",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "*/*",
                            "Connection": "keep-alive",
                            "Content-Type": "application/json;charset=UTF-8",
                            "HRUN-Request-ID": "HRUN-fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c-086980",
                            "Content-Length": "43"
                          },
                          "cookies": {},
                          "body": {
                            "page": 1,
                            "pageSize": 10,
                            "sort": "test"
                          }
                        },
                        "response": {
                          "status_code": 200,
                          "headers": {
                            "Server": "nginx/1.14.2",
                            "Date": "Thu, 07 Apr 2022 09:01:27 GMT",
                            "Content-Type": "application/json",
                            "Content-Length": "8899",
                            "Connection": "keep-alive",
                            "X-Powered-By": "CAS Server"
                          },
                          "cookies": {},
                          "encoding": "utf-8",
                          "content_type": "application/json",
                          "body": {
                            "code": 0,
                            "msg": "OK",
                            "data": {
                              "rows": [
                                {
                                  "id": 35,
                                  "title": "Flask Redis的使用以及方法封装",
                                  "views": 651,
                                  "create_date": "2020-10-30 10:49:07",
                                  "category_id": 1,
                                  "tag_id": 1,
                                  "update_date": "2022-04-01 08:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610958182982file.png",
                                  "summary": "在我们日常的Python Web开发中，无不都是使用数据库来进行数据的存储，由于一般的系统任务中通常不会存在高并发的情况，所以这样看起来并没有什么问题，可是一旦涉及大数据量的需求，比如一些商品抢购的情景，或者是主页访问量瞬间较大的时候，单一使用数据库来保存数据的系统会因为面向磁盘，磁盘读/写速度比较慢的问题而存在严重的性能弊端，",
                                  "comment_count": 0,
                                  "category_name": "Python Wab",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 38,
                                  "title": "后台密钥初始化，以及加解密实现",
                                  "views": 57,
                                  "create_date": "2020-11-10 20:46:08",
                                  "category_id": 1,
                                  "tag_id": 2,
                                  "update_date": "2022-03-02 16:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959468279file.png",
                                  "summary": "后台密钥初始化，以及加解密实现",
                                  "comment_count": 0,
                                  "category_name": "Python Wab",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 39,
                                  "title": "Git常用命令",
                                  "views": 56,
                                  "create_date": "2020-11-11 16:55:31",
                                  "category_id": 8,
                                  "tag_id": 5,
                                  "update_date": "2022-03-23 23:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959091642file.png",
                                  "summary": "Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。\nGit 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。\nGit 与常用的版本控制工具 CVS, Subversion 等不同，它采用了分布式版本库的方式，不必服务器端软件支持。",
                                  "comment_count": 1,
                                  "category_name": "GIT",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 40,
                                  "title": "爬虫框架 scrapy 的 初使用",
                                  "views": 50,
                                  "create_date": "2021-01-18 11:51:56",
                                  "category_id": 9,
                                  "tag_id": 6,
                                  "update_date": "2022-04-06 12:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959258262file.png",
                                  "summary": "当系统中同时存在Python 2、Python 3时，孤的电脑直接执行scrapy命令使用的是Python 2，此时，需要在scrapy命令前添加“python3 -m”才可以使用Python 3，因此，请使用virtualenv建立虚拟环境运行scrapy等各种程序。",
                                  "comment_count": 0,
                                  "category_name": "爬虫",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 50,
                                  "title": " jmeter jmx脚本操作，以及返回结果处理",
                                  "views": 49,
                                  "create_date": "2021-03-31 15:18:40",
                                  "category_id": 14,
                                  "tag_id": 10,
                                  "update_date": "2022-04-07 14:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/Blue%20ocean11.png",
                                  "summary": " jmeter jmx脚本操作，以及返回结果处理",
                                  "comment_count": 1,
                                  "category_name": "tools",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 42,
                                  "title": "异步邮件发送的两种实现方式",
                                  "views": 43,
                                  "create_date": "2021-01-18 15:29:53",
                                  "category_id": 1,
                                  "tag_id": 2,
                                  "update_date": "2021-12-01 22:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959535975file.png",
                                  "summary": "Flask-Mail 使用同步模式发送电子邮件。\n从电子邮件发送开始，直到电子邮件交付后，给浏览器发回其响应，在整个过程中，Web服务器会一直阻塞。如果我们试图发送电子邮件到一个服务器是缓慢的，甚至更糟糕的，暂时处于脱机状态，所以使用多线程异步发送电子邮件可以避免处理请求过程中不必要的延迟，将发送电子邮件的函数移到后台线程中，能够使程序更加流畅！但实际上...",
                                  "comment_count": 0,
                                  "category_name": "Python Wab",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 47,
                                  "title": "前后端分离部署，nginx配置",
                                  "views": 31,
                                  "create_date": "2021-02-21 14:52:29",
                                  "category_id": 13,
                                  "tag_id": 9,
                                  "update_date": "2022-03-02 20:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/Blue%20ocean11.png",
                                  "summary": "前后端分离部署，nginx配置",
                                  "comment_count": 0,
                                  "category_name": "nginx",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 48,
                                  "title": "SQLAlchemy 的封装使用",
                                  "views": 27,
                                  "create_date": "2021-03-09 16:24:16",
                                  "category_id": 11,
                                  "tag_id": 8,
                                  "update_date": "2022-03-10 19:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1615278537674/file.png",
                                  "summary": "sqlalchemy 的封装使用",
                                  "comment_count": 0,
                                  "category_name": "Python Package",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 46,
                                  "title": "python中的进程和线程",
                                  "views": 24,
                                  "create_date": "2021-02-21 14:29:18",
                                  "category_id": 12,
                                  "tag_id": 8,
                                  "update_date": "2021-11-02 11:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1613888955125/file.png",
                                  "summary": "今天我们使用的计算机早已进入多CPU或多核时代，而我们使用的操作系统都是支持“多任务”的操作系统，这使得我们可以同时运行多个程序，也可以将一个程序分解为若干个相对独立的子任务...",
                                  "comment_count": 0,
                                  "category_name": "Python 基础",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 37,
                                  "title": "Celery 基于Flask 的定时任务实现 (一)",
                                  "views": 23,
                                  "create_date": "2020-11-10 20:36:40",
                                  "category_id": 10,
                                  "tag_id": 7,
                                  "update_date": "2021-04-26 16:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610958626660file.png",
                                  "summary": "Celery 基于Flask 的定时任务实现",
                                  "comment_count": 0,
                                  "category_name": "Celery",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                }
                              ],
                              "rowTotal": 13,
                              "pageSize": 10,
                              "page": 1,
                              "pageTotal": 2
                            },
                            "success": true
                          }
                        }
                      }
                    ],
                    "stat": {
                      "content_size": 0,
                      "response_time_ms": 124.7,
                      "elapsed_ms": 122.422
                    },
                    "address": {
                      "client_ip": "10.32.109.179",
                      "client_port": 59032,
                      "server_ip": "42.192.38.108",
                      "server_port": 443
                    },
                    "validators": {}
                  },
                  "export_vars": {
                    "code222": 0,
                    "a_id2": 35
                  }
                }
              ]
            },
            {
              "name": "获取文章列表222",
              "success": false,
              "case_id": "fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c",
              "time": {
                "start_at": 1649322086.642773,
                "start_at_iso_format": "2022-04-07T09:01:26.642773",
                "duration": 0.47127532958984375
              },
              "in_out": {
                "config_vars": {
                  "code222": 0,
                  "a_id2": 35,
                  "code": 100201
                },
                "export_vars": {}
              },
              "message": "",
              "log": "D:\\project\\zero-auto\\zero_autotest_backend\\suite\\1649322085026\\577\\logs\\fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c.run.log",
              "step_datas": [
                {
                  "success": false,
                  "name": "获取文章列表222",
                  "case_id": "testcase2d4bcd",
                  "message": "",
                  "variables": {
                    "code222": 0,
                    "a_id2": 50,
                    "code": 100201,
                    "sort": "default",
                    "request": {
                      "params": {},
                      "headers": {
                        "Content-Type": "application/json;charset=UTF-8",
                        "HRUN-Request-ID": "HRUN-fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c-086643"
                      },
                      "data": null,
                      "cookies": {},
                      "timeout": 120,
                      "allow_redirects": true,
                      "verify": false,
                      "json": {
                        "page": 1,
                        "pageSize": 10,
                        "sort": "default"
                      }
                    },
                    "response": "<autotest.httprunner.response.ResponseObject object at 0x000002101680DB20>"
                  },
                  "data": {
                    "success": true,
                    "req_resps": [
                      {
                        "request": {
                          "method": "POST",
                          "url": "https://www.xiaobaicodes.com/api/blog/getlist",
                          "headers": {
                            "User-Agent": "python-requests/2.27.1",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "*/*",
                            "Connection": "keep-alive",
                            "Content-Type": "application/json;charset=UTF-8",
                            "HRUN-Request-ID": "HRUN-fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c-086643",
                            "Content-Length": "46"
                          },
                          "cookies": {},
                          "body": {
                            "page": 1,
                            "pageSize": 10,
                            "sort": "default"
                          }
                        },
                        "response": {
                          "status_code": 200,
                          "headers": {
                            "Server": "nginx/1.14.2",
                            "Date": "Thu, 07 Apr 2022 09:01:26 GMT",
                            "Content-Type": "application/json",
                            "Content-Length": "9007",
                            "Connection": "keep-alive",
                            "X-Powered-By": "CAS Server"
                          },
                          "cookies": {},
                          "encoding": "utf-8",
                          "content_type": "application/json",
                          "body": {
                            "code": 0,
                            "msg": "OK",
                            "data": {
                              "rows": [
                                {
                                  "id": 50,
                                  "title": " jmeter jmx脚本操作，以及返回结果处理",
                                  "views": 49,
                                  "create_date": "2021-03-31 15:18:40",
                                  "category_id": 14,
                                  "tag_id": 10,
                                  "update_date": "2022-04-07 14:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/Blue%20ocean11.png",
                                  "summary": " jmeter jmx脚本操作，以及返回结果处理",
                                  "comment_count": 1,
                                  "category_name": "tools",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 48,
                                  "title": "SQLAlchemy 的封装使用",
                                  "views": 27,
                                  "create_date": "2021-03-09 16:24:16",
                                  "category_id": 11,
                                  "tag_id": 8,
                                  "update_date": "2022-03-10 19:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1615278537674/file.png",
                                  "summary": "sqlalchemy 的封装使用",
                                  "comment_count": 0,
                                  "category_name": "Python Package",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 47,
                                  "title": "前后端分离部署，nginx配置",
                                  "views": 31,
                                  "create_date": "2021-02-21 14:52:29",
                                  "category_id": 13,
                                  "tag_id": 9,
                                  "update_date": "2022-03-02 20:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/Blue%20ocean11.png",
                                  "summary": "前后端分离部署，nginx配置",
                                  "comment_count": 0,
                                  "category_name": "nginx",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 46,
                                  "title": "python中的进程和线程",
                                  "views": 24,
                                  "create_date": "2021-02-21 14:29:18",
                                  "category_id": 12,
                                  "tag_id": 8,
                                  "update_date": "2021-11-02 11:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1613888955125/file.png",
                                  "summary": "今天我们使用的计算机早已进入多CPU或多核时代，而我们使用的操作系统都是支持“多任务”的操作系统，这使得我们可以同时运行多个程序，也可以将一个程序分解为若干个相对独立的子任务...",
                                  "comment_count": 0,
                                  "category_name": "Python 基础",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 45,
                                  "title": "python中对字符串的操作",
                                  "views": 20,
                                  "create_date": "2021-02-21 14:21:36",
                                  "category_id": 12,
                                  "tag_id": 8,
                                  "update_date": "2022-03-10 18:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/Blue%20ocean11.png",
                                  "summary": "python中对字符串的操作",
                                  "comment_count": 0,
                                  "category_name": "Python 基础",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 44,
                                  "title": "python arrow时间库的使用",
                                  "views": 23,
                                  "create_date": "2021-01-28 10:17:39",
                                  "category_id": 11,
                                  "tag_id": 8,
                                  "update_date": "2021-08-08 23:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1611800257170/file.png",
                                  "summary": "Python针对日期时间的处理提供了大量的package，类和方法，但在可用性上来看非常繁琐和麻烦\n\n第三方库Arrow提供了一个合理的、人性化的方法来创建、操作、格式转换的日期，时间，和时间戳，帮助我们使用较少的导入和更少的代码来处理日期和时间。",
                                  "comment_count": 0,
                                  "category_name": "Python Package",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 42,
                                  "title": "异步邮件发送的两种实现方式",
                                  "views": 43,
                                  "create_date": "2021-01-18 15:29:53",
                                  "category_id": 1,
                                  "tag_id": 2,
                                  "update_date": "2021-12-01 22:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959535975file.png",
                                  "summary": "Flask-Mail 使用同步模式发送电子邮件。\n从电子邮件发送开始，直到电子邮件交付后，给浏览器发回其响应，在整个过程中，Web服务器会一直阻塞。如果我们试图发送电子邮件到一个服务器是缓慢的，甚至更糟糕的，暂时处于脱机状态，所以使用多线程异步发送电子邮件可以避免处理请求过程中不必要的延迟，将发送电子邮件的函数移到后台线程中，能够使程序更加流畅！但实际上...",
                                  "comment_count": 0,
                                  "category_name": "Python Wab",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 41,
                                  "title": "Celery 基于Flask 的定时任务实现 (二)",
                                  "views": 19,
                                  "create_date": "2021-01-18 14:43:33",
                                  "category_id": 10,
                                  "tag_id": 7,
                                  "update_date": "2022-03-25 19:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610958626660file.png",
                                  "summary": "我们需要调用celery当然就要先初始化elery，因为celery启动的时候需要自己配置，当时我们通过flask启动任务的话，配置都统一写在一起，所以这里要通过flask的app注册来把celery给注册上，才能celery启动的时候读取统一的配置文件",
                                  "comment_count": 0,
                                  "category_name": "Celery",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 40,
                                  "title": "爬虫框架 scrapy 的 初使用",
                                  "views": 50,
                                  "create_date": "2021-01-18 11:51:56",
                                  "category_id": 9,
                                  "tag_id": 6,
                                  "update_date": "2022-04-06 12:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959258262file.png",
                                  "summary": "当系统中同时存在Python 2、Python 3时，孤的电脑直接执行scrapy命令使用的是Python 2，此时，需要在scrapy命令前添加“python3 -m”才可以使用Python 3，因此，请使用virtualenv建立虚拟环境运行scrapy等各种程序。",
                                  "comment_count": 0,
                                  "category_name": "爬虫",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 39,
                                  "title": "Git常用命令",
                                  "views": 56,
                                  "create_date": "2020-11-11 16:55:31",
                                  "category_id": 8,
                                  "tag_id": 5,
                                  "update_date": "2022-03-23 23:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959091642file.png",
                                  "summary": "Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。\nGit 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。\nGit 与常用的版本控制工具 CVS, Subversion 等不同，它采用了分布式版本库的方式，不必服务器端软件支持。",
                                  "comment_count": 1,
                                  "category_name": "GIT",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                }
                              ],
                              "rowTotal": 13,
                              "pageSize": 10,
                              "page": 1,
                              "pageTotal": 2
                            },
                            "success": true
                          }
                        }
                      }
                    ],
                    "stat": {
                      "content_size": 0,
                      "response_time_ms": 327.66,
                      "elapsed_ms": 325.996
                    },
                    "address": {
                      "client_ip": "10.32.109.179",
                      "client_port": 59032,
                      "server_ip": "42.192.38.108",
                      "server_port": 443
                    },
                    "validators": {}
                  },
                  "export_vars": {
                    "code222": 0,
                    "a_id2": 50
                  }
                },
                {
                  "success": true,
                  "name": "获取文章列表222",
                  "case_id": "testcase2d4bcd",
                  "message": "",
                  "variables": {
                    "code222": 0,
                    "a_id2": 35,
                    "code": 100201,
                    "sort": "test",
                    "request": {
                      "params": {},
                      "headers": {
                        "Content-Type": "application/json;charset=UTF-8",
                        "HRUN-Request-ID": "HRUN-fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c-086980"
                      },
                      "data": null,
                      "cookies": {},
                      "timeout": 120,
                      "allow_redirects": true,
                      "verify": false,
                      "json": {
                        "page": 1,
                        "pageSize": 10,
                        "sort": "test"
                      }
                    },
                    "response": "<autotest.httprunner.response.ResponseObject object at 0x00000210167D3D00>"
                  },
                  "data": {
                    "success": true,
                    "req_resps": [
                      {
                        "request": {
                          "method": "POST",
                          "url": "https://www.xiaobaicodes.com/api/blog/getlist",
                          "headers": {
                            "User-Agent": "python-requests/2.27.1",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "*/*",
                            "Connection": "keep-alive",
                            "Content-Type": "application/json;charset=UTF-8",
                            "HRUN-Request-ID": "HRUN-fd33e34b-9ea6-4f40-aeb9-71e845cb6a6c-086980",
                            "Content-Length": "43"
                          },
                          "cookies": {},
                          "body": {
                            "page": 1,
                            "pageSize": 10,
                            "sort": "test"
                          }
                        },
                        "response": {
                          "status_code": 200,
                          "headers": {
                            "Server": "nginx/1.14.2",
                            "Date": "Thu, 07 Apr 2022 09:01:27 GMT",
                            "Content-Type": "application/json",
                            "Content-Length": "8899",
                            "Connection": "keep-alive",
                            "X-Powered-By": "CAS Server"
                          },
                          "cookies": {},
                          "encoding": "utf-8",
                          "content_type": "application/json",
                          "body": {
                            "code": 0,
                            "msg": "OK",
                            "data": {
                              "rows": [
                                {
                                  "id": 35,
                                  "title": "Flask Redis的使用以及方法封装",
                                  "views": 651,
                                  "create_date": "2020-10-30 10:49:07",
                                  "category_id": 1,
                                  "tag_id": 1,
                                  "update_date": "2022-04-01 08:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610958182982file.png",
                                  "summary": "在我们日常的Python Web开发中，无不都是使用数据库来进行数据的存储，由于一般的系统任务中通常不会存在高并发的情况，所以这样看起来并没有什么问题，可是一旦涉及大数据量的需求，比如一些商品抢购的情景，或者是主页访问量瞬间较大的时候，单一使用数据库来保存数据的系统会因为面向磁盘，磁盘读/写速度比较慢的问题而存在严重的性能弊端，",
                                  "comment_count": 0,
                                  "category_name": "Python Wab",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 38,
                                  "title": "后台密钥初始化，以及加解密实现",
                                  "views": 57,
                                  "create_date": "2020-11-10 20:46:08",
                                  "category_id": 1,
                                  "tag_id": 2,
                                  "update_date": "2022-03-02 16:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959468279file.png",
                                  "summary": "后台密钥初始化，以及加解密实现",
                                  "comment_count": 0,
                                  "category_name": "Python Wab",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 39,
                                  "title": "Git常用命令",
                                  "views": 56,
                                  "create_date": "2020-11-11 16:55:31",
                                  "category_id": 8,
                                  "tag_id": 5,
                                  "update_date": "2022-03-23 23:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959091642file.png",
                                  "summary": "Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。\nGit 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。\nGit 与常用的版本控制工具 CVS, Subversion 等不同，它采用了分布式版本库的方式，不必服务器端软件支持。",
                                  "comment_count": 1,
                                  "category_name": "GIT",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 40,
                                  "title": "爬虫框架 scrapy 的 初使用",
                                  "views": 50,
                                  "create_date": "2021-01-18 11:51:56",
                                  "category_id": 9,
                                  "tag_id": 6,
                                  "update_date": "2022-04-06 12:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959258262file.png",
                                  "summary": "当系统中同时存在Python 2、Python 3时，孤的电脑直接执行scrapy命令使用的是Python 2，此时，需要在scrapy命令前添加“python3 -m”才可以使用Python 3，因此，请使用virtualenv建立虚拟环境运行scrapy等各种程序。",
                                  "comment_count": 0,
                                  "category_name": "爬虫",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 50,
                                  "title": " jmeter jmx脚本操作，以及返回结果处理",
                                  "views": 49,
                                  "create_date": "2021-03-31 15:18:40",
                                  "category_id": 14,
                                  "tag_id": 10,
                                  "update_date": "2022-04-07 14:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/Blue%20ocean11.png",
                                  "summary": " jmeter jmx脚本操作，以及返回结果处理",
                                  "comment_count": 1,
                                  "category_name": "tools",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 42,
                                  "title": "异步邮件发送的两种实现方式",
                                  "views": 43,
                                  "create_date": "2021-01-18 15:29:53",
                                  "category_id": 1,
                                  "tag_id": 2,
                                  "update_date": "2021-12-01 22:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610959535975file.png",
                                  "summary": "Flask-Mail 使用同步模式发送电子邮件。\n从电子邮件发送开始，直到电子邮件交付后，给浏览器发回其响应，在整个过程中，Web服务器会一直阻塞。如果我们试图发送电子邮件到一个服务器是缓慢的，甚至更糟糕的，暂时处于脱机状态，所以使用多线程异步发送电子邮件可以避免处理请求过程中不必要的延迟，将发送电子邮件的函数移到后台线程中，能够使程序更加流畅！但实际上...",
                                  "comment_count": 0,
                                  "category_name": "Python Wab",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 47,
                                  "title": "前后端分离部署，nginx配置",
                                  "views": 31,
                                  "create_date": "2021-02-21 14:52:29",
                                  "category_id": 13,
                                  "tag_id": 9,
                                  "update_date": "2022-03-02 20:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/Blue%20ocean11.png",
                                  "summary": "前后端分离部署，nginx配置",
                                  "comment_count": 0,
                                  "category_name": "nginx",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 48,
                                  "title": "SQLAlchemy 的封装使用",
                                  "views": 27,
                                  "create_date": "2021-03-09 16:24:16",
                                  "category_id": 11,
                                  "tag_id": 8,
                                  "update_date": "2022-03-10 19:30:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1615278537674/file.png",
                                  "summary": "sqlalchemy 的封装使用",
                                  "comment_count": 0,
                                  "category_name": "Python Package",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 46,
                                  "title": "python中的进程和线程",
                                  "views": 24,
                                  "create_date": "2021-02-21 14:29:18",
                                  "category_id": 12,
                                  "tag_id": 8,
                                  "update_date": "2021-11-02 11:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1613888955125/file.png",
                                  "summary": "今天我们使用的计算机早已进入多CPU或多核时代，而我们使用的操作系统都是支持“多任务”的操作系统，这使得我们可以同时运行多个程序，也可以将一个程序分解为若干个相对独立的子任务...",
                                  "comment_count": 0,
                                  "category_name": "Python 基础",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                },
                                {
                                  "id": 37,
                                  "title": "Celery 基于Flask 的定时任务实现 (一)",
                                  "views": 23,
                                  "create_date": "2020-11-10 20:36:40",
                                  "category_id": 10,
                                  "tag_id": 7,
                                  "update_date": "2021-04-26 16:00:00",
                                  "is_top": "False",
                                  "img_link": "https://img.xiaobaicodes.com/img/system/1610958626660file.png",
                                  "summary": "Celery 基于Flask 的定时任务实现",
                                  "comment_count": 0,
                                  "category_name": "Celery",
                                  "author_name": "小白",
                                  "author_avatar": "https://avatar.xiaobaicodes.com/avatar/1/1604301848646/avatar.png"
                                }
                              ],
                              "rowTotal": 13,
                              "pageSize": 10,
                              "page": 1,
                              "pageTotal": 2
                            },
                            "success": true
                          }
                        }
                      }
                    ],
                    "stat": {
                      "content_size": 0,
                      "response_time_ms": 124.7,
                      "elapsed_ms": 122.422
                    },
                    "address": {
                      "client_ip": "10.32.109.179",
                      "client_port": 59032,
                      "server_ip": "42.192.38.108",
                      "server_port": 443
                    },
                    "validators": {}
                  },
                  "export_vars": {
                    "code222": 0,
                    "a_id2": 35
                  }
                }
              ]
            }
          ]
        },
        "success": true
      }
    });

    // 初始化报告数据
    const initReportData = () => {
      // state.detailData = state.test_data.data.details
      // 用例 成功状态
      let test_data = props.reportBody
      // let test_data = state.test_data.data
      state.nodeStepData = {} // 选中数据
      state.reportTestCaseData.testcase.success = test_data.success
      state.reportTestCaseData.testcase.stat = test_data.stat
      state.reportTestCaseData.testcase.time = test_data.time
      state.reportTestCaseData.testcase.platform = test_data.platform
      state.reportTestCaseData.testcase.details = test_data.details

      // 步骤详情
      if (state.nodeStepData.length > 0) {
        state.reportTestCaseData.step.success = state.nodeStepData.success
      }
    }

    // 节点点击赋值
    const reportNodeClick = (node: any) => {
      if (!node.step_datas) {
        state.nodeStepData = node
        state.reportTestCaseData.step.success = node.success
        state.reportTestCaseData.step.name = node.name
        state.reportTestCaseData.step.case_id = node.case_id
        state.reportTestCaseData.step.message = node.message
        state.reportTestCaseData.step.variables = node.variables
        state.reportTestCaseData.step.export_vars = node.export_vars
        state.reportTestCaseData.step.stat = node.data.stat
        state.reportTestCaseData.step.address = node.data.address
        state.reportTestCaseData.step.validators = node.data.validators
        if (node.data.req_resps.length > 0) {
          let req_resps_data = node.data.req_resps[0]
          state.reportTestCaseData.step.request = req_resps_data.request
          state.reportTestCaseData.step.response = req_resps_data.response
        } else {
          state.reportTestCaseData.step.request = {}
          state.reportTestCaseData.step.response = {}
        }

      }
    }


    // 用例图
    const initStepData = () => {
      let stepECharts = ECharts.init(stepChartRef.value)
      stepECharts.setOption({
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
              {
                value: state.reportTestCaseData.testcase.stat.teststeps.successes,
                name: '成功',
                itemStyle: {color: '#00af00'}
              },
              {
                value: state.reportTestCaseData.testcase.stat.teststeps.failures,
                name: '失败',
                itemStyle: {color: '#F7464A'}
              },
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
      })
    }
    // 套件图
    const initSuitesData = () => {
      let suiteECharts = ECharts.init(suitesChartRef.value)
      suiteECharts.setOption({
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
              {
                value: state.reportTestCaseData.testcase.stat.testcases.success,
                name: '成功',
                itemStyle: {color: '#00af00'}
              },
              {
                value: state.reportTestCaseData.testcase.stat.testcases.fail,
                name: '失败',
                itemStyle: {color: '#F7464A'}
              },
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
      })
    }

    const guid2 = () => {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }

      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
    }

    onMounted(() => {
      if (props.reportBody) {
        initReportData()
        initSuitesData()
        initStepData()
        // 窗口变动自适应大小
        window.onresize = () => {
          ECharts.init(stepChartRef.value).resize();
          ECharts.init(suitesChartRef.value).resize();
        }
        // 加载完dom重新渲染
        nextTick(() => {
          ECharts.init(stepChartRef.value).resize();
          ECharts.init(suitesChartRef.value).resize();
        })
      }
    })

    return {
      suitesChartRef,
      stepChartRef,
      initSuitesData,
      initStepData,
      initReportData,
      reportNodeClick,
      // initTestCount,
      guid2,
      ...toRefs(state),
    };
  }
})

</script>

<style lang="scss" scoped>

.test_report {
  height: calc(100vh - 100px);
}

th, td {
  border-bottom: 1px solid #d9d9d9 !important;
}

th {
  padding: 5px 10px;
}

td {
  padding: 7px 10px;
  word-break: break-all;
}


.box-height {
  overflow-y: auto;
  //height: 100%;
  height: calc(100vh - 30px - 34px - 49px - 100px);
}

.step {
  .step__header {
    padding: 0 0 10px;
    width: 100%;
    display: flex;
    position: relative;
    margin: 7px 0 0;
    border-bottom: 1px solid #eceff1;
    font-size: 20px;
    font-weight: 700;

    .step__header__name {
      padding-left: 10px;
    }

    .step__header__tab {

    }
  }
}


// 请求
.title {
  position: relative;
  padding-left: 11px;
  font-size: 14px;
  font-weight: 600;
  height: 28px;
  line-height: 28px;
  background: #f7f7fc;
  color: #333333;
}

.title::before {
  content: '';
  position: absolute;
  top: 7px;
  left: 0;
  width: 3px;
  height: 14px;
  background: #409eff;
}

table {
  width: 100%;
}

.table {
  width: 100%;
}

.table__parameter {
  width: 20%;
}

.table__content {
  width: 80%;
}

::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #fffacd;
}

pre, .code-block {
    background-color: #f8f9fa;
    border: 1px solid #ebedef;
    border-radius: 4px;
    color: #222 !important;
    font-family: Consolas,monospace;
    font-size: 13px;
    margin: 0;
    padding: 7px 10px;
    white-space: pre-wrap;
}

.pre {
    border: none;
    white-space: pre;
    padding: 5px 0 5px 30px;
    font-family: Consolas;
    font-size: 13px;
}
.pre > pre {
    background: transparent;
    border: none;
}
.dark pre, .dark #test-view-charts .card-panel, .dark .scenario, .dark .background, .dark ul.steps, .dark .collapsible > li, .dark #charts-row .card-panel {
    border: 1px solid #333 !important;
}
</style>