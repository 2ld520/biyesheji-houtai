<template>
  <div>
    <el-table
      :data="list.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
      style="width: 100%"
      ><el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="卖家名称:">
              <span>{{ props.row.sellername }}</span>
            </el-form-item>
            <el-form-item label="卖家学号:">
              <span>{{ props.row.sellesturnum }}</span>
            </el-form-item>
            <el-form-item label="商品ID:">
              <span>{{ props.row.goodsid }}</span>
            </el-form-item>
            <el-form-item label="买家学号:">
              <span>{{ props.row.buyerstunum }}</span>
            </el-form-item>
            <el-form-item label="收货地址:">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="订单创建时间:">
              <span>{{ props.row.time }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="orderid" label="订单编号" width="180">
      </el-table-column>
      <el-table-column prop="goodsimg" label="商品图片" width="180">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="getimg(scope.row.goodsimg)"
            fit="scale-down"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="orderstate" label="订单状态" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.orderstate === 0" style="color:red"
            >订单已关闭</span
          >
          <span v-if="scope.row.orderstate === 1" style="color:#00cdcd"
            >买家已付款</span
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <!-- <el-button @click="paymoney(scope.row)" type="primary" size="small"
            >修改</el-button
          > -->
          <el-button @click="closeorder(scope.row)" size="small"
            >关闭订单</el-button
          >
          <el-button @click="deleteOrder(scope.row)" type="danger" size="small"
            >删除订单</el-button
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
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
      list: [],
      currentPage: 1,
      pagesize: 5
    }
  },
  methods: {
    async getorder () {
      let res = await this.axios.get('/api/getorder')
      this.list = res.data
      console.log(res)
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
    // 关闭订单
    closeorder (obj) {
      this.$confirm('是否要关闭这个订单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.axios.post('/api/changeOrder', qs.stringify({
          'orderstate': 0,
          'id': obj.orderid
        }))
        this.getorder()
      })
    },
    // 删除订单
    deleteOrder (obj) {
      if (obj.orderstate !== 0) {
        this.$message({
          message: '订单进行中，无法删除',
          type: 'error'
        })
      } else {
        this.axios.delete('/api/deleteOrder', { params: { 'orderid': obj.orderid } })
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getorder()
      }
    }
  },
  created () {
    this.getorder()
  }
}
</script>

<style>
</style>
