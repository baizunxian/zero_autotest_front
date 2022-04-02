<template>
  <!-- data - table -->
  <div>
    <div style="display: flex; align-items: center;">
      <strong>变量</strong>
      <el-tooltip placement="bottom-start">
        <template #content>
          定义的全局变量，作用域为整个用例
          <br/>
          <br/>参数名：可以自定义名称<br/>
          类型：参数值的数据类型<br/>
          参数值：变量对应的值<br/>
          备注：变量信息描述<br/>
          <br/>
          加密：想要变量值加密需要变量名加上__encryption后缀 <br/>
          例如有个变量名是 pwd 想对 pwd 对应的值加密 则变量名改完 pwd__encryption 保存后对应的值加密<br/>
          <br/>样例：定义一个名称为id，值为10000的变量，格式为参数名id，类型为int，参数值为10000<br/>
        </template>
        <el-icon><ele-IconInfo></ele-IconInfo></el-icon>
      </el-tooltip>
      <el-button class="filter-item" type="success" icon="el-icon-plus" round size="mini" style="padding: 4px;"
                 title="新增变量" @click="addVariables"></el-button>
    </div>
    <el-table
        ref="multipleTable"
        :data="variables"
        border
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column type="selection" width="55" label="Option">
      </el-table-column>
      <el-table-column header-align='center'>
        <template #header>
          <strong style="font-size: 14px;">变量名</strong>
        </template>
        <template #default="scope">
          <el-input v-model="scope.row.key"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="type" width="120" header-align='center'>
        <template #header>
          <strong style="font-size: 14px;">类型</strong>
        </template>
        <template #default="scope">
          <el-select v-model="scope.row.type" placeholder="请选择">
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
        <template #header>
          <strong style="font-size: 14px;">变量值</strong>
        </template>
        <template #default="scope">
          <el-input v-model="scope.row.value"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="remarks_" header-align='center'>
        <template #header>
          <strong style="font-size: 14px;">备注</strong>
        </template>
        <template #default="scope">
          <el-input v-model="scope.row.remarks_"></el-input>
        </template>
      </el-table-column>

      <el-table-column align="center" width="50" class-name="small-padding fixed-width">
        <template #default="scope">

          <el-button size="small" type="text" @click="deleteVariables(scope.row,scope.index)">
            <el-icon>
              <ele-Delete/>
            </el-icon>
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- headers -->
    <div style="display: flex; align-items: center;">
      <strong>参数</strong>
      <el-tooltip placement="bottom-start">
        <template #content>
          全局参数，用于实现数据化驱动，作用域为整个用例<br/>
          <br/>参数名：可以自定义名称<br/>
          参数值：参数对应的值<br/>
          备注：参数信息描述<br/>
          <br/>样例1：定义单个参数，参数有两个值格式，参数名称为name1，参数值["value1","value2"]<br/>
          <br/>样例2：定义多个参数，每个参数有两个值格式，参数名称为name1，name2，参数值[["name1_value1","name1_value2"],["name2_value1","name2_value2"]]<br/>
        </template>
        <el-icon><ele-IconInfo></ele-IconInfo></el-icon>
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
        ref="parametersTableRef"
        :data="parameters"
        border
        tooltip-effect="dark"
        style="width: 100%"
    >

      <el-table-column prop="Key" header-align='center'>
        <template #header>
          <strong style="font-size: 14px;">参数名</strong>
        </template>
        <template #default="scope">
          <el-input type="textarea" v-model="scope.row.key" :placeholder="ValueV"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="Value" header-align='center'>
        <template #header>
          <strong style="font-size: 14px;">参数值</strong>
        </template>
        <template #default="scope">
          <el-input type="textarea" v-model="scope.row.value" :placeholder="ValueP"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="remarks_" header-align='center' width="250">
        <template #header>
          <strong style="font-size: 14px;">备注</strong>
        </template>
        <template #default="scope">
          <el-input type="textarea" v-model="scope.row.remarks_"></el-input>
        </template>
      </el-table-column>

      <el-table-column align="center" width="150" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button size="small" type="text" @click="deleteParameters(scope.row,scope.index)">
            <el-icon>
              <ele-Delete/>
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="display: flex; align-items: center;">
      <strong>函数</strong>
      <el-tooltip placement="bottom-start">
        <template #content>
          前置函数：在 HTTP 请求发送前执行 hook 函数，主要用于准备工作<br/>
          后置函数：在 HTTP 请求发送后执行 hook 函数，主要用户测试后的清理工作<br/>
        </template>
        <el-icon><ele-IconInfo></ele-IconInfo></el-icon>
      </el-tooltip>
      <el-button class="filter-item" type="success" icon="el-icon-plus" round size="mini" style="padding: 4px;"
                 title="新增函数" @click="addHooks"></el-button>
    </div>
    <el-table
        ref="hooksTableRef"
        :data="hooks"
        border
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column label="key" header-align='center'>
        <template #header>
          <strong style="font-size: 14px;">前置函数</strong>
        </template>
        <template #default="scope">
          <el-input v-model="scope.row.setup_hooks"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="value" header-align='center'>
        <template #header>
          <strong style="font-size: 14px;">后置函数</strong>
        </template>
        <template #default="scope">
          <el-input v-model="scope.row.teardown_hooks"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" width="50" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button size="small" type="text" @click="deleteHooks(scope.row,scope.index)">
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
// import {cvsToParam} from '@/api/caseParams'
// import {temp} from '@/utils/request'

