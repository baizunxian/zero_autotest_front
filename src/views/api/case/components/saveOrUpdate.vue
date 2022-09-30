<template>
  <div class="system-edit-menu-container h100">
    <el-card class="save-update-card" shadow="hover">
      <div>
        <el-page-header
            class="page-header"
            :content="editType === 'create'? '新增用例':'更新用例'"
            style="margin: 10px 0;"
            @back="goBack"
        >
        </el-page-header>

        <h3 class="block-title">请求信息</h3>

        <url ref="urlRef" @saveOrUpdateOrDebug="saveOrUpdateOrDebug"/>

        <h3 class="block-title">基本信息</h3>

        <messages ref="messagesRef"/>

        <h3 class="block-title">参数信息</h3>
        <div style="min-height: 500px">
          <el-tabs v-model="activeName">
            <el-tab-pane name='requestBody'>
              <template #label>
                <div style="align-items: center; display: flex; justify-content: center">
                  <strong>body</strong>
                  <div v-show="getStatus('body')" class="request-editor-tabs-badge"></div>
                </div>
              </template>
              <request-body ref="requestBodyRef" @updateHeader="updateHeader"/>
            </el-tab-pane>

            <el-tab-pane name='requestHeaders'>
              <template #label><strong>Headers({{ getHeaderLength() }})</strong></template>
              <request-headers ref="requestHeadersRef"/>
            </el-tab-pane>

            <el-tab-pane name='extractValidate'>
              <template #label>
                <div style="align-items: center; display: flex; justify-content: center">
                  <strong>提取/校验</strong>
                  <div v-show="getStatus('ev')" class="request-editor-tabs-badge"></div>
                </div>
              </template>
              <extract-validate ref="extractValidateRef"/>
            </el-tab-pane>

            <el-tab-pane name='variablesParameters'>
              <template #label>
                <div style="align-items: center; display: flex; justify-content: center">
                  <strong>变量/参数/函数</strong>
                  <div v-show="getStatus('vp')" class="request-editor-tabs-badge"></div>
                </div>
              </template>
              <variables-parameters ref="variablesParametersRef"/>
            </el-tab-pane>

            <el-tab-pane name='preOperation' class="h100">
              <template #label>
                <div style="align-items: center; display: flex; justify-content: center">
                  <strong>前置操作</strong>
                  <!--                  <div v-show="getStatus('vp')" class="request-editor-tabs-badge"></div>-->
                </div>
              </template>
              <pre-operation/>
            </el-tab-pane>

          </el-tabs>
        </div>
      </div>
    </el-card>


    <!--    <el-dialog-->
    <!--        lock-scroll-->
    <!--        title="测试报告"-->
    <!--        v-model="showTestReportDialog"-->
    <!--        width="80%"-->
    <!--        :close-on-click-modal="false"-->
    <!--        center-->
    <!--        append-to-body-->
    <!--        top='4vh'-->
    <!--    >-->
    <el-dialog
        draggable
        v-model="showTestReportDialog"
        width="80%"
        top="8vh"
        destroy-on-close
        :close-on-click-modal="false">
      <test-report :reportBody="reportBody"/>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue'
import Url from '/@/views/api/case/components/url.vue'
import Messages from '/@/views/api/case/components/messages.vue'
import RequestBody from '/@/views/api/case/components/requestBody.vue'
import RequestHeaders from '/@/views/api/case/components/requestHeaders.vue'
import ExtractValidate from '/@/views/api/case/components/extractValidate.vue'
import VariablesParameters from '/@/views/api/case/components/variablesParameters.vue'
import TestReport from '/@/views/api/Report/components/report.vue'
import preOperation from "/@/views/api/caseSuite/components/saveOrUpdateNew.vue"
import {ElLoading, ElMessage} from "element-plus"
import {useStore} from "/@/store"
import {useRoute, useRouter} from "vue-router"
import {useTestCaseApi} from '/@/api/useAutoApi/testcase'

