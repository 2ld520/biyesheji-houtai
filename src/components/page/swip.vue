<template>
  <div>
    <el-button type="primary" @click="dialogFormVisible1 = true"
      >预览效果</el-button
    >
    <el-button type="primary" @click="dialogFormVisible = true"
      >添加图片</el-button
    >
    <el-row>
      <el-table
        :data="list.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
        style="width: 100%"
      >
        <el-table-column prop="imgurl" label="图片" width="180">
          <template slot-scope="scope">
            <el-image
              :src="getimg(scope.row.imgurl)"
              fit="scale-down"
              style="width: 100px; height: 100px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="imgid" label="ID" width="180"> </el-table-column>
        <el-table-column prop="imglink" label="连接link" width="180">
        </el-table-column>
        <el-table-column prop="state" label="状态" width="180"
          ><template slot-scope="scope">
            <span v-if="scope.row.state == '1'" style="color:rgb(84, 195, 29);"
              >启用</span
            >
            <span v-if="scope.row.state == '0'" style="color:red;">禁止</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="small"
              @click="cheackstate(scope.row, 1)"
              :disabled="scope.row.state == 1 ? true : false"
              >启用</el-button
            >
            <el-button
              type="warning"
              size="small"
              @click="cheackstate(scope.row, 0)"
              :disabled="scope.row.state == 1 ? false : true"
              >禁用</el-button
            >
            <el-button @click="delectswip(scope.row)" type="danger" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="预览窗口"
        :visible.sync="dialogFormVisible1"
        width="30%"
      >
        <div class="block">
          <el-carousel type="card" height="200px">
            <el-carousel-item v-for="(item, index) in imgbox" :key="index">
              <el-image
                :src="getimg(item.imgurl)"
                fit="fill"
                style="height: 200px"
              ></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible1 = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-row>

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
    <!-- 添加图片窗口 -->
    <el-dialog title="上传图片" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="addmoneyForm">
        <el-form-item label="链接地址" :label-width="formLabelWidth">
          <el-input
            v-model="form.imglink"
            autocomplete="off"
            placeholder="输入完整链接,例如https://www.baidu.com"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="form.state" placeholder="状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片" :label-width="formLabelWidth">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="/api/insertSwipimg"
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
  </div>
</template>

<script>
import qs from 'qs'

export default {
  data () {
    return {
      dialogFormVisible1: false,
      currentPage: 1,
      pagesize: 5,
      list: [],
      imgbox: [],
      dialogFormVisible: false,
      form: {
        imglink: '',
        state: ''
      },
      formLabelWidth: '100px',
      value1: true

    }
  },
  methods: {
    async getSwipimg () {
      let res = await this.axios.get('/api/getSwipimg')
      this.list = res.data.data
      // console.log(res.data.data)
    },
    getimg (obj) {
      return '/api/imgage/' + obj
    },
    getState (obj) {
      return false
    },
    async getimgState () {
      let res = await this.axios.get('/api/getSwipimg/state')
      this.imgbox = res.data
      console.log(res.data)
    },
    handleSizeChange: function (size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    cancel () {
      this.dialogFormVisible = false
    },
    // 上传
    upload () {
      let start = 0
      let end = 0
      for (let i of this.list) {
        i.state == 1 ? start++ : end++
      }
      this.form.state == 1 && start >= 4 ? this.$message.error('当前启用图片达到数量上限，无法继续添加') : this.$refs.upload.submit()
      this.getSwipimg()
      this.dialogFormVisible = false

      console.log('操作完成')
    },
    // 删除
    async delectswip (obj) {
      if (this.list.length == 1) {
        this.$message.error('当前为最后一张图片，无法删除')
      } else if (obj.state != 0) {
        this.$message.error('当前图片正在启用中，无法删除')
      } else {
        let res = this.axios.delete('/api/deleteSwipimg', { params: { imgid: obj.imgid } })
        this.getSwipimg()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }
    },
    changestate (obj) {
      obj.state = obj.state == 1 ? 0 : 1
      console.log(obj.state)
    },
    getstate (state) {
      let value = state = !!1
      return value
    },
    // 防止全部都被禁用 或者 虽多启用3个
    cheackstate (obj, state) {
      let start = 0
      let end = 0
      for (let i of this.list) {
        i.state == 1 ? start++ : end++
      }
      // console.log(start)
      // 如果当前操作为禁用(0),判定已启用的数量(start)是否为1
      state == 0 ? start == 1 ? this.$message.error('当前图片为最后一张启用图片，无法禁用') : this.open(obj, state)
        // 若操作不为禁用
        : start == 4 ? this.$message.error('当前启用的图片数不能超过4张') : this.open(obj, state)
    },

    // 启用 or 禁用
    open (obj, state) {
      let text = state == 1 ? '是否要启用这张图片' : '是否要禁用这张图片'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        let res = await this.axios.post('/api/updateState', qs.stringify({
          'state': state,
          'imgid': obj.imgid
        }))

        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.getSwipimg()
      }).catch()
    }
  },
  created () {
    this.getSwipimg()
    this.getimgState()
  }
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.block {
  padding: 30px;
  text-align: center;
  border-right: 1px solid #eff2f6;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}
</style>
