<template>
  <el-form inline ref="request-form" :model="requestForm" label-width="50px" size="mini" label-position="right">
    <!-- data -->
    <el-radio-group size="small" v-model="requestForm.dataType" class="radio-group">
      <el-radio label="data">data</el-radio>
      <el-radio label="json">json</el-radio>
      <el-radio label="params">params</el-radio>
      <el-radio label="form-data">form-data</el-radio>
      <!--      <el-radio label="form-data">form-data</el-radio>-->
    </el-radio-group>

    <!---------------------------params------------------------------------>
    <div v-if="requestForm.dataType === 'data'">
      <el-button size="small" class="filter-item" type="primary" @click="addData">Add Data</el-button>
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
      <div>
        <el-button size="small" class="filter-item" type="primary" @click="addParams">Add Params</el-button>
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
    <div v-if="requestForm.dataType === 'form-data'">
      <div>
        <el-button class="filter-item" type="primary" @click="addFormData">Add FromData</el-button>
        <el-button class="filter-item" type="primary" @click="addFormData1">Add FromData</el-button>
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
              <el-input v-model="row.key"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="type" width="120" header-align='center'>
            <template #header>
              <strong style="font-size: 14px;">参数类型</strong>
            </template>
            <template #default="{row}">
              <el-select v-model="row.type" placeholder="请选择">
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
              <div class="file-input-container">
                <div class="file-input">
                  <input type="file" ref="fileInputRef" @change="test" class="file-input__native">
                  <div v-if="!fileData.name" @click="selectFile" class="file-input__fake">
                    <span>Select Files</span>
                  </div>
                  <div class="file-input__name">
                    <div class="file-input__name__title" :title="fileData.name">{{fileData.name}}</div>
                    <el-button size="small" type="text" @click="deletedFile()">
                      <el-icon>
                        <ele-Delete/>
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
            <template #default="{row, $index}">
              <el-link :underline="false" type="primary" @click="deleteParams(row, $index)"><i
                  class="el-icon-delete"></i></el-link>
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
//
export default defineComponent({
  components: {JsonEditorVue},
  name: 'requestBody',
  setup() {
    const formRef = ref()
    const aceEditorRef = ref()
    const formDataRef = ref()
    const fileInputRef = ref()

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
      formData: [{key: 'test', type: 'File', value: ''}],
      formDatatypeOptions: ['Text', 'File'],
      fileData: {},

    });

    const editorInit = () => {
      state.jsonData = {test1: 'test2'}
      // aceEditorRef.value.initData(state.jsonData)
    }
    // 初始化表单
    const initForm = (formData) => {
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
    }


    // 获取表单数据
    const getFormData = () => {
      let requestData = {}
      requestData.type = state.requestForm.dataType
      if (state.requestForm.dataType === 'json') {
        // if (!state.hasJsonFlag) throw new Error('json 格式错误!')
        requestData.json = state.jsonData
      }
      if (state.requestForm.type === 'data') {
        requestData.data = state.bodyData
      }
      if (state.requestForm.type === 'params') {
        requestData.params = state.paramsData
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
    const test = (e: any) => {
      state.fileData = e.target.files[0]
      console.log(formDataRef.value)
      console.log(e.target.files[0])
    }
    const deletedFile = () => {
      fileInputRef.value.value = ''
      state.fileData = {}
    }

    const selectFile = () => {
      fileInputRef.value.click()
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
      fileInputRef,
      selectFile,
      test,
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
    }

    .file-input__name {
      box-sizing: border-box;
      display: flex;
      min-width: 0;
      height: 20px;
      align-items: center;
      border-radius: 4px;
      border: 1px solid;
      font-size: var(--text-size-m);
      font-family: var(--text-family-default);
      color: var(--content-color-primary);
      background-color: transparent;
      padding: var(--spacing-xs) 2px;

      .file-input__name__title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>