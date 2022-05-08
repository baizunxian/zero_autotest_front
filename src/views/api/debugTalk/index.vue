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
            @keyup.enter.native="search">

        </el-input>

        <el-button class="ml10" type="primary" @click="search">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button class="ml10" type="warning" @click="onOpenSaveOrUpdate(null)">
          <el-icon>
            <ele-Guide/>
          </el-icon>
          公共函数
        </el-button>
        <!--        函数列表-->
        <el-button class="ml10" type="primary" @click="openFuncList">公共函数列表
        </el-button>
      </div>
      <!--函数列表-->
      <el-dialog
          draggable
          title="函数列表"
          v-model="debugFuncListShow"
          width="80%"
          top="8vh"
          style="height: 100%">
        <div class="mb15">
          <el-input
              clearable
              v-model="funcQuery.func_name"
              placeholder="输入函数名查询"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="search"/>

          <el-button class="ml10" type="primary" @click="getFuncList">
            <el-icon>
              <ele-Search/>
            </el-icon>
            查询
          </el-button>
        </div>
        <!--          函数列表-->
        <el-table
            :data="funcList"
            :key="0"
            border
            fit
            highlight-current-row
            style="width: 100%;"
        >
          <el-table-column prop="func_name" label="函数名称" width="180">
            <template #default="{row}">
              <el-link type="primary" :underline="false" @click="getCommon(row)">{{ row.func_name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="func_args" label="函数参数" width="300">
            <template #default="{row}">
              <strong>{{ row.func_args }}</strong>
            </template>
          </el-table-column>
          <el-table-column prop="func_doc" label="函数说明">
            <template #default="{row}">
              <div style="white-space: pre-wrap; font-weight: bold" v-html="row.func_doc"></div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="100">
            <template #default="{row}">
              <el-button type="text" icon="el-icon-caret-right" @click="showDebugFunc(row)">
                调试
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!--函数调试-->
      <el-dialog
          draggable
          lock-scroll
          title="函数调试"
          v-if="debugFuncShow"
          v-model="debugFuncShow"
          width="80%"
          destroy-on-close
          :close-on-click-modal="false"
          center
          append-to-body
          top='4'
      >
        <div class="filter-container">
          <div class="mb15">
            <strong>{{ debugFuncForm.func_parse_str }}</strong>
            <div style="white-space: pre-wrap; font-weight: bold" v-html="debugFuncForm.func_doc"></div>
          </div>

          <el-form size="mini" style="width: 50%;" label-position="left" label-width="100px" :model="funcArgsInfo">
            <el-form-item v-for="(value , key) in funcArgsInfo" :key="key" :label="key">
              <el-input v-model="funcArgsInfo[key]"></el-input>
            </el-form-item>
          </el-form>

          <el-button class="filter-item" type="primary" icon="el-icon-caret-right" @click="debugFunc">
            执行
          </el-button>

          <json-viewer
              :value="debugFuncResult"
              :expand-depth="5"
              copyable
              :boxed="true"
              sort
          />
        </div>
      </el-dialog>

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
            <template v-if="field.fieldName === 'debug_talk'">
              <el-button size="small"
                         type="text"
                         @click="onOpenSaveOrUpdate(row)">
                debugtalk.py
              </el-button>
            </template>

            <template v-else>
              {{ row[field.fieldName] }}
            </template>
          </template>
        </el-table-column>


        <!--        <el-table-column prop="" label="操作" width="120" align="center">-->
        <!--          <template #default="scope">-->
        <!--            <el-button type="text" icon="el-icon-s-order" @click="getList(scope.row)">-->
        <!--              函数列表-->
        <!--            </el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>

      <pagination :total="total"
                  :hidden="total === 0"
                  v-model:page="listQuery.page"
                  v-model:limit="listQuery.pageSize"
                  @pagination="getList"/>

    </el-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import Pagination from '/@/components/Pagination/index.vue';
import {useDebugTalkApi} from "/@/api/useAutoApi/debugTalk";
import {useRouter} from 'vue-router'

import "vue3-json-viewer/dist/index.css"
import {JsonViewer} from 'vue3-json-viewer'

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
  name: 'apiDebugTalk',
  components: {Pagination, JsonViewer},
  setup() {
    const saveOrUpdateRef = ref();
    const router = useRouter();
    const state = reactive({
      fieldData: [
        {fieldName: 'id', label: 'ID', width: '55', align: 'center', show: true},
        {fieldName: 'project_name', label: '所属项目', width: '', align: 'center', show: true},
        {fieldName: 'debug_talk', label: 'DebugTalk', width: '', align: 'center', show: true},
        {fieldName: 'module_name', label: '所属模块', width: '', align: 'center', show: true},
        {fieldName: 'updation_date', label: '更新时间', width: '150', align: 'center', show: true},
        {fieldName: 'updated_by_name', label: '更新人', width: '', align: 'center', show: true},
        // {fieldName: 'creation_date', label: '创建时间', width: '150', align: 'center', show: true},
        // {fieldName: 'created_by_name', label: '创建人', width: '', align: 'center', show: true},
      ],
      // list
      listData: [],
      tableLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 20,
        project_name: '',
      },

      // funcInfo
      debugFuncResult: null,  // 函数运行结果
      funcList: [],      // 函数列表
      debugFuncListShow: false,
      debugFuncShow: false,
      funcQuery: {
        id: null,
        func_name: '',
      },
      funcArgsInfo: {},  // 函数参数
      debugFuncForm: {
        id: null,
        func_parse_str: '',
        func_name: '',
      }
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

    // 查询
    const search = () => {
      state.listQuery.page = 1
      getList()
    }

    // 新增或修改
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

    // 打开函数列表页面
    const openFuncList = (row: any) => {
      state.funcQuery.id = null
      if (row) state.funcQuery.id = row.id
      state.debugFuncListShow = !state.debugFuncListShow
      getFuncList()
    }
    //获取函数列表
    const getFuncList = () => {
      useDebugTalkApi().getFuncList(state.funcQuery)
          .then(res => {
            state.funcList = res.data
          })
    }
    //函数页面初始化
    const showDebugFunc = (row) => {
      state.debugFuncResult = ''
      state.funcArgsInfo = []
      state.funcArgsInfo = row.args_info
      state.debugFuncShow = !state.debugFuncShow
      state.debugFuncForm.func_parse_str = row.func_name + row.func_args
      state.debugFuncForm.func_name = row.func_name
      state.debugFuncForm.func_doc = row.func_doc
      state.debugFuncForm.args_info = state.funcArgsInfo
    }
    // 函数调试
    const debugFunc = () => {
      state.debugFuncResult = ''
      state.debugFuncForm.id = state.funcQuery.id
      useDebugTalkApi().debugFunc(state.debugFuncForm)
          .then(res => {
            state.debugFuncResult = res.data.result
          })
    }
    // 页面加载时
    onMounted(() => {
      getList();
    });
    return {
      getList,
      search,
      saveOrUpdateRef,
      onOpenSaveOrUpdate,
      openFuncList,
      getFuncList,
      showDebugFunc,
      debugFunc,
      deleted,
      ...toRefs(state),
    };
  },
});
</script>
