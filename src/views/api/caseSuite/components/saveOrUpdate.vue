<template>
  <div class="system-edit-menu-container">
    <!--    <el-dialog :title="editType === 'save'? '新增' : '修改'" v-model="isShowDialog" width="80%">-->
    <el-card class="box-card save-update-card" style="height: 90%;">
      <el-page-header
          class="page-header"
          style="margin: 10px 0;"
          @back="goBack"
      >
        <template #content>
          <span style="padding-right: 10px;">{{ editType === 'save' ? '新增套件' : '更新套件' }}</span>
          <el-button type="primary" @click="saveOrUpdate" class="title-button">保存</el-button>
        </template>
      </el-page-header>
      <h3 class="block-title">基本信息</h3>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" style="width: 30%;">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="套件名称" prop="name">
              <el-input v-model="form.name" placeholder="套件名称" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属项目" prop="project_id">
              <el-select v-model="form.project_id" clearable placeholder="选择所属项目" style="width: 100%"
                         @change="selectProject">
                <el-option
                    v-for="item in projectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="关联配置" prop="config_id">
              <el-select v-model="form.config_id" placeholder="请选择配置" clearable filterable
                         style="width: 100%;">
                <el-option
                    v-for="item in configList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注">
              <el-input v-model="form.remarks" placeholder="简要描述" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <h3 class="block-title">用例信息</h3>
      <el-row>
        <el-col :span="24">
          <el-transfer
              ref="transferRef"
              v-model="form.include"
              filterable
              :right-default-checked="form.include"
              :props="{key: 'id', label: 'name'}"
              :titles="['可选用例', '已选用例']"
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
      <template #footer>
          <span class="dialog-footer">
            <el-button @click="onDialog">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">保 存</el-button>
          </span>
      </template>
    </el-card>
    <!--    </el-dialog>-->

    <!--  case info  -->
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
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage} from "element-plus";
import {useTestCaseApi} from "/@/api/useAutoApi/testcase";
import {useTestSuiteApi} from "/@/api/useAutoApi/suite";
import {useProjectApi} from "/@/api/useAutoApi/project";
import {useRoute, useRouter} from "vue-router"
import catCase from '/@/views/api/case/catCase/catCase.vue'


export default defineComponent({
  name: 'saveOrUpdateSuite',
  components: {
    catCase,
  },
  setup(props, {emit}) {
    const createForm = () => {
      return {
        name: '', // 名称
        include: [], // 关联用例
        project_id: '', // 关联项目
        remarks: '', // 简要描述
        config_id: null, // 配置信息
      }
    }
    const formRef = ref()
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      isShowDialog: false,
      editType: '',
      // 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
      form: createForm(),
      rules: {
        name: [{required: true, message: '请输入模块名称', trigger: 'blur'},],
        project_id: [{required: true, message: '请选择所属项目', trigger: 'blur'},],
      },
      include_data: [],
      // project
      projectList: [], // 项目数据
      projectQuery: {   //
        page: 1,
        pageSize: 20,
        name: '',
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

      // cat case
      catCaseId: null,
      showCaseInfo: false,
    });

    // init suite
    const initData = () => {
      console.log(route, '-----------')
      if (route.query.id) {
        useTestSuiteApi().getSuitesInfo({id: route.query.id}).then(res => {
          state.form.id = res.data.id
          state.form.name = res.data.name
          state.form.include = res.data.include
          state.form.project_id = state.caseQuery.project_id = state.configQuery.project_id = res.data.project_id
          state.form.remarks = res.data.remarks
          getCaseList()
          getConfigList()
        })
      }
    }

    // 关闭弹窗
    const onDialog = () => {
      state.isShowDialog = !state.isShowDialog;
    };
    // 新增
    const saveOrUpdate = () => {
      formRef.value.validate((valid: any) => {
        if (valid) {
          useTestSuiteApi().saveOrUpdate(state.form)
              .then(() => {
                ElMessage.success('操作成功');
              })
        }
      })
      console.log(state.form, 'state.menuForm')
      // setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
    };


    // 获取项目列表
    const getProjectList = () => {
      useProjectApi().getList(state.projectQuery) // 请求数据写死，后面优化
          .then(res => {
            state.projectList = res.data.rows
          })
    }
    // 选择项目
    const selectProject = (project_id: number) => {
      state.form.config_id = null
      state.form.include = []
      state.include_data = []
      state.configQuery.project_id = state.caseQuery.project_id = project_id

      getCaseList()
      getConfigList()
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

    // goBack
    const goBack = () => {
      router.push({name: 'apiCaseSuite'})
    }
    // 页面加载时
    onMounted(() => {
      initData()
      getProjectList();
    });
    return {
      initData,
      formRef,
      onDialog,
      saveOrUpdate,
      getConfigList,
      getProjectList,
      getCaseList,
      onCatTestCase,
      selectProject,
      goBack,
      route,
      router,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.block-title {
  position: relative;
  margin-bottom: 12px;
  padding-left: 11px;
  font-size: 14px;
  font-weight: 600;
  height: 28px;
  line-height: 28px;
  background: #f7f7fc;
  color: #333333;

  &::before {
    content: '';
    position: absolute;
    top: 7px;
    left: 0;
    width: 3px;
    height: 14px;
    background: #409eff;
  }
}

:deep(.page-header .el-page-header__icon .el-icon) {
  background-color: #3883fa;
  border-radius: 50%;
  color: white;
}

:deep(.el-page-header .page-header) {
  margin-left: 0 !important;
}

:deep(.save-update-card .el-card__body) {
  padding-top: 0;
}

:deep(.el-transfer-panel .el-transfer-panel__header) {
  height: 30px !important;
}

:deep(.el-transfer-panel__filter) {
  display: block;

  height: 26px !important;
}

:deep(.el-input__inner) {
  height: 26px !important;
}

:deep(.el-input__prefix) {
  top: 4px;
}

:deep(.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label) {
  font-size: 12px;
  font-weight: bold;
}


:deep(.el-transfer-panel) {
  width: 40%;
}

:deep(.el-page-header__content) {
  display: flex;
}
</style>