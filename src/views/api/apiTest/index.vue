<template>
  <div>
    <el-card shadow="hover" style="height: 100%">
      <splitpanes class="default-theme" @resize="paneSize = $event[0].size" style="height: 100%;">
        <pane :size="32">
          <project></project>
        </pane>
        <pane :size="100">
          <!--          <splitpanes class=""-->
          <!--                      ref="containerRef"-->
          <!--                      @resize="winChange('resize', $event)"-->
          <!--                      @ready="winChange('ready', $event)"-->
          <!--                      :horizontal="true">-->
          <!--            <pane :size="100">-->
          <!--              <container-top ref="containerTopRef"></container-top>-->
          <!--            </pane>-->
          <!--            <pane :size="100">-->
          <!--              <container-bottom></container-bottom>-->
          <!--            </pane>-->
          <!--          </splitpanes>-->
        </pane>
      </splitpanes>
    </el-card>
  </div>

</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, ref} from 'vue';
import project from '/@/views/api/apiTest/components/project.vue';
import {Splitpanes, Pane} from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

export default defineComponent({
  name: 'query_db',
  components: {
    project,
    Splitpanes,
    Pane,
  },
  setup() {
    const containerRef = ref()
    const containerTopRef = ref()
    const state = reactive({
      paneSize: 50,
    });

    const winChange = (changeType: string, $event: any) => {
      let height = containerRef.value.$el.offsetHeight * 50 / 100
      if (changeType == 'resize') {
        height = containerRef.value.$el.offsetHeight * $event[0].size / 100
      }
      containerTopRef.value.setMonacoHeHeight(height)
    }

    return {
      winChange,
      containerRef,
      containerTopRef,
      ...toRefs(state)
    };
  },
});
</script>

<style lang="scss" scoped>

:deep(.el-card) {
  height: 100%;

  .el-card__body {
    height: 100%;
    padding: 5px;
  }
}

.splitpanes.default-theme .splitpanes__pane {
  background-color: #ffffff;
}

.splitpanes__pane .content {
  padding: 0 6px;
}

</style>