import {defineComponent, reactive, ref, toRefs} from "vue";

export default defineComponent({
  name: 'variablesParameters',
  components: {},
  setup() {
    const formRef = ref()
    const state = reactive({
      variables: [],   // 变量列表
      parameters: [{key: '', value: '', remarks_: ''}],  //  参数列表
      hooks: [],  // 钩子函数列表
      ValueV: '多参数示例：a,b    单参数示例： c',
      ValueP: '多参数示例: [["name1", "pwd1"],["name2","pwd2"]]   单参数示例: [1, "value2"]',
      typeOptions: ['string', 'int', 'float', 'boolean'],

    });
    // 初始化数据
    const initForm = (formData: any) => {
      state.variables = []
      state.parameters = []
      state.hooks = []
      state.parameters = [{key: '', value: '', remarks_: ''}]

      if (formData && formData.variables && formData.variables.length > 0) {
        this.variables = data.variables
      }
      if (formData.parameters) {
        this.parameters = []
        formData.parameters.forEach(p => {
          if (typeof p['value'] == 'string') {
            state.parameters.push({key: p['key'], value: p['value'], remarks_: p['remarks_']})
          } else {
            state.parameters.push({key: p['key'], value: JSON.stringify(p['value']), remarks_: p['remarks_']})
          }
        })
      }
      if (formData && formData.setup_hooks && formData.teardown_hooks) {
        let setup_hooks = data.setup_hooks
        let teardown_hooks = data.teardown_hooks
        setup_hooks.forEach((hook, index) => {
          state.hooks.push({'setup_hooks': hook, 'teardown_hooks': teardown_hooks[index]})
        })
        // this.hooks = form.hooks
      }

    }

    // 获取表单数据
    const getFormData = () => {
      let form = {
        variables: [],
        parameters: [],
        setup_hooks: [],
        teardown_hooks: [],
      }
      if (state.variables.length > 0) {
        this.variables.forEach(data => {
          if (data.key !== '' && data.type === 'string') {
            data.value = data.value.replace(/'/g, '"')
            form.variables.push(data)
          }else{
            form.variables.push(data)
          }
        })
      }
      if (state.parameters.length > 0) {
        this.parameters.forEach(data => {
          if (data.key !== '') {
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
    }

    // variables
    const addVariables = () => {
      state.variables.push({key: '', type: 'string', value: '', remarks_: ''})
    }
    const deleteVariables = (row, index) => {
      state.variables.splice(index, 1)
    }

    // parameters
    const addParameters = () => {
      state.parameters.push({key: '', value: '', remarks_: ''})
    }
    const deleteParameters = (row, index) => {
      state.parameters.splice(index, 1)
    }

    // hooks
    const addHooks = () => {
      state.hooks.push({setup_hooks: '', teardown_hooks: ''})
    }
    const deleteHooks = (row, index) => {
      state.hooks.splice(index, 1)
    }

    return {
      formRef,
      initForm,
      getFormData,
      addVariables,
      deleteVariables,
      addParameters,
      deleteParameters,
      addHooks,
      deleteHooks,
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