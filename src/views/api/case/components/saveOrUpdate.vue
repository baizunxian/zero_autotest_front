<template>
  <div class="system-edit-menu-container">
    <el-card shadow="hover">
      <div>
        <el-page-header :content="editType === 'create'? '新增用例':'更新用例'" style="margin: 10px;">
        </el-page-header>

        <url ref="urlRef" @saveOrUpdateOrDebug="saveOrUpdateOrDebug"/>

        <h3 class="block-title">基本信息</h3>

        <messages ref="messagesRef"/>

        <h3 class="block-title">参数信息</h3>
        <div style="min-height: 500px">
          <el-tabs v-model="activeName">
            <el-tab-pane name='requestBody'>
              <template #label><strong>body</strong></template>
              <request-body ref="requestBodyRef"/>
            </el-tab-pane>

            <el-tab-pane name='requestHeaders'>
              <template #label><strong>Headers</strong></template>
              <request-headers ref="requestHeadersRef"/>
            </el-tab-pane>

            <el-tab-pane name='extractValidate'>
              <template #label><strong>提取/校验</strong></template>
              <extract-validate ref="extractValidateRef"/>
            </el-tab-pane>

            <el-tab-pane name='variablesParameters'>
              <template #label><strong>变量/参数/函数</strong></template>
              <variables-parameters ref="variablesParametersRef"/>
            </el-tab-pane>

            <el-tab-pane name='outputList'>
              <template #label><strong>输出参数</strong></template>
              <output-list ref="outputListRef"/>
            </el-tab-pane>

            <el-tab-pane name='Skip'>
              <template #label><strong>用例跳过条件</strong></template>
              <skip ref="skipRef"/>
            </el-tab-pane>

          </el-tabs>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import Url from '/@/views/api/case/components/url.vue'
import Messages from '/@/views/api/case/components/messages.vue'
import RequestBody from '/@/views/api/case/components/requestBody.vue'
import RequestHeaders from '/@/views/api/case/components/requestHeaders.vue'
import ExtractValidate from '/@/views/api/case/components/extractValidate.vue'
import VariablesParameters from '/@/views/api/case/components/variablesParameters.vue'
import OutputList from '/@/views/api/case/components/outputList.vue'
import Skip from '/@/views/api/case/components/skip.vue'
// import {mapGetters} from 'vuex'
import {ElMessage, ElLoading} from "element-plus";
import {useStore} from "/@/store";
import {useRoute} from "vue-router";
import {useTestCaseApi} from '/@/api/useAutoApi/testcase';

export default defineComponent({
  name: 'saveOrUpdateTestCase',
  components: {
    Url,
    Messages,
    RequestBody,
    RequestHeaders,
    ExtractValidate,
    VariablesParameters,
    OutputList,
    Skip,
  },
  setup(props, {emit}) {
    const store = useStore();
    const route = useRoute();
    const userInfo = store.state.userInfos
    const urlRef = ref()
    const messagesRef = ref()
    const requestBodyRef = ref()
    const requestHeadersRef = ref()
    const extractValidateRef = ref()
    const variablesParametersRef = ref()
    const outputListRef = ref()
    const skipRef = ref()
    const state = reactive({
      isShowDialog: false,
      activeName: 'requestBody',
      editType: '',
      content: {key: 'vaue'},
    });


    const saveOrUpdateOrDebug = (type: string) => {
      try {
        // 获取url mothod 表单
        let urlForm = urlRef.value.getFormData()
        let msgForm = messagesRef.value.getFormData()
        let bodyForm = requestBodyRef.value.getFormData()
        let headForm = requestHeadersRef.value.getFormData()
        let EVForm = extractValidateRef.value.getFormData()
        let VPForm = variablesParametersRef.value.getFormData()
        console.log(VPForm, 'VPForm')
        let outputForm = outputListRef.value.getFormData()
        let skipForm = skipRef.value.getFormData()
        //
        // this.$set(bodyForm, 'url', urlForm.url)
        // this.$set(bodyForm, 'method', urlForm.method)
        // this.$set(bodyForm, 'headers', headForm)
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
            skip: true,
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
            output: outputForm
          },
        }
        console.log(urlForm, ' urlForm')
        //   let skip_info = this.$refs.skip.getSkip()
        //   if (skip_info) {
        //     testCaseForm.test.skip_info = skip_info
        //   }
        // 保存用例
        if (type === 'save') {
          console.log('testCaseForm', testCaseForm)
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
          useTestCaseApi().debugCase(testCaseForm)
              .then(res => {
                // this.reportData = res.data
                console.log(res, 'this.res')
                if (type === 'debug') {
                  // this.testReportShow = true
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

    const initTestCast = () => {
      if (route.query.id) {
        useTestCaseApi().getTestCaseInfo({id: route.query.id})
            .then(res => {
              let data = res.data
              let case_data = data.testcase
              // url
              let urlForm = {
                id: data.id,
                // resource: this.resource,
                url: case_data.request.url,
                method: case_data.request.method,
                enabled_flag: data.enabled_flag,
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
              outputListRef.value.initForm(case_data.output)
              if (case_data.skip_info) {
                skipRef.value.initForm(case_data.skip_info)
              }
            })
      }
    }

    onMounted(() => {
      initTestCast()
    })

    return {
      urlRef,
      messagesRef,
      requestBodyRef,
      requestHeadersRef,
      extractValidateRef,
      variablesParametersRef,
      outputListRef,
      skipRef,
      store,
      route,
      saveOrUpdateOrDebug,
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
}

.block-title::before {
  content: '';
  position: absolute;
  top: 7px;
  left: 0;
  width: 3px;
  height: 14px;
  background: #409eff;
}
</style>