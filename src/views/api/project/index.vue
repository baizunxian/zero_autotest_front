<template>
  <div>
    <el-card shadow="hover">
      <div class="mb15">
        <el-input v-model="listQuery.name" placeholder="请输入项目名称" style="max-width: 180px"></el-input>
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

        <el-table-column label="操作" width="100" align="center">
          <template #default="{row}">
            <el-button size="small" type="text" @click="onOpenSaveOrUpdate('update', row)">
              修改
            </el-button>
            <el-button size="small" type="text" @click="deleted(row)">
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
    <save-or-update ref="saveOrUpdateRef" @getList="getList"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import saveOrUpdate from '/@/views/api/project/components/saveOrUpdate.vue';
import Pagination from '/@/components/Pagination/index.vue';
import {useProjectApi} from "/@/api/useAutoApi/project";
//
// interface rowData {
//   name: string,
//   responsible_name: string,
//   test_user: string,
//   dev_user: string,
//   publish_app: string,
//   simple_desc: string,
//   other_desc: string,
//   config_id: number,
//   creation_date: string,
//   updation_date: string,
//   created_by: number,
//   updated_by: number,
// }
//
// interface queryData {
//   page: number,
//   pageSize: number,
//   name: string,
// }
//
// // 定义接口来定义对象的类型
// interface State {
//   listData: rowData[],
//   tableLoading: boolean,
//   total: number,
//   listQuery: queryData,
// }


export default defineComponent({
  name: 'apiProject',
  components: {saveOrUpdate, Pagination},
  setup() {
    const saveOrUpdateRef = ref();
    const state = reactive({
      fieldData: [
        {fieldName: 'name', label: '项目名称', width: '', align: 'center', show: true},
        {fieldName: 'responsible_name', label: '负责人', width: '', align: 'center', show: true},
        {fieldName: 'test_user', label: '测试人员', width: '', align: 'center', show: true},
        {fieldName: 'dev_user', label: '开发人员', width: '', align: 'center', show: true},
        {fieldName: 'publish_app', label: '发布应用', width: '', align: 'center', show: true},
        {fieldName: 'simple_desc', label: '描述', width: '', align: 'center', show: true},
        {fieldName: 'remarks', label: '备注', width: '', align: 'center', show: true},
        {fieldName: 'config_id', label: '关联配置', width: '', align: 'center', show: true},
        {fieldName: 'updation_date', label: '更新时间', width: '150', align: 'center', show: true},
        {fieldName: 'updated_by_name', label: '更新人', width: '', align: 'center', show: true},
        {fieldName: 'creation_date', label: '创建时间', width: '150', align: 'center', show: true},
        {fieldName: 'created_by_name', label: '创建人', width: '', align: 'center', show: true},
      ],
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
    const getList = () => {
      state.tableLoading = true
      useProjectApi().getList(state.listQuery)
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

    // 新增或修改角色
    const onOpenSaveOrUpdate = (editType: string, row: any) => {
      saveOrUpdateRef.value.openDialog(editType, row);
    };

    // 删除角色
    const deleted = (row: any) => {
      ElMessageBox.confirm(`此操作将删除名称：“${row.name}”，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            useProjectApi().deleted({id: row.id})
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
      ...toRefs(state),
    };
  },
});
</script>