export default defineComponent({
  name: 'saveOrUpdateTestCase',
  components: {
    Url,
    Messages,
    RequestBody,
    RequestHeaders,
    ExtractValidate,
    VariablesParameters,
    // OutputList,
    // Skip,
    TestReport,
    preOperation,
  },
  props: {
    case_id: Number
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const userInfo = store.state.userInfos
    const urlRef = ref()
    const messagesRef = ref()
    const requestBodyRef = ref()
    const requestHeadersRef = ref()
    const extractValidateRef = ref()
    const variablesParametersRef = ref()
    // const outputListRef = ref()
    // const skipRef = ref()
    const state = reactive({
      isShowDialog: false,
      activeName: 'requestBody',
      editType: '',
      content: {key: 'vaue'},

      // report
      // report
      showTestReportDialog: false,
      reportBody: {},
    });


    const saveOrUpdateOrDebug = (type: string) => {
      try {
        // 获取url mothod 表单
        let urlForm = urlRef.value.getFormData()   // url表单信息
        let msgForm = messagesRef.value.getFormData()
        let bodyForm = requestBodyRef.value.getFormData()
        let headForm = requestHeadersRef.value.getFormData()
        let EVForm = extractValidateRef.value.getFormData()
        let VPForm = variablesParametersRef.value.getFormData()
        // let outputForm = outputListRef.value.getFormData()
        // let skipForm = skipRef.value.getFormData()

        bodyForm.url = urlForm.url
        bodyForm.method = urlForm.method
        bodyForm.headers = headForm
        // 组装表单
        let testCaseForm = {
          id: msgForm.id,
          user_id: userInfo.userInfos.id,
          env_name: urlForm.env_name,
          name: msgForm.name,
          project_id: msgForm.project_id,
          module_id: msgForm.module_id,
          config_id: msgForm.config_id,
          code_id: msgForm.code_id,
          code: msgForm.code,
          priority: msgForm.priority,
          run_type: 1,
          service_name: '',
          include: msgForm.include,
          testcase: {
            // skip: true,
            case_id: msgForm.id,
            name: msgForm.name,
            request: bodyForm,
            parameters: VPForm.parameters,
            variables: VPForm.variables,
            hooks: VPForm.hooks,
            setup_hooks: VPForm.setup_hooks,
            teardown_hooks: VPForm.teardown_hooks,
            extract: EVForm.extract,
            validate: EVForm.validate,
            // output: outputForm
          },
        }

        // 保存用例
        if (type === 'save') {
          useTestCaseApi().saveOrUpdate(testCaseForm)
              .then(res => {
                ElMessage.success('保存成功！')
                let case_id = res.data
                messagesRef.value.setCaseId(case_id)
              })
        } else {
          testCaseForm.type = type
          testCaseForm.base_url = urlForm.base_url
          const loading = ElLoading.service({
            lock: true,
            text: '用例执行中,请稍候。。。',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)',
            customClass: 'loading-class'
          })
          useTestCaseApi().debugTestCaseNew(testCaseForm)
              .then(res => {
                state.reportBody = res.data
                if (type === 'debug') {
                  console.log('-----------------debug---------------')
                  urlRef.value.onOpenCloseEnvDialog()
                  state.showTestReportDialog = true
                  loading.close()
                } else {
                  // this.drawer = true
                  loading.close()
                }
              })
              .catch(() => {
                loading.close()
              })
        }
      } catch (err: any) {
        console.log(err)
        ElMessage.info(err || '信息表单填写不完整')

      }
    }

    const initTestCase = () => {
      let case_id = route.query.id || props.case_id
      if (case_id) {
        useTestCaseApi().getTestCaseInfo({id: case_id})
            .then(res => {
              let data = res.data
              let case_data = data.testcase
              // url
              let urlForm = {
                id: data.id,
                // dataSource: this.dataSource,
                url: case_data.request.url,
                method: case_data.request.method,
                enabled_flag: data.enabled_flag,
                base_url: '',
              }
              urlRef.value.initForm(urlForm)
              // msg
              let case_info = {
                name: data.name,
                config_id: data.config_id,
                code_id: data.code_id,
                priority: data.priority,
                code: data.code,
                id: data.id,
                include: data.include,
                module_id: data.module_id,
                project_id: data.project_id,
                run_type: data.run_type,
                user_id: data.user_id,
              }
              // case_info.id = c_id
              // 编辑赋值调用 详情
              messagesRef.value.initForm(case_info)
              // 编辑赋值调用 请求参数
              requestBodyRef.value.initForm(case_data.request)
              requestHeadersRef.value.initForm(case_data.request)
              // extractValidate
              let evForm = {
                extract: case_data.extract,
                validate: case_data.validate,
              }
              extractValidateRef.value.initForm(evForm)

              //variablesParameters
              let vpFrom = {
                variables: case_data.variables,
                parameters: case_data.parameters,
                setup_hooks: case_data.setup_hooks,
                teardown_hooks: case_data.teardown_hooks,
                // hooks: case_data.hooks,
              }
              variablesParametersRef.value.initForm(vpFrom)
              // outputListRef.value.initForm(case_data.output)
              // if (case_data.skip_info) {
              //   skipRef.value.initForm(case_data.skip_info)
              // }
            })
      }
    }

    // 返回到列表
    const goBack = () => {
      router.push({name: 'apiTestCase'})
    }

    // updateHeader
    const getHeaderLength = () => {
      return requestHeadersRef.value.headersData.length
    }
    const updateHeader = (headerData: any, remove: any) => {
      requestHeadersRef.value.updateHeader(headerData, remove)
    }

    // 获取是否填写参数状态
    const getStatus = (components: string) => {
      switch (components) {
        case 'body':
          return requestBodyRef.value.getStatus()
        case 'vp':
          return variablesParametersRef.value.getStatus()
        case 'ev':
          return extractValidateRef.value.getStatus()
      }
    }
    onMounted(() => {
      initTestCase()
    })

    return {
      urlRef,
      messagesRef,
      requestBodyRef,
      requestHeadersRef,
      extractValidateRef,
      variablesParametersRef,
      // outputListRef,
      // skipRef,
      store,
      route,
      router,
      goBack,
      getHeaderLength,
      updateHeader,
      saveOrUpdateOrDebug,
      getStatus,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.block-title {
  position: relative;
  margin-bottom: 12px;
  padding-left: 11px;
  font-size: 14px;
  font-weight: 600;
  height: 28px;
  line-height: 28px;
  background: #f7f7fc;
  color: #333333;

  &::before {
    content: '';
    position: absolute;
    top: 7px;
    left: 0;
    width: 3px;
    height: 14px;
    background: #409eff;
  }
}

:deep(.page-header .el-page-header__icon .el-icon) {
  background-color: #3883fa;
  border-radius: 50%;
  color: white;
}

:deep(.el-page-header .page-header) {
  margin-left: 0 !important;
}

:deep(.save-update-card .el-card__body) {
  padding-top: 0;
}

:deep(.el-tabs__header) {
  margin: 0 0 10px;
}

:deep(.el-tabs__item.is-active) {
  color: var(--el-text-color-primary);
}

//:deep(.el-tabs__item:hover) {
//  color: var(--el-text-color-primary);
//}

.request-editor-tabs-badge {
  background-color: #0cbb52;
  display: inline-flex;
  width: 8px;
  height: 8px;
  margin-left: 5px;
  border-radius: 8px;
}
</style>