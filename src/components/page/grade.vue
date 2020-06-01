<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12"
        ><el-input placeholder="请输入内容" v-model="search">
          <el-button slot="append" icon="el-icon-search"></el-button> </el-input
      ></el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加成绩</el-button
        ></el-col
      >
    </el-row>
    <br />
    <el-upload
      class="upload-demo"
      ref="upload"
      action="/api/addgradeForm"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary"
        >选取excel文件</el-button
      >
      <el-button
        style="margin-left: 10px;"
        size="small"
        type="success"
        @click="submitUpload"
        >上传到服务器</el-button
      >
    </el-upload>
    <el-table :data="tables" style="width: 100%">
      <el-table-column prop="stunum" label="学号" width="180">
      </el-table-column>
      <el-table-column prop="stuname" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="subject" label="科目" width="180">
      </el-table-column>
      <el-table-column prop="grade" label="成绩" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.grade >= 60" style="color:green">{{
            scope.row.grade
          }}</span>
          <span v-if="scope.row.grade < 60" style="color:red">{{
            scope.row.grade
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button @click="toupdate(scope.row)" type="primary" size="small"
            >修改</el-button
          >
          <el-popconfirm
            title="确定要删除这条成绩吗？"
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
      :total="list.length"
    >
    </el-pagination>

    <!-- 添加成绩窗口 -->
    <el-dialog title="添加成绩" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="ruleForm">
        <el-form-item label="学生姓名" :label-width="formLabelWidth">
          <el-input v-model="form.stuname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生学号" :label-width="formLabelWidth">
          <el-input v-model="form.stunum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="科目" :label-width="formLabelWidth">
          <el-input v-model="form.coures" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="成绩" :label-width="formLabelWidth">
          <el-input v-model="form.grade" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="add('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改成绩 -->
    <el-dialog title="添加成绩" :visible.sync="dialogFormVisible2">
      <el-form :model="form2" ref="ruleForm">
        <el-form-item label="成绩" :label-width="formLabelWidth">
          <el-input v-model="form2.grade" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="updateGrade('ruleForm')"
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
      list: [],
      currentPage: 1,
      pagesize: 5,
      dialogFormVisible: false,
      form: {
        stuname: '',
        stunum: '',
        coures: '',
        grade: ''
      },
      formLabelWidth: '100px',
      fileList: [],
      search: '',
      dialogFormVisible2: false,
      form2: {
        'grade': '',
        'id': ''
      }
    }
  },
  methods: {
    async getGrade () {
      let res = await this.axios.get('/api/getGrade')
      this.list = res.data
      // console.log(this.list)
    },
    handleSizeChange: function (size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    // 表单重置
    resetform () {
      this.form.stuname = ''
      this.form.stunum = ''
      this.form.course = ''
      this.form.grade = ''
    },
    // 表单取消
    cancel () {
      this.dialogFormVisible = false
      this.resetform()
    },
    async add () {
      let res = await this.axios.post('/api/insertgrade', qs.stringify({
        'stunum': parseInt(this.form.stunum),
        'stuname': this.form.stuname,
        'grade': parseInt(this.form.grade),
        'coures': this.form.coures
      }))
      this.dialogFormVisible = false
      this.resetform()
      this.getGrade()
    },
    handleRemove (file) {
      console.log(file)
    },
    handlePreview (file) {
      console.log(file)
    },
    submitUpload () {
      this.$refs.upload.submit()
      this.getGrade()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    // 删除
    async handleConfirm (obj) {
      let res = this.axios.post('/api/delectgrade', qs.stringify({
        'id': obj.id
      }))
      this.getGrade()
      console.log(obj)
    },
    toupdate (obj) {
      this.dialogFormVisible2 = true
      this.form2.grade = obj.grade
      this.form2.id = obj.id
    },
    async updateGrade () {
      let res = await this.axios.post('/api/updateGrade', qs.stringify({
        'grade': this.form2.grade,
        'id': this.form2.id
      }))
      this.getGrade()
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      this.dialogFormVisible2 = false
    }
  },
  created () {
    this.getGrade()
  },
  // 模糊搜索
  computed: {
    // 模糊搜索
    tables () {
      const search = this.search
      if (search) {
        // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。

        return this.list.filter(data => {
          // some() 方法用于检测数组中的元素是否满足指定条件;
          // some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
          // 如果没有满足条件的元素，则返回false。

          return Object.keys(data).some(key => {
            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
            // 该方法对大小写敏感！所以只前需要toLowerCase()方法将所有查询到内容变为小写。
            return String(data[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return this.list.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize)
    }
  }
}
</script>

<style>
</style>
