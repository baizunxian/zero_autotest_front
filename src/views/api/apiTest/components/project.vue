<template>
  <div class="content">

    <div style="display: flex">
      <el-select v-model="projectForm.id"
                 clearable placeholder="请选择项目"
                 style="width: 200px"
                 @change="projectChange"
      >
        <el-option
            v-for="item in projectList"
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
        :data="moduleList"
        icon=""
        lazy
        @check-change="moduleChange"
    >
      <template #default="{ node, data }">
        <el-icon v-show="node.level === 1"><ele-FolderOpened /></el-icon>
        <span class="custom-tree-node">
          <span>😀{{ node.label }}</span>
        </span>
      </template>
    </el-tree>

  </div>

</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useProjectApi} from "/@/api/useAutoApi/project";
import {useModuleApi} from "/@/api/useAutoApi/module";
import {useTestCaseApi} from "/@/api/useAutoApi/testcase";

export default defineComponent({
  name: 'apiProject',
  setup() {

    const state = reactive({
      // project
      projectList: [],
      projectForm: {
        id: null,
        name: '',
      },
      // module
      moduleList: [],
      moduleForm: {
        id: null,
        project_id: null,
        pageSize: 1000,
      },
      // case
      caseList: [],
      caseForm: {
        id: null,
        project_id: null,
        module_id: null,
        pageSize: 1000,
      },
      tableList: [],
    });
    // project
    const getProjectList = () => {
      useProjectApi().getList(state.projectForm).then((res: any) => {
        state.projectList = res.data.rows
      })
    }

    // project 变更
    const projectChange = (value: string) => {
      console.log('projectChange--->', value)
      state.moduleForm.project_id = value
      if (!value) {
        state.moduleList = []
      }
      getModuleList()
    }

    // module
    const getModuleList = () => {
      useModuleApi().getList(state.moduleForm)
          .then(res => {
            state.moduleList = res.data.rows
          })
    };

    // case

    const getCaseList = () => {
      useTestCaseApi().getList(state.caseForm)
          .then(res => {
            state.caseList = res.data.rows
          })
    }


    // source 变更
    const dbChange = (value: any) => {
      if (value) {
        state.dbForm.id = value
        getProjectList()
      } else {
        state.dbList = []
        state.tableList = []
      }

    }

    const moduleChange = (
        data: any,
        checked: boolean,
        indeterminate: boolean
    ) => {
      console.log(data, checked, indeterminate)
    }

    const loadNode = (node: any, resolve: any) => {
      if (node.level === 0) {
        return resolve(state.projectList)
      }
      if (node.level === 1) {
        console.log("node--->", node)
        state.caseForm.module_id = node.data.id
         useTestCaseApi().getList(state.caseForm)
          .then(res => {
            return resolve(res.data.rows)
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
      getProjectList()
    })


    return {
      getProjectList,
      getModuleList,
      getCaseList,
      dbChange,
      projectChange,
      moduleChange,
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