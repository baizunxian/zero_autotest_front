<template>
  <div class="home-container" style="height: 100%;">
    <el-row style='margin-bottom: 10px'>
      <el-col :span='24' class='common'>
        <count-statistics :data="countInfo" />
      </el-col>
    </el-row>

    <!--    top, 运行分析-->
    <el-row style='margin-bottom: 10px ; height: 30%'>
      <el-col :span='6' class='common'>
        <top-statistics :data='topInfo'/>
      </el-col>
<!--      <el-col :span='18' class='common'>-->
<!--        <module-statistic :data='countData' v-if='countData'/>-->
<!--      </el-col>-->
    </el-row>

  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import CountStatistics from '/@/views/home/components/countStatistics.vue';
import TopStatistics from '/@/views/home/components/topStatistics.vue';
import {useStatisticsApi} from "/@/api/useSystemApi/statistic";

export default defineComponent({
  name: 'home',
  components: {
    CountStatistics,
    TopStatistics,
  },
  setup() {
    const state = reactive({
      countInfo: {},
      topInfo: {}
    });
    const initData = () => {
      useStatisticsApi().countStatistic()
          .then((res: any) => {
            state.countInfo = res.data.count_info
            state.topInfo = res.data.top_info
          })
    }
    onMounted(() => {
      initData()
    })
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>

.home-container {
  padding: 15px;
}

</style>