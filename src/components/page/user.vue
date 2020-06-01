<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12"
        ><el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button> </el-input
      ></el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加用户</el-button
        ></el-col
      >
    </el-row>

    <!-- 添加用户窗口 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item
          prop="username"
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            v-model="form.password"
            autocomplete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="学号" :label-width="formLabelWidth" prop="stunum">
          <el-input
            v-model="form.stunum"
            autocomplete="off"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth" prop="tel">
          <el-input v-model="form.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="名称"
          :label-width="formLabelWidth"
          prop="nickname"
        >
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校" :label-width="formLabelWidth" prop="school">
          <el-select v-model="form.region" placeholder="请选择校区">
            <el-option label="厦门理工学院" value="厦门理工学院"></el-option>
            <el-option label="厦门集美大学" value="厦门集美大学"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="add('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      style="width: 100%"
    >
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="nickname" label="名称" width="180">
      </el-table-column>
      <el-table-column prop="imgurl" label="头像" width="180">
        <template slot-scope="scope">
          <el-avatar :src="getimg(scope.row.imgurl)"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="电话号码" width="180">
      </el-table-column>
      <el-table-column prop="school" label="学校" width="180">
      </el-table-column>
      <el-table-column prop="usernum" label="认证学号" width="180">
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button
            @click="toupdateuser(scope.row)"
            type="primary"
            size="small"
            >修改基本资料</el-button
          >
          <el-popconfirm
            title="确定要删除用户吗？"
            iconColor="red"
            @onConfirm="handleConfirm(scope.row)"
            type="danger"
            okType="danger"
            confirmButtonText="删除"
          >
            <el-button type="danger" size="small" slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
    >
    </el-pagination>

    <!-- //修改基本资料窗口 -->
    <el-dialog title="修改基础资料" :visible.sync="dialogFormVisible2">
      <el-form :model="form2" ref="ruleForm">
        <el-form-item label="电话号码" :label-width="formLabelWidth">
          <el-input v-model="form2.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="平台昵称" :label-width="formLabelWidth">
          <el-input v-model="form2.nickname" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="updateuser('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
      currentPage: 1,
      pagesize: 5,
      tableData: [],
      dialogFormVisible: false,
      form: {
        username: '',
        password: '',
        tel: '',
        school: '',
        nickname: '',
        imgurl: '',
        stunum: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible2: false,
      rules: {
        username: [
          { required: true, message: '请输入活动用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请选择密码', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请选择电话号码', trigger: 'blur' }
        ],
        school: [
          { required: false, message: '请选择学校', trigger: 'change' }
        ],
        nickname: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        stunum: [
          { required: true, message: '请输入学号', trigger: 'blur' }
        ]

      },
      form2: {}
    }
  },
  methods: {
    async getUser () {
      let res = await this.axios.get('/api/user')
      this.tableData = res.data
      console.log(this.tableData)
    },
    handleClick (obj) {
      console.log(obj)
    },
    getimg (url) {
      return '/api/imgage/' + url
    },
    async handleConfirm (obj) {
      let res = await this.axios.delete('/api/userDelete', { params: { 'usernum': obj.usernum } })
      if (res === 1) {
        this.$message('删除成功')
      }
      this.getUser()
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    add (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form + '添加用户')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel (formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    handleSizeChange: function (size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    toupdateuser (obj) {
      this.form2 = obj
      this.dialogFormVisible2 = true
    },
    updateuser () {
      this.axios.post('/api/updatebase', qs.stringify({
        'tel': this.form2.tel,
        'nickname': this.form2.nickname,
        'usernum': this.form2.usernum
      })).then(
        () => {
          this.getUser()
          this.dialogFormVisible2 = false
          this.$message({
            message: '修改成功',
            type: 'success'
          }

          )
        }
      )
    }

  },
  created () {
    this.getUser()
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
