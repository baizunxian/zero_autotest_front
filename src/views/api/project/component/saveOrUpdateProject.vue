<template>
  <div class="system-edit-menu-container">
    <el-dialog :title="editType === 'save'? '新增菜单' : '修改菜单'" v-model="isShowDialog" width="769px">
      <el-form :model="projectForm" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="项目名称">
              <el-input v-model="projectForm.name" placeholder="项目名称" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="负责人">
              <el-input v-model="projectForm.responsible_name" placeholder="负责人" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="测试人员">
              <el-input v-model="projectForm.test_user" placeholder="测试人员" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="开发人员">
              <el-input v-model="projectForm.dev_user" placeholder="开发人员" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="关联应用">
              <el-input v-model="projectForm.publish_app" placeholder="关联应用" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="简要描述">
              <el-input v-model="projectForm.simple_desc" placeholder="简要描述" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="关联配置">
              <el-input v-model="projectForm.config_id" placeholder="关联配置" clearable></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="saveOrUpdate" size="default">保 存</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useProjectApi} from "/@/api/useAutoApi/project";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: 'saveOrUpdateProject',
  setup(props, {emit}) {
    const createProjectForm = () => {
      return {
        name: '', // 项目名称
        responsible_name: '', // 负责人
        test_user: '', // 测试人员
        dev_user: '', // 开发人员
        publish_app: '', // 关联应用
        simple_desc: '', // 简要描述
        config_id: null, // 配置信息
      }
    }
    const state = reactive({
      isShowDialog: false,
      editType: '',
      // 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
      projectForm: createProjectForm(),
      menuData: [], // 上级菜单数据
    });

    // 打开弹窗
    const openDialog = (type: string, row: any) => {
      state.editType = type
      if (row) {
        state.projectForm = JSON.parse(JSON.stringify(row));
      } else {
        state.projectForm = createProjectForm()
      }
      state.isShowDialog = true;
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };
    // 新增
    const saveOrUpdate = () => {
      useProjectApi().saveOrUpdateProject(state.projectForm)
          .then(() => {
            ElMessage.success('操作成功');
            emit('getProjectList')
            closeDialog(); // 关闭弹窗
          })
      console.log(state.projectForm, 'state.menuForm')
      // setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
    };
    // 页面加载时
    onMounted(() => {
      // getMenuData();
    });

    return {
      openDialog,
      closeDialog,
      onCancel,
      saveOrUpdate,
      ...toRefs(state),
    };
  },
});
</script>
