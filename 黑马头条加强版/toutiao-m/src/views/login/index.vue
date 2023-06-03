<template>
  <div class="login-container">
    <!-- 导航 -->
    <van-nav-bar title="登录" />
    <!-- 表单 -->
    <van-form @submit="onSubmit" >
      <van-field v-model="user.phoneNumber" name="用户名" type="number" placeholder="请输入手机号" required>
        <i slot="left-icon" class=" iconfont icon-shouji"></i>
      </van-field>
      <van-field v-model="user.code" type="number" name="密码" placeholder="请输入验证码" required>
        <i slot="left-icon" class=" iconfont icon-yanzhengma"></i>
        <template #button>
          <van-button size="small" type="default" round class="code">发送验证码</van-button>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api/user.js'
export default {
  name: 'MyLogin',
  data () {
    return {
      user: {
        // 13888888888
        // 13911111111
        phoneNumber: '13911112222',
        code: '123123'
      }
    }
  },
  methods: {
    async onSubmit () {
      const { data: res } = await loginAPI(this.user)
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {

  // 图标大小
  .iconfont {
    font-size: .4625rem;
  }

  // 验证码
  ::v-deep.code {
    width: 152px;
    height: 46px;
    color: #666666;
    background-color: #ededed;
    line-height: 46px;
    font-size: 22px;
  }
}
</style>
