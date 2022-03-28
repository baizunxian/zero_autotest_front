<template>
  <div>
    <el-form inline ref="urlform" :model="urlform" label-width="50px" size="mini" label-position="right" :rules="rules"
             class="title">
      <el-form-item prop="url">
        <el-input placeholder="请输入请求地址" v-model="urlform.url" class="input-with-select" style="width:700px">
          <el-select v-model="urlform.method" slot="prepend" placeholder="请选择" style="width: 100px;">
            <el-option
                v-for="item in methodList"
                :key="item"
                :label="item"
                :value="item">
              <span style="float: left">{{ item }}</span>
            </el-option>
          </el-select>
          <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
        </el-input>
      </el-form-item>
      <el-button size="mini" type="primary" @click="saveOrUpdateCase" class="title-button" :disabled="this.urlform.enabled_flag===0">保存</el-button>
      <el-button size="mini" type="success" @click="envdialog('debug')" :disabled="this.urlform.enabled_flag===0">调试</el-button>
      <el-button size="mini" type="warning" @click="envdialog('assert')" :disabled="this.urlform.enabled_flag===0">断言调试</el-button>
      <el-button size="mini" type="primary" @click="caseReview" v-if="this.resource=='caseReview'">用例审核</el-button>
    </el-form>

    <el-dialog
        :visible.sync="envshow"
        width="600px"
        v-dialogDrag
        append-to-body
        :close-on-click-modal="false">
      <el-form
          :rules="rules"
          ref="urlform"
          :model="urlform"
          label-width="80px"

      >
        <el-form-item label="运行环境" prop="belong_project_id">
          <el-select v-model="urlform.base_url" placeholder="选择环境" filterable style="width:80%">
            <el-option :value="null" label="自带环境">自带环境</el-option>
            <el-option
                v-for="item in envlist"
                :key="item.id"
                :label="item.env_name"
                :value="item.base_url">
              <span style="float: left">{{ item.env_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="envshow = false">取消</el-button>
      <el-button type="primary" @click="debugCase">运行</el-button>
    </span>
    </el-dialog>

    <!-- 评审弹窗 -->
    <el-dialog
        title="评审用例"
        :visible.sync="reviewCaseDialogVisible"
        width="600px"
        v-dialogDrag
        :close-on-click-modal="false">
      <el-form
          :rules="rules"
          ref="caseReviewForm"
          :model="caseReviewForm"
          label-width="80px"
      >
        <el-form-item label="跨声推送" prop="iaa_user">
          <el-select
              v-model="caseReviewForm.iaa_user" placeholder="请选择推送用户" clearable filterable style="width: 100%;"
              multiple
          >
            <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id">
              <span style="float: left">{{ item.nickname }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跨声推送" prop="iaa_push_type">
          <el-radio-group v-model="caseReviewForm.iaa_type">
            <el-radio :label="20">推送</el-radio>
            <el-radio :label="10">不推送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评审结果" prop="iaa_push_type">
          <el-radio-group v-model="caseReviewForm.review_result">
            <el-radio :label="20">通过</el-radio>
            <el-radio :label="10">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评审意见" prop="other_desc">
          <el-input type="textarea" rows="5" v-model="caseReviewForm.comment" placeholder="请输入意见"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="reviewCaseDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {GetEnvList} from '@/api/env'
import {GetReviewInfo, SaveOrUpdateReview} from '@/api/casereview'
import {mapGetters} from 'vuex'
import {getAllUser} from "@/api/user";


export default {
  name: 'url',
  data() {
    return {
      activeName: 'extractValidate',
      reviewCaseDialogVisible: false,
      reviewInfo:{},
      userList:[],
      resource:'',
      envshow: false,
      methodList: ['POST', 'GET', 'PUT', 'DELETE'],
      rules: {
        url: [{required: true, message: '请求地址不能为空', trigger: 'blur'}],
      },
      urlform: {
        url: '',
        method: 'POST',
        base_url: null,
        enabled_flag: null
      },
      envlist: [],
      envQuery: {
        page: 1,
        pageSize: 200
      },
      userListQuery: {
        page: 1,
        pageSize: 1000,
      },
      caseReviewForm: {
        id:undefined,
        test_case_id:undefined,
        review_status: 10,
        review_result: 20,
        iaa_user: '',
        iaa_type: 10,
        comment:undefined,
        flag:undefined,
        grade:undefined,
        review_user:this.userId,
      },
      updateNumber: 0,
      type: 'debug'
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },

  watch: {
    urlform: {
      handler(val) {
        this.updateNumber++
        if (val && this.updateNumber > 1) {
          this.$emit('setUpdateCount', 'URL')
        }
      },
      deep: true
    }
  },

  methods: {
    // 重置表单
    resetForm(data) {
      this.updateNumber = 0
      this.urlform = {
        id:undefined,
        url: '',
        method: 'POST',
        env_name: null
      }
      if (data) this.urlform.url = data.code
    },

    getUrlForm() {
      return this.urlform
    },
    // 编辑时插入数据
    setUrlForm(form) {
      this.updateNumber = 0
      this.urlform.url = form.url
      this.urlform.method = form.method
      this.urlform.enabled_flag = form.enabled_flag
      if(form.hasOwnProperty('id')){
        this.urlform.id = form.id
      }
      if(form.hasOwnProperty('resource')){
        this.resource = form.resource
      }
      this.getReviewInfo()
      this.getuserlist()
    },
    // 获取用例评审信息
    getReviewInfo(){
      GetReviewInfo({"id":this.urlform.id})
          .then(res => {
            this.reviewInfo = res.data
          })
    },
    // 获取用户列表
    getuserlist() {
      getAllUser(this.userListQuery)
          .then(res => {
            this.userList = res.data.rows
          })
    },
    // 重置表单
    // resetform() {
    //   this.urlform.url = ''
    //   this.urlform.method = 'POST'
    // },
    saveOrUpdateCase() {
      this.$refs.urlform.validate(vaild => {
        if (vaild) {
          this.$emit('saveOrUpdateCaseOrdebug', 'save')
          // debugCase(form)
          //   .then(res => {
          //   })
        } else {
          this.$message({
            type: 'warning',
            message: '请填写地址信息'
          })
        }
      })
    },
    // 选择环境弹窗
    envdialog(type) {
      this.type = type
      this.$refs.urlform.validate(vaild => {
        if (vaild) {
          this.getenvlist()
          this.envshow = true
        } else {
          this.$message({
            type: 'warning',
            message: '请填写地址信息'
          })
        }
      })
    },
    // 执行
    debugCase() {
      this.$emit('saveOrUpdateCaseOrdebug', this.type)
      this.envshow = false
    },
    // 用例审核
    caseReview(){
      if(this.reviewInfo.review_status == 20){
        this.caseReviewForm.id = this.reviewInfo.id
        this.caseReviewForm.test_case_id = this.reviewInfo.test_case_id
        this.caseReviewForm.review_status = this.reviewInfo.review_status
        this.caseReviewForm.review_result = this.reviewInfo.review_result
        this.caseReviewForm.iaa_user = JSON.parse(this.reviewInfo.iaa_user)
        this.caseReviewForm.iaa_type = this.reviewInfo.iaa_type
        this.caseReviewForm.comment = this.reviewInfo.comment
        this.caseReviewForm.flag = this.reviewInfo.flag
        this.caseReviewForm.grade = this.reviewInfo.grade
        this.caseReviewForm.review_user = this.reviewInfo.review_user
      }else{
        this.caseReviewForm = {
          id: this.reviewInfo.id,
          test_case_id: this.reviewInfo.test_case_id,
          review_status: 10,
          review_result: 20,
          iaa_user: [this.reviewInfo.created_by],
          iaa_type: 10,
          comment:undefined,
          flag:undefined,
          grade:undefined,
          review_user:this.userId,
        }
      }
      this.reviewCaseDialogVisible = true
    },
    // 用例审核
    // 评审用例保存

    save() {
      this.$refs['caseReviewForm'].validate(async (vaild) => {
        if (vaild) {
          try {
            this.buttonStart = true
            let res = await SaveOrUpdateReview(this.caseReviewForm)
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '用例评审保存成功！'
              })
              this.reviewCaseDialogVisible = false
            }
          } catch (error) {
            console.log(error)
            this.buttonStart = false
          }
        } else {
          this.$message.error('请填写必填参数')
        }
      })
    },
    // 获取项目列表
    getenvlist() {
      GetEnvList(this.envQuery)
          .then(res => {
            this.envlist = res.data.rows
          })
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

.title {
  margin-left: 10px;
  margin-top: 10px;

  .title-button {
    margin-left: 10px;
  }

  ::v-deep .el-input-group__prepend {
    // color: #909399;
    font-weight: 1000;
  }

  ::v-deep .el-input__inner {
    font-weight: bold;
    font-size: 13px;
  }

  ::v-deep .el-form-item--mini .el-form-item__error {
    padding-left: 100px;
  }

  ::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 5px;
  }
}

.tip {
  padding: 4px 4px;
  border-left: 5px solid #409EFF;
  margin-top: 20px;

  p {
    margin: 0;
  }
}

</style>
