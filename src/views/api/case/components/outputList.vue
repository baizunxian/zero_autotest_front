<template>
  <div>
    <div style="display: flex; align-items: center;">
      <strong>输出参数
        <el-tooltip placement="bottom-start">
          <div slot="content">
            整个用例输出的参数列表，可输出的参数包括公共的变量和提取的参数; <br/>
            <br/>参数名：可以自定义名称<br/>
            <br/>样例：返回内容为 {code: 0, msg: 'OK'}，要输出msg的值步骤，<br/>
            1.在提取中变量名为name，提取的格式为content.msg<br/>
            2.在输出参数中定义参数名为name
            3.在测试报告中可以参数输出参数为{ "name": ”OK“ }
            <br/>
          </div>
          <i class="el-icon-info" style="color:#409eff;margin-left:5px;"></i>
        </el-tooltip>
      </strong>
      <el-button class="filter-item" type="success" icon="el-icon-plus" round size="mini" style="padding: 4px;"
                 title="新增参数" @click="addOutput"></el-button>
    </div>
    <el-table
        :header-cell-style="tabelheadercolor"
        ref="outputTable"
        :data="outputdata"
        border
        tooltip-effect="dark"
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
      <el-table-column align="center" width="50" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-link :underline="false" type="primary" @click="deleteOutput(row,$index)"><i
              class="el-icon-delete"></i></el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'outputList',
  data() {
    return {
      tabelheadercolor: {color: '#000', background: '#f5f5f5'},
      outputdata: [],
      updateNumber: 0,
    }
  },
  watch: {
    outputdata: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 1) {
          this.$emit('setUpdateCount', '输出参数')
        }
      },
      deep: true
    }
  },

  methods: {
    getOutputForm() {
      let output = []
      if (this.outputdata.length > 0) {
        this.outputdata.forEach(ext => {
          if (ext.key != '') {
            output.push(ext.key)
          }
        })
      }
      return output
    },

    // 重置表单
    resetForm() {
      this.updateNumber = 0
      this.outputdata = []
    },
    // 编辑
    setOutputform(form) {
      this.updateNumber = 0
      this.outputdata = []
      if (form && form.length > 0) {
        form.forEach(output => {
          let output_dict = {
            key: output,
          }
          this.outputdata.push(output_dict)
        })
      }
    },

    addOutput() {
      this.outputdata.push({key: ''})
    },

    deleteOutput(row, index) {
      this.outputdata.splice(index, 1)
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