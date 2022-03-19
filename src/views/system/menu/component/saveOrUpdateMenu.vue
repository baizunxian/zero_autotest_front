<template>
  <div class="system-edit-menu-container">
    <el-dialog :title="editType === 'save'? '新增菜单' : '修改菜单'" v-model="isShowDialog" width="769px">
      <el-form :model="menuForm" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="上级菜单">
              <el-select v-model="menuForm.parent_id" clearable placeholder="Select">
                <el-option :value="0" label="根目录"></el-option>
                <el-option
                    v-for="item in allMenuList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="菜单类型">
              <el-radio-group v-model="menuForm.menu_type">
                <el-radio :label="10">菜单</el-radio>
                <el-radio :label="20">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="菜单名称">
              <el-input v-model="menuForm.title" placeholder="格式：message.router.xxx" clearable></el-input>
            </el-form-item>
          </el-col>
          <template v-if="menuForm.menu_type === 10">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="路由名称">
                <el-input v-model="menuForm.name" placeholder="路由中的 name 值" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="路由路径">
                <el-input v-model="menuForm.path" placeholder="路由中的 path 值" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="重定向">
                <el-input v-model="menuForm.redirect" placeholder="请输入路由重定向" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="菜单图标">
                <IconSelector placeholder="请输入菜单图标" v-model="menuForm.icon" type="all"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="组件路径">
                <el-input v-model="menuForm.component" placeholder="组件路径" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="链接地址">
                <el-input v-model="menuForm.isLink" placeholder="外链/内嵌时链接地址（http:xxx.com）" clearable
                          :disabled="!menuForm.isLink">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="权限标识">
                <el-select v-model="menuForm.roles" placeholder="取角色管理" clearable class="w100">
                  <el-option label="admin" value="admin"></el-option>
                  <el-option label="common" value="common"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="menuForm.menuType === 'btn'">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="权限标识">
                <el-input v-model="menuForm.btnPower" placeholder="请输入权限标识" clearable></el-input>
              </el-form-item>
            </el-col>
          </template>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="菜单排序">
              <el-input-number v-model="menuForm.sort" controls-position="right" placeholder="请输入排序" class="w100"/>
            </el-form-item>
          </el-col>
          <template v-if="menuForm.menu_type === 10">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否隐藏">
                <el-radio-group v-model="menuForm.isHide">
                  <el-radio :label="true">隐藏</el-radio>
                  <el-radio :label="false">不隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="页面缓存">
                <el-radio-group v-model="menuForm.isKeepAlive">
                  <el-radio :label="true">缓存</el-radio>
                  <el-radio :label="false">不缓存</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否固定">
                <el-radio-group v-model="menuForm.isAffix">
                  <el-radio :label="true">固定</el-radio>
                  <el-radio :label="false">不固定</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否外链">
                <el-radio-group v-model="menuForm.isLink" :disabled="menuForm.isIframe">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否内嵌">
                <el-radio-group v-model="menuForm.isIframe" @change="onSelectIframeChange">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>
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
import IconSelector from '/@/components/iconSelector/index.vue';
import {useMenuApi} from "/@/api/useSystemApi/menu";
import {ElMessage} from "element-plus";

export default defineComponent({
  name: 'saveOrUpdateMenu',
  components: {IconSelector},
  props: ['menuList', 'allMenuList'],
  setup(props, {emit}) {
    const createMenuForm = () => {
      return {
        parent_id: 0, // 上级菜单
        menu_type: 10, // 菜单类型  10 菜单  20 按钮
        name: '', // 路由名称
        component: '', // 组件路径
        sort: 0, // 菜单排序
        path: '', // 路由路径
        redirect: '', // 路由重定向，有子集 children 时
        title: '', // 菜单名称
        icon: '', // 菜单图标
        isHide: false, // 是否隐藏
        isKeepAlive: true, // 是否缓存
        isAffix: false, // 是否固定
        isLink: false, // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink:true 2、链接地址不为空`
        isIframe: false, // 是否内嵌，开启条件，`1、isIframe:true 2、链接地址不为空`
        roles: '', // 权限标识，取角色管理
        btnPower: '', // 菜单类型为按钮时，权限标识
      }
    }

    const state = reactive({
      isShowDialog: false,
      editType: '',
      // 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
      menuForm: createMenuForm(),
      menuData: [], // 上级菜单数据
    });
    // 创建表单

    // 打开弹窗
    const openDialog = (editType: string, row: any) => {
      state.editType = editType
      if (row) {
        state.menuForm = JSON.parse(JSON.stringify(row));
      } else {
        state.menuForm = createMenuForm()
      }
      state.isShowDialog = true;
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 是否内嵌下拉改变
    const onSelectIframeChange = () => {
      if (state.ruleForm.meta.isIframe) state.ruleForm.isLink = true;
      else state.ruleForm.isLink = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };
    // 新增
    const saveOrUpdate = () => {
      useMenuApi().saveOrUpdateMenu(state.menuForm)
          .then(() => {
            ElMessage.success('操作成功');
            emit('getMenuList')
            closeDialog(); // 关闭弹窗
          })
      console.log(state.menuForm, 'state.menuForm')
      // setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
    };
    // 页面加载时
    onMounted(() => {
      // getMenuData();
    });

    return {
      openDialog,
      closeDialog,
      onSelectIframeChange,
      onCancel,
      saveOrUpdate,
      ...toRefs(state),
    };
  },
});
</script>
