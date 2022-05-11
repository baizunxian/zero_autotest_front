<template>
  <div>
    <el-card shadow="hover">
      <div class="mb15">
        <el-input v-model="listQuery.name" placeholder="请输入配置名称" style="max-width: 180px"></el-input>
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
          新增
        </el-button>
      </div>
      <el-table
          border
          v-loading="tableLoading"
          :data="listData"
          style="width: 100%">
        <el-table-column type="selection" width="55" align="center"></el-table-column>

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
            <template v-if="field.fieldName === 'name'">
              <el-button size="small"
                         type="text"
                         @click="onOpenSaveOrUpdate('update', row)">
                {{ row[field.fieldName] }}
              </el-button>
            </template>

            <template v-else>
              {{ row[field.fieldName] }}
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button type="text" @click="onOpenSaveOrUpdate('update', scope.row)">
              修改
            </el-button>
            <el-button type="text" @click="deleted(scope.row)">
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

    <el-dialog
        draggable
        v-model="showSaveOrUpdate"
        width="80%"
        top="8vh"
        :title="editType === 'save'? '新增配置':'更新配置'"
        destroy-on-close
        :close-on-click-modal="false">
      <save-or-update ref="saveOrUpdateRef" @getList="getList" :config_id="config_id"/>
      <template #footer>
        <el-button @click="showSaveOrUpdate = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import Pagination from '/@/components/Pagination/index.vue';
import {useTestCaseApi} from "/@/api/useAutoApi/testcase";
import {useRouter} from "vue-router";
import saveOrUpdate from '/@/views/api/configure/components/saveOrUpdate.vue';

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
  name: 'apiConfigure',
  components: {saveOrUpdate, Pagination},
  setup() {
    const saveOrUpdateRef = ref();
    const router = useRouter();
    const state = reactive({
      fieldData: [
        {fieldName: 'id', label: 'ID', width: '55', align: 'center', show: true},
        {fieldName: 'name', label: '配置名称', width: '', align: 'center', show: true},
        {fieldName: 'project_name', label: '所属项目', width: '', align: 'center', show: true},
        {fieldName: 'module_name', label: '所属模块', width: '', align: 'center', show: true},
        {fieldName: 'updation_date', label: '更新时间', width: '150', align: 'center', show: true},
        {fieldName: 'updated_by_name', label: '更新人', width: '', align: 'center', show: true},
        {fieldName: 'creation_date', label: '创建时间', width: '150', align: 'center', show: true},
        {fieldName: 'created_by_name', label: '创建人', width: '', align: 'center', show: true},
      ],
      // list
      listData: [],
      tableLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 20,
        case_type: 2,
        name: '',
      },
      // configure
      editType: 'save',
      config_id: null,
      showSaveOrUpdate: false,
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

    // 查询
    const search = () => {
      state.listQuery.page = 1
      getList()
    }

    // 新增或修改
    const onOpenSaveOrUpdate = (editType: string, row: any | null) => {
      state.editType = editType
      if (row && row.id) {
        state.config_id = row.id
      } else {
        state.config_id = null
      }
      state.showSaveOrUpdate = !state.showSaveOrUpdate
      // router.push({name: 'saveOrUpdateTestCase', query: query})
    };

    // saveOrUpdate
    const saveOrUpdate = () => {
      saveOrUpdateRef.value.saveOrUpdate()
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


    // 页面加载时
    onMounted(() => {
      getList();
    });
    return {
      getList,
      search,
      saveOrUpdateRef,
      saveOrUpdate,
      onOpenSaveOrUpdate,
      deleted,
      router,
      ...toRefs(state),
    };
  },
});
</script>
