<template>
  <el-form inline ref="request-form" :model="requestForm" label-width="50px" size="mini" label-position="right">
    <!-- data -->
    <div style="border-bottom: 1px solid #E6E6E6; display: flex; justify-content: space-between">
      <div>
        <el-radio-group
            size="small"
            v-model="requestForm.dataType"
            class="radio-group"
            @change="radioChange"
        >
          <!--      <el-radio label="data">data</el-radio>-->
          <el-radio label="form_data">form-data</el-radio>
          <!--          <el-radio label="json">json</el-radio>-->
          <el-radio label="json">json</el-radio>
          <el-radio label="data">row</el-radio>

          <!--          <el-popover-->
          <!--              v-if="requestForm.dataType === 'data'"-->
          <!--              hide-after="0"-->
          <!--              placement="bottom"-->
          <!--              trigger="click"-->
          <!--              popper-class="popover-class"-->
          <!--              ref="rawPopoverRef">-->
          <!--            <template #reference>-->
          <!--              <el-button size="small" type="text" @click="showPopover" title="add data">-->
          <!--                {{ dataType[activeDataType] }}-->
          <!--                <el-icon v-if="popoverOpen">-->
          <!--                  <ele-ArrowUp></ele-ArrowUp>-->
          <!--                </el-icon>-->
          <!--                <el-icon v-else>-->
          <!--                  <ele-ArrowDown></ele-ArrowDown>-->
          <!--                </el-icon>-->
          <!--              </el-button>-->
          <!--            </template>-->
          <!--            <div class="dropdown-menu">-->
          <!--              <div-->
          <!--                  @click="handleDataType(key)"-->
          <!--                  v-for="(value, key) in dataType"-->
          <!--                  :key="key"-->
          <!--                  class="dropdown-menu-item"-->
          <!--              >-->
          <!--          <span>-->
          <!--            {{ value }}-->
          <!--          </span>-->
          <!--              </div>-->
          <!--            </div>-->

          <!--          </el-popover>-->
        </el-radio-group>
      </div>

      <div style="padding-right: 5px;" v-show="requestForm.dataType === 'json'">
        <el-button style="font-weight: 600; " size="small" type="text" @click="jsonFormat" title="美化JSON">
          Beautify
        </el-button>

<!--        <el-button style="font-weight: 600; " size="small" type="text" @click="jsonCompact" title="压缩JSON">-->
<!--          Compact-->
<!--        </el-button>-->
      </div>
    </div>

    <div style="padding-top: 8px;">
      <div style="border: 1px solid #E6E6E6">
        <v-ace-editor
            v-show="requestForm.dataType === 'data' || requestForm.dataType === 'json'"
            ref="jsonEditorRef"
            v-model:value="rawData"
            :lang="long"
            :options="aceOptions"
            style="height:500px"
        ></v-ace-editor>
      </div>
    </div>
    <!---------------------------params------------------------------------>
    <div v-if="requestForm.dataType === 'params'">
      <div class="block-title">
        <el-button size="small" type="text" @click="addParams" title="add params">
          <el-icon>
            <ele-CirclePlusFilled></ele-CirclePlusFilled>
          </el-icon>
          add
        </el-button>
      </div>
      <div>
        <el-table
            ref="paramsDataTableRef"
            :data="paramsData"
            tooltip-effect="dark"
            border
            style="width: 100%"
        >
          <el-table-column header-align='center'>
            <template #header>
              <strong style="font-size: 14px;">参数名</strong>
            </template>
            <template #default="scope">
              <el-input size="small" v-model="scope.row.key"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="type" width="120" header-align='center'>
            <template #header>
              <strong style="font-size: 14px;">参数类型</strong>
            </template>
            <template #default="scope">
              <el-select size="small" v-model="scope.row.type" placeholder="请选择">
                <el-option
                    v-for="item in dataTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="value" header-align='center'>
            <template #header>
              <strong style="font-size: 14px;">参数值</strong>
            </template>
            <template #default="scope">
              <el-input size="small" v-model="scope.row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" width="50" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button size="small" type="text" @click="deleteParams(scope.$index)">
                <el-icon>
                  <ele-Delete/>
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--    form-data-->
    <div v-if="requestForm.dataType === 'form_data'">
      <div class="block-title">
        <el-button size="small" type="text" @click="addFormData" title="add fromData">
          <el-icon>
            <ele-CirclePlusFilled></ele-CirclePlusFilled>
          </el-icon>
          add
        </el-button>
      </div>
      <div>
        <el-table
            ref="formDataRef"
            :data="formData"
            tooltip-effect="dark"
            border
            style="width: 100%"
        >
          <el-table-column header-align='center'>
            <template #header>
              <strong style="font-size: 14px;">参数名</strong>
            </template>
            <template #default="{row}">
              <el-input size="small" v-model="row.key"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="type" width="120" header-align='center'>
            <template #header>
              <strong style="font-size: 14px;">参数类型</strong>
            </template>
            <template #default="{row}">
              <el-select size="small" v-model="row.type" placeholder="请选择">
                <el-option
                    v-for="item in formDatatypeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="value" header-align='center'>
            <template #header>
              <strong style="font-size: 14px;">参数值</strong>
            </template>
            <template #default="{row, $index}">
              <el-input size="small" v-if="row.type === 'text'" v-model="row.value"></el-input>
              <div v-else class="file-input-container">
                <div class="file-input">
                  <input size="small" type="file" :id="'selectFile' + $index" @change="fileChange($event, row)"
                         class="file-input__native">

                  <el-button v-if="!row.value.name" type="info" size="small" @click="selectFile($index)">选择文件
                  </el-button>
                  <div v-else class="file-input__name">
                    <div class="file-input__name__title" :title="row.value.name">{{ row.value.name }}</div>
                    <el-button class="file-input__name__delete-icon" size="small" type="text"
                               @click="deletedFile(row, $index)">
                      <el-icon>
                        <ele-Close/>
                      </el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" width="50" class-name="small-padding fixed-width">
            <template #default="{$index}">
              <el-button size="small" type="text" @click="deleteFormData($index)">
                <el-icon>
                  <ele-Delete/>
                </el-icon>
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>
  </el-form>
  <!--  <App></App>-->
