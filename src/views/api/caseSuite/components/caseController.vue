<template>
  <el-collapse-transition>
    <div v-show="data.showDetail" @click.stop="">
      <el-divider style="margin: 10px 0 5px 0;"/>
      <div style="border: 1px solid #E6E6E6">
        <case-info :case_id="data.value"></case-info>
      </div>
    </div>
  </el-collapse-transition>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';
import caseInfo from "/@/views/api/case/catCase/catCase.vue";


export default defineComponent({
  name: 'scriptController',
  components: {
    caseInfo,
  },
  props: {
    data: Object
  },
  emits: ['update:data'],
  setup() {
    const state = reactive({
      // data
      showDetail: false
    });
    // 删除节点
    return {
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