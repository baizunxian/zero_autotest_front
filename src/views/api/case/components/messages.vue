<template>
  <el-form ref="formRef" :model="form" label-width="80px" label-position="right"
           :rules="rules">
    <el-row :gutter="35">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb20">
        <el-form-item label="用例名" prop="case_name">
          <el-input v-model.trim="form.name" style="width: 100%;" placeholder="请输入用例名称"></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb20">
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="form.project_id" placeholder="选择请求方法" filterable style="width: 100%;"
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
      </el-col>

      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb20">
        <el-form-item label="可选模块" prop="module_id">
          <el-select v-model="form.module_id" placeholder="选择模块" filterable style="width: 100%;">
            <el-option
                v-for="modules in moduleList"
                :key="modules.id + modules.name"
                :label="modules.name"
                :value="modules.id">
              <span style="float: left">{{ modules.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb20">
        <el-form-item label="关联配置" prop="config_id">
          <el-select v-model="form.config_id" placeholder="请选择配置" clearable filterable
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
    </el-row>
    <!--        <el-form-item label="接口code" prop="code_id">-->
    <!--          <el-select-->
    <!--              v-model="messageForm.code_id"-->
    <!--              placeholder="通过code搜索"-->
    <!--              filterable style="width: 100%;"-->
    <!--              remote-->
    <!--              clearable-->
    <!--              :remote-method="getCode"-->
    <!--              :loading="selectLoading"-->
    <!--              @change="selectCode"-->
    <!--          >-->
    <!--            <el-option-->
    <!--                v-for="api_code in codeList"-->
    <!--                :key="api_code.id"-->
    <!--                :label="api_code.code"-->
    <!--                :value="api_code.id">-->
    <!--              <span style="float: left">-->
    <!--                {{ api_code.code }}-->
    <!--              </span>-->
    <!--            </el-option>-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="优先级" prop="priority">-->
    <!--          <el-radio-group v-model="form.priority">-->
    <!--            <el-radio :label=1>1</el-radio>-->
    <!--            <el-radio :label=2>2</el-radio>-->
    <!--            <el-radio :label=3>3</el-radio>-->
    <!--            <el-radio :label=4>4</el-radio>-->
    <!--          </el-radio-group>-->
    <!--        </el-form-item>-->

  </el-form>

  <el-col :span="16">
    <!--      <el-transfer-->
    <!--          filterable-->
    <!--          ref="transfer"-->
    <!--          target-order="push"-->
    <!--          filter-placeholder="输入名称查询"-->
    <!--          v-model="messageForm.include"-->
    <!--          :titles="[`可选前置用例(总条数:${preCaseTotal})`, `已选前置用例(总条数:${messageForm.include.length})`]"-->
    <!--          :data="include_data"-->
    <!--          @changeQuery="preSearchCase"-->
    <!--          :props="{key: 'id', label: 'name'}"-->
    <!--          @change="onChange">-->
    <!--        <template #>-->
    <!--            <span-->
    <!--                slot-scope="{ option }"-->
    <!--                :title="option.name"-->
    <!--                :draggable="!option.disabled"-->
    <!--                @dragstart="drag($event,option)">-->
    <!--              <el-link @click.prevent="catCaseInfo(option.id)" target="_blank" type="success">查看</el-link>-->
    <!--              {{ option.name }}-->
    <!--            </span>-->
    <!--          </template>-->
    <!--      </el-transfer>-->
    <!--      <pre-case-->
    <!--          :data="include_data"-->
    <!--          :preCaseTotal="preCaseTotal"-->
    <!--          v-model="messageForm.include"-->
    <!--          @catCaseInfo="catCaseInfo"-->
    <!--          @change-query="preSearchCase">-->
    <!--      </pre-case>-->

  </el-col>

  <!--    <el-dialog-->
  <!--        lock-scroll-->
  <!--        v-if="showCaseInfo"-->
  <!--        :visible.sync="showCaseInfo"-->
  <!--        width="80%"-->
  <!--        destroy-on-close-->
  <!--        :close-on-click-modal="false"-->
  <!--        center-->
  <!--        append-to-body-->
  <!--        top='4vh'-->
  <!--    >-->
  <!--      <div slot="title">用例详情</div>-->
  <!--      <cat-case :id="catCaseId"/>-->
  <!--    </el-dialog>-->

</template>

<script lang="ts">
import {useProjectApi} from '/@/api/useAutoApi/project'
import {useModuleApi} from '/@/api/useAutoApi/module'
import {useTestCaseApi} from '/@/api/useAutoApi/testcase'
import {defineComponent, reactive, ref, toRefs} from "vue";
import {ElMessage} from "element-plus";


export default defineComponent({
  name: 'case-url',
  components: {},
  setup(props, {emit}) {
    const formRef = ref()
    const createForm = () => {
      return {
        case_name: '',
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
      isShowDialog: false,
      handleType: '',   //case 调用类型， 保存，调试
      // 表单及校验
      form: createForm(),
      rules: {
        url: [{required: true, message: '请求地址不能为空', trigger: 'blur'}],
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
      //config
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
    const selectProject = (project_id: number) => {
      state.form.module_id = null
      state.form.config_id = null
      state.form.include = []
      state.moduleList = []
      state.include_data = []
      state.moduleQuery.project_id = state.moduleQuery.project_id = state.caseQuery.project_id = project_id
      // state.configQuery.project_id = project_id
      // state.caseQuery.project_id = project_id

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
            state.caseList = res.data.rows
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

    return {
      formRef,
      initForm,
      getFormData,
      getProjectList,
      getModuleList,
      getCaseList,
      getConfigList,
      selectProject,
      ...toRefs(state),
    };
  },
});
</script>
