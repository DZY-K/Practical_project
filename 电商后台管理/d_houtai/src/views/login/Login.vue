<template>
  <div class="login-container">
    <div class="login_box">
      <!-- 登录页面图片 -->
      <div class="header">
        <img src="@/assets/logo.png" alt="">
      </div>
      <!-- 表单 -->
      <el-form ref="restForm" label-width="0" class="login_footer" :model="form" :rules="rules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="form.username" autocomplete="off" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" autocomplete="off" v-model="form.password"
            prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login_btn">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyLogin',
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则--组件
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置用组件
    resetForm () {
      // console.log(this)
      this.$refs.restForm.resetFields()
    },
    login () {
      this.$refs.restForm.validate(async item => {
        // console.log(item)
        if (!item) return
        const { data: res } = await this.$http.post('login', this.form)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .header {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px #eee solid;
      box-shadow: 0 0 10px #ddd;
      padding: 10px;

      // background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login_footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;

      .login_btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
