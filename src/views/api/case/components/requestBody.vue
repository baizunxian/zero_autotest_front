<template>
  <el-form inline ref="request-form" :model="requestForm" label-width="50px" size="mini" label-position="right">
    <!-- data -->
    <el-radio-group v-model="requestForm.dataType" class="radio-group">
      <el-radio label="data">data</el-radio>
      <el-radio label="json">json</el-radio>
      <el-radio label="params">params</el-radio>
      <!--      <el-radio label="form-data">form-data</el-radio>-->
    </el-radio-group>

    <!---------------------------params------------------------------------>
    <div v-if="requestForm.dataType === 'data'">
      <el-button class="filter-item" type="primary" @click="addData">Add Data</el-button>
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
              <el-button size="small" type="text" @click="deleteData(scope.row,scope.index)">
                <el-icon>
                  <ele-Delete/>
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <JsonEditorVue v-show="requestForm.dataType === 'json'" class="editor" v-model="jsonData" @blur="validate" />

    <!---------------------------params------------------------------------>
    <div v-if="requestForm.dataType === 'params'">
      <div>
        <el-button class="filter-item" type="primary" @click="addParams">Add Params</el-button>
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
              <el-button size="small" type="text" @click="deleteParams(scope.row,scope.index)">
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

import {defineComponent, reactive, ref, toRefs, onMounted} from "vue";
//
export default defineComponent({
  components: {JsonEditorVue},
  name: 'requestBody',
  setup() {
    const formRef = ref()
    const aceEditorRef = ref()

    const state = reactive({
      requestForm: {
        dataType: 'json',
        headers: {},
      },
      bodyData: [],
      jsonData: {key: 'value'},
      paramsData: [],
      hasJsonFlag: false,
      dataTypeOptions: ['string', 'int', 'float', 'boolean'],

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
    const deleteData = (row, index) => {
      state.bodyData.splice(index, 1)
    }

    // params
    const addParams = () => {
      state.paramsData.push({key: '', type: 'string', value: ''})
    }
    const deleteParams = (row, index) => {
      state.paramsData.splice(index, 1)
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
      aceEditorRef,
      ...toRefs(state),
    }
//
  },
});
</script>

<style lang="scss" scoped>
::v-deep .jsoneditor-vue {
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

.json-editor-vue  {
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
</style>