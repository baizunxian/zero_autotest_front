<template>
  <!-- data - table -->
  <div>
    <div style="display: flex; align-items: center;">
      <strong>变量</strong>
      <el-tooltip placement="bottom-start">
        <div slot="content">
          定义的全局变量，作用域为整个用例
          <br/>
          <br/>参数名：可以自定义名称<br/>
          类型：参数值的数据类型<br/>
          参数值：变量对应的值<br/>
          备注：变量信息描述<br/>
          <br/>
          加密：想要变量值加密需要变量名加上__encryption后缀 <br/>
          例如有个变量名是 pwd 想对 pwd 对应的值加密 则变量名改完 pwd__encryption 保存后对应的值加密<br/>
          <br/>样例：定义一个名称为id，值为10000的变量，格式为参数名id，类型为int，参数值为10000<br/></div>
        <i class="el-icon-info" style="color:#409eff;margin-left:5px;"></i>
      </el-tooltip>
      <el-button class="filter-item" type="success" icon="el-icon-plus" round size="mini" style="padding: 4px;"
                 title="新增变量" @click="addVariables"></el-button>
    </div>
    <el-table
        :header-cell-style="tabelheadercolor"
        ref="multipleTable"
        :data="variables"
        border
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column type="selection" width="55" label="Option">
      </el-table-column>
      <el-table-column header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">变量名</strong>
        </template>
        <template slot-scope="{row}">
          <el-input v-model="row.key"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="type" width="120" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">类型</strong>
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
          <strong style="font-size: 14px;">变量值</strong>
        </template>
        <template slot-scope="{row}">
          <el-input v-model="row.value"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="remarks_" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">备注</strong>
        </template>
        <template slot-scope="{row}">
          <el-input v-model="row.remarks_"></el-input>
        </template>
      </el-table-column>

      <el-table-column align="center" width="50" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-link :underline="false" type="primary" @click="deleteVariables(row,$index)"><i class="el-icon-delete"></i>
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- headers -->
    <div style="display: flex; align-items: center;">
      <strong>参数</strong>
      <el-tooltip placement="bottom-start">
        <div slot="content">
          全局参数，用于实现数据化驱动，作用域为整个用例<br/>
          <br/>参数名：可以自定义名称<br/>
          参数值：参数对应的值<br/>
          备注：参数信息描述<br/>
          <br/>样例1：定义单个参数，参数有两个值格式，参数名称为name1，参数值["value1","value2"]<br/>
          <br/>样例2：定义多个参数，每个参数有两个值格式，参数名称为name1，name2，参数值[["name1_value1","name1_value2"],["name2_value1","name2_value2"]]<br/>
        </div>
        <i class="el-icon-info" style="color:#409eff;margin-left:5px;"></i>
      </el-tooltip>
      <el-button
          class="filter-item"
          type="success"
          icon="el-icon-plus"
          round
          size="mini"
          style="padding: 4px;"
          title="新增参数"

          @click="addParameters">
      </el-button>
      <!--
            <el-button class="filter-item" type="success" icon="el-icon-plus"  round size="mini" style="padding: 4px;" title="新增参数" @click="csvUpload">导入</el-button>
      -->
    </div>
    <el-table
        :header-cell-style="tabelheadercolor"
        ref="multipleTable"
        :data="parameters"
        border
        tooltip-effect="dark"
        style="width: 100%"
    >

      <el-table-column prop="Key" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">参数名</strong>
        </template>
        <template slot-scope="{row}">
          <el-input type="textarea" v-model="row.key" :placeholder="ValueV"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="Value" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">参数值</strong>
        </template>
        <template slot-scope="{row}">
          <el-input type="textarea" v-model="row.value" :placeholder="ValueP"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="remarks_" header-align='center' width="250">
        <template slot="header">
          <strong style="font-size: 14px;">备注</strong>
        </template>
        <template slot-scope="{row}">
          <el-input type="textarea" v-model="row.remarks_"></el-input>
        </template>
      </el-table-column>

      <el-table-column align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button class="filter-item" type="success" icon="el-icon-upload" round size="mini" style="padding: 4px;"
                     @click="csvUpload(row,$index)">导入
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-delete" round size="mini" style="padding: 4px;"
                     @click="deleteParameters(row,$index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="display: flex; align-items: center;">
      <strong>函数</strong>
      <el-tooltip placement="bottom-start">
        <div slot="content">
          前置函数：在 HTTP 请求发送前执行 hook 函数，主要用于准备工作<br/>
          后置函数：在 HTTP 请求发送后执行 hook 函数，主要用户测试后的清理工作<br/>
        </div>
        <i class="el-icon-info" style="color:#409eff;margin-left:5px;"></i>
      </el-tooltip>
      <el-button class="filter-item" type="success" icon="el-icon-plus" round size="mini" style="padding: 4px;"
                 title="新增函数" @click="addHooks"></el-button>
    </div>
    <el-table
        :header-cell-style="tabelheadercolor"
        ref="multipleTable"
        :data="hooks"
        border
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column label="key" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">前置函数</strong>
        </template>
        <template slot-scope="{row}">
          <el-input v-model="row.setup_hooks"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="value" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">后置函数</strong>
        </template>
        <template slot-scope="{row}">
          <el-input v-model="row.teardown_hooks"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" width="50" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-link :underline="false" type="primary" @click="deleteHooks(row,$index)"><i class="el-icon-delete"></i>
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog
        title="导入"
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        width="600px"
        v-dialogDrag
        :close-on-click-modal="false">
      <el-form
          ref="uploadForm"
          :model="uploadForm"
          label-width="80px"
      >
        <el-form-item label="上传文件" prop="leader_user">
          <el-upload
              ref="upload"
              action="#"
              :on-change="onUploadChange"
              :limit="1"
              :auto-upload="false">
            <div slot="tip" class="el-upload__tip">上传无扩展名文件，内容使用逗号分割</div>
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="下载模板" prop="down">
          <el-button size="small" type="primary">
            <a :href="this.temp" download="parameter_template">参数模板</a>
          </el-button>
          <div class="el-upload__tip">不要修改文件名称及格式，仅替换内容</div>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="cvsToParam" :loading="buttonStart">导入</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {cvsToParam} from '@/api/caseParams'
