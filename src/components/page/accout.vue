<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12"
        ><el-input v-model="search" placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button> </el-input
      ></el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加学生</el-button
        ></el-col
      >
    </el-row>
    <el-table :data="tables" style="width: 100%">
      <el-table-column prop="accountname" label="学生姓名" width="180">
      </el-table-column>
      <el-table-column prop="stunum" label="学号" width="180">
      </el-table-column>
      <el-table-column prop="payword" label="密码" width="180">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.payword"
            placement="bottom"
          >
            <el-button>查看</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="stuschool" label="学校" width="180">
      </el-table-column>
      <el-table-column prop="stuage" label="年龄" width="180">
      </el-table-column>
      <el-table-column prop="stusex" label="性别" width="180">
      </el-table-column>

      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="success" size="small">删除</el-button>
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
      currentPage: 1,
      pagesize: 5,
      list: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {

      },
      search: ''
    }
  },
  methods: {
    async getAccout () {
      let res = await this.axios.get('/api/getAccount')
      this.list = res.data
      console.log(this.list)
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
    }
  },
  created () {
    this.getAccout()
  },
  computed: {
    // 模糊搜索
    tables () {
      const search = this.search
      if (search) {
        // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
        // 注意： filter() 不会对空数组进行检测。
        // 注意： filter() 不会改变原始数组。
        return this.list.filter(data => {
          // some() 方法用于检测数组中的元素是否满足指定条件;
          // some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
          // 如果没有满足条件的元素，则返回false。
          // 注意： some() 不会对空数组进行检测。
          // 注意： some() 不会改变原始数组。
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
.ok_money {
  color: #00cdcd;
}
.no_money {
  color: red;
}
</style>