</template>

<script lang="ts">
import {VAceEditor} from '/@/components/VaceEditor/index.js';
import {defineComponent, onMounted, reactive, ref, toRefs} from "vue";
import {useFileApi} from '/@/api/useSystemApi/file'
import {ElMessage} from "element-plus";
import "/@/assets/jsoneditor/jsoneditor.css";


export default defineComponent({
  components: {VAceEditor},
  name: 'requestBody',
  setup(props, {emit}) {
    const formDataRef = ref()
    const rawPopoverRef = ref()
    const jsonEditorRef = ref()

    const state = reactive({
      requestForm: {
        dataType: 'json',
        headers: {},
      },
      // body
      bodyData: [],
      rawData: JSON.stringify({key: 'value'}),
      paramsData: [],
      hasJsonFlag: false,
      dataTypeOptions: ['string', 'int', 'float', 'boolean'],

      // formData
      formData: [],
      formDatatypeOptions: ['text', 'file'],
      fileData: {},
      // row
      aceOptions: {
        fontSize: 14,
        enableAutoIndent: true, // 启用基本自动完成
        enableSnippets: true, // 启用代码段
        enableLiveAutocompletion: true, // 启用实时自动完成
        printMarginColumn: 30,
        displayIndentGuides: true, // 显示参考线
        // enableEmmet: true, // 启用Emmet
        tabSize: 2, // 标签大小
        useWorker: true, // 使用辅助对象
        showPrintMargin: false, //去除编辑器里的竖线
        // enableMultiselect: true, //     选中多处
        readOnly: false, // 是否只读
        showFoldWidgets: true, // 显示折叠部件
        fadeFoldWidgets: true, // 淡入折叠部件
        wrap: true, //换行
        animatedScroll: true,
        navigateWithinSoftTabs: true,
      },
      editor: null,
      long: 'json',
      // dataType: {json: 'JSON', text: 'Text'},
      // activeDataType: 'json',
      // popoverOpen: false,
    });

    // 初始化表单
    const initForm = (formData: any) => {
      state.requestForm.dataType = formData.type
      initAce(state.requestForm.dataType)
      if (formData.type === 'data') {
        state.rawData = formData.data.replace('/\\n/g', "\n")
        handleHeader('data')
      }

      if (formData.type === 'json') {
        state.rawData = formData.json ? JSON.stringify(formData.json, null, 2) : ''
      }

      if (formData.type === 'form_data') {
        state.formData = formData.form_data ? formData.form_data : []
      }
    }

    // 获取表单数据
    const getFormData = () => {
      let requestData: any = {}
      requestData.type = state.requestForm.dataType
      if (state.requestForm.dataType === 'data') {
        requestData.data = state.rawData
      }
      if (state.requestForm.dataType === 'json') {
        requestData.json = JSON.parse(state.rawData)
      }
      if (state.requestForm.dataType === 'form_data') {
        requestData.form_data = state.formData
      }
      return requestData
    }


    // raw
    const initAce = (value) => {
      if (value == 'data') {
        state.long = 'text'
      }
      if (value == 'json') {
        state.long = 'json'
      }
    }

    const radioChange = (value: any) => {
      state.requestForm.dataType = value
      if (value == 'form_data') {
        handleHeader('form_data')
      } else {
        initAce(value)
        handleHeader(state.requestForm.dataType)

      }
    }
    // const handleDataType = (data: any) => {
    //   state.popoverOpen = !state.popoverOpen
    //   rawPopoverRef.value.hide()
    //   state.activeDataType = data
    //   handleHeader(data)
    // }

    const handleHeader = (dataType: any) => {
      let headerData: any = {key: 'Content-Type'}
      if (dataType === 'data') {
        headerData.value = 'text/plain'
      }
      emit('updateHeader', headerData, dataType === 'form_data')
    }

    const showPopover = () => {
      state.popoverOpen = !state.popoverOpen
    }
    // 美化json
    const jsonFormat = () => {
      try {
        state.rawData = JSON.stringify(JSON.parse(state.rawData), null, 2);
      } catch {
        ElMessage.info('JSON格式错误！')
      }
    }
    // 压缩json
    const jsonCompact = () => {
      try {
        state.rawData = JSON.stringify(JSON.parse(state.rawData));
      } catch {
        ElMessage.info('JSON格式错误！')
      }
    }

    // bodyData
    const addData = () => {
      state.bodyData.push({key: '', type: 'string', value: ''})
    }
    const deleteData = (index: number) => {
      state.bodyData.splice(index, 1)
    }

    // params
    const addParams = () => {
      state.paramsData.push({key: '', type: 'string', value: ''})
    }
    const deleteParams = (index: number) => {
      state.paramsData.splice(index, 1)
    }

    // formData
    const addFormData = () => {
      state.formData.push({key: 'test', type: 'Text', value: ''})
    }
    // 选择文件时触发，上传文件，回写地址
    const fileChange = (e: any, row: any) => {
      state.fileData = e.target.files[0]
      let file: any = e.target.files[0]
      let formData = new FormData
      formData.append('name', file.name)
      formData.append('file', file)
      useFileApi().upload(formData)
          .then((res: any) => {
            row.value = {abspath: res.data.abspath, name: res.data.name}
          })

    }
    // 删除文件处理
    const deletedFile = (row: any, index: number) => {
      let fileRef = document.getElementById('selectFile' + index)
      useFileApi().deleted({name: row.value.name})
      row.value = {}
      if (fileRef) fileRef.value = ''
    }
    // 删除
    const deleteFormData = (index: number) => {
      state.formData.splice(index, 1)
    }
    // 选择文件
    const selectFile = (index: number) => {
      let fileRef = document.getElementById('selectFile' + index)
      if (fileRef) fileRef.click()
    }
    onMounted(() => {
    })

    return {
      initForm,
      radioChange,
      getFormData,
      addData,
      deleteData,
      addParams,
      deleteParams,
      deletedFile,
      formDataRef,
      rawPopoverRef,
      jsonEditorRef,
      jsonFormat,
      jsonCompact,
      deleteFormData,
      selectFile,
      fileChange,
      addFormData,
      showPopover,
      ...toRefs(state),
    }
//
  },
});
</script>

