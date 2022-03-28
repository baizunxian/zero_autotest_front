<template>
  <el-form inline ref="request-form" :model="request" label-width="50px" size="mini" label-position="right">
    <!-- data -->
    <el-radio-group v-model="request.type" size="mini" class="radio-group" @change="changeRadio">
      <el-radio label="data">data</el-radio>
      <el-radio label="json">json</el-radio>
      <el-radio label="params">params</el-radio>
      <!--      <el-radio label="form-data">form-data</el-radio>-->
    </el-radio-group>
    <div v-if="request.type === 'data'">
      <el-button class="filter-item" type="primary" @click="addData">Add Data</el-button>
      <div>
        <el-table
            :header-cell-style="tabelheadercolor"
            ref="multipleTable"
            :data="testdata"
            header-align='center'
            border
            tooltip-effect="dark"
            style="width: 100%"
        >
          <!-- <el-table-column type="selection" width="55" label="Option">
          </el-table-column> -->
          <el-table-column label="Key" header-align='center'>
            <template slot="header">
              <strong style="font-size: 14px;">参数名</strong>
            </template>
            <template slot-scope="{row}">
              <el-input v-model="row.key"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="type" width="120" header-align='center'>
            <template slot="header">
              <strong style="font-size: 14px;">参数类型</strong>
            </template>
            <template slot-scope="{row}">
              <el-select v-model="row.type" placeholder="请选择">
                <el-option
                    v-for="item in typeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="value" header-align='center'>
            <template slot="header">
              <strong style="font-size: 14px;">参数值</strong>
            </template>
            <template slot-scope="{row}">
              <el-input v-model="row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" width="50" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-link :underline="false" type="primary" @click="deleteData(row,$index)"><i class="el-icon-delete"></i>
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- json -->
    <vue-json-editor
        v-if="request.type === 'json'"
        v-model="json"
        :showBtns="false"
        :mode="'code'"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
        @has-error="onError"
        lang="zh"/>
    <!-- params -->
    <div v-if="request.type === 'params'">
      <div>
        <el-button class="filter-item" type="primary" @click="addParams">Add Params</el-button>
      </div>
      <div>
        <el-table
            :header-cell-style="tabelheadercolor"
            ref="multipleTable"
            :data="paramsdata"
            tooltip-effect="dark"
            border
            style="width: 100%"
        >
          <el-table-column header-align='center'>
            <template slot="header">
              <strong style="font-size: 14px;">参数名</strong>
            </template>
            <template slot-scope="{row}">
              <el-input v-model="row.key"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="type" width="120" header-align='center'>
            <template slot="header">
              <strong style="font-size: 14px;">参数类型</strong>
            </template>
            <template slot-scope="{row}">
              <el-select v-model="row.type" placeholder="请选择">
                <el-option
                    v-for="item in typeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="value" header-align='center'>
            <template slot="header">
              <strong style="font-size: 14px;">参数值</strong>
            </template>
            <template slot-scope="{row}">
              <el-input v-model="row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" width="50" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-link :underline="false" type="primary" @click="deleteParams(row,$index)"><i
                  class="el-icon-delete"></i></el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--    <div v-show="request.type === 'form-data'">-->
    <!--      <div>-->
    <!--        <el-button class="filter-item" type="primary" @click="addFormData">Add FromData</el-button>-->
    <!--        <el-button class="filter-item" type="primary" @click="addFormData1">Add FromData</el-button>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <el-table-->
    <!--            :header-cell-style="tabelheadercolor"-->
    <!--            ref="formDataRef"-->
    <!--            :data="formData"-->
    <!--            tooltip-effect="dark"-->
    <!--            border-->
    <!--            style="width: 100%"-->
    <!--        >-->
    <!--          <el-table-column header-align='center'>-->
    <!--            <template slot="header">-->
    <!--              <strong style="font-size: 14px;">参数名</strong>-->
    <!--            </template>-->
    <!--            <template slot-scope="{row}">-->
    <!--              <el-input v-model="row.key"></el-input>-->
    <!--            </template>-->
    <!--          </el-table-column>-->

    <!--          <el-table-column prop="type" width="120" header-align='center'>-->
    <!--            <template slot="header">-->
    <!--              <strong style="font-size: 14px;">参数类型</strong>-->
    <!--            </template>-->
    <!--            <template slot-scope="{row}">-->
    <!--              <el-select v-model="row.type" placeholder="请选择">-->
    <!--                <el-option-->
    <!--                    v-for="item in formDatatypeOptions"-->
    <!--                    :key="item"-->
    <!--                    :label="item"-->
    <!--                    :value="item">-->
    <!--                </el-option>-->
    <!--              </el-select>-->
    <!--            </template>-->
    <!--          </el-table-column>-->

    <!--          <el-table-column prop="value" header-align='center'>-->
    <!--            <template slot="header">-->
    <!--              <strong style="font-size: 14px;">参数值</strong>-->
    <!--            </template>-->
    <!--            <template slot-scope="{row, $index}">-->
    <!--              &lt;!&ndash;              <input type="file" :id="$index + 'files'">&ndash;&gt;-->
    <!--              &lt;!&ndash;              <input v-if="row.type === 'File'" :id="$index + 'files'" type="file" v-model="row.value"></input>&ndash;&gt;-->
    <!--&lt;!&ndash;              <input v-if="row.type === 'File'" :id="$index + 'files'" type="file"></input>&ndash;&gt;-->
    <!--              <el-upload-->
    <!--                  v-if="row.type === 'File'"-->
    <!--                  -->
    <!--                  class="upload-demo"-->
    <!--                  action="https://jsonplaceholder.typicode.com/posts/"-->
    <!--                  :on-change="handleChange"-->
    <!--                  :file-list="fileList">-->
    <!--                <el-button size="small" type="primary">点击上传</el-button>-->
    <!--                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
    <!--              </el-upload>-->
    <!--              <el-input v-else v-model="row.value"></el-input>-->
    <!--            </template>-->
    <!--          </el-table-column>-->
    <!--          <el-table-column align="center" width="50" class-name="small-padding fixed-width">-->
    <!--            <template slot-scope="{row,$index}">-->
    <!--              <el-link :underline="false" type="primary" @click="deleteParams(row,$index)"><i-->
    <!--                  class="el-icon-delete"></i></el-link>-->
    <!--            </template>-->
    <!--          </el-table-column>-->
    <!--        </el-table>-->
    <!--      </div>-->
    <!--    </div>-->
  </el-form>
