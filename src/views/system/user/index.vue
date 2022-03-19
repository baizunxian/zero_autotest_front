<template>
  <div class="system-user-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input v-model="listQuery.username" placeholder="请输入用户名称" style="max-width: 180px"></el-input>
        <el-button type="primary" class="ml10" @click="getUserList">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button type="success" class="ml10" @click="onOpenSaveOrUpdate('save', null)">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增用户
        </el-button>
      </div>
      <el-table
          :data="listData"
          v-loading="tableLoading"
          style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="username" label="账户名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nickname" label="用户昵称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="roles" label="关联角色" show-overflow-tooltip></el-table-column>
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="用户状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="user_type" label="用户类型" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="用户描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updation_date" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creation_date" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button
                size="small"
                type="text"
                @click="onOpenSaveOrUpdate('update', scope.row)">修改
            </el-button>
            <el-button
                :disabled="userInfos.user_type !== 10"
                size="small"
                type="text"
                @click="onDelUser(scope.row)">
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
          @pagination="getUserList"/>
    </el-card>
    <save-or-update-user @getUserList="getUserList" ref="saveOrUpdateUserRef"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import saveOrUpdateUser from '/@/views/system/user/component/saveOrUpdateUser.vue';
import Pagination from '/@/components/Pagination/index.vue';
import {useUserApi} from '/@/api/useSystemApi/user';
import {useStore} from "/@/store";

// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  username: string;
  email: string;
  roles: string;
  status: boolean;
  nickname: string;
  user_type: number;
  created_by: number;
  updated_by: number;
  creation_date: string;
  updation_date: string;
}


export default defineComponent({
  name: 'systemUser',
  components: {saveOrUpdateUser, Pagination},
  setup() {
    const saveOrUpdateUserRef = ref();
    const store = useStore();
    const userInfos = store.state.userInfos.userInfos;
    const state = reactive({
      listData: [],
      tableLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 20,
        username: '',
      },
    });
    // 获取用户数据
    const getUserList = () => {
      state.tableLoading = true
      useUserApi().getUserList(state.listQuery)
          .then(res => {
            state.listData = res.data.rows
            state.total = res.data.rowTotal
            state.tableLoading = false
          })
    };

    // 新增或修改用户
    const onOpenSaveOrUpdate = (editType: string, row?: TableDataRow) => {
      saveOrUpdateUserRef.value.openDialog(editType, row);
    };

    // 删除用户
    const onDelUser = (row: TableDataRow) => {
      ElMessageBox.confirm(`此操作将删除账户名称：“${row.username}”，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            useUserApi().delUser({id: row.id})
                .then(() => {
                  ElMessage.success('删除成功');
                  getUserList()
                })
          })
          .catch(() => {
          });
    };
    // 页面加载时
    onMounted(() => {
      getUserList();
    });
    return {
      getUserList,
      saveOrUpdateUserRef,
      onOpenSaveOrUpdate,
      onDelUser,
      store,
      userInfos,
      ...toRefs(state),
    };
  },
});
</script>
