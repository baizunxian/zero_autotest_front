<template>
  <div class="step-details">
    <step-controller step_type="post" :data="setup_hooks"></step-controller>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from 'vue';
import {useRoute, useRouter} from "vue-router"
import {handleEmpty} from "/@/utils/other";


export default defineComponent({
  name: 'postOperation',
  components: {
  },
  setup(props, {emit}) {
    const formRef = ref()
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      setup_hooks: []
    });

    //
    const setData = (data: any) => {
      if (data) {
        state.setup_hooks = data
      }
    }

    // 获取表单数据
    const getData = () => {
      return handleEmpty(state.setup_hooks)
    }

    return {
      setData,
      getData,
      formRef,
      route,
      router,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>

.block-title {
  position: relative;
  padding-left: 11px;
  font-size: 14px;
  font-weight: 600;
  height: 20px;
  line-height: 20px;
  background: #f7f7fc;
  color: #333333;
  border-left: 2px solid #409eff;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

:deep(.el-card__body) {
  padding: 5px 10px;
}
</style>