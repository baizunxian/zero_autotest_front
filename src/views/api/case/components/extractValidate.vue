<template>
  <!-- data - table -->
  <div>
    <div style="display: flex; align-items: center;">
      <strong>提取
        <el-tooltip placement="bottom-start">
          <div slot="content">
            从当前 HTTP 请求的响应结果中提取参数，并保存到参数变量中（例如token），后续测试用例可通过$token的形式进行引用<br/>
            <br/>参数名：可以自定义名称<br/>
            参数值：响应结果中的参数值<br/>
            <br/>样例：content 相当于返回的body内容, 返回内容为 {code: 0, msg: 'OK'}，要提取msg的格式为content.msg<br/></div>
          <i class="el-icon-info" style="color:#409eff;margin-left:5px;"></i>
        </el-tooltip>
      </strong>
      <el-button class="filter-item" type="success" icon="el-icon-plus" round size="mini" style="padding: 4px;"
                 title="新增提取" @click="addExtract"></el-button>
    </div>
    <el-table
        :header-cell-style="tabelheadercolor"
        ref="multipleTable"
        :data="extract"
        border
        tooltip-effect="dark"
        style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="55" label="Option">
      </el-table-column> -->
      <el-table-column header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">变量名</strong>
        </template>
        <template slot-scope="{row}">
          <el-input v-model="row.key"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="value" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">提取值</strong>
        </template>
        <template slot-scope="{row}">
          <el-input v-model="row.value"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" width="50" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-link :underline="false" type="primary" @click="deleteExtract(row,$index)"><i class="el-icon-delete"></i>
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- headers -->
    <div style="display: flex; align-items: center;">
      <strong>校验</strong>
      <el-tooltip placement="bottom-start">
        <div slot="content">
          测试用例中定义的结果校验项，作用域为当前测试用例，用于实现对当前测试用例运行结果的校验<br/>
          <br/>校验参数：响应结果中的参数<br/>
          对比规则：校验参数与校验值对比的规则<br/>
          类型：校验值的数据类型<br/>
          校验值：跟校验参数进行对比的值<br/>
          <br/>样例：返回内容为 {code: 0, msg: 'OK'}，要校验msg等于OK， 校验参数格式为content.msg，对比规则为equals，类型为String，校验值为OK<br/></div>
        <i class="el-icon-info" style="color:#409eff;margin-left:5px;"></i>
      </el-tooltip>
      <el-button class="filter-item" type="success" icon="el-icon-plus" round size="mini" style="padding: 4px;"
                 title="新增校验" @click="addValidate"></el-button>
    </div>
    <el-table
        :header-cell-style="tabelheadercolor"
        ref="multipleTable"
        :data="validate"
        border
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column prop="key" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">校验参数</strong>
        </template>
        <template slot-scope="{row}">
          <el-input v-model="row.check"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="Comparator" width="120" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">对比规则</strong>
        </template>
        <template slot-scope="{row}">
          <el-select v-model="row.comparator" placeholder="请选择">
            <el-option
                v-for="item in comparatorOptions"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
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

      <el-table-column prop="Expected" label="Expected" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">校验值</strong>
        </template>
        <template slot-scope="{row}">
          <el-input v-model="row.expected"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" width="50" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-link :underline="false" type="primary" @click="deleteValidate(row,$index)"><i class="el-icon-delete"></i>
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'extractValidate',
  data() {
    return {
      tabelheadercolor: {color: '#000', background: '#f5f5f5'},
      extract: [],
      validate: [],
      updateNumber: 0,
      typeOptions: ['string', 'int', 'float', 'boolean', 'dict', 'list'],
      comparatorOptions: [
        'equals',
        'contains',
        'startswith',
        'endswith',
        'regex_match',
        'type_match',
        'contained_by',
        'less_than',
        'less_than_or_equals',
        'greater_than',
        'greater_than_or_equals',
        'not_equals',
        'string_equals',
        'length_equals',
        'length_greater_than',
        'length_greater_than_or_equals',
        'length_less_than',
        'length_less_than_or_equals',
        'json_equals',
      ],
    }
  },
  watch: {
    extract: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 2) {
          this.$emit('setUpdateCount', '提取')
        }
      },
      deep: true
    },
    validate: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 2) {
          this.$emit('setUpdateCount', '校验')
        }
      },
      deep: true
    }
  },
  methods: {
    getEVForm() {
      let from = {
        extract: [],
        validate: [],
      }
      if (this.extract.length > 0) {
        this.extract.forEach(ext => {
          if (ext.key !== '') {
            let extracts = {}
            this.$set(extracts, ext.key, ext.value)
            from.extract.push(extracts)
          }
        })
      }
      if (this.validate && this.validate.length > 0) {
        from.validate = this.validate
      }
      return from
    },
    // 重置表单
    resetForm() {
      this.updateNumber = 0
      this.extract = []
      this.validate = []
    },
    // 设置断言
    setValidate(validate) {
      validate.forEach(item => {
        if (!this.validate.find(el => el.check === item.check)) {
          this.validate.push(item)
        }
      })
    },
    setExtract(extract) {
      extract.forEach(item => {
        if (!this.extract.find(el => el.key === item.key)) {
          this.extract.push(item)
        }
      })
    },
    // 编辑
    setEvForm(form) {
      this.updateNumber = 0
      this.extract = []
      this.validate = []
      if (form.extract && form.extract.length > 0) {

        console.log(this.extract, 'this.extract ')
        console.log(form.extract, 'form.extract')
        form.extract.forEach(extracts => {
          for (let key in extracts) {
            let extract_dict = {
              key: key,
              value: extracts[key]
            }
            this.extract.push(extract_dict)
          }
        })
      }
      if (form.validate && form.validate.length > 0) {
        form.validate.forEach(data => {
          // 后台数据是按类型返回的，前端数据存储转为string
          if (typeof (data.expected) === 'object') {
            data['expected'] = JSON.stringify(data.expected)
          } else {
            data['expected'] = data.expected.toString()
          }
          this.validate.push(data)
        })

      }
    },

    addExtract() {
      this.extract.push({key: '', value: 'content.'})
    },
    addValidate() {
      this.validate.push({check: 'content.', comparator: 'equals', type: 'string', expected: ''})
    },
    deleteExtract(row, index) {
      this.extract.splice(index, 1)
    },
    deleteValidate(row, index) {
      this.validate.splice(index, 1)
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