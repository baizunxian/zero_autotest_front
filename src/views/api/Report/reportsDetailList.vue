<template>
  <div class="app-container">
    <el-page-header @back="goBack" content='报告详情' style="margin: 5px; font-size: 18px; font-weight: 500;">
    </el-page-header>
    <div class="filter-container">
      <el-input
          clearable
          v-model="listQuery.summary_report_name"
          placeholder="输入报告名查询"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="search"/>
      <el-input
          clearable
          v-model="listQuery.basic_execute_user"
          placeholder="输入执行人查询" style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="search"/>
      <el-input
          clearable
          v-model="listQuery.case_created_by_name"
          placeholder="输入用例创建人查询" style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="search"/>
      <el-select v-model="listQuery.summary_success" placeholder="运行结果" style="width: 150px;"
                 class="filter-item">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.request_method" placeholder="请求方法" style="width: 150px;"
                 class="filter-item">
        <el-option
            v-for="item in options_method"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-arrow-down" @click="excel_export">
        导出
      </el-button>
    </div>
    <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        stripe
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#F3F4F7',color:'#7e8084'}"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="序号" width="50px" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (listQuery.page - 1) * listQuery.pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="报告名称" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" :underline="false" :disabled="row.basic_extend_string_1 == ''"
                   @click="lockreport(row)">{{ row.summary_report_name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="运行结果" prop="summary_success" align="center" width="75">
        <template slot-scope="{row}">
          <el-tag type="success" v-if="row.summary_success">通过</el-tag>
          <el-tag v-else type="danger">不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行耗时(秒)" prop="summary_duration" align="center" width="100"></el-table-column>
      <el-table-column label="状态码" prop="response_status_code" align="center" width="100"></el-table-column>
      <el-table-column label="请求方法" prop="request_method" align="center" width="100"></el-table-column>
      <el-table-column label="执行时间" prop="request_start_timestamp" align="center" width="150"></el-table-column>
      <el-table-column label="执行人" prop="basic_execute_user" align="center"></el-table-column>
      <el-table-column label="用例创建人" prop="case_created_by_name" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" :disabled="!row.c_id" icon="el-icon-s-promotion" @click="to_case(row)">
            跳转到用例
          </el-button>

          <el-button size="mini" type="primary" icon="el-icon-download" @click="reportDetailDownload(row)">
            下载
          </el-button>

          <!--                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteReport(row)">
                                  删除
                              </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getreportdetaillist"/>

    <el-dialog
        lock-scroll
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        width="80%"
        destroy-on-close
        :close-on-click-modal="false"
        center
        top='4vh'
        v-dialogDrag
    >
      <div slot="title">测试报告</div>
      <test-report :reportData="reportData"/>
    </el-dialog>

    <el-dialog
        title="报错信息"
        :visible.sync="dialogVisible1"
        width="30%">
      <span>{{ this.errorDetail }}</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
            </span>
    </el-dialog>
  </div>

</template>

<script>
import {getReportList, delReport, getReportById, reportsDetailList, getReportNewById} from '@/api/report'
import Pagination from '@/components/Pagination'
import testReport from './components/testReport'
import waves from '@/directive/waves' // waves directive
import {mapGetters} from 'vuex'
import {GetLookupValueList, saveOrUpdateLookupValue, delLookupValue} from '@/api/lookup'
import config from '@/config/config.js'
import axios from 'axios'
import {getToken, getUserId} from '@/utils/auth'


export default {
  name: 'reportsDetailList',
  components: {
    Pagination,
    testReport,
  },
  directives: {waves},
  data() {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      tableKey: 0,
      errorDetail: '',
      listLoading: true,
      list: null,
      SelectionChange: [],
      lookup_value_list: [],
      options: [{
        value: null,
        label: '全部'
      }, {
        value: 1,
        label: '通过'
      }, {
        value: 0,
        label: '不通过'
      }],
      options_method: [{
        value: null,
        label: '全部'
      }, {
        value: 'GET',
        label: 'GET'
      }, {
        value: 'POST',
        label: 'POST'
      }],
      fid: null,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10,
        batch: undefined,
        request_method: undefined,
        summary_report_name: undefined,
        basic_project_id: undefined,
        basic_module_id: undefined,
        basic_execute_user: undefined,
        summary_success: null,
        case_created_by_name: null,
        ids: []
      },
      buttonStart: false,
      reportData: {},
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  beforeRouteEnter(to, form, next) {
    console.log(to)
    next((vm) => {
      vm.listQuery.batch = to.params.batch;
      vm.getreportdetaillist()
      if (to.meta.lookup_id) {
        vm.getLookupValue(to.meta.lookup_id)
      }
    })
  },

  methods: {
    // 获取报告详情列表
    getreportdetaillist() {
      this.listLoading = true
      reportsDetailList(this.listQuery)
          .then(res => {
            this.list = res.data.rows
            this.total = res.data.rowTotal
            this.listLoading = false
          })
    },

    //导出列表
    getreportDetaillist_excel() {
      this.listQuery.ids = []
      this.SelectionChange.forEach((val, index) => {
        this.listQuery.ids.push(val.id)
      })
      axios({
        method: "POST",
        url: config.BaseUrl + '/reportListDetailExcel',
        headers:{"Content-Type":"application/json;charset=UTF-8","token":getToken(),"userId":getUserId()},
        data: this.listQuery,
        responseType: 'blob',
      }).then((res) => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', '测试报告详情.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(error => {
        this.$Notice.error({
          title: '错误',
          desc: '网络连接错误'
        })
        console.log(error)
      })
    },
    // 获取数据字典
    getLookupValue(looup_id) {
      GetLookupValueList({lookup_id: looup_id})
          .then(res => {
            this.lookup_value_list = res.data
          })
    },
    resetcarouselform() {
      this.projectform = {
        id: undefined,
        project_name: '',
        responsible_name: '',
        dev_user: '',
        test_user: '',
        publish_app: '',
        simple_desc: '',
        other_desc: '',
        config_id: undefined,
        created_by: this.userId,
      }
    },
    // 查询
    search() {
      this.listQuery.page = 1
      this.getreportdetaillist()
    },
    // 导出
    excel_export() {
      this.getreportDetaillist_excel()
    },
    // 状态转换
    getStatus(val) {
      let value = this.lookup_value_list.find(v => v.lookup_code === val)
      if (value) {
        return value.lookup_value
      } else {
        return ''
      }
    },
    deleteReport(val, index) {
      this.$confirm('是否删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(() => {
            delReport({'id': val.id, 'created_by': this.userId})
                .then(res => {
                  if (res.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    })
                    this.getreportdetaillist()
                  }
                })
          })
    },
    // 获取报告
    lockreport(row) {
      getReportNewById({id: row.id, batch: row.basic_batch})
          .then(res => {
            this.reportData = res.data.basic_extend_string_1
            this.$nextTick(() => {
              this.dialogVisible = true
            })
          })
    },
    // 下载 报告
    reportDetailDownload(row) {
      let a = document.createElement('a')
      a.href = config.BaseUrl + `/reportDetailDownload/${this.listQuery.batch}/${row.id}`;
      a.click()
    },
    // 多选
    handleSelectionChange(val) {
      this.SelectionChange = val
    },
    // 日志详情
    reportLog(row) {
      getReportById({id: row.id})
          .then(res => {
            this.errorDetail = res.data.basic_extend_string_1
            this.$nextTick(() => {
              this.dialogVisible1 = true
            })
          })
    },
    // 返回设置
    goBack() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1)
      // this.$router.push({path: '/Api/Report'})
    },
    // 查看用例信息，
    to_case(row) {
      // this.$router.push('')
      this.$router.push({path: '/Api/saveOrUpdateCase', query: {type: 'update', id: row.c_id}})
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

::v-deep .el-dialog--center .el-dialog__body {
  padding: 5px;
}
</style>