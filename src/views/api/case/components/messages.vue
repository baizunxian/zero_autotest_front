<template>
  <el-form ref="formRef" :model="form" label-width="80px" label-position="right"
           :rules="rules">
    <el-row :gutter="24">
      <el-col :span="10">
        <!--      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb20">-->
        <el-form-item label="用例名" prop="name">
          <el-input v-model.trim="form.name" style="width: 100%;" placeholder="请输入用例名称"></el-input>
        </el-form-item>
        <!--      </el-col>-->

        <!--      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb20">-->
        <el-form-item label="所属项目" prop="project_id">
          <el-select size="small" v-model="form.project_id" placeholder="选择所属项目" filterable style="width: 100%;"
                     @change="selectProject">
            <el-option
                v-for="project in projectList"
                :key="project.id + project.name"
                :label="project.name"
                :value="project.id">
              <span style="float: left">{{ project.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!--      </el-col>-->

        <!--      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb20">-->
        <el-form-item label="可选模块" prop="module_id">
          <el-select size="small" v-model="form.module_id" placeholder="选择模块" filterable style="width: 100%;">
            <el-option
                v-for="modules in moduleList"
                :key="modules.id + modules.name"
                :label="modules.name"
                :value="modules.id">
              <span style="float: left">{{ modules.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!--      </el-col>-->

        <!--      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb20">-->
        <el-form-item label="关联配置" prop="config_id">
          <el-select size="small" v-model="form.config_id" placeholder="请选择配置" clearable filterable
                     style="width: 100%;">
            <el-option
                v-for="item in configList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                  <span style="float: left">
                    {{ item.name }}
                  </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!--      </el-col>-->


      <el-col :span="14">
        <el-transfer
            ref="transferRef"
            v-model="form.include"
            filterable
            :right-default-checked="form.include"
            :props="{key: 'id', label: 'name'}"
            :titles="['可选前置用例', '已选前置用例']"
            :data="include_data"
        >
          <template #default="{option}">
            <span
                :title="option.name"
                :draggable="!option.disabled">
              <el-link target="_blank"
                       @click.prevent="onCatTestCase(option.id)"
                       type="success"
                       style="font-size: 12px">查看</el-link>
              {{ option.name }}
            </span>
          </template>
        </el-transfer>
      </el-col>

    </el-row>
  </el-form>

  <el-dialog
      draggable
      v-model="showCaseInfo"
      width="80%"
      top="8vh"
      destroy-on-close
      ref="catCaseRef"
      :close-on-click-modal="false">
    <cat-case :case_id="catCaseId" @onCatTestCase="onCatTestCase"/>
  </el-dialog>
</template>

<script lang="ts">
import catCase from '/@/views/api/case/catCase/catCase.vue'
import {useProjectApi} from '/@/api/useAutoApi/project'
import {useModuleApi} from '/@/api/useAutoApi/module'
import {useTestCaseApi} from '/@/api/useAutoApi/testcase'
import {defineComponent, onMounted, reactive, ref, toRefs} from "vue";


export default defineComponent({
  name: 'case-url',
  components: {
    catCase,
  },
  setup() {
    const formRef = ref()
    const createForm = () => {
      return {
        name: '',
        code_id: null,
        code: '',
        project_id: null,
        module_id: null,
        config_id: null,
        id: null,
        priority: 3,
        include: []
      }
    }
    const state = reactive({
      // cat case info
      showCaseInfo: false,
      catCaseId: null,
      // form
      isShowDialog: false,
      handleType: '',   //case 调用类型， 保存，调试
      // 表单及校验
      form: createForm(),
      rules: {
        name: [{required: true, message: '请输入用例名', trigger: 'blur'}],
        project_id: [{required: true, message: '请选择所属项目', trigger: 'blur'}],
        module_id: [{required: true, message: '请选择所属模块', trigger: 'blur'}],
      },

      include_data: [],

      // project
      projectList: [],
      projectQuery: {
        page: 1,
        pageSize: 1000,
      },
      // module
      moduleList: [],
      moduleQuery: {
        page: 1,
        pageSize: 1000,
        project_id: null,
      },
      //case
      caseList: [],
      caseQuery: {
        page: 1,
        pageSize: 1000,
        case_type: 1,
        project_id: null
      },

      //config
      configList: [],
      configQuery: {
        page: 1,
        pageSize: 1000,
        case_type: 2,
        project_id: null
      },

    });
    // 初始化表单
    const initForm = (formData: any) => {
      state.form = createForm()
      if (formData) state.form = formData
      if (formData.project_id) {
        state.moduleQuery.project_id = formData.project_id
        state.caseQuery.project_id = formData.project_id
        state.configQuery.project_id = formData.project_id
        getModuleList()
        getCaseList()
        getConfigList()
      }
    }

    // 回填id
    const setCaseId = (id: any) => {
      state.form.id = id
    }

    // 获取表单数据
    const getFormData = () => {
      return state.form
    }
    //  ----------------project start-------------------------------------
    // 获取项目列表
    const getProjectList = () => {
      useProjectApi().getList(state.projectQuery) // 请求数据写死，后面优化
          .then(res => {
            state.projectList = res.data.rows
          })
    }
    // 选择项目
    const selectProject = (project_id: any) => {
      state.form.module_id = null
      state.form.config_id = null
      state.form.include = []
      state.moduleList = []
      state.include_data = []
      state.moduleQuery.project_id = state.configQuery.project_id = state.caseQuery.project_id = project_id

      getModuleList()
      getCaseList()
      getConfigList()
    }
    //  ----------------module start-------------------------------------
    // 获取模块列表
    const getModuleList = () => {
      useModuleApi().getList(state.moduleQuery) // 请求数据写死，后面优化
          .then(res => {
            state.moduleList = res.data.rows
          })
    }

    //  ----------------config start-------------------------------------
    // 获取用例列表
    const getCaseList = () => {
      useTestCaseApi().getList(state.caseQuery) // 请求数据写死，后面优化
          .then(res => {
            state.caseList = state.include_data = res.data.rows
          })
    }

    //  ----------------config start-------------------------------------
    // 获取配置列表
    const getConfigList = () => {
      useTestCaseApi().getList(state.configQuery) // 请求数据写死，后面优化
          .then(res => {
            state.configList = res.data.rows
          })
    }

    // cat case
    const onCatTestCase = (id: any) => {
      state.catCaseId = id
      state.showCaseInfo = true
    }

    onMounted(() => {
      getProjectList()
    })
    return {
      formRef,
      initForm,
      getFormData,
      setCaseId,
      getProjectList,
      getModuleList,
      getCaseList,
      getConfigList,
      selectProject,
      onCatTestCase,
      ...toRefs(state),
    };
  },
});
</script>


<style lang="scss" scoped>
:deep(.el-transfer-panel .el-transfer-panel__header) {
  height: 30px !important;
}

:deep(.el-transfer-panel__filter .el-input__inner) {
  height: 26px !important;
}

:deep(.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label) {
  font-size: 12px;
  font-weight: bold;
}

:deep(.el-input__inner) {
  font-weight: bold;
}
</style>