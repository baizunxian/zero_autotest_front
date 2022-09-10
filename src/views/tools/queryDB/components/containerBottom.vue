<template>
  <div style="margin-bottom: 20px">
    <el-button size="small" @click="addTab(editableTabsValue)">
      add tab
    </el-button>
  </div>
  <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      closable
      @tab-remove="removeTab"
  >
    <el-tab-pane
        v-for="item in data"
        :key="item.name"
        :label="item.title"
        :name="item.name"
    >
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';

export default defineComponent({

  name: 'app',
  setup() {

    const state = reactive({
      activeName: 'test',
      tabIndex: 1,
      data: [
        {name: 'test', title: 'title1', content: 'content1'},
        {name: 'test2', title: 'test2', content: 'content2'},
        {name: 'test3', title: 'title3', content: 'content3'},
      ]
    });


    const addTab = (targetName: string) => {
      const newTabName = `结果${++state.tabIndex}`
      state.data.push({
        title: newTabName,
        name: newTabName,
        content: 'New Tab content',
      })
      state.activeName = newTabName
    }

    const removeTab = (targetName: string) => {
      const tabs = state.data
      let activeName = state.activeName
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      state.activeName = activeName
      state.data = tabs.filter((tab) => tab.name !== targetName)
    }


    return {
      addTab,
      removeTab,
      ...toRefs(state)
    };
  },
});
</script>

<style lang="scss" scoped>

</style>