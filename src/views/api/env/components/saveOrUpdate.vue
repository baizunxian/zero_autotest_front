<template>
  <div class="system-edit-menu-container">
    <el-dialog
        draggable :title="editType === 'save'? '新增' : '修改'" v-model="isShowDialog" width="40%">
      <el-form :model="form" :rules="rules" ref="formRef" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="环境名称" prop="name">
              <el-input v-model="form.name" placeholder="环境名称" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="环境地址" prop="url">
              <el-input v-model="form.url" placeholder="环境地址" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remarks" placeholder="备注" clearable></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onDialog" size="default">取 消</el-button>
					<el-button type="primary" @click="saveOrUpdate" size="default">保 存</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs, ref} from 'vue';
import {useEnvApi} from "/@/api/useAutoApi/env";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: 'saveOrUpdateEnv',
  setup(props, {emit}) {
    const createForm = () => {
      return {
        name: '', // 项目名称
        url: '', // 环境地址
        remarks: '', // 备注

      }
    }
    const formRef = ref()
    const state = reactive({
      isShowDialog: false,
      editType: '',
      // 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
      form: createForm(),
      rules: {
        name: [{required: true, message: '请输入环境名称', trigger: 'blur'},],
        url: [{required: true, message: '请输入环境地址', trigger: 'blur'},],
      },
    });

    // 打开弹窗
    const openDialog = (type: string, row: any) => {
      // 获取项目列表
      state.editType = type
      if (row) {
        state.form = JSON.parse(JSON.stringify(row));
      } else {
        state.form = createForm()
      }
      onDialog();
    };
    // 关闭弹窗
    const onDialog = () => {
      state.isShowDialog = !state.isShowDialog;
    };
    // 新增
    const saveOrUpdate = () => {
      formRef.value.validate((valid: any) => {
        if (valid) {
          useEnvApi().saveOrUpdate(state.form)
              .then(() => {
                ElMessage.success('操作成功');
                emit('getList')
                onDialog(); // 关闭弹窗
              })
        }
      })
      console.log(state.form, 'state.menuForm')
      // setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
    };
    // 页面加载时
    onMounted(() => {
      // getMenuData();
    });

    return {
      openDialog,
      formRef,
      props,
      onDialog,
      saveOrUpdate,
      ...toRefs(state),
    };
  },
});
</script>
