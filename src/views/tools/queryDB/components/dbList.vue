<template>
  <div class="content">

    <div style="display: flex">
      <el-select v-model="dbForm.data_source"
                 clearable placeholder="请选择数据库"
                 style="width: 200px"
                 @change="sourceChange"
      >
        <el-option
            v-for="item in dataSource"
            :key="item"
            :label="item"
            :value="item"
        >
        </el-option>
      </el-select>
      <el-select v-model="dbForm.id"
                 clearable
                 placeholder="请选择数据库"
                 style="width: 200px; margin-left: -1px"
                 @change="dbChange"
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

    <el-tree
        style="width: 100%;"
        :props="defaultProps"
        :load="loadNode"
        :data="dbList"
        icon=""
        lazy
        @check-change="handleCheckChange"
    >
      <template #default="{ node, data }">
        <el-icon>
          <ele-CirclePlusFilled/>
        </el-icon>
        <span class="custom-tree-node">
          <span>😀{{ node.label }}</span>
        </span>
      </template>
    </el-tree>

  </div>

</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';
import {useQueryDBApi} from "/@/api/useTools/querDB";

export default defineComponent({
  name: 'typeTab',
  setup() {

    const state = reactive({
      // db_info
      dataSource: ['mysql', 'redis'],
      sourceList: [],
      dbList: [],
      dbForm: {
        id: null,
        data_source: '',
        table: '',
      },
      tableList: [],
    });
    // 获取列表
    const getSourceList = () => {
      useQueryDBApi().getSourceList(state.dbForm).then((res: any) => {
        state.sourceList = res.data
      })
    }

    // source 变更
    const sourceChange = (value: string) => {
      state.dbForm.data_source = value
      if (value) {
        getSourceList()
      } else {
        state.dbForm.id = null
        state.sourceList = []
        state.dbList = []
        state.tableList = []
      }
    }
    // source 变更
    const dbChange = (value: any) => {
      if (value) {
        state.dbForm.id = value
        getDBList()
      } else {
        state.dbList = []
        state.tableList = []
      }

    }

    // 获取数据库表
    const getDBList = () => {
      useQueryDBApi().getDBList(state.dbForm).then((res: any) => {
        res.data.forEach((e: any) => {
          state.dbList.push({name: e.Database})
        })
      })
    }

    const getTableList = async () => {
      let res: any = await useQueryDBApi().getTableList(state.dbForm)
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


    return {
      getDBList,
      dbChange,
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

.content {
  padding: 0 12px;
  width: 100%;
  overflow-x: auto;
  height: 100%
}

.el-tree .el-icon i { //原有的箭头 去掉
  display: none !important;
  height: 0;
  width: 0;
}

</style>