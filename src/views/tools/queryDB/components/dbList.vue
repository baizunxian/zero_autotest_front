<template>
  <div class="dbTreeForDbQuery">
    <div class="wrapper-op">
      <!--      <el-select v-model="dbForm.data_source"-->
      <!--                 clearable placeholder="请选择数据库"-->
      <!--                 style="width: 200px"-->
      <!--                 @change="sourceChange"-->
      <!--      >-->
      <!--        <el-option-->
      <!--            v-for="item in dataSource"-->
      <!--            :key="item"-->
      <!--            :label="item"-->
      <!--            :value="item"-->
      <!--        >-->
      <!--        </el-option>-->
      <!--      </el-select>-->
      <el-select v-model="sourceForm.id"
                 clearable
                 placeholder="连接"
                 style="width: 200px; margin-left: -1px"
                 @change="sourceChange"
      >
        <el-option
            v-for="item in sourceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        >
        </el-option>
      </el-select>


      <el-button type="text" class="ml10" @click="getList">
        <el-icon>
          <ele-CirclePlusFilled/>
        </el-icon>
        新增
      </el-button>
    </div>
    <div class="tree-current-node">
      <span style="color: #2c2f37;font-weight: 600; font-size: 12px">当前库：</span>{{ currentDB }}
    </div>

    <div style="height: 100%; overflow-y: auto">
      <el-table
          :data="dbList"
          style="width: 100%"
          row-key="name"
          lazy
          :show-header="false"
          :load="getTableList"
          @row-click="clickDB"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="name" width="auto" :show-overflow-tooltip="true">
          <template #default="{row}">
            <el-icon>
              <ele-Coin/>
            </el-icon>
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
      </el-table>

    </div>

  </div>

</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useQueryDBApi} from "/@/api/useTools/querDB";

export default defineComponent({
  name: 'typeTab',
  setup(props, {emit}) {

    const state = reactive({
      // source
      dataSource: ['mysql', 'redis'],
      sourceList: [],
      sourceForm: {
        id: null,
      },
      // db
      dbList: [],
      dbForm: {
        id: null,
        source_id: null,
      },
      currentDB: '',
      // table
      tableList: [],
      tableForm: {
        source_id: null,
        databases: null,
      },

      // column
    });
    // source
    const getSourceList = () => {
      useQueryDBApi().getSourceList(state.sourceForm).then((res: any) => {
        state.sourceList = res.data
      })
    }

    // source 变更
    const sourceChange = (value: string) => {
      state.dbForm.source_id = state.tableForm.source_id = value
      if (!value) {
        state.sourceForm.id = null
        state.dbList = []
        state.tableList = []
      } else {
        getDBList()
      }
    }

    // db
    // 获取数据库表
    const getDBList = () => {
      useQueryDBApi().getDBList(state.dbForm).then((res: any) => {
        state.dbList = res.data
      })
    }

    const clickDB = async (row, column, event) => {
      let iconInfo = event.currentTarget.querySelector(".el-table__expand-icon")
      if (iconInfo) {
        iconInfo.click();
      }
      if (row.type === "database") {
        state.tableForm.databases = row.name
        state.currentDB = row.name
        let dbs = await getColumnList()
        let data = {
          database: row.name,
          source_id: state.sourceForm.id,
          dbs: [{ dbName: row.name, tables:dbs}]
        }
        emit("setData", data)
      }
      console.log(row, column, event)
    }

    // table

    const getTableList = async (row: any, treeNode: unknown, resolve: (date: any) => void) => {
      state.tableForm.databases = row.name
      let res: any = await useQueryDBApi().getTableList(state.tableForm)
      // return res.data
      resolve(res.data)
    }

    // column
    const getColumnList = async () => {
      let res: any = await useQueryDBApi().getColumnList(state.tableForm)
      return res.data
    }

    const handleCheckChange = (
        data: any,
        checked: boolean,
        indeterminate: boolean
    ) => {
      console.log(data, checked, indeterminate)
    }

    const loadNode = (node: any, resolve: any) => {
      if (node.level === 0) {
        return resolve(state.dbList)
      }
      if (node.level === 1) {
        state.dbForm.table = node.label
        getTableList().then(data => {
          console.log(data, 'data=->')
          return resolve(data)
        })

      }
      if (node.level === 2) {
        return resolve([])
      }

    }
    const defaultProps = {
      children: 'children',
      label: 'name',
      isLeaf: (data: any, node: any) => {
        if (node.level === 2) {
          return true
        }
      },
    }

    onMounted(() => {
      getSourceList()
    })


    return {
      getSourceList,
      getDBList,
      getColumnList,
      clickDB,
      getTableList,
      sourceChange,
      handleCheckChange,
      defaultProps,
      loadNode,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>

.dbTreeForDbQuery {
  padding: 0 6px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;

  .wrapper-op {
    min-width: 220px;
    margin-bottom: 8px;
    display: flex;
    //flex-direction: column;
    align-items: stretch;
  }

  .tree-current-node {
    padding: 0 0 8px 6px;
    border-bottom: 1px solid #dee2ea;
    margin-bottom: 6px;
  }
}

.el-tree .el-icon i { //原有的箭头 去掉
  display: none !important;
  height: 0;
  width: 0;
}

:deep(.el-table td.el-table__cell) {
  border-bottom: #ffffff;
}

</style>