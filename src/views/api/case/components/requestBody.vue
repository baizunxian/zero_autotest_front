<template>
  <el-form inline ref="request-form" :model="requestForm" label-width="50px" size="mini" label-position="right">
    <!-- data -->
    <el-radio-group size="small" v-model="requestForm.dataType" class="radio-group">
      <el-radio label="data">data</el-radio>
      <el-radio label="json">json</el-radio>
      <el-radio label="params">params</el-radio>
      <el-radio label="form_data">form-data</el-radio>
      <!--      <el-radio label="form-data">form-data</el-radio>-->
    </el-radio-group>

    <!---------------------------params------------------------------------>
    <div v-if="requestForm.dataType === 'data'">
      <div class="block-title">
        <el-button size="small" type="text" @click="addData" title="add data">
          <el-icon>
            <ele-CirclePlusFilled></ele-CirclePlusFilled>
          </el-icon>
          add
        </el-button>
      </div>
      <div>
        <el-table
            ref="bodyDataTableRef"
            :data="bodyData"
            header-align='center'
            border
            tooltip-effect="dark"
            style="width: 100%"
        >
          <!-- <el-table-column type="selection" width="55" label="Option">
          </el-table-column> -->
          <el-table-column label="Key" header-align='center'>
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
            <template v-slot="scope">
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
            <template v-slot="scope">
              <el-input size="small" v-model="scope.row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" width="50" class-name="small-padding fixed-width">
            <template v-slot="scope">
              <el-button size="small" type="text" @click="deleteData(scope.$index)">
                <el-icon>
                  <ele-Delete/>
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <JsonEditorVue v-show="requestForm.dataType === 'json'" class="editor" v-model="jsonData" style="height: 500px"/>

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
                  <!--                  <el-button v-else :title="fileData.name">{{ fileData.name }}-->
                  <!--                    <el-icon>-->
                  <!--                        <ele-Delete/>-->
                  <!--                      </el-icon>-->
                  <!--                  </el-button>-->
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
              <!--              <input @change="test($event)" v-if="row.type === 'File'" type="file" :id="$index + 'files'">-->
              <!--              <input v-if="row.type === 'File'" :id="$index + 'files'" type="file" v-model="row.value"></input>-->
              <!--              <input v-if="row.type === 'File'" :id="$index + 'files'" type="file"></input>-->

              <!--              <el-input v-else v-model="row.value"></el-input>-->
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
import JsonEditorVue from '/@/components/VaceEditor/json-editor.vue'

import {defineComponent, reactive, ref, toRefs} from "vue";
import {useFileApi} from '/@/api/useSystemApi/file'
//
export default defineComponent({
  components: {JsonEditorVue},
  name: 'requestBody',
  setup() {
    const formRef = ref()
    const aceEditorRef = ref()
    const formDataRef = ref()

    const state = reactive({
      requestForm: {
        dataType: 'json',
        headers: {},
      },
      // body
      bodyData: [],
      jsonData: {key: 'value'},
      paramsData: [],
      hasJsonFlag: false,
      dataTypeOptions: ['string', 'int', 'float', 'boolean'],

      // formData
      formData: [],
      formDatatypeOptions: ['text', 'file'],
      fileData: {},

    });

    const editorInit = () => {
      state.jsonData = {test1: 'test2'}
      // aceEditorRef.value.initData(state.jsonData)
    }
    // 初始化表单
    const initForm = (formData: any) => {
      console.log(formData, ' formData')
      state.requestForm.dataType = formData.type
      if (formData.type === 'json') {
        state.jsonData = formData.json
      }
      if (formData.type === 'params') {
        if (formData.params.length > 0) {
          formData.params.forEach(params => {
            params['value'] = params.value.toString()
          })
        }
        state.paramsData = formData.params
      }
      if (formData.type === 'data') {
        state.bodyData = formData.data
      }
      if (formData.type === 'form_data') {
        state.formData = formData.form_data ? formData.form_data : []
      }
    }


    // 获取表单数据
    const getFormData = () => {
      let requestData = {}
      requestData.type = state.requestForm.dataType
      if (state.requestForm.dataType === 'json') {
        // if (!state.hasJsonFlag) throw new Error('json 格式错误!')
        requestData.json = state.jsonData
      }
      if (state.requestForm.dataType === 'data') {
        requestData.data = state.bodyData
      }
      if (state.requestForm.dataType === 'params') {
        requestData.params = state.paramsData
      }
      if (state.requestForm.dataType === 'form_data') {
        requestData.form_data = state.formData
      }
      state.hasJsonFlag = true
      return requestData
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
    // onMounted(() => {
    //   editorInit()
    // })

    return {
      formRef,
      editorInit,
      initForm,
      getFormData,
      addData,
      deleteData,
      addParams,
      deleteParams,
      deletedFile,
      aceEditorRef,
      formDataRef,
      deleteFormData,
      selectFile,
      fileChange,
      addFormData,
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
</style>