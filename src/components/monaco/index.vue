<template>
  <div class="monaco-editor" ref="monacoEditorRef"></div>
</template>
<script lang="ts">
import * as monaco from 'monaco-editor'
import {reactive, ref, watch, onMounted, toRefs, toRaw} from 'vue'
import {language as pythonLanguage} from 'monaco-editor/esm/vs/basic-languages/python/python.js';


export default {
  name: 'monaco-editor',
  props: {
    // 展示的字符串
    value: {
      type: String,
      default: '',
    },
    // 是否启用比对
    isDiff: {
      type: Boolean,
      default: false,
    },
    // 比对需要的源数据
    oldString: {
      type: String,
      default: '',
    },
    // 比对需要的新数据
    newString: {
      type: String,
      default: '',
    },
    // 语言
    long: {
      type: String,
      default: 'python',
    },
    // 主题
    theme: {
      type: String,
      default: 'vs-dark',
    }
  },
  setup(props: any) {
    const monacoEditorRef = ref()
    const editor: any = ref(null)
    const originalEditor: any = ref(null)
    const modifiedEditor: any = ref(null)
    const state = reactive({
      options: {
        value: props.value,  // 值
        theme: props.theme,   // 主题
        autoIndex: true,  //
        language: props.long, // 语言类型
        tabCompletion: 'on',
        cursorSmoothCaretAnimation: true,
        formatOnPaste: true,
        mouseWheelZoom: true,
        folding: true, //代码折叠
        autoClosingBrackets: 'always',
        autoClosingOvertype: 'always',
        autoClosingQuotes: 'always',
        automaticLayout: 'always',
      }
    })

    const initEditor = () => {
      // 初始化编辑器，确保dom已经渲染
      monaco.languages.register({id: 'python'})
      monaco.languages.registerCompletionItemProvider(
          'python',
          {
            provideCompletionItems() {
              let suggestions: any = []
              pythonLanguage.keywords.forEach((item: any) => {
                suggestions.push({
                  label: item,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: item
                });
              })
              return {
                // suggestions: cloneDeep(vCompletion),//自定义代码补全
                suggestions: suggestions
              }
            },
            triggerCharacters: ['.'],
          }
      )
      if (props.isDiff) {
        editor.value = monaco.editor.createDiffEditor(monacoEditorRef.value, state.options)
        originalEditor.value = monaco.editor.createModel(props.value, props.long)
        modifiedEditor.value = monaco.editor.createModel(props.value, props.long)
        toRaw(editor.value).setModel({
          original: toRaw(originalEditor.value),
          modified: toRaw(modifiedEditor.value)
        })
      } else {
        editor.value = monaco.editor.create(monacoEditorRef.value, state.options)
      }


      editor.value.onDidChangeModelContent((val: any) => {
        console.log(val)
      })
    }

    // 获取value
    const getValue = () => {
      return toRaw(editor.value).getValue()
    }

    watch(
        () => props.value,
        (newVal) => {
          toRaw(editor.value).setValue(newVal)
        },
        {deep: true}
    )
    watch(
        () => props.long,
        (newVal) => {
          monaco.editor.setModelLanguage(toRaw(editor.value).getModel(), newVal)
        },
        {deep: true}
    )
    watch(
        () => props.oldString,
        (newVal) => {
          toRaw(originalEditor.value).setValue(newVal)
        },
        {deep: true}
    )
    watch(
        () => props.newString,
        (newVal) => {
          toRaw(modifiedEditor.value).setValue(newVal)
        },
        {deep: true}
    )

    onMounted(() => {
      initEditor()
    })

    return {
      getValue,
      initEditor,
      monacoEditorRef,
      ...toRefs(state)
    }
  }
}

</script>
<style scoped>
.monaco-editor {
  width: 100%;
  height: 100%;
}
</style>