<template>
  <div>
    <el-page-header @back="goBack" :content="type === 'create'? '新增用例':'更新用例'" style="margin: 10px;">
    </el-page-header>

    <url
        ref="urlRef"
        @saveOrUpdateCaseOrdebug="saveOrUpdateCaseOrdebug"
        @showUpdateCount="showUpdateCount"
        @setUpdateCount="setUpdateCount"
    />

<!--    <el-card class="box-card" style="margin: 10px;">-->
<!--      <div class="tip">-->
<!--        <p><strong>基本信息</strong></p>-->
<!--      </div>-->
<!--      <messages-->
<!--          ref="messagesRef"-->
<!--          @showUpdateCount="showUpdateCount"-->
<!--          @setUpdateCount="setUpdateCount"-->
<!--      />-->
<!--    </el-card>-->
<!--    <el-card class="box-card" style="margin: 10px;">-->
<!--      &lt;!&ndash; 参数信息 &ndash;&gt;-->
<!--      <div class="tip">-->
<!--        <p><strong>参数信息</strong></p>-->
<!--      </div>-->
<!--      <el-tabs v-model="activeName">-->

<!--        <el-tab-pane name='requestBody'>-->
<!--          <strong slot="label">body</strong>-->
<!--          <request-body-->
<!--              ref="requestBodyRef"-->
<!--              @showUpdateCount="showUpdateCount"-->
<!--              @setUpdateCount="setUpdateCount"-->
<!--          />-->
<!--        </el-tab-pane>-->

<!--        <el-tab-pane name='requestHeaders'>-->
<!--          <strong slot="label">Headers</strong>-->
<!--          <request-headers-->
<!--              ref="requestHeadersRef"-->
<!--              @showUpdateCount="showUpdateCount"-->
<!--              @setUpdateCount="setUpdateCount"-->
<!--          />-->
<!--        </el-tab-pane>-->

<!--        <el-tab-pane name='extractValidate'>-->
<!--          <strong slot="label">提取/校验</strong>-->
<!--          <extract-validate-->
<!--              ref="extractValidateRef"-->
<!--              @showUpdateCount="showUpdateCount"-->
<!--              @setUpdateCount="setUpdateCount"-->
<!--          />-->
<!--        </el-tab-pane>-->

<!--        <el-tab-pane name='variablesParameters'>-->
<!--          <strong slot="label">变量/参数/函数</strong>-->
<!--          <variables-parameters-->
<!--              ref="variablesParametersRef"-->
<!--              @showUpdateCount="showUpdateCount"-->
<!--              @setUpdateCount="setUpdateCount"-->
<!--          />-->
<!--        </el-tab-pane>-->
<!--        <el-tab-pane name='outputList'>-->
<!--          <strong slot="label">输出参数</strong>-->
<!--          <output-list-->
<!--              ref="outputListRef"-->
<!--              @showUpdateCount="showUpdateCount"-->
<!--              @setUpdateCount="setUpdateCount"-->
<!--          />-->
<!--        </el-tab-pane>-->

<!--        <el-tab-pane name='Skip'>-->
<!--          <strong slot="label">用例跳过条件</strong>-->
<!--          <skip-->
<!--              ref="skipRef"-->
<!--              @showUpdateCount="showUpdateCount"-->
<!--              @setUpdateCount="setUpdateCount"-->
<!--          />-->
<!--        </el-tab-pane>-->

<!--      </el-tabs>-->

<!--      <el-dialog-->
<!--          lock-scroll-->
<!--          title="测试报告"-->
<!--          v-if="testReportShow"-->
<!--          :visible.sync="testReportShow"-->
<!--          width="80%"-->
<!--          destroy-on-close-->
<!--          :close-on-click-modal="false"-->
<!--          center-->
<!--          v-dialogDrag-->
<!--          append-to-body-->
<!--          top='4vh'-->
<!--      >-->
<!--        <test-report :reportData="reportData"/>-->
<!--      </el-dialog>-->

<!--      <el-drawer-->
<!--          v-show="drawer"-->
<!--          title="我是标题"-->
<!--          :visible.sync="drawer"-->
<!--          :with-header="false"-->
<!--          close-on-press-escape-->
<!--          show-close-->
<!--          :before-close="drawerClose"-->

