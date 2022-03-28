<template>
  <div>
    <el-table
        :header-cell-style="tabelheadercolor"
        ref="outputTable"
        :data="data"
        border
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column header-align='center' width="400">
        <template slot="header">
          <strong style="font-size: 14px;">跳过方法</strong>
        </template>
        <template slot-scope="{row}">
          <el-select clearable v-model="row.key" placeholder="请选择" style="width: 100%">
            <el-option
                v-for="(value,key)  in SkipSelect"
                :key="key"
                :label="value"
                :value="key">
            </el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column prop="value" header-align='center'>
        <template slot="header">
          <strong style="font-size: 14px;">判断值</strong>
        </template>
        <template slot-scope="{row}">
          <el-input v-model="row.value"></el-input>
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
      data: [{'key': '', value: ''}],
      updateNumber: 0,
      SkipSelect: {skip: '直接跳过', skipIf: '如果判断值不为空跳过', skipUnless: '如果判断值为空跳过'}
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
    getSkip() {
      let skipInfo = {}
      if (this.data.length > 0) {
        this.data.forEach(ext => {
          if (ext.key !== '') {
            if (ext.key === 'skip') {
              skipInfo['key'] = ext.key
              skipInfo['value'] = true
            } else {
              if (ext.value === '') {
                throw ('【用例跳过过条件】判断值不能为空！')
              }
              skipInfo['key'] = ext.key
              skipInfo['value'] = ext.value
            }
          }
        })
      }
      if (skipInfo.key !== undefined) {
        return skipInfo
      }
      return null
    },
    // 重置表单
    resetForm() {
      this.updateNumber = 0
      this.data = [{'key': '', value: ''}]
    },
    // 编辑
    setSkipForm(form) {
      this.updateNumber = 0
      this.data = [{'key': '', value: ''}]
      if (form.key !== undefined) {
        let data = []
        data.push(form)
        this.data = data
      }
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