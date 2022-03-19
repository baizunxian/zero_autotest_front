<template>
  <div class="system-menu-container">
    <el-card shadow="hover">
      <div class="system-menu-search mb15">
        <el-input v-model="listQuery.name" placeholder="请输入菜单名称" style="max-width: 180px"></el-input>
        <el-button type="primary" class="ml10" @click="getMenuList">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button type="success" class="ml10" @click="onOpenSaveOrUpdate('save', null)">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增菜单
        </el-button>
      </div>
      <el-table
          :data="menuList"
          v-loading="menuTableLoading"
          style="width: 100%"
          row-key="path"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column label="菜单名称" show-overflow-tooltip>
          <template #default="scope">
            <SvgIcon :name="scope.row.icon"/>
            <span class="ml10">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
        <el-table-column label="组件路径" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.component }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限标识" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.roles }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" show-overflow-tooltip width="80">
          <template #default="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="类型" show-overflow-tooltip width="80">
          <template #default="scope">
            <el-tag type="success" size="small">{{ scope.row.xx }}菜单</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="140">
          <template #default="scope">
            <el-button size="small" type="text" @click="onOpenSaveOrUpdate('update', scope.row)">修改</el-button>
            <el-button size="small" type="text" @click="onTabelRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <save-or-update-menu :menuList="menuList" :allMenuList="allMenuList" @getMenuList="getMenuList" ref="saveOrUpdateMenuRef"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {useMenuApi} from '/@/api/useSystemApi/menu';
import {useStore} from '/@/store';
import {RouteRecordRaw} from 'vue-router';
import {ElMessage, ElMessageBox} from 'element-plus';
import saveOrUpdateMenu from '/@/views/system/menu/component/saveOrUpdateMenu.vue';

export default defineComponent({
  name: 'systemMenu',
  components: {saveOrUpdateMenu},
  setup() {
    const store = useStore();
    const saveOrUpdateMenuRef = ref();
    const state = reactive({
      menuList: null,
      allMenuList: null,
      menuTableLoading: false,
      listQuery: {
        page: 1,
        pageSize: 200,
        name: '',
      },
    });

    // 递归组装菜单
    const menuAssembly = (parent_menu: Array<object>, all_menu: Array<object>) => {
      parent_menu.forEach(parent => {
        all_menu.forEach(menu => {
          if (menu.parent_id == parent.id) {
            parent.children = parent.children ? parent.children : [];
            parent.children.push(menu);
          }
        })
        if (parent.children) menuAssembly(parent.children, all_menu);
      })
      state.menuList = parent_menu
    };

    // 获取菜单列表
    const getMenuList = async () => {
      state.menuTableLoading = true
      let res = await useMenuApi().allMenu()
      state.allMenuList = res.data
      let parent_menu = []
      res.data.forEach(menu => {
        if (!menu.parent_id) {
          parent_menu.push(menu)
        }
      })
      menuAssembly(parent_menu, res.data)
     state.menuTableLoading = false
    };
    // 打开新增菜单弹窗
    // const onOpenAddMenu = () => {
    //   addMenuRef.value.openDialog();
    // };
    // 打开编辑菜单弹窗
    const onOpenSaveOrUpdate = (editType: string, row: RouteRecordRaw) => {
      saveOrUpdateMenuRef.value.openDialog(editType, row);
    };
    // 删除当前行
    const onTabelRowDel = (row: RouteRecordRaw) => {
      ElMessageBox.confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            ElMessage.success('删除成功');
          })
          .catch(() => {
          });
    };
    onMounted(() => {
      getMenuList()
    })

    return {
      // addMenuRef,
      saveOrUpdateMenuRef,
      // onOpenAddMenu,
      onOpenSaveOrUpdate,
      onTabelRowDel,
      getMenuList,
      ...toRefs(state),
    };
  },
});
</script>
