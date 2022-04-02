<template>
  <div class="system-edit-menu-container">
    <el-card shadow="hover">
      <div>
        <el-page-header :content="editType === 'create'? '新增用例':'更新用例'" style="margin: 10px;">
        </el-page-header>

        <!--      <url-->
        <!--          ref="urlRef"-->
        <!--          @saveOrUpdateCaseOrdebug="saveOrUpdateCaseOrdebug"-->
        <!--          @showUpdateCount="showUpdateCount"-->
        <!--          @setUpdateCount="setUpdateCount"-->
        <!--      />-->
        <url ref="urlRef" @saveOrUpdateOrDebug="saveOrUpdateOrDebug"/>

        <!--      <el-card class="box-card" style="margin: 10px;">-->
        <h3 class="block-title">基本信息</h3>
        <!--      <messages-->
        <!--            ref="messagesRef"-->
        <!--            @showUpdateCount="showUpdateCount"-->
        <!--            @setUpdateCount="setUpdateCount"-->
        <!--        />-->
        <messages
            ref="messagesRef"
        />

        <h3 class="block-title">参数信息</h3>
        <el-tabs v-model="activeName">
          <el-tab-pane name='requestBody'>
            <template #label> <strong>body</strong> </template>
            <request-body ref="requestBodyRef" />
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
            <output-list ref="outputListRef" />
          </el-tab-pane>


          <el-tab-pane name='Skip'>
            <template #label><strong>用例跳过条件</strong></template>
            <skip ref="skipRef" />
          </el-tab-pane>

        </el-tabs>

        <VAceEditor
          v-model:value="content"
          lang="text"
          theme="chrome"
          style="height: 500px"
          :options="{ useWorker: true }"
        />




<!--                </el-tabs>-->

<!--                <el-dialog-->
<!--                    lock-scroll-->
<!--                    title="测试报告"-->
<!--                    v-if="testReportShow"-->
<!--                    :visible="testReportShow"-->
<!--                    width="80%"-->
<!--                    destroy-on-close-->
<!--                    :close-on-click-modal="false"-->
<!--                    center-->
<!--                    v-dialogDrag-->
<!--                    append-to-body-->
<!--                    top='4vh'-->
<!--                >-->
<!--        &lt;!&ndash;          <test-report :reportData="reportData"/>&ndash;&gt;-->
<!--                </el-dialog>-->

<!--                <el-drawer-->
<!--                    v-show="drawer"-->
<!--                    title="我是标题"-->
<!--                    :visible="drawer"-->
<!--                    :with-header="false"-->
<!--                    close-on-press-escape-->
<!--                    show-close-->
<!--                    :before-close="drawerClose"-->

<!--                    size="60%"-->
<!--                >-->
<!--                  <automatic-assertion-->
<!--                      ref="AutomaticAssertion"-->
<!--                      :reportData="reportData"-->
<!--                      @setValidate="setValidate"-->
<!--                      @setExtract="setExtract"-->
<!--                  />-->
<!--                </el-drawer>-->
      </div>
    </el-card>
    <test></test>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from 'vue';
import Url from '/@/views/api/case/components/url.vue'
import Messages from '/@/views/api/case/components/messages.vue'
import RequestBody from '/@/views/api/case/components/requestBody.vue'
import RequestHeaders from '/@/views/api/case/components/requestHeaders.vue'
import ExtractValidate from '/@/views/api/case/components/extractValidate.vue'
import VariablesParameters from '/@/views/api/case/components/variablesParameters.vue'
import OutputList from '/@/views/api/case/components/outputList.vue'
import Skip from '/@/views/api/case/components/skip.vue'
import test from '/@/views/api/case/components/test.vue'
// import AutomaticAssertion from './AutomaticAssertion'
// import {mapGetters} from 'vuex'
import {ElMessage} from "element-plus";
// import {ElMessage} from "element-plus";