</template>

<script>
import {debugtestcase} from '@/api/case'
import clipboard from '@/utils/clipboard'
import vueJsonEditor from 'vue-json-editor'

export default {
  name: 'request',
  components: {vueJsonEditor},
  data() {
    return {
      activeName: 'body',
      assertlist: [
        {formId: Math.random().toFixed(10)}
      ],
      testdata: [],  // data 数据
      json: {key: 'value'},
      paramsdata: [],  //params
      // formData: [],  //formData
      buttonStart: false,
      hasJsonFlag: true,
      tabelheadercolor: {color: '#000', background: '#f5f5f5'},
      methodList: ['POST', 'GET', 'PUT', 'DELETE'],
      typeList: ['data', 'json', 'params'],
      typeOptions: ['string', 'int', 'float', 'boolean'],
      // formDatatypeOptions: ['Text', 'File'],
      request: {
        type: 'json',
        headers: {},
      },
      updateNumber: 0
    }
  },

  watch: {
    testdata: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 4) {
          this.$emit('setUpdateCount', 'body-data')
        }
      },
      deep: true
    },
    json: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 4) {
          this.$emit('setUpdateCount', 'body-json')
        }
      },
      deep: true
    },
    paramsdata: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 4) {
          this.$emit('setUpdateCount')
        }
      },
      deep: true
    },
    request: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 4) {
          this.$emit('setUpdateCount')
        }
      },
      deep: true
    }
  },

  methods: {
    // 重置表单
    resetForm() {
      this.updateNumber = 0
      this.testdata = []
      this.json = {key: 'value'}
      this.paramsdata = []
      this.request = {type: 'json', headers: {},}
      this.hasJsonFlag = true
    },
    // from 拼接
    getBodyForm() {

      let requestData = {}
      requestData.type = this.request.type
      if (this.request.type === 'json') {
        if (!this.hasJsonFlag) throw new Error('json 格式错误!')
        this.$set(requestData, 'json', this.json)
      }
      if (this.request.type === 'data') {
        requestData.data = this.testdata
      }
      if (this.request.type === 'params') {
        requestData.params = this.paramsdata
      }
      this.hasJsonFlag = true
      return requestData
    },
    // 编辑时赋值
    setBodyForm(form) {
      this.updateNumber = 0
      this.resetForm()
      this.request.type = form.type
      if (form.type === 'json') {
        this.json = form.json
      }
      if (form.type === 'params') {
        if (form.params.length > 0) {
          form.params.forEach(params => {
            params['value'] = params.value.toString()
          })
        }
        this.paramsdata = form.params
      }
      if (form.type === 'data') {
        this.testdata = form.data
      }
    },

    typeChange(val) {

    },
    // data
    addData() {
      this.testdata.push({key: '', type: 'string', value: ''})
    },
    deleteData(row, index) {
      this.testdata.splice(index, 1)
    },

    // params
    addParams() {
      this.paramsdata.push({key: '', type: 'string', value: ''})
    },
    deleteParams(row, index) {
      this.paramsdata.splice(index, 1)
    },
    onJsonChange(value) {
      // console.log('更改value:', value);
      // 实时保存
      this.onJsonSave(value)
    },
    onJsonSave(value) {
      // console.log('保存value:', value);
      this.resultInfo = value
      this.hasJsonFlag = true
    },
    onError(value) {
      // console.log("json错误了value:", value);
      this.hasJsonFlag = false
    },
    changeRadio() {
      this.hasJsonFlag = true
    }
  }
}
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