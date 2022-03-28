<template>
  <el-form inline ref="request-form" label-width="50px" size="mini" label-position="right">
    <div>
      <el-button class="filter-item" type="primary" @click="addHeaders">Add Headers</el-button>
      <el-button class="filter-item" type="primary" @click="bulkEdit">
        {{ this.showBulk ? "KeyValueEdit" : "BulkEdit" }}
      </el-button>
    </div>

    <div v-show="showBulk">
      <el-input type="textarea" rows="5" v-model="headersBulk" placeholder="" show-word-limit></el-input>
    </div>

    <div v-show="!showBulk">
      <el-table
          :header-cell-style="tabelheadercolor"
          ref="multipleTable"
          :data="headersdata"
          tooltip-effect="dark"
          border
          style="width: 100%"
      >
        <el-table-column header-align='center'>
          <template slot="header">
            <strong style="font-size: 14px;">参数名</strong>
          </template>
          <template slot-scope="{row}">
            <el-input v-model="row.key"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="value" header-align='center'>
          <template slot="header">
            <strong style="font-size: 14px;">参数值</strong>
          </template>
          <template slot-scope="{row}">
            <el-input v-model.trim="row.value"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" width="50" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-link :underline="false" type="primary" @click="deleteHeader(row,$index)"><i class="el-icon-delete"></i>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'request',
  data() {
    return {
      activeName: 'body',
      showBulk: false,
      headersBulk: '',
      assertlist: [
        {formId: Math.random().toFixed(10)}
      ],
      headersdata: [],  // 请求头
      buttonStart: false,
      tabelheadercolor: {color: '#000', background: '#f5f5f5'},
      methodList: ['POST', 'GET', 'PUT', 'DELETE'],
      typeList: ['data', 'json', 'params'],
      typeOptions: ['string', 'int', 'float', 'boolean'],
      request: {
        type: 'data',
        headers: {},
      },
      updateNumber: 0,
    }
  },
  watch: {
    headersdata: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 1) {
          this.$emit('setUpdateCount', 'Headers')
        }
      },
      deep: true
    }
  },
  methods: {
    // 重置表单
    resetForm(data) {
      this.updateNumber = 0
      this.headersBulk = ''
      this.headersdata = [
        {'key': 'token', 'value': '${get_token(123456,Aa123456,reset=False,uat,key_time=360000)}'},
        {'key': 'appkey', 'value': ''},
        {'key': 'method', 'value': ''}
      ]
      if (data) {
        // let head = {}
        // this.$set(head, 'key', 'method')
        // this.$set(head, 'value', data.code)
        this.headersdata[2].value = data.code
      }
    },

    // from 拼接
    getHeadForm() {
      let headers = {}
      if (this.showBulk) {
        this.bulkToKeyValue()
      }
      if (this.headersdata.length > 0) {
        this.headersdata.forEach(data => {
          if (data.key != '') {
            this.$set(headers, data.key, data.value)
          }
        })
      }
      return headers
    },
    // 编辑时赋值
    setHerdForm(form) {
      this.updateNumber = 0
      this.headersdata = []
      for (let key in form.headers) {
        let head = {}
        this.$set(head, 'key', key)
        this.$set(head, 'value', form.headers[key])
        this.headersdata.push(head)
      }
    },

    typeChange(val) {

    },
    // Headers
    addHeaders() {
      this.headersdata.push({key: '', value: ''})
    },
    deleteHeader(row, index) {
      this.headersdata.splice(index, 1)
    },

    bulkEdit() {
      if (this.showBulk) {
        this.bulkToKeyValue()
        this.showBulk = false
      } else {
        this.keyValueToBulk()
        this.showBulk = true
      }
    },
    bulkToKeyValue() {
      if (this.headersBulk.length > 0) {
        let snsArr = this.headersBulk.split(/[(\r\n)\r\n]+/)
        if (snsArr.length > 0) {
          let headerList = []
          snsArr.forEach(data => {
            let keyValue = data.split(':')
            let head = {}
            if (keyValue.length >= 2) {
              this.$set(head, 'key', keyValue[0])
              this.$set(head, 'value', keyValue[1])
            } else if (keyValue.length < 2) {
              this.$set(head, 'key', keyValue[0])
              this.$set(head, 'value', '')
            }
            headerList.push(head)
          })
          this.headersdata = headerList
        }
      }
    },
    keyValueToBulk() {
      if (this.headersdata.length > 0) {
        let bulk = ''
        this.headersdata.forEach(data => {
          if (data.key != '') {
            bulk = bulk + data.key + ':' + data.value + '\r\n'
          }
        })
        this.headersBulk = bulk
      }
    },

  }
}
</script>

<style lang="scss" scoped>
.employee_body {
  margin: 10px 20px 0;
  overflow: hidden;
}

.app-container {
  padding: 0;
}

.inputclass {
  width: 300px;
}

.el-dialog {
  height: 50%;
}

table {
  width: 50%;
  border-collapse: collapse;

  tr, td {
    border: 1px solid #d2d2d6;
    padding: 5px;
  }
}

.radio-group {
  margin-bottom: 15px;
}

.title-wrap {
  font-size: 14px;
  color: #8b60f0;
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 12px;

  .title {
    padding: 0 16px;
  }

  .line {
    width: 100px;
    height: 2px;
    border-bottom: 2px dashed #e1e1f5;
  }

  .add-line {
    width: 800px;
    overflow: hidden;
  }
}

.filter-item {
  color: #fff;
  background-color: #5bc0de;
  border-color: #ffffff;
  margin-bottom: 10px;

  &:hover {
    color: #fff;
    background-color: #31b0d5;
    border-color: #ffffff;
  }
}
</style>

<style lang="scss">
/* jsoneditor右上角默认有一个链接,加css去掉了 */
.jsoneditor-poweredBy {
  display: none;
}

.ace_gutter {
  background: #FFF
}

.jsoneditor-vue .jsoneditor {
  border: 0;

  .jsoneditor-menu {
    // background: #ebebeb;
    background-color: #ebebeb;
    border-bottom: 0;

    .jsoneditor-modes {
      color: #000;
    }

    .jsoneditor-outer {
      background: #ebebeb;
    }

    button {
      outline: none;
      background-color: #5bc0de;

      &:hover {
        background-color: #5bc0de;
      }
    }
  }
}
</style>