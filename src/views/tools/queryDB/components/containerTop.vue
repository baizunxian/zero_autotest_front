<template>
  <div>
    <div class="db-query-top-bar">
      <el-link @click="execute">
        <el-icon>
          <ele-CaretRight/>
        </el-icon>
        执行
      </el-link>
<!--      <el-button @click="execute" icon="CaretRight">执行</el-button>-->
    </div>

    <div style="border: 1px solid #E6E6E6; overflow-y: auto">
      <monaco-editor
          :style="{height: height + 'px'}"
          ref="monacoEditRef"
          :dbs="dbs"
          v-model:value="sql"
          v-model:long="long"
      ></monaco-editor>
    </div>
  </div>
</template>

<script lang="ts">
import monacoEditor from '/@/components/monaco/index.vue'
import {defineComponent, reactive, toRefs, ref} from 'vue';
import {useQueryDBApi} from "/@/api/useTools/querDB";
import {ElMessage} from "element-plus/es";

export default defineComponent({
  components: {monacoEditor},
  name: 'app',
  setup(props, {emit}) {
    const monacoEditRef = ref()
    const state = reactive({
      long: 'sql',
      height: 300,
      // db
      dbs: [],
      //execute
      executeForm: {
        sql: '',
        source_id: "",
        database: "",
      }
    });

    const setMonacoHeHeight = (height: number) => {
      state.height = height
    }

    const setData = (data: any) => {
      state.dbs = data.dbs
      state.executeForm.source_id = data.source_id
      state.executeForm.database = data.database
    }

    const execute = () => {
      if (state.executeForm.source_id == "") {
        ElMessage.warning('请选择对应数据源！');
        return
      }
      state.executeForm.sql = monacoEditRef.value.getValue()
      useQueryDBApi().execute(state.executeForm)
          .then(res => {
            emit("setResult", res.data)
            console.log(res)
          })
    }

    const get_mode = () => {
      console.log("mode --->", monacoEditRef.value.getMode())
    }
    return {
      setData,
      execute,
      monacoEditRef,
      setMonacoHeHeight,
      get_mode,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>

.db-query-top-bar {
  flex: none;
  display: flex;
  border-bottom: 1px solid #dee2ea;
  padding: 0 2px;
}

</style>