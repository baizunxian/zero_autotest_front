<template>
  <div class="system-user-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input v-model="listQuery.username" placeholder="请输入用户名称" style="max-width: 180px"></el-input>
        <el-button type="primary" class="ml10" @click="search">
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
          border
          :data="listData"
          v-loading="tableLoading"
          style="width: 100%"
      >
        <el-table-column label="序号" width="50px" align="center">
          <template #default="scope">
            {{ scope.$index + (listQuery.page - 1) * listQuery.pageSize + 1 }}
          </template>
        </el-table-column>

        <el-table-column
            v-for="field in fieldData"
            :key="field.fieldName"
            :label="field.label"
            :align="field.align"
            :width="field.width"
            :show-overflow-tooltip="field.show"
            :prop="field.fieldName"
        >
          <template #default="{row}">
            <template v-if="field.fieldName === 'username'">
              <el-button size="small"
                         type="text"
                         @click="onOpenSaveOrUpdate('update', row)">
                {{ row[field.fieldName] }}
              </el-button>
            </template>

            <template v-else-if="field.fieldName === 'status'">
              <el-tag type="success" v-if="row.status">启用</el-tag>
              <el-tag type="info" v-else>禁用</el-tag>
            </template>

            <template v-else>
              {{ row[field.fieldName] }}
            </template>

          </template>
        </el-table-column>

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
                @click="deleted(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total"
                  :hidden="total === 0"
                  v-model:page="listQuery.page"
                  v-model:limit="listQuery.pageSize"
                  @pagination="getList"/>
    </el-card>
    <save-or-update @getList="getList" ref="saveOrUpdateRef"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import saveOrUpdate from '/@/views/system/user/components/saveOrUpdate.vue';
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

interface listQueryRow {
  page: number;
  pageSize: number;
  username: string;

}

interface StateRow {
  fieldData: Array<any>;
  listData: Array<TableDataRow>;
  tableLoading: boolean;
  total: number;
  listQuery: listQueryRow;
}


export default defineComponent({
  name: 'systemUser',
  components: {saveOrUpdate, Pagination},
  setup() {
    const saveOrUpdateRef = ref();
    const store = useStore();
    const userInfos = store.state.userInfos.userInfos;
    const state = reactive<StateRow>({
      fieldData: [
        {fieldName: 'username', label: '账户名称', width: '', align: 'center', show: true},
        {fieldName: 'nickname', label: '用户昵称', width: '', align: 'center', show: true},
        {fieldName: 'roles', label: '关联角色', width: '', align: 'center', show: true},
        {fieldName: 'email', label: '邮箱', width: '', align: 'center', show: true},
        {fieldName: 'status', label: '用户状态', width: '', align: 'center', show: true},
        {fieldName: 'remarks', label: '备注', width: '', align: 'center', show: true},
        {fieldName: 'updation_date', label: '更新时间', width: '150', align: 'center', show: true},
        {fieldName: 'updated_by', label: '更新人', width: '', align: 'center', show: true},
        {fieldName: 'creation_date', label: '创建时间', width: '150', align: 'center', show: true},
        {fieldName: 'created_by', label: '创建人', width: '', align: 'center', show: true},
      ],
      // list
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
    const getList = () => {
      state.tableLoading = true
      useUserApi().getList(state.listQuery)
          .then(res => {
            state.listData = res.data.rows
            state.total = res.data.rowTotal
            state.tableLoading = false
          })
    };

    // 查询
    const search = () => {
      state.listQuery.page = 1
      getList()
    }

    // 新增或修改用户
    const onOpenSaveOrUpdate = (editType: string, row?: TableDataRow) => {
      saveOrUpdateRef.value.openDialog(editType, row);
    };

    // 删除用户
    const deleted = (row: TableDataRow) => {
      ElMessageBox.confirm(`此操作将删除账户名称：“${row.username}”，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            useUserApi().deleted({id: row.id})
                .then(() => {
                  ElMessage.success('删除成功');
                  getList()
                })
          })
          .catch(() => {
          });
    };
    // 页面加载时
    onMounted(() => {
      getList();
    });
    return {
      getList,
      search,
      saveOrUpdateRef,
      onOpenSaveOrUpdate,
      deleted,
      store,
      userInfos,
      ...toRefs(state),
    };
  },
});
</script>
