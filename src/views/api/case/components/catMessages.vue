<template>
  <el-row>
    <el-col :span="8" style="padding-right: 50px;">
      <el-form ref="messageForm" :model="messageForm" label-width="80px" size="mini" label-position="right"
               :rules="rules">
        <el-form-item label="用例名" prop="case_name">
          <el-input v-model="messageForm.case_name" style="width: 100%;" placeholder="请输入用例名称"></el-input>
        </el-form-item>
        <el-form-item label="所属项目" prop="project_id">
          <el-select v-model="messageForm.project_id" placeholder="选择请求方法" filterable style="width: 100%;"
                     @change="selectProject">
            <el-option
                v-for="project in projectList"
                :key="project.id + project.project_name"
                :label="project.project_name"
                :value="project.id">
              <span style="float: left">{{ project.project_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可选模块" prop="module_id">
          <el-select v-model="messageForm.module_id" placeholder="选择模块" filterable style="width: 100%;"
                     @change="selectModule">
            <el-option
                v-for="modules in moduletList"
                :key="modules.id + modules.module_name"
                :label="modules.module_name"
                :value="modules.id">
              <span style="float: left">{{ modules.module_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联配置" prop="config_id">
          <el-select v-model="messageForm.config_id" placeholder="请选择配置" clearable filterable
                     style="width: 100%;">
            <el-option
                v-for="item in configList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              <span style="float: left">
                {{ item.name }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接口code" prop="code_id">
          <el-select
              v-model="messageForm.code_id"
              placeholder="通过code搜索"
              filterable style="width: 100%;"
              remote
              clearable
              :remote-method="getCode"
              :loading="selectLoading"
              @change="selectCode"
          >
            <el-option
                v-for="api_code in codeList"
                :key="api_code.id"
                :label="api_code.code"
                :value="api_code.id">
              <span style="float: left">
                {{ api_code.code }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="messageForm.priority">
            <el-radio :label=1>1</el-radio>
            <el-radio :label=2>2</el-radio>
            <el-radio :label=3>3</el-radio>
            <el-radio :label=4>4</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
    </el-col>

    <el-col :span="16">
      <el-transfer
          filterable
          ref="transfer"
          target-order="push"
          filter-placeholder="输入名称查询"
          v-model="messageForm.include"
          :titles="[`可选前置用例(总条数:${preCaseTotal})`, `已选前置用例(总条数:${messageForm.include.length})`]"
          :data="include_data"
          @changeQuery="preSearchCase"
          :props="{key: 'id', label: 'name'}"
          @change="onChange">
            <span
                slot-scope="{ option }"
                :title="option.label"
                :draggable="!option.disabled"
                @dragstart="drag($event,option)">
              {{ option.name }}
            </span>
      </el-transfer>
      <!--      <pre-case-->
      <!--          :data="include_data"-->
      <!--          :preCaseTotal="preCaseTotal"-->
      <!--          v-model="messageForm.include"-->
      <!--          @catCaseInfo="catCaseInfo"-->
      <!--          @change-query="preSearchCase">-->
      <!--      </pre-case>-->

    </el-col>

    <el-dialog
        lock-scroll
        v-if="showCaseInfo"
        :visible.sync="showCaseInfo"
        width="80%"
        destroy-on-close
        :close-on-click-modal="false"
        center
        append-to-body
        top='4vh'
    >
      <div slot="title">用例详情</div>
      <cat-case :id="catCaseId"/>
    </el-dialog>

  </el-row>
</template>

<script>
import {GetProjectList} from '@/api/project'
import {GetModuleList} from '@/api/module'
import {GetCaseList, gatApiCode} from '@/api/case'
import catCase from '../catCase'
import Sortable from 'sortablejs'
import elTransfer from '@/components/transfer/src/main'

export default {
  name: 'messages',
  components: {
    catCase,
    elTransfer,
    // preCase,
  },
  data() {
    return {
      selectLoading: false,
      showCaseInfo: false,
      catCaseId: null,
      draggingKey: null,
      include_data: [],
      projectList: [],
      moduletList: [],
      configList: [],
      codeList: [],
      methodList: ['POST', 'GET', 'PUT', 'DELETE'],
      projectlistQuery: {
        page: 1,
        pageSize: 1000,
      },
      moduletlistQuery: {
        page: 1,
        pageSize: 1000,
        project_id: '',
      },
      // 配置获取
      CaselistQuery: {
        page: 1,
        pageSize: 10,
        type: 1,
        module_id: '',
        project_id: '',
      },
      configListQuery: {
        page: 1,
        pageSize: 1000,
        type: 2,
        // module_id: '',
        project_id: '',
      },
      rules: {
        case_name: [{required: true, message: '请输入用例名', trigger: 'blur'}],
        project_id: [{required: true, message: '请选择项目', trigger: 'blur'}],
        module_id: [{required: true, message: '请选择模块', trigger: 'blur'}],
      },
      messageForm: this.createFrom(),
      updateNumber: 0,
      preCaseTotal: 0,
    }
  },
  created() {
    this.getProjectList()
    this.codeList = []
  },
  watch: {
    messageForm: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 1) {
          this.$emit('setUpdateCount', '基本信息')
        }
      },
      deep: true
    }
  },
  methods: {
    // 保存，返回表单

    createFrom() {
      return {
        case_name: '',
        code_id: '',
        code: '',
        project_id: '',
        module_id: '',
        config_id: null,
        id: '',
        priority: 3,
        include: []
      }
    },

    async getMsgForm() {
      // return this.messageForm
      let isTrue = await this.$refs['messageForm'].validate()
      if (isTrue) {
        return this.messageForm
      } else {
        return false
      }
    },

    get_include() {
      console.log(this.messageForm.include)
    },
    // 保存回填id
    setCaseId(c_id) {
      this.messageForm.id = c_id
    },
    // 重置表单
    resetForm(data) {
      this.updateNumber = 0
      this.messageForm = this.createFrom()
      this.include_data = []
      this.codeList = []
      if (data) {
        this.messageForm.code_id = data.code_id
        this.messageForm.code = data.code
        this.messageForm.case_name = data.case_name
        this.codeList.push({id: data.code_id, code: data.code})
      }
    },
    // 编辑时赋值
    setMsgFrom(case_info) {
      this.updateNumber = 0
      this.messageForm.id = case_info.id
      this.messageForm.case_name = case_info.case_name
      this.messageForm.priority = case_info.priority
      this.messageForm.config_id = ''
      // 初始化项目
      if (case_info.project_id) {
        this.messageForm.project_id = case_info.project_id
        this.moduletlistQuery.project_id = case_info.project_id  // 请求模块列表赋值，项目id
        this.configListQuery.project_id = case_info.project_id  // 请求模块列表赋值，项目id
        this.CaselistQuery.project_id = case_info.project_id
        this.messageForm.include = case_info.include
        this.getModuleList() // 获取模块列表
        this.getCaseList()
        //     .then(res => {
        //   this.messageForm.include = case_info.include
        //   this.getInclude(case_info.include)
        // })
        this.getConfigList()  // 获取config 列表
        this.codeList = []
        // 初始化模块
        if (case_info.module_id) {
          this.messageForm.module_id = case_info.module_id
        }
        // 初始化配置
        if (case_info.config_id) {
          this.messageForm.config_id = case_info.config_id
        }
        // 初始化api code
        if (case_info.code_id) {
          let code_info = this.codeList.find(v => v.id = case_info.code_id)
          if (!code_info) {
            this.codeList.push({id: case_info.code_id, code: case_info.code})
          }
          this.messageForm.code_id = case_info.code_id
          this.messageForm.code = case_info.code
        }

      }

    },

    // 获取项目列表
    getProjectList() {
      GetProjectList(this.projectlistQuery)
          .then(res => {
            this.projectList = res.data.rows
          })
    },

    async getInclude(include) {
      if (include.length > 0) {
        let res = await GetCaseList({ids: include, page: 1, pageSize: 1000})
        let data = res.data.rows
        data.forEach(i => {
          if (!this.include_data.some(e => e.id === i)) {
            this.include_data.push(...data)
          }
        })
      }
    },
    // 选择项目
    selectProject(project_id) {
      this.messageForm.module_id = ''
      this.messageForm.config_id = ''
      this.messageForm.include = []
      this.moduletlistQuery.project_id = project_id
      this.configListQuery.project_id = project_id
      this.moduletList = []
      this.include_data = []
      this.CaselistQuery.project_id = project_id
      this.getModuleList()
      this.getCaseList()
      this.getConfigList()
    },
    // 选择模块
    selectModule(module_id) {
      // this.messageForm.include = []
      // this.configList = []
      // this.messageForm.config_id = ''
      // this.getConfigList()

    },
    // 获取模块列表
    async getModuleList() {
      let res = await GetModuleList(this.moduletlistQuery)
      this.moduletList = res.data.rows
    },
    //获取配置列表
    async getConfigList() {
      let res = await GetCaseList(this.configListQuery)
      this.configList = res.data.rows
    },
    // 获取配置，用例列表
    getCaseList() {
      GetCaseList(this.CaselistQuery)
          .then(res => {
            let res_data = res.data.rows
            this.include_data = []  // 用例
            // 循环数组
            this.preCaseTotal = res.data.rowTotal
            this.include_data = res_data
            this.getInclude(this.messageForm.include)
          })

    },

    preSearchCase(query) {
      if (query.length >= 2) {
        this.CaselistQuery.name = query
        GetCaseList({name: query, page: 1, pageSize: 1000})
            .then(res => {
              let res_data = res.data.rows
              if (res_data) {
                res_data.forEach(testcase => {
                  if (!this.include_data.some((e) => e.id === testcase.id)) {
                    this.include_data.push(testcase)
                  }
                })
              }
            })
      }
    },

    // 获取用例
    getCode(query) {
      if (query.length >= 3) {
        this.selectLoading = true
        this.codeList = []
        gatApiCode({api_code: query})
            .then(res => {
              if (res.code === 0) {
                this.codeList = res.data
                this.selectLoading = false
              }
            })
      }
    },
    //选择
    selectCode(val) {
      if (val) {
        let code_info = this.codeList.find(v => v.id === val)
        if (code_info) {
          this.messageForm.code = code_info.code
        }
      } else {
        this.messageForm.code = null
      }
    },
    drag(ev, option) {
      this.draggingKey = option.key
      this.setInclude(this.messageForm.include)
    },

    setInclude(include) {
      this.messageForm.include = include
    },

    onChange(value, direction, movedKeys) {
      this.$emit('update:call-back', value)
    },
    catCaseInfo(id) {
      this.catCaseId = id
      this.showCaseInfo = true
    }
  }
  ,
  mounted() {
    const transfer = this.$refs.transfer.$el
    const leftPanel = transfer.getElementsByClassName('el-transfer-panel')[0].getElementsByClassName('el-transfer-panel__body')[0]
    const rightPanel = transfer.getElementsByClassName('el-transfer-panel')[1].getElementsByClassName('el-transfer-panel__body')[0]
    const rightEl = rightPanel.getElementsByClassName('el-transfer-panel__list')[0]
    Sortable.create(rightEl, {
      onEnd: (evt) => {
        const {oldIndex, newIndex} = evt
        const temp = this.messageForm.include[oldIndex]
        if (!temp || temp === 'undefined') {
          return
        }// 解决右边最后一项从右边拖左边，有undefined的问题
        for (var i = 0; i < this.messageForm.include.length; i++) {
          if (this.messageForm.include[i] === '' || this.messageForm.include[i] === null || typeof (this.messageForm.include[i]) === 'undefined') {
            this.messageForm.include.splice(i, 1)
            i = i - 1
          }
        }
        const arr_temp = [].concat(this.messageForm.include) // 创建一个新的临时数组，用以操作后不变更原数组
        arr_temp.splice(newIndex, 0, arr_temp.splice(oldIndex, 1)[0]) // 在b位置插入从a位置截取的元素
        this.messageForm.include = arr_temp
        this.$emit('update:call-back', this.messageForm.include)
      }
    })
    const leftEl = leftPanel.getElementsByClassName('el-transfer-panel__list')[0]
    Sortable.create(leftEl, {
      onEnd: (evt) => {
        const {oldIndex, newIndex} = evt
        const temp = this.include_data[oldIndex]
        if (!temp || temp === 'undefined') {
          return
        } // 解决右边最后一项从右边拖左边，有undefined的问题
        this.$set(this.include_data, oldIndex, this.include_data[newIndex])
        this.$set(this.include_data, newIndex, temp)
      }
    })
    leftPanel.ondragover = (ev) => {
      ev.preventDefault()
    }
    leftPanel.ondrop = (ev) => {
      ev.preventDefault()
      const index = this.messageForm.include.indexOf(this.draggingKey)
      if (index !== -1) {
        this.messageForm.include.splice(index, 1)
      }
    }
    rightPanel.ondragover = (ev) => {
      ev.preventDefault()
    }
    rightPanel.ondrop = (ev) => {
      ev.preventDefault()
      if (this.messageForm.include.indexOf(this.draggingKey) === -1) {
        if (null != this.draggingKey) {
          this.messageForm.include.push(this.draggingKey)
        }
      }
    }
  }
}
</script>