<style lang="scss" scoped>
:deep(.jsoneditor-vue) {
  height: 800px;
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

:deep(.radio-group) {
  margin-bottom: 4px;
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

.json-editor-vue {
  .jsoneditor {
    border: 0;
  }

  .jsoneditor-menu {
    border-bottom: 0;
    background-color: #ebebeb;
    border-bottom: 0;

    .jsoneditor-modes {
      color: #000;
    }

    .jsoneditor-outer {
      background: #ebebeb;
    }

  }

  button {
    outline: none;
    background-color: #5bc0de;

    &:hover {
      background-color: #5bc0de;
    }
  }
}

json-editor-vue .jsoneditor {
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


  }
}

.ace-jsoneditor .ace_gutter {
  background: #ffffff
}

.ace-jsoneditor .ace_text-layer {
  color: black;
}

.block-title {
  position: relative;
  padding-left: 11px;
  font-size: 14px;
  font-weight: 600;
  height: 28px;
  line-height: 28px;
  background: #f7f7fc;
  color: #333333;
}


.file-input-container {
  display: inline-block;
  max-width: 100%;

  .file-input {
    display: flex;
    align-items: center;
    padding: var(--spacing-xs);

    .file-input__native {
      opacity: 0;
      position: absolute;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    .file-input__fake {
      position: relative;
      height: 20px;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      background-color: #F2F2F2;
      min-width: 100px;
      color: #6B6B6B;
      font-weight: 600;

      &:hover {
        color: #212121;
        background-color: #E6E6E;
      }
    }

    .btn {
      box-sizing: border-box;
      border-radius: 4px;
    }

    .file-input__name {
      box-sizing: border-box;
      display: flex;
      min-width: 0;
      height: 24px;
      align-items: center;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      font-size: 12px;
      font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica, Arial, sans-serif;
      color: #212121;
      background-color: transparent;
      padding: 4px 2px;

      .file-input__name__title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-input__name__delete-icon {
        display: flex;
        align-items: center;
        margin-left: 8px;
        padding-right: 2px;
        cursor: pointer;
        color: #212121;
      }
    }
  }
}

.dropdown-menu {
  padding: 4px 0;
  box-sizing: border-box;
  background-color: #F9F9F9;
  border-radius: 4px;
  border: 1px solid #EDEDED;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);

  .dropdown-menu-item {
    position: relative;
    box-sizing: border-box;
    height: 32px;
    color: #212121;
    font-size: 12px;
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica, Arial, sans-serif;;
    display: flex;
    align-items: center;
    cursor: default;
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    padding: 0 16px;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:hover {
      background-color: #EDEDED;
    }
  }
}


</style>
<style>
.popover-class {
  padding: 0 !important;
}
</style>