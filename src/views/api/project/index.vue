<template>
  <div>
    <el-card shadow="hover">
      <div class="mb15">
        <el-input v-model="listQuery.name" placeholder="请输入项目名称" style="max-width: 180px"></el-input>
        <el-button type="primary" class="ml10" @click="getProjectList">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button type="success" class="ml10" @click="onOpenSaveOrUpdate('save', null)">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增项目
        </el-button>
      </div>
      <el-table
          v-loading="tableLoading"
          :data="listData"
          style="width: 100%">
        <el-table-column label="项目名称" show-overflow-tooltip prop="name"></el-table-column>
        <el-table-column label="负责人" show-overflow-tooltip prop="responsible_name"></el-table-column>
        <el-table-column label="测试人员" show-overflow-tooltip prop="test_user"></el-table-column>
        <el-table-column label="开发人员" show-overflow-tooltip prop="dev_user"></el-table-column>
        <el-table-column label="发布应用" show-overflow-tooltip prop="publish_app"></el-table-column>
        <el-table-column label="描述" show-overflow-tooltip prop="simple_desc"></el-table-column>
        <el-table-column label="其他信息" show-overflow-tooltip prop="other_desc"></el-table-column>
        <el-table-column label="关联配置" show-overflow-tooltip prop="config_id"></el-table-column>
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
          @pagination="getProjectList"/>
    </el-card>
    <save-or-update-project ref="saveOrUpdateProjectRef" @getProjectList="getProjectList"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import saveOrUpdateProject from '/@/views/api/project/component/saveOrUpdateProject.vue';
import Pagination from '/@/components/Pagination/index.vue';
import {useProjectApi} from "/@/api/useAutoApi/project";

// 定义接口来定义对象的类型
// interface TableData {
//   roleName: string;
//   roleSign: string;
//   describe: string;
//   sort: number;
//   status: boolean;
//   createTime: string;
// }


export default defineComponent({
  name: 'apiProject',
  components: {saveOrUpdateProject, Pagination},
  setup() {
    const saveOrUpdateProjectRef = ref();
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
    const getProjectList = () => {
      state.tableLoading = true
      useProjectApi().getProjectList(state.listQuery)
          .then(res => {
            state.listData = res.data.rows
            state.total = res.data.rowTotal
            state.tableLoading = false
          })
    };

    // 新增或修改角色
    const onOpenSaveOrUpdate = (editType: string, row: any) => {
      saveOrUpdateProjectRef.value.openDialog(editType, row);
    };

    // 删除角色
    const delRole = (row: any) => {
      ElMessageBox.confirm(`此操作将删除角色名称：“${row.name}”，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            useProjectApi().delProject({id: row.id})
                .then(() => {
                  ElMessage.success('删除成功');
                  getProjectList()
                })
          })
          .catch(() => {
          });
    };
    // 页面加载时
    onMounted(() => {
      getProjectList();
    });
    return {
      getProjectList,
      saveOrUpdateProjectRef,
      onOpenSaveOrUpdate,
      delRole,
      ...toRefs(state),
    };
  },
});
</script>
