<template>
  <div class="system-edit-role-container">
    <el-dialog title="修改角色" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" label-width="90px" ref="ruleFormRef">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色名称">
              <el-input v-model="ruleForm.name" placeholder="请输入角色名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色标识">
              <template #label>
                <el-tooltip effect="dark" content="用于 `router/route.ts` meta.roles" placement="top-start">
                  <span>角色标识</span>
                </el-tooltip>
              </template>
              <el-input v-model="ruleForm.role_type" placeholder="请输入角色标识" clearable></el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">-->
          <!--            <el-form-item label="排序">-->
          <!--              <el-input-number v-model="ruleForm.sort" :min="0" :max="999" controls-position="right" placeholder="请输入排序"-->
          <!--                               class="w100"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="角色状态">
              <el-switch v-model="ruleForm.status" :active-value="10" :inactive-value="20" inline-prompt active-text="启"
                         inactive-text="禁"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="角色描述">
              <el-input v-model="ruleForm.description" type="textarea" placeholder="请输入角色描述" maxlength="150"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="菜单权限">
              <el-tree ref="roleTreeRef"
                       :data="menuData"
                       :props="menuProps"
                       @check-change="roleTreeChange"
                       :default-checked-keys="ruleForm.menus"
                       node-key="id"
                       show-checkbox class="menu-data-tree"/>
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
import {defineComponent, reactive, toRefs, ref} from 'vue';
import {useMenuApi} from "/@/api/useSystemApi/menu";
import {useRolesApi} from "/@/api/useSystemApi/roles";
import {ElMessage} from "element-plus";

// 定义接口来定义对象的类型
interface MenuDataTree {
  id: number;
  title: string;
  children?: MenuDataTree[];
}

interface RoleData {
  name: string;
  role_type: number;
  menus: Array<number>;
  description: string;
  status: boolean;
}

interface RoleState {
  isShowDialog: boolean;
  ruleForm: RoleData;
  menuData: Array<MenuDataTree>;
  menuProps: {
    children: string;
    label: string;
  };
}

export default defineComponent({
  name: 'editRole',
  setup(props, {emit}) {
    let createForm = () => {
      return {
        name: '',  // 角色名称
        role_type: 10,   // 角色类型
        menus: [],    // 关联菜单
        description: '',   //描述
        status: 10,   // 角色状态 10 启用，20 禁用
      }
    }
    const ruleFormRef = ref()
    const roleTreeRef = ref()
    const state = reactive<RoleState>({
      editType: null,
      isShowDialog: false,
      ruleForm: createForm(),
      menuData: [],
      menuProps: {
        children: 'children',
        label: 'title',
      },
    });
    // 打开弹窗
    const openDialog = (editType: string, row: RoleData) => {
      getMenuData()
      state.editType = editType
      if (row) {
        state.ruleForm = JSON.parse(JSON.stringify(row));
      } else {
        state.ruleForm = createForm()
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
    // 更新-新增
    const saveOrUpdate = () => {
      ruleFormRef.value.validate((valid: any) => {
        if (valid) {
          useRolesApi().saveOrUpdateRole(state.ruleForm)
              .then(() => {
                ElMessage.success('操作成功');
                emit('getRolesList')
                closeDialog(); // 关闭弹窗
              })
        }
      })

    };
    // 获取菜单结构数据
    const getMenuData = () => {
      useMenuApi().getAllMenus()
          .then(res => {
            state.menuData = res.data
          });
    };
    const roleTreeChange = () => {
      state.ruleForm.menus = roleTreeRef.value.getCheckedKeys()
    }
    return {
      openDialog,
      closeDialog,
      onCancel,
      saveOrUpdate,
      ruleFormRef,
      roleTreeRef,
      roleTreeChange,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
.system-edit-role-container {
  .menu-data-tree {
    border: var(--el-input-border, var(--el-border-base));
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    padding: 5px;
  }
}
</style>
