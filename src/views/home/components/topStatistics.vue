<template>
  <el-card class="box-card" style="margin-right: 8px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="项目用例数TOP" name="first">
        <div ref="pcns" id="pcns">
          <el-table
              :data="data.pcns_data"
              stripe
              :show-header="false"
              >
            <el-table-column
                prop="name"
                label="项目"
                width="180">
              <template #default="{row, $index}">
                <svg-icon style="font-size: 18px;" v-if="$index === 0" class-name="gold_medal" icon-class="gold_medal"/>
                <svg-icon style="font-size: 18px;" v-if="$index === 1" class-name="silver_medal"
                          icon-class="silver_medal"/>
                <svg-icon style="font-size: 18px;" v-if="$index === 2" class-name="bronze_medal"
                          icon-class="bronze_medal"/>
                {{ row.name }}
              </template>
            </el-table-column>

            <el-table-column
                prop="case_num"
                align="right"
                label="用例总数">
              <template #default="{row, $index}">
                <span v-if="$index === 0">
                  <svg-icon class-name="search-icon" icon-class="gold_modal"/>
                </span>
                {{ row.case_num }}条
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="用例创建TOP" name="second">

        <el-table
            :data="data.ucns_data"
            stripe
            :show-header="false"
            style="width: 100%">
          <el-table-column
              prop="username"
              label="创建人"
              width="180">
            <template #default="{row, $index}">
              <svg-icon style="font-size: 18px;" v-if="$index === 0" class-name="gold_medal" icon-class="gold_medal"/>
              <svg-icon style="font-size: 18px;" v-if="$index === 1" class-name="silver_medal"
                        icon-class="silver_medal"/>
              <svg-icon style="font-size: 18px;" v-if="$index === 2" class-name="bronze_medal"
                        icon-class="bronze_medal"/>
              {{ row.username }}
            </template>
          </el-table-column>

          <el-table-column
              prop="case_num"
              align="right"
              label="用例总数">
            <template #default="{row, $index}">
              <span :title="$index">{{ row.case_num }}条</span>

            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>-->
      <!--      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>-->
    </el-tabs>
  </el-card>

</template>


<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';

export default defineComponent({
  name: 'top',
  props: {
    data: Object
  },
  setup() {
    const state = reactive({
      activeName: 'first',
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.el-card ) {
  padding: 0 5px;
  height: 100%;
}

.box-card {
  padding: 0 5px;
}

:deep(.el-tabs__header) {
  margin: 0 0 8px;
}

:deep(.el-tabs__item.is-active) {
  color: #000000;
  font-weight: 600;
}

</style>