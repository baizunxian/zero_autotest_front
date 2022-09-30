<template>

  <el-collapse-transition>
    <div v-show="data.showDetail" @click.stop="">
      <el-divider style="margin: 10px 0 5px 0;"/>
      <div style="border: 1px solid #E6E6E6; padding: 8px">

        <el-form ref="formRef"
                 :model="data"
                 label-width="auto"
                 label-position="left"
                 >

          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
              <el-form-item label="运行环境" prop="project_id">
                <el-select size="small" v-model="data.env_id" placeholder="运行环境" filterable
                           style="width: 100%;"
                           @change="selectProject">
                  <el-option
                      v-for="env in envList"
                      :key="env.id + env.name"
                      :label="env.name"
                      :value="env.id">
                    <span style="float: left">{{ env.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
              <el-form-item label="数据源名称" prop="module_id">
                <el-select size="small" v-model="data.source_id" placeholder="请选择" filterable
                           style="width: 100%;">
                  <el-option
                      v-for="source in sourceList"
                      :key="source.id + source.name"
                      :label="source.name"
                      :value="source.id">
                    <span style="float: left">{{ source.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
              <el-form-item label="超时时间" prop="config_id">
                <el-input-number v-model="data.timeout" placeholder="秒"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
              <el-form-item label="存储结果" prop="variable_name">
                <el-input v-model="data.variable_name"/>
              </el-form-item>
            </el-col>
          </el-row>

          <span class="el-form-item__label">SQL</span>
          <div style="border: 1px solid #E6E6E6">
            <monaco-editor
                style="height: 300px"
                ref="monacoEditRef"
                v-model:value="data.value"
            ></monaco-editor>
          </div>

        </el-form>

      </div>
    </div>
  </el-collapse-transition>

</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';
import monacoEditor from "/@/components/monaco/index.vue";


export default defineComponent({
  name: 'sqlController',
  components: {
    monacoEditor,
  },
  props: {
    data: Object
  },
  emits: ['update:data'],
  setup() {
    const state = reactive({
      // sourceList
      envList: [],
      sourceList: [],
    });

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