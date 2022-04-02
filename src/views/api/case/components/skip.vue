<template>
  <div>
    <el-table
        ref="skipTableRef"
        :data="skipData"
        border
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column header-align='center' width="400">
        <template #header>
          <strong style="font-size: 14px;">跳过方法</strong>
        </template>
        <template #default="scope">
          <el-select clearable v-model="scope.row.key" placeholder="请选择" style="width: 100%">
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
        <template #header>
          <strong style="font-size: 14px;">判断值</strong>
        </template>
        <template #default="scope">
          <el-input v-model="scope.row.value"></el-input>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script lang="ts">

import {defineComponent, reactive, toRefs} from "vue";

export default defineComponent({
  name: 'caseSkip',
  components: {},
  setup() {
    const state = reactive({
      skipData: [{'key': '', value: ''}],  // 跳过数据
      SkipSelect: {skip: '直接跳过', skipIf: '如果判断值不为空跳过', skipUnless: '如果判断值为空跳过'}

    });
    // 初始化数据
    const initForm = (formData: any) => {
      state.skipData = [{'key': '', value: ''}]
      if (formData.key !== undefined) {
        let data = []
        data.push(form)
        state.skipData = data
      }

    }

    // 获取skip
    const getFormData = () => {
      let skipInfo = {}
      if (state.skipData.length > 0) {
        state.skipData.forEach(ext => {
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

    }

    return {
      initForm,
      getFormData,
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
</style>