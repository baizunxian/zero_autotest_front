<template>
  <div>
    <el-row justify="space-between"
            v-for="(header, index) in data"
            :key="index"
            align="middle"
            class="el-row--flex"
            style="padding: 5px 0"
    >
      <el-col :span="7">
        <el-input type="primary"
                  size="small"
                  maxlength="200"
                  placeholder="键"
                  v-model="header.key">
          <template #suffix>
            {{ header.key.length }}/200
          </template>
        </el-input>
      </el-col>
      <el-col :span="7">
        <el-input type="primary"
                  size="small"
                  placeholder="值"
                  v-model="header.value">
        </el-input>
      </el-col>

      <el-col :span="7">
        <el-input type="primary"
                  size="small"
                  placeholder="备注"
                  v-model="header.remarks">
        </el-input>
      </el-col>

      <el-col :span="1">
        <el-button type="danger" circle @click="deleteHeaders(index)" :disabled="data.length === index  + 1 ">
          <el-icon>
            <ele-Delete/>
          </el-icon>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs, watch} from 'vue';
import {Search} from "@element-plus/icons-vue";


interface state {
  headersBulk: string,
}

export default defineComponent({
  name: 'headersController',
  props: {
    data: {
      type: Array,
      default: () => {
        return [{key: '', value: '', remarks: ""}]
      }
    }
  },
  emits: ['update:data'],
  setup(props: any) {
    const formRef = ref()
    const state = reactive<state>({
      headersBulk: '',  // bulk内容

    });

    // bulk 转换
    const bulkEdit = () => {
      keyValueToBulk()
    }

    const bulkToKeyValue = () => {
      if (state.headersBulk.length > 0) {
        let snsArr = state.headersBulk.split(/[(\r\n)\r\n]+/)
        if (snsArr.length > 0) {
          let headerList: any = []
          snsArr.forEach(data => {
            let keyValue = data.split(':')
            let head: any = {}
            if (keyValue.length >= 2) {
              head.key = keyValue[0]
              head.value = keyValue[1]
            } else if (keyValue.length < 2) {
              head.key = keyValue[0]
              head.value = ''
            }
            headerList.push(head)
          })
          props.data = headerList
        }
        addHeaders()
      }
    }

    const keyValueToBulk = () => {
      if (props.data.length > 0) {
        let bulk = ''
        props.data.forEach((data: any) => {
          if (data.key != '') {
            bulk = bulk + data.key + ':' + data.value + '\r\n'
          }
        })
        state.headersBulk = bulk
      }
    }

    // Headers
    const addHeaders = () => {
      props.data.push({key: '', value: '', remarks: ""})


    }
    const deleteHeaders = (index: number) => {
      props.data.splice(index, 1)
    }

    const headerBlur = () => {
      if (props.data) {
        let endData = props.data[props.data.length - 1]
        if (!endData) {
          addHeaders()
        } else if (endData.key !== "" || endData.value !== "") {
          addHeaders()
        }
      }
    }

    watch(
        () => props.data,
        (val) => {
          if (val) {
            headerBlur()
          }
        },
        {
          deep: true,
          immediate:true,
        }
    );

    return {
      Search,
      formRef,
      headerBlur,
      addHeaders,
      deleteHeaders,
      bulkEdit,
      bulkToKeyValue,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>

</style>