<template>
  <div>
    <el-row :gutter="20">
      <!-- <el-col :span="12"
        ><el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button> </el-input
      ></el-col> -->
      <el-col :span="4">
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加资讯</el-button
        ></el-col
      >
      <el-button type="primary" @click="getNotice()"
          >广播</el-button
        ></el-col
      >
    </el-row>
    <el-table
      :data="list.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
      style="width: 100%"
    >
      <el-table-column prop="img" label="图片" width="180">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="getimg(scope.row.img)"
            fit="scale-down"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="资讯ID" width="180"> </el-table-column>
      <el-table-column prop="title" label="标题" width="180"> </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="推送内容:">
              <span>{{ props.row.text }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button @click="updatenews(scope.row)" type="primary" size="small"
            >编辑内容</el-button
          >
          <el-button @click="deletenews(scope.row)" type="danger" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加资讯窗口 -->
    <el-dialog title="添加资讯" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="addmoneyForm">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            v-model="form.text"
            autocomplete="off"
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择图片" :label-width="formLabelWidth">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="/api/insertNews"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="form.fileList"
            list-type="picture"
            :auto-upload="false"
            :data="form"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="upload('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- //编辑内容窗口 -->
    <el-dialog title="编辑内容" :visible.sync="dialogFormVisible2">
      <el-form :model="form" ref="addmoneyForm">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form2.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            v-model="form2.text"
            autocomplete="off"
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel2('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="update('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 广播窗口 -->

    <el-dialog title="广播" :visible.sync="dialogFormVisible3">
      <el-form :model="form3" ref="addmoneyForm">
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input v-model="form3.noticetext" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="updateNotice('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
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
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
      currentPage: 1,
      pagesize: 10,
      list: [],
      dialogFormVisible: false,
      form: {
        title: '',
        text: '',
        fileList: []
      },
      form2: {
        title: '',
        text: '',
        id: ''
      },
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      form3: {
        noticetext: ''
      }

    }
  },
  methods: {
    async getnews () {
      let res = await this.axios.get('/api/getNews')
      this.list = res.data.data
      console.log(this.list)
    },
    async getNotice () {
      this.dialogFormVisible3 = true
      let res = await this.axios.get('/api/getNotice')
      this.form3.noticetext = res.data.text
    },
    getimg (obj) {
      return '/api/imgage/' + obj
    },
    handleSizeChange: function (size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    upload () {
      console.log(this.form)
      this.$refs.upload.submit()
      this.dialogFormVisible = false
      this.getnews()
      this.form.title = ''
      this.form.text = ''
      this.form.fileList = ''
      this.$message({
        message: '添加成功',
        type: 'success',
        duration: '1000'
      })
    },
    deletenews (obj) {
      this.axios.delete('/api/deleteNews', { params: { 'id': obj.id } }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: '1000'
        })
        this.getnews()
      })
    },
    updatenews (obj) {
      this.form2.title = obj.title
      this.form2.text = obj.text
      this.form2.id = obj.id
      this.dialogFormVisible2 = true
    },
    cancel () {
      this.dialogFormVisible = false
    },
    cancel2 () {
      this.dialogFormVisible2 = false
    },
    update () {
      this.axios.post('/api/updateNews', qs.stringify({
        'title': this.form2.title,
        'text': this.form2.text,
        'id': this.form2.id
      })).then(() => {
        console.log('编辑成功')
        this.dialogFormVisible2 = false
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.getnews()
      })
    },
    async updateNotice () {
      let res = this.axios.post('/api/updateNotice', qs.stringify({
        'text': this.form3.noticetext
      }))
      this.$message({
        message: '广播成功',
        type: 'success'
      })
      this.dialogFormVisible3 = false
    }
  },
  created () {
    this.getnews()
  }
}
</script>

<style>
</style>
