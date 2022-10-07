<template>
  <el-collapse-transition>
    <div v-show="data.showDetail" @click.stop="">
      <el-divider style="margin: 10px 0 5px 0;"/>
      <el-row>
        <el-col :span="18">
          <div style="border: 1px solid #E6E6E6">
            <monaco-editor
                style="height: 500px"
                ref="monacoEditRef"
                v-model:value="data.value"
            ></monaco-editor>
          </div>
        </el-col>

        <el-col :span="6">
          <div style="padding: 8px;">
            <div>代码片段</div>
            <div>
              <el-button type="text" @click="headers('get')">获取请求头</el-button>
            </div>
            <div>
              <el-button type="text" @click="environment('get')">获取环境变量</el-button>
            </div>
            <div>
              <el-button type="text" @click="variables('get')">获取变量</el-button>
            </div>
            <div>
              <el-button type="text" @click="headers('set')">设置请求头</el-button>
            </div>
            <div>
              <el-button type="text" @click="environment('set')">设置环境变量</el-button>
            </div>
            <div>
              <el-button type="text" @click="variables('set')">设置变量</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
  </el-collapse-transition>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';
import monacoEditor from "/@/components/monaco/index.vue";


export default defineComponent({
  name: 'scriptController',
  components: {
    monacoEditor,
  },
  props: {
    data: Object
  },
  emits: ['update:data'],
  setup(props: any) {
    const state = reactive({
      // data
      showDetail: false
    });

    // 设置请求头
    const headers = (type: string) => {
      let content = ""
      let setContent = props.data.value ? '\nzero.headers.set("key", "value")' : 'zero.headers.set("key", "value")'
      let getContent = props.data.value ? '\nzero.headers.get("key")' : 'zero.headers.get("key")'
      content = type == "set" ? setContent : getContent
      props.data.value += content
    }

    // 设置环境变量
    const environment = (type: string) => {
      let content = ""
      let setContent = props.data.value ? '\nzero.environment.set("key", "value")' : 'zero.environment.set("key", "value")'
      let getContent = props.data.value ? '\nzero.environment.get("key")' : 'zero.environment.get("key")'
      content = type == "set" ? setContent : getContent
      props.data.value += content
    }

    const variables = (type: string) => {
      let content = ""
      let setContent = props.data.value ? '\nzero.variables.set("key", "value")' : 'zero.variables.set("key", "value")'
      let getContent = props.data.value ? '\nzero.variables.get("key")' : 'zero.variables.get("key")'
      content = type == "set" ? setContent : getContent
      props.data.value += content
    }


    // 删除节点
    return {
      headers,
      environment,
      variables,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>

// el-terr
:deep(.el-tree-node__content) {
  height: 100%;
  //max-height: 26px;
  margin-top: 6px;
  vertical-align: center;
  -webkit-box-align: center;
  display: flex;
  cursor: pointer;
  align-items: center;
}

:deep(.el-card__body) {
  padding: 5px 10px;
}

.zero-base-card {
  min-height: 36px;

  .zero-base-header {
    min-height: 26px;

    .el-tag--small {
      height: 24px;
    }

    .el-step__icon {
      width: 20px;
      height: 20px;
      font-size: 12px;
    }

    .header-right {
      //margin-top: 1px;
      float: right;
      z-index: 1;
    }
  }
}

</style>