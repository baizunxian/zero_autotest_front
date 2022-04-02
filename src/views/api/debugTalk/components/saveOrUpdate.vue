<template>
  <div ref="debugTalkRef" id="test1" style="height: 300px"></div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from "vue";
import {useRoute} from 'vue-router'
import {useDebugTalkApi} from "/@/api/useAutoApi/debugTalk";
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/theme-chrome';
import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url';
import workerPythonUrl from 'ace-builds/src-noconflict/mode-python?url';
import 'ace-builds/src-noconflict/theme-monokai'

ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);
ace.config.setModuleUrl('ace/mode/python', workerPythonUrl);

export default defineComponent({
  name: 'saveOrUpdateDebugTalk',
  components: {},
  setup() {
    const debugTalkRef = ref()
    const route = useRoute()
    const state = reactive({
      editor: null,
      content: '',  // bulk内容
      // headers

    });

    // 初始化Editor
    const initEditor= (data: any) => {
      console.log('editorRef.value', debugTalkRef.value)
      console.log('editorRef.value', data)
      state.editor = ace.edit(debugTalkRef.value, {
        fontSize: 16,
        mode: "ace/mode/python",
        theme: "ace/theme/monokai",
      })

      state.editor.session.setValue(data)
    }

    const initData = () => {
        if (route.query.id) {
          useDebugTalkApi().getDebugTalkInfo({id: route.query.id})
          .then(res => {
            state.content = res.data.debug_talk
            initEditor(state.content)
          })
        }
    }

    onMounted(() => {
      initData()
    })

    return {
      initEditor,
      initData,
      debugTalkRef,
      ...toRefs(state),
    };
  },
})

</script>

<style lang="scss" scoped>
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

table {
  width: 50%;
  border-collapse: collapse;

  tr, td {
    border: 1px solid #d2d2d6;
    padding: 5px;
  }
}

.radio-group {
  margin-bottom: 15px;
}

.title-wrap {
  font-size: 14px;
  color: #8b60f0;
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 12px;

  .title {
    padding: 0 16px;
  }

  .line {
    width: 100px;
    height: 2px;
    border-bottom: 2px dashed #e1e1f5;
  }

  .add-line {
    width: 800px;
    overflow: hidden;
  }
}

.filter-item {
  color: #fff;
  background-color: #5bc0de;
  border-color: #ffffff;
  margin-bottom: 10px;

  &:hover {
    color: #fff;
    background-color: #31b0d5;
    border-color: #ffffff;
  }
}
</style>

<style lang="scss">
/* jsoneditor右上角默认有一个链接,加css去掉了 */
.jsoneditor-poweredBy {
  display: none;
}

.ace_gutter {
  background: #FFF
}

.jsoneditor-vue .jsoneditor {
  border: 0;

  .jsoneditor-menu {
    // background: #ebebeb;
    background-color: #ebebeb;
    border-bottom: 0;

    .jsoneditor-modes {
      color: #000;
    }

    .jsoneditor-outer {
      background: #ebebeb;
    }

    button {
      outline: none;
      background-color: #5bc0de;

      &:hover {
        background-color: #5bc0de;
      }
    }
  }
}
</style>