<template>
  <div>
    <div class="block-title" style="display: flex; align-items: center;">

        <el-tooltip placement="bottom-start">
          <strong>输出参数</strong>
          <template #content>
            整个用例输出的参数列表，可输出的参数包括公共的变量和提取的参数; <br/>
            <br/>参数名：可以自定义名称<br/>
            <br/>样例：返回内容为 {code: 0, msg: 'OK'}，要输出msg的值步骤，<br/>
            1.在提取中变量名为name，提取的格式为content.msg<br/>
            2.在输出参数中定义参数名为name
            3.在测试报告中可以参数输出参数为{ "name": ”OK“ }
            <br/>
          </template>
        </el-tooltip>

      <el-button type="text" @click="addOutput" title="新增参数">
        <el-icon><ele-CirclePlusFilled></ele-CirclePlusFilled></el-icon>add
      </el-button>

    </div>
    <el-table
        ref="outputTableRef"
        :data="outputList"
        border
        tooltip-effect="dark"
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
      <el-table-column align="center" width="50" class-name="small-padding fixed-width">
        <template #default="scope">

          <el-button size="small" type="text" @click="deleteOutput(scope.$index)">
            <el-icon>
              <ele-Delete/>
            </el-icon>
          </el-button>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">

import {defineComponent, reactive, ref, toRefs} from "vue";

interface stateRow {
  outputList: Array<object>
}

export default defineComponent({
  name: 'outputList',
  components: {},
  setup() {
    const state = reactive<stateRow>({
      outputList: [],  // 输出变量列表

    });
    // 初始化数据
    const initForm = (formData: any) => {
      state.outputList = []
      if (formData && formData.length > 0) {
        formData.forEach((output: any )=> {
          let output_dict = {
            key: output,
          }
          state.outputList.push(output_dict)
        })
      }
    }

    // 获取output
    const getFormData = () => {
      let output:Array<object> = []
      if (state.outputList.length > 0) {
        state.outputList.forEach((ext: any) => {
          if (ext.key != '') {
            output.push(ext.key)
          }
        })
      }
      return output
    }

    // Output
    const addOutput = () => {
      state.outputList.push({key: ''})
    }
    const deleteOutput = (index: number) => {
      state.outputList.splice(index, 1)
    }

    return {
      initForm,
      getFormData,
      addOutput,
      deleteOutput,
      ...toRefs(state),
    };
  },
})

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
/* el-input */
::v-deep .el-input__inner {
  font-weight: bold;
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
</style>