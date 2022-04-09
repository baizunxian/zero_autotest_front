<template>
  <div>
    <el-card shadow="hover">
      <div class="mb15">
        <el-input v-model="listQuery.name" placeholder="请输入用例名称" style="max-width: 180px"></el-input>
        <el-button type="primary" class="ml10" @click="getList">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button type="success" class="ml10" @click="onOpenSaveOrUpdate('save', null)">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增
        </el-button>
      </div>
      <el-table
          border
          v-loading="tableLoading"
          :data="listData"
          style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="ID" show-overflow-tooltip prop="id" width="55"></el-table-column>
        <el-table-column label="用例名" show-overflow-tooltip prop="name">
          <template #default="scope">
            <el-button type="text" @click="onOpenSaveOrUpdate('update', scope.row)">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="所属项目" show-overflow-tooltip prop="project_name"></el-table-column>
        <el-table-column label="所属模块" show-overflow-tooltip prop="module_name"></el-table-column>
        <el-table-column label="关联配置" show-overflow-tooltip prop="config_id"></el-table-column>
        <el-table-column label="更新人" show-overflow-tooltip prop="created_by_name"></el-table-column>
        <el-table-column label="更新时间" show-overflow-tooltip prop="updation_date"></el-table-column>
        <el-table-column label="创建时间" show-overflow-tooltip prop="creation_date"></el-table-column>
        <el-table-column label="创建人" show-overflow-tooltip prop="updated_by_name"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="text"
                       @click="onOpenRunPage(scope.row)">运行
            </el-button>

            <el-button type="text"
                       @click="onOpenSaveOrUpdate('update', scope.row)">修改
            </el-button>
            <el-button type="text" @click="deleted(scope.row)">
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
          @pagination="getList"/>
    </el-card>
    <save-or-update ref="saveOrUpdateRef" @getList="getList"/>

    <el-dialog
        v-model="showRunPage"
        width="600px"
        top="8vh"
        title="运行用例"
        :close-on-click-modal="false">
      <el-form
          :model="runForm"
          label-width="70px"

      >
        <el-form-item label="运行环境" prop="belong_project_id">
          <el-select v-model="runForm.base_url" placeholder="选择环境" filterable style="width:100%">
            <el-option :value="''" label="自带环境">自带环境</el-option>
            <el-option
                v-for="item in envList"
                :key="item.id"
                :label="item.name"
                :value="item.url">
              <span style="float: left">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
            <span class="dialog-footer">
              <el-button @click="showRunPage = !showRunPage">取消</el-button>
              <el-button type="primary" :loading="runCaseLoading" @click="runTestCase">运行</el-button>
            </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import saveOrUpdate from '/@/views/api/module/components/saveOrUpdate.vue';
import Pagination from '/@/components/Pagination/index.vue';
import {useTestCaseApi} from "/@/api/useAutoApi/testcase";
import {useRouter} from "vue-router";
import {useEnvApi} from "/@/api/useAutoApi/env";

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
  name: 'apiTestCase',
  components: {saveOrUpdate, Pagination},
  setup() {
    const saveOrUpdateRef = ref();
    const router = useRouter();
    const state = reactive({
      listData: [],
      tableLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 20,
        name: '',
      },
      // run test case
      showRunPage: false,
      runCaseLoading: false,
      envList: [],
      runForm: {
        id: null,
        base_url: '',
      }
    });
    // 初始化表格数据
    const getList = () => {
      state.tableLoading = true
      useTestCaseApi().getList(state.listQuery)
          .then(res => {
            state.listData = res.data.rows
            state.total = res.data.rowTotal
            state.tableLoading = false
          })
    };

    // 新增或修改
    const onOpenSaveOrUpdate = (editType: string, row: any | null) => {
      let query: object = {}
      query.editType = editType
      if (row) query.id = row.id
      router.push({name: 'saveOrUpdateTestCase', query: query})
    };

    // 删除角色
    const deleted = (row: any) => {
      ElMessageBox.confirm(`此操作将删除角色名称：“${row.name}”，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            useTestCaseApi().deleted({id: row.id})
                .then(() => {
                  ElMessage.success('删除成功');
                  getList()
                })
          })
          .catch(() => {
          });
    };

    // 打开运行页面
    const onOpenRunPage = (row: any) => {
      state.showRunPage = true;
      state.runForm.id = row.id;
      getEnvList();
    };
    // 获取环境信息
    const getEnvList = () => {
      useEnvApi().getList({page: 1, pageSize: 1000})  // 请求数据写死，后面优化
          .then(res => {
            state.envList = res.data.rows
          })
    }
    // 运行测试用例
    const runTestCase = () => {
      state.runCaseLoading = !state.runCaseLoading;
      useTestCaseApi().runTestCase(state.runForm)
          .then(res => {
            console.log(res)
            ElMessage.success('运行成功');
            state.runCaseLoading = !state.runCaseLoading;
            state.showRunPage = false;
          })
          .catch((err: any) => {
            ElMessage.error(err.message);
            state.runCaseLoading = !state.runCaseLoading;
          })
    }
    // 页面加载时
    onMounted(() => {
      getList();
    });
    return {
      getList,
      saveOrUpdateRef,
      getEnvList,
      onOpenRunPage,
      runTestCase,
      onOpenSaveOrUpdate,
      deleted,
      router,
      ...toRefs(state),
    };
  },
});
</script>
