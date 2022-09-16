<template>
    <el-button @click="get_mode">test</el-button>

  <div style="border: 1px solid #E6E6E6; overflow-y: auto">
    <monaco-editor
        :style="{height: height + 'px'}"
        ref="monacoEditRef"
        :dbs="dbs"
        v-model:value="sql"
        v-model:long="long"
    ></monaco-editor>
  </div>
</template>

<script lang="ts">
import monacoEditor from '/@/components/monaco/index.vue'
import {defineComponent, reactive, toRefs, ref} from 'vue';

export default defineComponent({
  components: {monacoEditor},
  name: 'app',
  setup() {
    const monacoEditRef = ref()
    const state = reactive({
      sql: 'mysql',
      long: 'sql',
      height: 10,
      // db
      dbs: [{ dbName: 'autotest', tables: [{ tblName: 'case_info', tableColumns: [
            {columnName: "name"},
            {columnName: "project_id"},
            {columnName: "model_id"},
          ] }] }]
    });

    const setMonacoHeHeight = (height: number) => {
      state.height = height
    }


    const get_mode = () => {
      console.log("mode --->", monacoEditRef.value.getMode())
    }
    return {
      monacoEditRef,
      setMonacoHeHeight,
      get_mode,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>

</style>