<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12"
        ><el-input placeholder="请输入内容" v-model="search">
          <el-button slot="append" icon="el-icon-search"></el-button> </el-input
      ></el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addstubox = true"
          >添加账户</el-button
        ></el-col
      >
    </el-row>
    <el-table :data="tables" style="width: 100%">
      <el-table-column prop="accountname" label="用户名" width="180">
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
      <el-table-column prop="stunum" label="学号" width="180">
      </el-table-column>
      <el-table-column prop="stuschool" label="学校" width="180">
      </el-table-column>
      <el-table-column prop="allmoney" label="账户余额(元)" width="180">
      </el-table-column>
      <el-table-column prop="lightmoney" label="电费(元)" width="180">
        <template slot-scope="scope">
          <span :class="scope.row.lightmoney > 0 ? 'ok_money' : 'no_money'">{{
            scope.row.lightmoney
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="watermoney" label="水费(元)" width="180">
        <template slot-scope="scope">
          <span :class="scope.row.watermoney > 0 ? 'ok_money' : 'no_money'">{{
            scope.row.watermoney
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stustate" label="账户状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.stustate === 1">已激活</span>
          <span v-if="scope.row.stustate === 0">未激活</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button @click="paymoney(scope.row)" type="primary" size="small"
            >扣费</el-button
          >
          <el-button @click="tomoney(scope.row)" type="success" size="small"
            >充值</el-button
          >
          <el-button @click="deleteac(scope.row)" type="danger" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 扣费 -->
    <el-dialog title="扣费" :visible.sync="dialogFormVisible">
      <el-form :model="form1" ref="ruleForm">
        <el-form-item label="电费" :label-width="formLabelWidth">
          <el-input v-model="form1.lightmoney" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="水费" :label-width="formLabelWidth">
          <el-input v-model="form1.watermoney" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="add('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 充值 -->
    <el-dialog title="充值" :visible.sync="form2dislog">
      <el-form :model="form2" ref="addmoneyForm">
        <el-form-item label="充值金额" :label-width="formLabelWidth">
          <el-input v-model="form2.allmoney" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCZ('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="addmoney('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 添加学生 -->

    <el-dialog title="添加学生" :visible.sync="addstubox">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item
          prop="stunum"
          label="学生名"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.accountname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="认证密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            v-model="form.payword"
            autocomplete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="学号" :label-width="formLabelWidth" prop="stunum">
          <el-input v-model="form.stunum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="tel">
          <el-radio v-model="form.stusex" label="男">男</el-radio>
          <el-radio v-model="form.stusex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
          <el-input v-model="form.stuage" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校" :label-width="formLabelWidth" prop="school">
          <el-select v-model="form.stuschool" placeholder="请选择校区">
            <el-option label="厦门理工学院" value="厦门理工学院"></el-option>
            <el-option label="厦门集美大学" value="厦门集美大学"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="addacount('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
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
      addstubox: false,
      form: {
        accountname: '',
        payword: '',
        stunum: '',
        stuschool: '',
        stuage: '',
        stusex: ''

      },
      form1: {
        lightmoney: '',
        watermoney: '',
        stunum: ''
      },
      form2: {
        stunum: '',
        allmoney: ''
      },
      form2dislog: false,
      formLabelWidth: '120px',
      search: ''
    }
  },
  methods: {
    async getAccout () {
      let res = await this.axios.get('/api/getAccount')
      this.list = res.data
      console.log(this.list)
    },
    paymoney (obj) {
      this.form1.stunum = obj.stunum
      this.dialogFormVisible = true
      // console.log(this.form1)
    },
    cancel () {
      this.addstubox = false
      this.dialogFormVisible = false
      this.form1.stunum = 0
      this.form1.lightmoney = 0
      this.form1.watermoney = 0
    },
    // 关闭充值窗口
    cancelCZ () {
      this.form2dislog = false
      this.form2.stunum = ''
      this.form2.allmoney = ''
    },
    // 打开充值窗口
    tomoney (obj) {
      this.form2.stunum = obj.stunum
      this.form2dislog = true
    },
    // 缴费
    async add () {
      let res = await this.axios.post('/api/charging', qs.stringify({
        'lightmoney': parseInt(this.form1.lightmoney),
        'watermoney': parseInt(this.form1.watermoney),
        'stunum': this.form1.stunum
      }))
      // console.log(typeof this.form1.lightmoney)
      if (res.data.state === 1) {
        this.$message({
          message: '扣费成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getAccout()
        this.form1.lightmoney = ''
        this.form1.watermoney = ''
        this.form1.stunum = ''
      }
    },
    // 充值
    async addmoney () {
      let res = await this.axios.post('/api/addmoney', qs.stringify({
        'allmoney': parseInt(this.form2.allmoney),
        'stunum': parseInt(this.form2.stunum)
      }))
      this.getAccout()
      this.form2dislog = false
      this.$message({
        message: '充值成功',
        type: 'success'
      })
      this.form2.stunum = ''
      this.form2.allmoney = ''
    },

    // 添加用户
    async addacount () {
      console.log(this.form)
      let res = await this.axios.post('/api/addaccount', qs.stringify({
        'accountname': this.form.accountname,
        'payword': parseInt(this.form.payword),
        'stunum': parseInt(this.form.stunum),
        'stuschool': this.form.stuschool,
        'stuage': parseInt(this.form.stuage),
        'stusex': this.form.stusex
      }))
      this.addstubox = false
      this.getAccout()
    },
    handleSizeChange: function (size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },

    // 删除用户
    deleteac (obj) {
      this.axios.delete('/api/deleteAccout', { params: { 'stunum': obj.stunum } }).then(() => {
        console.log('删除成功')
        this.getAccout()
      })
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
