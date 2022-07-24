<template>
  <div id="codeBox" ref="monacoEditorRef"></div>
</template>
<script lang="ts">
import * as monaco from 'monaco-editor'
import {reactive, ref, watch, onMounted, toRefs} from 'vue'
import {language as pythonLanguage} from 'monaco-editor/esm/vs/basic-languages/python/python.js';
import {toRaw} from 'vue-demi'

export default {
  name: 'monaco-editor',
  props: {
    value: {
      type: String,
      default: '',
    },
    long: {
      type: String,
      default: 'python',
    }
  },
  setup(props: any, {emit}: any) {
    const monacoEditorRef = ref()
    const editor: any = ref(null)
    const state = reactive({
      options: {
        value: props.value,
        theme: 'vs-dark',
        autoIndex: true,
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
            provideCompletionItems(model: any, position: any) {
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

      editor.value = monaco.editor.create(monacoEditorRef.value, state.options)

      // 监听值的变化
      editor.value.onDidChangeModelContent((val) => {
        //给父组件实时返回最新文本
        // emit('contentChange', toRaw(editor.value).getValue())
        // emit('update:value', toRaw(editor.value).getValue())
        console.log(toRaw(editor.value).getValue(), '---------------value1')

      })
    }

    watch(
        () => props.value,
        (newVal, oldVal) => {
          toRaw(editor.value).setValue(newVal)
        },
        {deep: true}
    )
    watch(
        () => props.long,
        (newVal, oldVal) => {
          console.log(newVal)
        },
        {deep: true}
    )

    onMounted(() => {
      initEditor()
    })

    return {
      initEditor,
      monacoEditorRef,
      ...toRefs(state)
    }
  }
}

// const cloneDeep = (suggestions) => {
//   return JSON.parse(JSON.stringify(suggestions))
// }
// const hoverTips = (arr, word) => {
//   let tip = ''
//   arr.forEach((item) => {
//     if (word == item.text) {
//       tip = {
//         contents: [{value: item.title || ''}, {value: item.content || ''}],
//       }
//     }
//   })
//   return tip
// }


</script>
<style scoped>
#codeBox {
  width: 100%;
  height: 100%;
}
</style>