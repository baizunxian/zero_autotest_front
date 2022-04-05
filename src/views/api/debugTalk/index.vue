<template>
  <div>
    <el-card shadow="hover">
      <div class="mb15">
        <el-input
            clearable
            v-model="listQuery.project_name"
            placeholder="输入项目名查询"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="getList"/>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
          查询
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-s-flag" @click="onOpenSaveOrUpdate(null)">公共函数
        </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="openFuncDialog">公共函数列表
        </el-button>
        <!--      <el-dialog-->
        <!--          title="函数列表"-->
        <!--          :visible="dialogFormVisible"-->
        <!--          width="80%"-->
        <!--          top="8vh"-->
        <!--          style="height: 100%">-->
        <!--        <div class="filter-container">-->
        <!--          <el-input-->
        <!--              clearable-->
        <!--              v-model="funcQuery.func_name"-->
        <!--              placeholder="输入函数名查询"-->
        <!--              style="width: 200px;"-->
        <!--              class="filter-item"-->
        <!--              @keyup.enter.native="search"/>-->

        <!--          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getFuncList">查询-->
        <!--          </el-button>-->
        <!--        </div>-->
        <!--        <el-table-->
        <!--            :data="tableData"-->
        <!--            :key="tableKey2"-->
        <!--            height="480"-->
        <!--            border-->
        <!--        >-->
        <!--          <el-table-column prop="func_name" label="函数名称" width="180">-->
        <!--            <template #default="scope">-->
        <!--              <el-link type="primary" :underline="false" @click="getCommon(row)">{{ row.func_name }}</el-link>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column prop="func_args" label="函数参数" width="300">-->
        <!--            <template #default="scope">-->
        <!--              <strong>{{ row.func_args }}</strong>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column prop="func_doc" label="函数说明">-->
        <!--            <template #default="scope">-->
        <!--              <div style="white-space: pre-wrap; font-weight: bold" v-html="row.func_doc"></div>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column prop="" label="操作" width="100">-->
        <!--            <template #default="scope">-->
        <!--              <el-button size="mini" type="primary" icon="el-icon-caret-right" @click="showDebugFunc(row)">-->
        <!--                调试-->
        <!--              </el-button>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->
        <!--      </el-dialog>-->
        <!--    </div>-->
      </div>
      <el-table
          v-loading="tableLoading"
          :data="listData"
          stripe
          border
          fit
          highlight-current-row
          style="width: 100%;"
      >
        <el-table-column label="序号" width="50px" align="center">
          <template #default="scope">
            {{ scope.$index + (listQuery.page - 1) * listQuery.pageSize + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="所属项目" prop="project_name" align="left" width="300">
          <template #default="scope">
            <span style="color: cadetblue;">{{ scope.row.project_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="DebugTalk" prop="leader_user" align="center">
          <template #default="scope">
            <el-link type="primary" :underline="false" @click="onOpenSaveOrUpdate(scope.row)">debugtalk.py</el-link>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="creation_date" align="center" width="150"></el-table-column>
        <el-table-column label="更新时间" prop="updation_date" align="center" width="150"></el-table-column>
        <el-table-column prop="" label="操作" width="120">
          <template #default="scope">
            <el-button size="mini" type="primary" icon="el-icon-s-order" @click="getList(scope.row)">
              函数列表
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page="listQuery.page" :limit="listQuery.pageSize"
                  @pagination="getList"/>


    </el-card>

    <!--    <save-or-update ref="saveOrUpdateRef" @getList="getList"/>-->
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import saveOrUpdate from '/@/views/api/module/components/saveOrUpdate.vue';
import Pagination from '/@/components/Pagination/index.vue';
import {useDebugTalkApi} from "/@/api/useAutoApi/debugTalk";
import {useRouter} from 'vue-router'

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
  name: 'apiModule',
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
        project_name: '',
      },
    });
    // 初始化表格数据
    const getList = () => {
      state.tableLoading = true
      useDebugTalkApi().getList(state.listQuery)
          .then(res => {
            state.listData = res.data.rows
            state.total = res.data.rowTotal
            state.tableLoading = false
          })
    };

    // 新增或修改角色
    const onOpenSaveOrUpdate = (row: any) => {
      let query = {}
      console.log('row', row)
      if (row) {
        query.id = row.id
      } else {
        query.common = 'common'
      }
      console.log('query', query)
      router.push({name: 'saveOrUpdateDebugTalk', query: query})
      // saveOrUpdateRef.value.openDialog(editType, row);
    };

    // 删除角色
    const deleted = (row: any) => {
      ElMessageBox.confirm(`此操作将删除角色名称：“${row.name}”，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            useDebugTalkApi().deleted({id: row.id})
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
      saveOrUpdateRef,
      onOpenSaveOrUpdate,
      deleted,
      ...toRefs(state),
    };
  },
});
</script>
