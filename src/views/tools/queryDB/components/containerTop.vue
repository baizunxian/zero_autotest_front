<template>
  <div style="border: 1px solid #E6E6E6; overflow-y: auto">
    <monaco-editor
        :style="{height: height + 'px'}"
        ref="monacoEditRef"
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

    });

    const setMonacoHeHeight = (height: number) => {
      state.height = height
    }
    return {
      monacoEditRef,
      setMonacoHeHeight,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>

</style>