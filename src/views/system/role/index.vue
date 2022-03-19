<template>
  <div class="system-role-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input v-model="listQuery.name" placeholder="请输入角色名称" style="max-width: 180px"></el-input>
        <el-button type="primary" class="ml10" @click="getRolesList">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button type="success" class="ml10" @click="onOpenSaveOrUpdate('save', null)">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增角色
        </el-button>
      </div>
      <el-table
          v-loading="tableLoading"
          :data="listData"
          style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="role_type" label="权限类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="角色状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 10">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="角色描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updation_date" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creation_date" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button :disabled="scope.row.roleName === '超级管理员'" size="small" type="text"
                       @click="onOpenSaveOrUpdate('update', scope.row)">修改
            </el-button>
            <el-button :disabled="scope.row.roleName === '超级管理员'" size="small" type="text" @click="delRole(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total>0"
          :total="total"
          :page="listQuery.page"
          :limit="listQuery.pageSize"
          @pagination="getRolesList"/>
    </el-card>
    <save-or-update-role ref="saveOrUpdateRoleRef" @getRolesList="getRolesList"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import saveOrUpdateRole from '/@/views/system/role/component/saveOrUpdateRole.vue';
import Pagination from '/@/components/Pagination/index.vue';
import {useRolesApi} from "/@/api/useSystemApi/roles";

// 定义接口来定义对象的类型
interface TableData {
  roleName: string;
  roleSign: string;
  describe: string;
  sort: number;
  status: boolean;
  createTime: string;
}


export default defineComponent({
  name: 'systemRole',
  components: {saveOrUpdateRole, Pagination},
  setup() {
    const saveOrUpdateRoleRef = ref();
    const state = reactive({
      listData: [],
      tableLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 20,
        name: '',
      },
    });
    // 初始化表格数据
    const getRolesList = () => {
      state.tableLoading = true
      useRolesApi().getRoleList(state.listQuery)
          .then(res => {
            state.listData = res.data.rows
            state.total = res.data.rowTotal
            state.tableLoading = false
          })
    };

    // 新增或修改角色
    const onOpenSaveOrUpdate = (editType: string, row) => {
      saveOrUpdateRoleRef.value.openDialog(editType, row);
    };

    // 删除角色
    const delRole = (row: any) => {
      ElMessageBox.confirm(`此操作将删除角色名称：“${row.name}”，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            useRolesApi().deleteRole({id: row.id})
                .then(() => {
                  ElMessage.success('删除成功');
                  getRolesList()
                })
          })
          .catch(() => {
          });
    };
    // 分页改变
    const onHandleSizeChange = (val: number) => {
      state.tableData.param.pageSize = val;
    };
    // 分页改变
    const onHandleCurrentChange = (val: number) => {
      state.tableData.param.pageNum = val;
    };
    // 页面加载时
    onMounted(() => {
      getRolesList();
    });
    return {
      getRolesList,
      saveOrUpdateRoleRef,
      saveOrUpdateRole,
      onOpenSaveOrUpdate,
      delRole,
      onHandleSizeChange,
      onHandleCurrentChange,
      ...toRefs(state),
    };
  },
});
</script>