// import ace from 'ace-builds';
// import { VAceEditor } from 'vue3-ace-editor';
// import 'ace-builds/src-noconflict/mode-json';
// import 'ace-builds/src-noconflict/theme-chrome';
// import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url';
// ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);


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
    test,
  },
  setup(props, {emit}) {
    const urlRef = ref()
    const requestBodyRef = ref()
    const state = reactive({
      isShowDialog: false,
      activeName: 'false',
      editType: '',
      content: {key: 'vaue'},
    });


    const saveOrUpdateOrDebug = (type: string) => {
      try {
        // 获取url mothod 表单
        let urlForm = urlRef.value.getFormData()
        // let msgForm = await this.$refs.messages.getMsgForm()
        // let bodyForm = this.$refs.requestBody.getBodyForm()
        // let headForm = this.$refs.requestHeaders.getHeadForm()
        // // let requestForm = this.$refs.request.getRquestForm()
        // // let requestForm = this.$refs.request.getRquestForm()
        // let EVForm = this.$refs.extractValidate.getEVForm()
        // let VPForm = this.$refs.variablesParameters.getVPForm()
        // let Output = this.$refs.outputList.getOutputForm()
        //
        // this.$set(bodyForm, 'url', urlForm.url)
        // this.$set(bodyForm, 'method', urlForm.method)
        // this.$set(bodyForm, 'headers', headForm)

        // 组装表单
        let testCaseForm = {
          // id: msgForm.id,
          // user_id: this.userId,
          // env_name: urlForm.env_name,
          // case_name: msgForm.case_name,
          // project_id: msgForm.project_id,
          // module_id: msgForm.module_id,
          // config_id: msgForm.config_id,
          // code_id: msgForm.code_id,
          // code: msgForm.code,
          // priority: msgForm.priority,
          // run_type: 1,
          // service_name: '',
          // include: msgForm.include,
          test: {
            // skip: true,
            // name: msgForm.case_name,
            // request: bodyForm,
            // parameters: VPForm.parameters,
            // variables: VPForm.variables,
            // hooks: VPForm.hooks,
            // setup_hooks: VPForm.setup_hooks,
            // teardown_hooks: VPForm.teardown_hooks,
            // extract: EVForm.extract,
            // validate: EVForm.validate,
            // output: Output
          },
        }
        console.log(urlForm, ' urlForm')
        //   let skip_info = this.$refs.skip.getSkip()
        //   if (skip_info) {
        //     testCaseForm.test.skip_info = skip_info
        //   }
        //   // 调用接口
        //   if (type === 'save') {
        //     useTestCaseApi.saveOrUpdate(testCaseForm)
        //         .then(res => {
        //           if (res.code === 0) {
        //             this.$message({
        //               type: 'success',
        //               message: '保存成功'
        //             })
        //             this.updateCount = 0
        //             this.updateModelList = []
        //             let c_id = res.data
        //             this.$refs.messages.setCaseId(c_id)
        //             // this.goBack()
        //           }
        //         })
        //   } else {
        //     form.type = type
        //     this.$set(form, 'base_url', urlForm.base_url)
        //     const loading = this.$loading({
        //       lock: true,
        //       text: '用例执行中,请稍候。。。',
        //       spinner: 'el-icon-loading',
        //       background: 'rgba(0, 0, 0, 0.8)',
        //       customClass: 'loading-class'
        //     })
        //     loading.$el.getElementsByTagName('i')[0].style.fontSize = '54px'
        //     loading.$el.getElementsByTagName('p')[0].style.fontSize = '26px'
        //     debugCase(form)
        //         .then(res => {
        //           this.reportData = res.data
        //           console.log(this.reportData, 'this.reportData')
        //           if (type === 'debug') {
        //             this.testReportShow = true
        //             loading.close()
        //           } else {
        //             this.drawer = true
        //             loading.close()
        //           }
        //         }).catch(() => {
        //       loading.close()
        //     })
        //   }
      } catch (err: any) {
        console.log(err)
        ElMessage.info(err || '信息表单填写不完整')

      }
    }


    return {
      urlRef,
      requestBodyRef,
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