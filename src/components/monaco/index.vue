<template>
  <div class="box-body" :style="'height:'+props.height+'px;'">
    <div class="time">
      <el-tooltip :content="'插入当前时间'" placement="bottom" effect="light">
        <span
            class="icon iconfont icon-shijian"
            @click="range('\n#set( Time = Power.currentDateTime())')"
        ></span>
      </el-tooltip>
      <el-tooltip :content="'添加注释'" placement="bottom" effect="light">
        <el-icon class="icon fa" @click="tips()">
          <SemiSelect/>
        </el-icon>
      </el-tooltip>
    </div>
    <div id="codeBox"></div>
  </div>
</template>
<script setup>
import * as monaco from 'monaco-editor'
import {reactive, defineProps, ref, watch, onMounted} from 'vue'

const emit = defineEmits(['contentChange'])
// import vCompletion from './sql.js'//引入补全代码文件
import {toRaw} from 'vue-demi'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  height: {
    type: [String, Number],
    default: 500,
  },
})

const tips = () => {
  range(`
#--注释--#
      `)
}
const dataList = reactive({})
const showInit = ref(true)
const editor = ref(null)
const provider = ref(null)
const mylang = ref(null)
const color = ref(null)
const hover = ref(null)
watch(
    () => props.value,
    (newVal, oldVal) => {
      toRaw(editor.value).setValue(newVal)
    },
    {deep: true}
)
const cloneDeep = (suggestions) => {
  return JSON.parse(JSON.stringify(suggestions))
}
const hoverTips = (arr, word) => {
  let tip = ''
  arr.forEach((item) => {
    if (word == item.text) {
      tip = {
        contents: [{value: item.title || ''}, {value: item.content || ''}],
      }
    }
  })
  return tip
}
const initEditor = () => {
  // 初始化编辑器，确保dom已经渲染
  monaco.languages.register({id: 'MyLanguage'})
  // provider.value = monaco.languages.registerCompletionItemProvider(
  //     'MyLanguage',
  //     {
  //       provideCompletionItems(model, position) {
  //         return {
  //           suggestions: cloneDeep(vCompletion),//自定义代码补全
  //         }
  //       },
  //       triggerCharacters: ['.'],
  //     }
  // )
  mylang.value = monaco.languages.setLanguageConfiguration('MyLanguage', {
    //自定义括号，冒号等符号的补全规则
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      {open: '{', close: '}'},
      {open: '[', close: ']'},
      {open: '(', close: ')'},
      {open: '"', close: '', notIn: ['string']},
      {open: "'", close: '', notIn: ['string', 'comment']},
      {open: '`', close: '`', notIn: ['string', 'comment']},
    ],
  })
  color.value = monaco.languages.setMonarchTokensProvider('MyLanguage', {
    //自定义文本颜色
    ignoreCase: true,
    tokenizer: {
      root: [
        [
          /pageData|currentUser/,
          {token: 'keyword'},
        ], //蓝色
        [
          /[+]|[-]|[*]|[/]|[%]|[>]|[<]|[=]|[!]|[:]|[&&]|[||]/,
          {token: 'string'},
        ], //红色
        [/'.*?'|".*?"/, {token: 'string.escape'}], //橙色
        [/#--.*?\--#/, {token: 'comment'}], //绿色
        [/null/, {token: 'regexp'}], //粉色
        [/[{]|[}]/, {token: 'type'}], //青色
        // [/[\u4e00-\u9fa5]/, { token: 'predefined' }],//亮粉色
        // [/''/, { token: 'invalid' }],//红色
        // [/[\u4e00-\u9fa5]/, { token: 'number.binary' }],//浅绿
        [/(?!.*[a-zA-Z])[0-9]/, {token: 'number.hex'}], //浅绿
        [/[(]|[)]/, {token: 'number.octal'}], //浅绿
        // [/[\u4e00-\u9fa5]/, { token: 'number.float' }],//浅绿
      ],
    },
  })
  hover.value = monaco.languages.registerHoverProvider('MyLanguage', {
    //自定义文字悬浮提示
    provideHover: (model, position) => {
      if (model.getWordAtPosition(position) != null) {
        const word = model.getWordAtPosition(position).word
        let arr = [
          {
            text: 'SqlUtil', //悬浮文字
            title: '数据库操作', //标题
            content: '对数据进行操作，支持sql,addConditionExist等操作', //提示内容
          },
        ]
        return hoverTips(arr, word)
      }
    },
  })
  editor.value = monaco.editor.create(document.getElementById('codeBox'), {
    //初始化配置
    value: props.value,
    theme: 'vs-dark',
    autoIndex: true,
    language: 'python', // 语言类型
    tabCompletion: 'on',
    cursorSmoothCaretAnimation: true,
    formatOnPaste: true,
    mouseWheelZoom: true,
    folding: true, //代码折叠
    autoClosingBrackets: 'always',
    autoClosingOvertype: 'always',
    autoClosingQuotes: 'always',
    automaticLayout: 'always',
  })

  // 监听值的变化
  editor.value.onDidChangeModelContent((val) => {
    //给父组件实时返回最新文本
    emit('contentChange', toRaw(editor.value).getValue())
  })
}
onMounted(() => {
  initEditor()
})
</script>
<style scoped>
#codeBox {
  width: 100%;
  height: 92%;
}

.code-container {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border: 1px solid #eaeaea;
}

.monaco-editor .scroll-decoration {
  box-shadow: none;
}

.time {
  width: 100%;
  border: 1px solid #ccc;
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  height: 8%;
  display: flex;
  align-items: center;
}

.icon {
  display: inline-block;
  font-size: 20px !important;
  margin: 0 10px;
}

.icon:hover {
  color: #ffa500;
  font-weight: bold;
}

.main {
  padding: 0 !important;
}
</style>