import {temp} from '@/utils/request'

export default {
  name: 'variablesParameters',
  data() {
    return {
      dialogVisible: false,
      buttonStart: false,
      temp: '',
      variables: [],
      parameters: [{key: '', value: '', remarks_: ''}],
      param_index: '',
      uploadForm: {},
      hooks: [],
      tabelheadercolor: {color: '#000', background: '#f5f5f5'},
      ValueV: '多参数示例：a,b    单参数示例： c',
      ValueP: '多参数示例: [["name1", "pwd1"],["name2","pwd2"]]   单参数示例: [1, "value2"]',
      typeOptions: ['string', 'int', 'float', 'boolean'],
      updateNumber: 0,
    }
  },
  created() {
    this.temp = temp + '/parameter_template'
  },

  watch: {
    variables: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 3) {
          this.$emit('setUpdateCount', '变量')
        }
      },
      deep: true
    },
    parameters: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 3) {
          this.$emit('setUpdateCount', '参数')
        }
      },
      deep: true
    },
    hooks: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 3) {
          this.$emit('setUpdateCount', '函数')
        }
      },
      deep: true
    }
  },

  methods: {
    // 重置表单
    resetForm() {
      this.updateNumber = 0
      this.variables = []
      this.parameters = []
      this.hooks = []
      this.parameters = [{key: '', value: '', remarks_: ''}]
    },

    getVPForm() {
      let form = {
        variables: [],
        parameters: [],
        setup_hooks: [],
        teardown_hooks: [],
      }
      console.log(this.variables)
      if (this.variables.length > 0) {
        this.variables.forEach(data => {
          if (data.key !== '' && data.type === 'string') {
            data.value = data.value.replace(/'/g, '"')
            form.variables.push(data)
          }else{
            form.variables.push(data)
          }
        })
      }
      if (this.parameters.length > 0) {
        this.parameters.forEach(data => {
          if (data.key !== '' && typeof (data.value) === 'string') {
            data.value = data.value.replace(/'/g, '"')
            form.parameters.push(data)
          }
        })
      }
      if (this.hooks.length > 0) {
        this.hooks.forEach(data => {
          if (data.key !== '') {
            form.setup_hooks.push(data.setup_hooks)
            form.teardown_hooks.push(data.teardown_hooks)
          }
        })
      }
      console.log(form)
      return form
    },
    // 插入数据
    setvpform(form) {
      this.updateNumber = 0
      this.variables = []
      this.parameters = [{key: '', value: '', remarks_: ''}]
      this.hooks = []
      if (form.variables && form.variables.length > 0) {
        this.variables = form.variables
      }
      if (form.parameters) {
        this.parameters = []
        form.parameters.forEach(p => {
          if (typeof p['value'] == 'string') {
            this.parameters.push({key: p['key'], value: p['value'], remarks_: p['remarks_']})
          } else {
            this.parameters.push({key: p['key'], value: JSON.stringify(p['value']), remarks_: p['remarks_']})
          }
        })
      }
      if (form.setup_hooks && form.teardown_hooks) {
        let setup_hooks = form.setup_hooks
        let teardown_hooks = form.teardown_hooks
        setup_hooks.forEach((data, index) => {
          this.hooks.push({'setup_hooks': data, 'teardown_hooks': teardown_hooks[index]})
        })
        // this.hooks = form.hooks
      }
    },

    addVariables() {
      this.variables.push({key: '', type: 'string', value: '', remarks_: ''})
    },
    csvUpload(row, index) {
      this.uploadForm = {}
      this.dialogVisible = true
      this.param_index = index
    },
    onUploadChange(file) {
      this.uploadForm.file = file.raw
    },
    cvsToParam() {
      this.$refs['uploadForm'].validate(async (vaild) => {
        if (vaild) {
          try {
            /*this.parameters = []*/
            this.buttonStart = true
            let formData = new FormData()
            formData.append('file', this.uploadForm.file)
            let res = await cvsToParam(formData)
            if (res.code == 0) {
              this.buttonStart = false
              this.dialogVisible = false
              let param = {key: res.data.key, value: JSON.stringify(res.data.value)}
              this.parameters[this.param_index] = param
              this.parameters.splice(this.param_index, 1, param)
            }
          } catch (error) {
            this.buttonStart = false
          }
        } else {
          this.$message.error('请填写必填参数')
        }
      })
    },
    addParameters() {
      this.parameters.push({key: '', value: '', remarks_: ''})
    },
    addHooks() {
      this.hooks.push({setup_hooks: '', teardown_hooks: ''})
    },
    deleteVariables(row, index) {
      this.variables.splice(index, 1)
    },
    deleteParameters(row, index) {
      this.parameters.splice(index, 1)
    },
    deleteHooks(row, index) {
      this.hooks.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-item {
  color: #fff;
  background-color: #5bc0de;
  border-color: #ffffff;

  &:hover {
    color: #fff;
    background-color: #31b0d5;
    border-color: #ffffff;
  }
}
</style>