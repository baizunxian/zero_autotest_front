<template>
  <div class="app-container">
    <el-page-header @back="goBack" content='报告详情' style="margin: 5px; font-size: 18px; font-weight: 500;"
                    v-if="this.fid">
    </el-page-header>
    <el-page-header @back="goBack2" content='CICD测试报告' style="margin: 5px; font-size: 18px; font-weight: 500;"
                    v-if="this.listQuery.id">
    </el-page-header>
    <div class="filter-container">
      <el-input
          clearable
          v-model="listQuery.report_name"
          placeholder="输入报告名查询"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="search"/>
      <el-input
          clearable
          v-model="listQuery.execute_user_name"
          placeholder="输入执行人查询" style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="search"/>
      <el-select v-model="listQuery.status" placeholder="运行结果" style="width: 150px;"
                 class="filter-item">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
          v-model="listQuery.min_and_max"
          type="datetimerange"
          align="right"
          start-placeholder="起始日期"
          end-placeholder="截止日期"
          style="width: 340px;"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="filter-item"
          :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-arrow-down" @click="excel_export">
        导出
      </el-button>
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-document" @click="logdialogVisible=true">
          日志
      </el-button> -->
    </div>

    <div>
      <el-link
          style="padding-bottom: 10px;"
          :underline="false"
          type="primary"
          :disabled="SelectionChange.length === 0"
          @click="batchStop">
        <i class="el-icon-caret-right"></i>
        停止
      </el-link>
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
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#F3F4F7',color:'#7e8084'}"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="序号" width="45px" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (listQuery.page - 1) * listQuery.pageSize + 1 }}
        </template>
      </el-table-column>
      <!--
            <el-table-column label="ID" prop="id" align="center" width="50"></el-table-column>
      -->
      <el-table-column label="报告名称" align="center" width="170" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <el-link type="primary" :underline="false" @click="lockreport(row)">{{ row.report_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" prop="type" align="center">
        <template slot-scope="{row}">
          <span v-if="row.type === 'case'">用例</span>
          <span v-if="row.type === 'suite'">套件</span>
          <span v-if="row.type === 'module'">模块</span>
          <span v-if="row.type === 'project'">项目</span>
          <span v-if="row.type === 'acg'">自动用例</span>
        </template>
      </el-table-column>
      <el-table-column label="执行类型" prop="run_type" align="center">
        <template slot-scope="{row}">
          <span>{{ getStatus(row.run_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行用例/总计用例" prop="test_count" align="center" width="125">
        <template #default="{scope}">
          <span>{{ scope.row.test_count + ' / ' + scope.row.scene_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行结果" prop="status" align="center" width="75">
        <template #default="{scope}">
          <el-tag type="success" v-if="scope.row.status">通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status==false">不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行结果" prop="successes" align="center"></el-table-column>
      <el-table-column label="成功用例" prop="successes_test_count" align="center"></el-table-column>
      <el-table-column label="执行耗时(秒)" prop="tests_run" align="center" width="100"></el-table-column>
      <el-table-column label="执行时间" prop="start_at" align="center" width="150"></el-table-column>
      <el-table-column label="执行人" prop="execute_user_name" align="center"></el-table-column>
      <!--            <el-table-column label="执行等级" prop="priority" align="center">-->
      <!--              <template slot="header">-->
      <!--                <span>执行等级</span>-->
      <!--                <el-tooltip placement="top" >-->
      <!--                  <div slot="content">-->
      <!--                    包含当前等级级以上等级的用例<br/>例如执行等级3，则运行的用例等级包含1，2，3-->
      <!--                  </div>-->
      <!--                  <i class="el-icon-info" style="color:#409eff;margin-left:5px;"></i>-->
      <!--                </el-tooltip>-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button  type="info" icon="el-icon-document" @click="lockreport(row)">
            详情
          </el-button>
          <el-button  type="primary" icon="el-icon-download" @click="reportDownload(row)"
                     :disabled="row.successes =='error'">
            下载
          </el-button>
          <!--                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteReport(row)">
                                  删除
                              </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getreportlist"/>

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

    <el-drawer
        title="日志"
        v-if="logdialogVisible"
        :visible.sync="logdialogVisible"
        direction="rtl"
        size="80%"
        :withHeader="false"
        destroy-on-close
    >
      <logs ref="loginfo"/>
    </el-drawer>
  </div>

</template>

<script>
// import {delReport, getReportById, getReportList, stopTest} from '@/api/report'
// import {getToken, getUserId} from '@/utils/auth'
import Pagination from '/@/components/Pagination'
// import logs from '@/components/logs'
// import testReport from './components/testReport'
// import waves from '@/directive/waves' // waves directive
import {mapGetters} from 'vuex'
// import {GetLookupValueList} from '@/api/lookup'
// import config from '@/config/config.js'
import axios from 'axios'


export default {
  name: 'projectlist',
  components: {
    Pagination,
    testReport,
    logs
  },
  directives: {waves},
  data() {
    return {
      dialogStatus: 'create',  // 弹窗类型
      operationType: {
        create: '新增',
        update: '修改',
      },
      dialogVisible: false,
      dialogVisible1: false,
      logdialogVisible: false,
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
      fid: null,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10,
        id: undefined,
        report_name: undefined,
        min_and_max: undefined,
        execute_user_name: undefined,
        responsible_name: undefined,
        fid: undefined,
        cicd_id: undefined,
        status: undefined,
        ids: [],
      },
      buttonStart: false,
      reportData: {},
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'tableHeight',
    ])
  },
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      if (to.query.batch) {
        vm.listQuery.id = to.query.batch;
      }
      if (to.query.cicd_id) {
        vm.listQuery.cicd_id = to.query.cicd_id
      }
      vm.getreportlist()
      if (to.meta.lookup_id) {
        vm.getLookupValue(to.meta.lookup_id)
      }
    })
  },

  methods: {
    // 获取项目列表
    getreportlist() {
      this.listLoading = true
      getReportList(this.listQuery)
          .then(res => {
            this.list = res.data.rows
            this.total = res.data.rowTotal
            this.listLoading = false
          })
    },

    //导出列表
    getreportlist_excel() {
      this.listQuery.ids = []
      this.SelectionChange.forEach((val, index) => {
        this.listQuery.ids.push(val.id)
      })
      axios({
        method: "POST",
        url: config.BaseUrl + '/reportListExcel',
        headers: {"Content-Type": "application/json;charset=UTF-8", "token": getToken(), "userId": getUserId()},
        data: this.listQuery,
        responseType: 'blob',
      }).then((res) => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', '测试报告.xlsx')
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
      this.getreportlist()
    },
    // 导出
    excel_export() {
      this.getreportlist_excel()
    },

    // 获取日志
    getLogs() {
      console.log('test111')
      //    this.$refs.loginfo.timerTaks()
    },
    // 日志关闭
    logclose() {
      this.logdialogVisible = !this.logdialogVisible
      this.$refs.loginfo.close()
      // this.$confirm('确认关闭？')
      // .then(_ => {
      //     this.logdialogVisible =!this.logdialogVisible
      //     this.$refs.log.close()
      //     done();
      // })
      // .catch(_ => {});
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
                    this.getreportlist()
                  }
                })
          })
    },
    // 获取报告
    lockreport(row) {
      if (row.successes == 'error') {
        this.reportLog(row)
      } else {
        if (row.run_type == '50') {
          this.reportDetail(row)
        } else {
          getReportById({id: row.id})
              .then(res => {
                this.reportData = res.data.reports
                this.$nextTick(() => {
                  this.dialogVisible = true
                })
              })
        }
      }
    },
    // 下载 报告
    reportDownload(row) {
      let hasToken = getToken()
      axios({
        method: 'GET',
        headers: {'token': hasToken},
        url: config.BaseUrl + `/reportDownload/${row.id}`,
        responseType: 'blob',
      }).then((res) => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], {type: 'application/vnd.ms-html'})
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', '测试报告.html')
        // document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(error => {
        this.$Notice.error({
          title: '错误',
          desc: '网络连接错误'
        })
        console.log(error)
      })
      // let a = document.createElement('a')
      // a.href = config.BaseUrl + `/reportDownload/${row.id}`,
      //     a.style.display = 'none'
      // a.click()
    },
    // 多选
    handleSelectionChange(val) {
      this.SelectionChange = val
    },
    // 日志详情
    reportLog(row) {
      getReportById({id: row.id})
          .then(res => {
            this.errorDetail = res.data.reports
            this.$nextTick(() => {
              this.dialogVisible1 = true
            })
          })
    },
    reportDetail(row) {
      this.$router.push({name: 'reportsDetailList', params: {batch: row.id}})
    },
    // 返回设置
    goBack() {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        report_name: undefined,
        min_and_max: undefined,
        execute_user_name: undefined,
        responsible_name: undefined,
        fid: undefined,
        cicd_id: undefined,
        id: undefined,
      },
          this.fid = null
      this.getreportlist()
    },
    // 返回设置
    goBack2() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({path: '/Api/CICDTasks'})
    },
    // 停止任务
    batchStop() {
      let batch_id = []
      this.SelectionChange.forEach(item => {
        batch_id.push(item.id)
      })
      if (batch_id.length > 0) {
        this.$confirm('是否停止选择的任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
            .then(() => {
              stopTest({batch_id: batch_id})
                  .then(res => {
                    this.$message({
                      type: 'success',
                      message: '停止成功!'
                    })
                    this.getreportlist()
                  })
            })
      }
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

<style lang="css"> .el-tooltip__popper {
  max-width: 20%
} </style>