<!--          size="60%"-->
<!--      >-->
<!--        <automatic-assertion-->
<!--            ref="AutomaticAssertion"-->
<!--            :reportData="reportData"-->
<!--            @setValidate="setValidate"-->
<!--            @setExtract="setExtract"-->
<!--        />-->
<!--      </el-drawer>-->

<!--    </el-card>-->
  </div>
</template>

<script>
import extractValidate from './extractValidate'
import variablesParameters from './variablesParameters'
import messages from './messages'
import requestBody from './requestBody'
import requestHeaders from './requestHeaders'
// import testReport from '@/views/api/Report/components/testReport'
import outputList from './outputList'
import AutomaticAssertion from './AutomaticAssertion'
import Skip from './skip'
import {mapGetters} from 'vuex'
import url from './url'


export default {
  name: 'saveOrUpdateCase',
  components: {
    messages,
    extractValidate,
    variablesParameters,
    url,
    testReport,
    requestBody,
    requestHeaders,
    outputList,
    Skip,
    AutomaticAssertion,
  },
  props: {
    type: String,
    c_id: Number,
  },
  data() {
    return {
      activeName: 'requestBody',
      resource: '',
      testReportShow: false,
      reportData: [],
      updateCount: 0,
      updateModelList: [],
      drawer: false
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  beforeRouteLeave(to, form, next) {
    if (form.path === '/Api/saveOrUpdateCase' && this.updateCount > 0) {
      // this.$confirm(`你修改了[${this.updateModelList}]的数据，确定离开此页面?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      this.saveCaseDraft()
          .then(() => {
            this.updateCount = 0
            this.updateModelList = []
            next()
          })
          .catch(() => {
                next(false)
              }
          )
    } else {
      next()
    }
  },
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      let c_id = to.query.id
      let type = to.query.type
      vm.resource = to.query.resource
      if (type === 'update') {
        if (c_id) vm.setditail(c_id)
      } else {
        vm.setditaildraft()
        console.log(c_id)
        let data = {
          code: to.query.code,
          code_id: to.query.code_id,
          case_name: to.query.name
        }
        to.query.code && to.query.code_id ? vm.reset(data) : vm.reset()
      }
    })
  },
  methods: {
    // 初始化用例信息
    setditail(c_id) {
      if (c_id) {
        getCaseInfo({id: c_id})
            .then(res => {
              let data = res.data
              let case_data = data.request.test
              // url
              let urlform = {
                id: data.id,
                resource: this.resource,
                url: case_data.request.url,
                method: case_data.request.method,
                enabled_flag: data.enabled_flag,
              }
              console.log(urlform, 'urlform')
              this.$refs.url.setUrlForm(urlform)
              // msg
              let case_info = {
                case_name: data.name,
                config_id: data.config_id,
                code_id: data.code_id,
                priority: data.priority,
                code: data.code,
                id: data.id,
                include: JSON.parse(data.include),
                module_id: data.module_id,
                project_id: data.project_id,
                run_type: data.run_type,
                user_id: data.user_id,
              }
              // case_info.id = c_id
              // 编辑赋值调用 详情
              this.$refs.messages.setMsgFrom(case_info)
              // 编辑赋值调用 请求参数
              this.$refs.requestBody.setBodyForm(case_data.request)
              this.$refs.requestHeaders.setHerdForm(case_data.request)
              // extractValidate
              let evform = {
                extract: case_data.extract,
                validate: case_data.validate,
              }
              this.$refs.extractValidate.setEvForm(evform)

              //variablesParameters
              let vpfrom = {
                variables: case_data.variables,
                parameters: case_data.parameters,
                setup_hooks: case_data.setup_hooks,
                teardown_hooks: case_data.teardown_hooks,
                // hooks: case_data.hooks,
              }
              this.$refs.variablesParameters.setvpform(vpfrom)
              this.$refs.outputList.setOutputform(case_data.output)
              if (case_data.skip_info) {
                this.$refs.skip.setSkipForm(case_data.skip_info)
              }
            })
      }
    },
    // 初始化用例信息-草稿
    setditaildraft() {
      getCaseDraft({})
          .then(res => {
            let data = res.data
            if (data === {}) {
              let data = {
                code: to.query.code,
                code_id: to.query.code_id,
                case_name: to.query.name
              }
              to.query.code && to.query.code_id ? this.reset(data) : this.reset()
            } else {
              let case_data = data.request.test
              // url
              let urlform = {
                url: case_data.request.url,
                method: case_data.request.method
              }
              this.$refs.url.setUrlForm(urlform)
              // msg
              let case_info = {
                case_name: data.name,
                config_id: data.config_id,
                code_id: data.code_id,
                priority: data.priority,
                code: data.code,
                id: data.id,
                include: JSON.parse(data.include),
                module_id: data.module_id,
                project_id: data.project_id,
                run_type: data.run_type,
                user_id: data.user_id,
              }
              // case_info.id = c_id
              // 编辑赋值调用 详情
              this.$refs.messages.setMsgFrom(case_info)
              // 编辑赋值调用 请求参数
              this.$refs.requestBody.setBodyForm(case_data.request)
              this.$refs.requestHeaders.setHerdForm(case_data.request)
              // extractValidate
              let evform = {
                extract: case_data.extract,
                validate: case_data.validate,
              }
              this.$refs.extractValidate.setEvForm(evform)

              //variablesParameters
              let vpfrom = {
                variables: case_data.variables,
                parameters: case_data.parameters,
                setup_hooks: case_data.setup_hooks,
                teardown_hooks: case_data.teardown_hooks,
                // hooks: case_data.hooks,
              }
              this.$refs.variablesParameters.setvpform(vpfrom)
              this.$refs.outputList.setOutputform(case_data.output)
            }
          })

    },
    async saveOrUpdateCaseOrdebug(type) {
      try {
        // 获取url mothod 表单
        let urlForm = this.$refs.url.getUrlForm()
        let msgForm = await this.$refs.messages.getMsgForm()
        let bodyForm = this.$refs.requestBody.getBodyForm()
        let headForm = this.$refs.requestHeaders.getHeadForm()
        // let requestForm = this.$refs.request.getRquestForm()
        // let requestForm = this.$refs.request.getRquestForm()
        let EVForm = this.$refs.extractValidate.getEVForm()
        let VPForm = this.$refs.variablesParameters.getVPForm()
        let Output = this.$refs.outputList.getOutputForm()

        this.$set(bodyForm, 'url', urlForm.url)
        this.$set(bodyForm, 'method', urlForm.method)
        this.$set(bodyForm, 'headers', headForm)

        // 组装表单
        let form = {
          id: msgForm.id,
          user_id: this.userId,
          // env_name: urlForm.env_name,
          case_name: msgForm.case_name,
          project_id: msgForm.project_id,
          module_id: msgForm.module_id,
          config_id: msgForm.config_id,
          code_id: msgForm.code_id,
          code: msgForm.code,
          priority: msgForm.priority,
          run_type: 1,
          // service_name: '',
          include: msgForm.include,
          test: {
            // skip: true,
            name: msgForm.case_name,
            request: bodyForm,
            parameters: VPForm.parameters,
            variables: VPForm.variables,
            // hooks: VPForm.hooks,
            setup_hooks: VPForm.setup_hooks,
            teardown_hooks: VPForm.teardown_hooks,
            extract: EVForm.extract,
            validate: EVForm.validate,
            output: Output
          },
        }
        let skip_info = this.$refs.skip.getSkip()
        if (skip_info) {
          form.test.skip_info = skip_info
        }
        // 调用接口
        if (type === 'save') {
          saveOrUpdateCase(form)
              .then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                  this.updateCount = 0
                  this.updateModelList = []
                  let c_id = res.data
                  this.$refs.messages.setCaseId(c_id)
                  // this.goBack()
                }
              })
        } else {
          form.type = type
          this.$set(form, 'base_url', urlForm.base_url)
          const loading = this.$loading({
            lock: true,
            text: '用例执行中,请稍候。。。',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)',
            customClass: 'loading-class'
          })
          loading.$el.getElementsByTagName('i')[0].style.fontSize = '54px'
          loading.$el.getElementsByTagName('p')[0].style.fontSize = '26px'
          debugCase(form)
              .then(res => {
                this.reportData = res.data
                console.log(this.reportData, 'this.reportData')
                if (type === 'debug') {
                  this.testReportShow = true
                  loading.close()
                } else {
                  this.drawer = true
                  loading.close()
                }
              }).catch(() => {
            loading.close()
          })
        }
      } catch (err) {
        console.log(err)
        this.$message({
          type: 'info',
          message: err || '信息表单填写不完整'
        })
      }
    },
    // 返回设置
    goBack() {

      if (this.resource === 'caseList') {
        this.$router.push({path: '/Api/caseList'})
      } else {
        this.$router.push({path: '/Api/caseReview'})
      }
    },
    // 重置表单
    reset(data) {
      this.$refs.url.resetForm(data)
      this.$refs.messages.resetForm(data)
      this.$refs.requestBody.resetForm()
      this.$refs.requestHeaders.resetForm(data)
      this.$refs.extractValidate.resetForm()
      this.$refs.variablesParameters.resetForm()
      this.$refs.outputList.resetForm()
      this.$refs.skip.resetForm()
    },

    setValidate(validate) {
      this.$refs.extractValidate.setValidate(validate)
    },
    setExtract(extract) {
      this.$refs.extractValidate.setExtract(extract)
    },
    // 更新次数
    setUpdateCount(model) {
      this.updateCount++
      if (model && this.updateModelList.indexOf(model) === -1) {
        this.updateModelList.push(model)
      }
    },
    showUpdateCount() {
      console.log(this.updateCount, 'thisupdateCount')
      console.log(this.updateModelList, 'updateModelList')
    },
    // 保存为草稿
    async saveCaseDraft() {
      try {
        // 获取url mothod 表单
        let urlForm = this.$refs.url.getUrlForm()
        let msgForm = await this.$refs.messages.getMsgForm()
        let bodyForm = this.$refs.requestBody.getBodyForm()
        let headForm = this.$refs.requestHeaders.getHeadForm()
        let EVForm = this.$refs.extractValidate.getEVForm()
        let VPForm = this.$refs.variablesParameters.getVPForm()
        let Output = this.$refs.outputList.getOutputForm()
        this.$set(bodyForm, 'url', urlForm.url)
        this.$set(bodyForm, 'method', urlForm.method)
        this.$set(bodyForm, 'headers', headForm)

        // 组装表单
        if (urlForm && msgForm && bodyForm) {
          let form = {
            id: msgForm.id,
            user_id: this.userId,
            case_name: msgForm.case_name,
            project_id: msgForm.project_id,
            module_id: msgForm.module_id,
            config_id: msgForm.config_id,
            code_id: msgForm.code_id,
            code: msgForm.code,
            priority: msgForm.priority,
            run_type: 1,
            include: msgForm.include,
            test: {
              name: msgForm.case_name,
              request: bodyForm,
              parameters: VPForm.parameters,
              variables: VPForm.variables,
              setup_hooks: VPForm.setup_hooks,
              teardown_hooks: VPForm.teardown_hooks,
              extract: EVForm.extract,
              validate: EVForm.validate,
              output: Output
            },
          }
          saveCaseDraft(form)
        }
      } catch (err) {
        console.log(err)
        this.$message({
          type: 'info',
          message: '信息表单填写不完整'
        })
      }
    },
    drawerClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$refs.AutomaticAssertion.resetDate()
            done()
          })
          .catch(_ => {
          })
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-class {
  font-size: 28px;
}

