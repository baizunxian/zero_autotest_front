<template>
  <div class="app-container">
    <div class="mb15">
      <el-input
          clearable
          v-model="listQuery.project_name"
          placeholder="输入项目名查询"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="search"/>
      <el-button v-waves class="filter-item" type="primary" @click="search">
        <el-icon>
          <ele-Search/>
        </el-icon>
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-s-flag" @click="getCommon">公共函数</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="openFuncDialog">公共函数列表
      </el-button>
      <el-dialog
          title="函数列表"
          :visible="dialogFormVisible"
          width="80%"
          top="8vh"
          style="height: 100%">
        <div class="filter-container">
          <el-input
              clearable
              v-model="funcQuery.func_name"
              placeholder="输入函数名查询"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="search"/>

          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getFuncList">查询
          </el-button>
        </div>
        <el-table
            :data="tableData"
            :key="tableKey2"
            height="480"
            border
        >
          <el-table-column prop="func_name" label="函数名称" width="180">
            <template #default="{row}">
              <el-button type="text" @click="getCommon(row)">{{ row.func_name }}</el-button>
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
              <el-button type="primary" icon="el-icon-caret-right" @click="showDebugFunc(row)">
                调试
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        stripe
        border
        fit
        :max-height="this.tableHeight"
        highlight-current-row
        style="width: 100%;"
        :header-cell-style="{background:'#F3F4F7',color:'#7e8084'}"

    >
      <el-table-column label="序号" width="50px" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (listQuery.page - 1) * listQuery.pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="所属项目" prop="project_name" align="left" width="300">
        <template slot-scope="{row}">
          <span style="color: cadetblue;">{{ row.project_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="DebugTalk" prop="leader_user" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" :underline="false" @click="edit(row)">debugtalk.py</el-link>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="creation_date" align="center" width="150"></el-table-column>
      <el-table-column label="更新时间" prop="updation_date" align="center" width="150"></el-table-column>
      <el-table-column prop="" label="操作" width="120">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" icon="el-icon-s-order" @click="openFuncDialog(row)">
            函数列表
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getDebugTalkList"/>

    <el-dialog
        lock-scroll
        title="函数调试"
        v-if="debugDialogShow"
        :visible.sync="debugDialogShow"
        width="80%"
        destroy-on-close
        :close-on-click-modal="false"
        center
        v-dialogDrag
        append-to-body
        top='4vh'
    >
      <div class="filter-container">
        <!--        <el-input-->
        <!--            clearable-->
        <!--            v-model="debugFuncForm.func_content"-->
        <!--            placeholder="输入项目名查询"-->
        <!--            style="width: 50%"-->
        <!--            class="filter-item"-->
        <!--        />-->
        <strong>{{ debugFuncForm.func_content }}</strong>
        <el-form size="mini" style="width: 50%;" label-position="left" label-width="100px" :model="funcArgsInfo">
          <el-form-item v-for="(value , key) in funcArgsInfo" :key="key" :label="key">
            <el-input v-model="funcArgsInfo[key]"></el-input>
          </el-form-item>
        </el-form>

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-caret-right" @click="debugFunc">
          执行
        </el-button>

        <json-viewer
            :value="debugFuncResult"
            :expand-depth="5"
            :copyable="copyable"
            :boxed="true"
            sort
        />
      </div>

    </el-dialog>

  </div>

</template>

<script>
// import {debugFunc, debugTalkList, getFuncList} from '@/api/case'
import Pagination from '/@/components/Pagination'
// import waves from '@/directive/waves' // waves directive
import {mapGetters} from 'vuex'
// import JsonViewer from '@/utils/vue-json-viewer'

export default {
  name: 'Debugtalk',
  components: {
    Pagination,
    JsonViewer,
  },
  directives: {waves},
  data() {
    return {
      debugDialogShow: false,
      debugFuncResult: null,
      tableKey: 0,
      tableKey2: 1,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10,
        order_field: null,
        sort_type: null,
        module_name: null,
        project_id: null,
        project_name: null,
      },
      tableData: [],
      functionNameList: ['获取token', '查询SQL'],
      funcQuery: {
        func_name: '',
        id: '',
      },
      dialogFormVisible: false,
      copyable: {copyText: '复制', copiedText: '复制成功'},
      funcArgsInfo: {},
      debugFuncForm: {
        id: null,
        func_content: '',
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'tableHeight',
    ])
  },
  created() {
    this.getDebugTalkList()
  },
  methods: {
    // 获取模块列表
    getDebugTalkList() {
      this.listLoading = true
      debugTalkList(this.listQuery)
          .then(res => {
            this.list = res.data.rows
            this.total = res.data.rowTotal
            this.listLoading = false
          })
    },

    // 查询
    search() {
      this.listQuery.page = 1
      this.getDebugTalkList()
    },

    // 修改
    edit(row) {
      this.$router.push({path: '/Api/editDebugtalk', query: {id: row.id}})
    },

    // 公共函数
    getCommon(row) {
      this.dialogFormVisible = false
      let query = {}
      if (this.funcQuery.id) {
        query = {
          id: this.funcQuery.id,
        }
      } else {
        query = {
          type: 'common',
        }
      }
      if (row) this.$set(query, 'find_content', row.func_name)
      this.$router.push({path: '/Api/editDebugtalk', query: query})
    },

    showDebugFunc(row) {
      this.debugFuncResult = ''
      this.funcArgsInfo = []
      this.funcArgsInfo = row.args_info
      this.debugDialogShow = !this.debugDialogShow
      this.debugFuncForm.func_content = row.func_name + row.func_args
      this.debugFuncForm.args_info = this.funcArgsInfo
      this.debugFuncForm.func_content = this.debugFuncForm.func_content.replace(/'/g, '"')
    },

    debugFunc() {
      this.debugFuncResult = ''
      this.debugFuncForm.id = this.funcQuery.id
      debugFunc(this.debugFuncForm)
          .then(res => {
            this.debugFuncResult = res.data.result
          })
    },
    //查询函数名称
    getFunctionNameList() {
      search_function_name_List(this.functionNameListQuery).then(res => {
        this.functionNameList = res.data
      })
    },
    //查询函数信息
    getFuncList() {
      getFuncList(this.funcQuery)
          .then(res => {
            this.tableData = res.data
          })
    },

    openFuncDialog(row) {
      this.funcQuery.id = null
      if (row) this.funcQuery.id = row.id
      this.dialogFormVisible = true
      this.getFuncList()
    }
  }
}
</script>

<style lang="scss" scoped>
.employee_body {
  margin: 10px 20px 0;
  overflow: hidden;
}

.inputclass {
  width: 300px;
}

.el-dialog {
  height: 50%;
}

table {
  width: 50%;
  border-collapse: collapse;

  tr, td {
    border: 1px solid #d2d2d6;
    padding: 5px;
  }
}

.filter-container {
  .filter-item {
    margin-right: 10px;
  }
}
</style>