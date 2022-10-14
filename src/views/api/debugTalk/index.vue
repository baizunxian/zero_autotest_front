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
              <el-button type="primary" link icon="el-icon-caret-right" @click="showDebugFunc(row)">
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
          append-to-body
      >
        <div>
          <div class="mb15">
            <strong>{{ debugFuncForm.func_parse_str }}</strong>
            <div style="white-space: pre-wrap; font-weight: bold" v-html="debugFuncForm.func_doc"></div>
          </div>

          <el-form size="mini" style="width: 50%;" label-position="left" label-width="100px" :model="funcArgsInfo">
            <el-form-item v-for="(value, key) in funcArgsInfo" :key="key" :label="key">
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

      <zero-table
          :columns="columns"
          :data="listData"
          v-model:page-size="listQuery.pageSize"
          v-model:page="listQuery.page"
          :total="total"
          @pagination-change="getList"
      >
      </zero-table>

    </el-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs, h} from 'vue';
import {ElMessage, ElMessageBox, ElButton} from 'element-plus';
import {useDebugTalkApi} from "/@/api/useAutoApi/debugTalk";
import {useRouter} from 'vue-router'

import "vue3-json-viewer/dist/index.css"


export default defineComponent({
  name: 'apiDebugTalk',
  setup() {
    const saveOrUpdateRef = ref();
    const router = useRouter();
    const state = reactive({
      columns: [
        {label: '序号', columnType: 'index', width: 'auto', showTooltip: true},
        {key: 'id', label: 'ID', width: '55', align: 'center', show: true},
        {key: 'project_name', label: '所属项目', width: '', align: 'center', show: true},
        {
          key: 'debug_talk', label: 'scriptcode', width: '', align: 'center', show: true,
          render: (row: any) => h(ElButton, {
            link: true,
            type: "primary",
            onClick: () => {
              onOpenSaveOrUpdate(row)
            }
          }, "script_code.py")
        },
        {key: 'module_name', label: '所属模块', width: '', align: 'center', show: true},
        {key: 'updation_date', label: '更新时间', width: '150', align: 'center', show: true},
        {key: 'updated_by_name', label: '更新人', width: '', align: 'center', show: true},
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
      let query: any = {}
      if (row) {
        query.id = row.id
      } else {
        query.common = 'common'
      }
      router.push({name: 'saveOrUpdateDebugTalk', query: query})
      // saveOrUpdateRef.value.openDialog(editType, row);
    };

    // 删除角色
    const deleted = (row: any) => {
      ElMessageBox.confirm('是否删除该条数据, 是否继续?', '提示', {
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
    const showDebugFunc = (row: any) => {
      state.debugFuncResult = ''
      state.funcArgsInfo = {}
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