.employee_body {
  margin: 10px 20px 0;
  overflow: hidden;
}

.app-container {
  padding: 0;
}

.inputclass {
  width: 300px;
}

.el-dialog {
  height: 50%;
}

.title {
  margin-left: 10px;
  margin-top: 10px;

  .title-button {
    margin-left: 10px;
  }

  ::v-deep .el-input-group__prepend {
    // color: #909399;
    font-weight: 1000;
  }

  // ::v-deep .el-input__inner {
  //   font-weight: bold;
  //   font-size: 15px;
  // }
}

.tip {
  padding: 4px 4px;
  border-left: 5px solid #409EFF;
  // margin-top: 20px;
  p {
    margin: 0;
  }
}

h5 {
  font-size: 1.64rem;
  line-height: 110%;
  margin: 0.82rem 0 0.656rem 0;
  font-weight: 100;
}

::v-deep .el-dialog--center .el-dialog__body {
  padding: 0px 25px 30px;
}

::v-deep .el-transfer-panel {
  width: 300px;
}

::v-deep .el-drawer__body {
  overflow: auto;
}

//修改动画的大小  给文字加粗效果
.el-loading-spinner {
  font-size: 80px;
  font-weight: bold;
}

//修改文字的大小
.el-loading-mask .el-loading-spinner .el-loading-text {
  font-size: 18px;
}

</style>
