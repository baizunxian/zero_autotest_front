<template>
  <div class="h100">
    <el-row  class="h100">
      <el-col :span="4" class="common" v-for="(tool, index) in list" :key="index">
        <div class="item" @click="clickToPage(tool.full_path)">
          <SvgIcon :name="tool.icon" :size="34"/>
          <div class="item__content">
            <span class="title">{{ data[tool.key] }}</span>
            <span class="remark">{{ tool.name }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';
import project_svg from "/@/icons/indexSvg/project_svg.svg";
import module_svg from "/@/icons/indexSvg/module_svg.svg";
import case_svg from "/@/icons/indexSvg/case_svg.svg";
import suite_svg from "/@/icons/indexSvg/suite_svg.svg";
import exc_count from "/@/icons/indexSvg/exc_count.svg";
import add_case from "/@/icons/indexSvg/add_case.svg";

export default defineComponent({
  name: 'countStatistics',
  props: {
    data: Object
  },
  setup() {
    const state = reactive({
      menuList: [],
      LastStageMenus: [],
      checkList: [],
      list: [
          {name: '项目', key: 'project_count', icon: project_svg},
          {name: '模块', key: 'module_count', icon: module_svg},
          {name: '用例', key: 'case_count', icon: case_svg},
          {name: '套件', key: 'suite_count', icon: suite_svg},
          {name: '当天运行用例数', key: 'today_run_count', icon: exc_count},
          {name: '当天用例新增数', key: 'add_case_count', icon: add_case}
      ],
      dialogTableVisible: false,
      countData:{
        project_count: 0,
        module_count: 0,
        case_count: 0,
        suite_count: 0,
        today_user_login_count: 0,
        today_total_run: 0,
        today_run_count: 0,
        add_case_count: 0,
      }
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.box-card {
  margin: 10px;
  height: calc(100% - 20px);
}

.item {
  border-radius: 5px;
  width: 95%;
  float: left;
  display: flex;
  align-items: center;
  height: 60px;
  padding-left: 16px;
  border: 1px solid #EBEEF5;
  background-color: #FFF;
  color: #303133;
  transition: .3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  //margin-left: 16px;
  //margin-top: 16px;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .5);
  }

  &__content {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
  }

  .icon {
    font-size: 32px;
  }

  .title {
    font-size: 20px;
    color: #333333;
    font-weight: 600;
  }

  .remark {
    font-size: 12px;
    color: #999999;
  }
}

.wiki {
  background-color: #e7faf0;
}

::v-deep .el-card__header {
  padding: 10px 10px;
}

::v-deep .el-card__body {
  padding: 0;
}

::v-deep .el-checkbox__label {
  width: 100px;
}
</style>
