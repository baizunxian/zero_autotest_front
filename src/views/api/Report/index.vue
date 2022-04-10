<template>
  <div>
    <el-card shadow="hover">
      <div class="mb15">
        <el-input
            clearable
            v-model="listQuery.name"
            placeholder="输入报告名查询"
            style="width: 200px;"
            class="ml10"
            @keyup.enter.native="search"/>
        <el-input
            clearable
            v-model="listQuery.execute_user_name"
            placeholder="输入执行人查询" style="width: 150px;"
            class="ml10"
            @keyup.enter.native="search"/>
        <!--      <el-select v-model="listQuery.status" placeholder="运行结果" style="width: 150px;"-->
        <!--                 class="filter-item">-->
        <!--        <el-option-->
        <!--            v-for="item in options"-->
        <!--            :key="item.value"-->
        <!--            :label="item.label"-->
        <!--            :value="item.value">-->
        <!--        </el-option>-->
        <!--      </el-select>-->
        <!--        <el-date-picker-->
        <!--            v-model="listQuery.min_and_max"-->
        <!--            type="datetimerange"-->
        <!--            align="right"-->
        <!--            start-placeholder="起始日期"-->
        <!--            end-placeholder="截止日期"-->
        <!--            style="width: 340px;"-->
        <!--            value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--            class="filter-item"-->
        <!--            :default-time="['00:00:00', '23:59:59']">-->
        <!--        </el-date-picker>-->
        <el-button class="ml10" type="primary" @click="search">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>

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
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="序号" width="45px" align="center">
          <template #default="scope">
            {{ scope.$index + (listQuery.page - 1) * listQuery.pageSize + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="报告名称" align="center" width="170" :show-overflow-tooltip="true">
          <template #default="{row}">
            <el-button type="text" @click="onOpenReport(row)">{{ row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="任务类型" prop="type" align="center">
          <template #default="scope">
            <span v-if="scope.row.type === 'case'">用例</span>
            <span v-if="scope.row.type === 'suite'">套件</span>
            <span v-if="scope.row.type === 'module'">模块</span>
            <span v-if="scope.row.type === 'project'">项目</span>
            <span v-if="scope.row.type === 'acg'">自动用例</span>
          </template>
        </el-table-column>
        <el-table-column label="执行类型" prop="run_type" align="center">
          <template #default="{row}">
            <span>{{ row.run_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运行用例/总计用例" prop="test_count" align="center" width="125">
          <template #default="{row}">
            <span>{{ row.run_test_count + ' / ' + row.run_test_count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运行结果" prop="status" align="center" width="75">
          <template #default="{row}">
            <el-tag type="success" v-if="row.success">通过</el-tag>
            <el-tag type="danger" v-else>不通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="执行结果" prop="successes" align="center"></el-table-column>
        <el-table-column label="成功用例" prop="successful_use_case" align="center"></el-table-column>
        <el-table-column label="执行耗时(秒)" prop="duration" align="center" width="100"></el-table-column>
        <el-table-column label="执行时间" prop="start_at" align="center" width="150"></el-table-column>
        <el-table-column label="执行人" prop="execute_user_name" align="center"></el-table-column>

        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template #default="{row}">
            <el-button type="text" icon="el-icon-delete" @click="deleteReport(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total"
                  :page="listQuery.page"
                  :limit="listQuery.pageSize"
                  @pagination="getList"/>

      <el-dialog
          v-model="showReportDialog"
          width="80%"
          top="8vh"
          destroy-on-close
          :close-on-click-modal="false">
        <test-report :reportBody="reportBody"/>
      </el-dialog>
    </el-card>
  </div>

</template>

<script lang="ts">

import Pagination from '/@/components/Pagination/index.vue'
import TestReport from '/@/views/api/Report/components/report.vue';
import {useReportApi} from '/@/api/useAutoApi/report';
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus'


export default defineComponent({
  name: 'apiReport',
  components: {Pagination, TestReport},
  setup() {
    const state = reactive({
      listData: [],
      showReportDialog: false,
      tableLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 20,
        id: null,
        name: null,
        min_and_max: null,
        execute_user_name: null,
        responsible_name: null,
        status: null,
        ids: [],
      },
      // report
      reportBody: {},
    });

    // 获取列表
    const getList = () => {
      state.tableLoading = true;
      useReportApi().getList(state.listQuery).then(res => {
        state.listData = res.data.rows
        state.total = res.data.rowTotal
        state.tableLoading = false
      });
    };

    // 查询
    const search = () => {
      state.listQuery.page = 1
      getList()
    }

    // 删除报告
    const deleteReport = (row: any) => {
      ElMessageBox.confirm('是否删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        useReportApi().deleted({'id': row.id}).then(() => {
          ElMessage.success('删除成功！')
          getList()
        })
      })
    }

    const onOpenReport = (row: any) => {
      console.log('row----------', row)
      state.reportBody = row.report_body
      state.showReportDialog = !state.showReportDialog
    }

    // 获取列表
    onMounted(() => {
      getList()
    })
    return {
      getList,
      onOpenReport,
      search,
      deleteReport,
      ...toRefs(state),
    };
  }
})

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