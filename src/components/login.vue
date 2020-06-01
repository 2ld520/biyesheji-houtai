<template>
  <div class="login_page">
    <div class="login_form">
      <h3 style="text-align:center">咚校园服务平台后台管理系统</h3>
      <el-form ref="form" :model="form" label-width="80px" class="form">
        <el-form-item label="用户名:">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="onSubmit" class="login_btn"
          >登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
      form: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    async onSubmit () {
      let name = this.form.name
      let password = parseInt(this.form.password)
      if (name !== '' && password !== '') {
        let res = await this.axios.post('/api/adminlogin', qs.stringify({
          'name': name,
          'password': password
        }))
        if (res.data.state === 1) {
          let code = res.data.data.code
          sessionStorage.setItem('code', code)
          this.$router.push({ path: '/index' })
        } else {
          this.$message('用户名或密码错误')
        }
      } else {
        this.$message('请正确输入信息')
      }
    }
  }
}
</script>

<style>
.login_page {
  background-color: rgb(184, 187, 186);
  height: 100%;
}
.login_form {
  position: relative;
  top: 20%;
  width: 400px;
  height: 300px;
  background-color: white;
  margin: auto;
  padding: 30px 0 0 0;
}
.form {
  padding: 60px 45px 0 0;
}
.login_btn {
  float: right;
}
</style>
