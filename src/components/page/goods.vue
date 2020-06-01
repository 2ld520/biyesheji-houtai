<template>
  <div>
    <el-table
      :data="list.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
      style="width: 100%"
      ><el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品id:">
              <span>{{ props.row.goodsid }}</span>
            </el-form-item>
            <el-form-item label="商品名称:">
              <span>{{ props.row.goodsname }}</span>
            </el-form-item>
            <el-form-item label="商品描述:">
              <span>{{ props.row.goodstext }}</span>
            </el-form-item>
            <el-form-item label="商品价格:">
              <span>{{ props.row.goodsprice }}</span>
            </el-form-item>
            <el-form-item label="卖家学号:">
              <span>{{ props.row.stunum }}</span>
            </el-form-item>
            <el-form-item label="卖家名称:">
              <span>{{ props.row.sellername }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="goodsid" label="商品id" width="180">
      </el-table-column>
      <el-table-column prop="goodsimg" label="商品图片" width="180">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="getimg(scope.row.goodsimg)"
            fit="scale-down"
            @click="docheckimg(scope.row.goodsimg)"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="goodsstate" label="商品状态" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.goodsstate === 0" style="color:red"
            >待审核</span
          >
          <span v-if="scope.row.goodsstate === 1" style="color:#00cdcd"
            >已审核</span
          >
          <span v-if="scope.row.goodsstate === 2" style="color:black"
            >已被拍下</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="time" label="创建时间" width="180">
      </el-table-column>

      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button
            @click="goodspass(scope.row, 1)"
            type="success"
            size="small"
            :disabled="scope.row.goodsstate == 0 ? false : true"
            >通过</el-button
          >
          <el-button
            @click="goodspass(scope.row, 0)"
            type="primary"
            size="small"
            :disabled="scope.row.goodsstate == 1 ? false : true"
            >下架</el-button
          >
          <el-button @click="delectgoods(scope.row)" type="danger" size="small"
            >删除</el-button
          >
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
    <el-dialog
      title="提示"
      :visible.sync="checkimgbox"
      width="50%"
      :before-close="handleClose"
    >
      <el-image
        style="width: 500px; height: 500px"
        :src="getimg(this.checkimg)"
        fit="scale-down"
      ></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button @click="(checkimgbox = false), (checkimg = '')"
          >取 消</el-button
        >
        <el-button type="primary" @click="checkimgbox = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
      checkimgbox: false,
      list: [],
      currentPage: 1,
      pagesize: 5,
      checkimg: ''
    }
  },
  methods: {
    getgoodslist () {
      this.axios.get('/api/getgoods').then(res => {
        this.list = res.data
        console.log(this.list)
      })
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
    showcheckimg (url) {
      return '/api/imgage/' + url
    },
    docheckimg (url) {
      this.checkimgbox = true
      this.checkimg = url
    },
    async goodspass (obj, state) {
      let res = await this.axios.post('/api/passgoods', qs.stringify({
        'id': obj.goodsid,
        'state': state
      }))
      console.log('审核通过')
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.getgoodslist()
    },
    delectgoods (obj) {
      this.axios.delete('/api/deletegoods', { params: { 'id': obj.goodsid } })
      this.getgoodslist()
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    }

  },
  created () {
    this.getgoodslist()
  }
}
</script>

<style>
.el-form--inline .el-form-item {
  display: inline;
}
</style>
