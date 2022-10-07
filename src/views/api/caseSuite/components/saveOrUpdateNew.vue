<template>
  <div class="system-edit-menu-container h100">
    <el-select size="small" v-model="optType" placeholder="" filterable
               class="w100"
               @change="selectProject">
      <el-option
          v-for="(value, key) in optTypes"
          :key="key"
          :label="value"
          :value="key">
      </el-option>
    </el-select>

    <el-button @click="addStep">test</el-button>

    <div style="height:100%; overflow-y: auto">
      <el-tree
          draggable
          :allow-drop="allowDrop"
          @node-drop="handleDrop"
          @node-click="nodeClick"
          :data="data">
        <template #default="{ node, data }">
          <zero-header v-model:data="node.data"/>
        </template>
      </el-tree>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, onUnmounted, reactive, toRefs} from 'vue';
import {useRoute, useRouter} from "vue-router"
import zeroHeader from "/@/views/api/caseSuite/components/zeroHeader.vue";


export default defineComponent({
  name: 'saveOrUpdateSuite',
  components: {
    zeroHeader,
  },
  setup() {
    const {proxy} = <any>getCurrentInstance();
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      // data
      optType: "script",
      optTypes: {
        script: "前置脚本",
        sql: "前置SQL",
        wait: "等待控制器",
        extract: "提取参数",
      },

      data: [
        {name: "前置脚本", index: 1, value: "select", step_type: "script", enable: true},
        {name: "前置SQL", index: 1, value: "select", step_type: "sql", enable: true},
        {name: "等待控制器", index: 1, value: 1, step_type: "wait", enable: true},
        {name: "用例", index: 1, value: 157, step_type: "case", enable: true},
        {name: "提取参数", index: 1, value: 157, step_type: "case", enable: true},
      ],

    });

    const alertMe = () => {
      alert('Clicked on alert icon');
    }

    // 不允许拖动为子
    const allowDrop = (draggingNode: any, dropNode: any, type: any) => {
      return type !== "inner"
    }

    // 节点拖动完成重新计算顺序
    const handleDrop = () => {
      computeDataIndex()
    }

    const nodeClick = (data) => {
      console.log("nodeaaa", data)
      data.showDetail = !data.showDetail
    }

    // 计算index，保持拖动后顺序
    const computeDataIndex = () => {
      state.data.forEach((data, index) => {
        data.index = index + 1
      })
    }
    // 追加步骤
    const addStep = () => {
      let data = {}
      if (state.optType === "script") {
        data = {name: "", value: "", step_type: "script", enable: true}
      } else if (state.optType === "sql") {
        data = {name: "", value: "", step_type: "sql", timeout: null, variable_name: "", enable: true}
      } else if (state.optType === "wait") {
        data = {name: "", value: null, step_type: "wait", enable: true}
      } else if (state.optType === "extract") {
        data = {name: "", value: null, json_path_list: [], step_type: "extract", enable: true}
      }
      state.data.push(data)
      showData()
      computeDataIndex()
    }

    const showData = () => {
      console.log(state.data)
    }

    onMounted(() => {
      // state.data.push({
      //   name: "test333333",
      //   index: 1,
      //   value: "select3",
      //   type: "sql",
      //   json_path_list: [{name: "test", path: "$.*"}]
      // })

      // 删除数据
      proxy.mittBus.on("deletedNode", (index: number) => {
        console.log("ondeletedNode", index)
        state.data.splice(index, 1)
        console.log(state.data,)
        computeDataIndex()
      })

      // 复制数据
      proxy.mittBus.on("copyNode", (data: any) => {
        state.data.push(JSON.parse(JSON.stringify(data)))
        computeDataIndex()
      })
    })

    onUnmounted(() => {
      proxy.mittBus.off('deletedNode');
    });


    return {
      alertMe,
      allowDrop,
      handleDrop,
      showData,
      nodeClick,
      addStep,
      route,
      router,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>

// el-terr
:deep(.el-tree-node__content) {
  height: 100%;
  //max-height: 26px;
  margin-top: 6px;
  vertical-align: center;
  -webkit-box-align: center;
  display: flex;
  cursor: pointer;
  align-items: center;
}

:deep(.el-card__body) {
  padding: 5px 10px;
}

:deep(.el-tree-node__label) {
  width: 100%;
}

.zero-base-card {
  min-height: 36px;

  .zero-base-header {
    min-height: 26px;

    .el-tag--small {
      height: 24px;
    }

    .el-step__icon {
      width: 20px;
      height: 20px;
      font-size: 12px;
    }

    .header-right {
      //margin-top: 1px;
      float: right;
      z-index: 1;
    }
  }
}
</style>