<template>
  <div class="login-container">
    <!-- 导航 -->
    <van-nav-bar title="登录" >
      <van-icon name="cross" slot="left" @click="$router.back()"/>
    </van-nav-bar>
    <!-- 表单 -->
    <van-form
      @submit="onSubmit"
      ref="loginRef"
    >
      <van-field
        v-model="user.mobile"
        name="mobile"
        type="number"
        placeholder="请输入手机号"
        required
        :rules="userFrom.mobile"
        maxlength="11"
      >
        <i
          slot="left-icon"
          class=" iconfont icon-shouji"
        ></i>
      </van-field>
      <van-field
        v-model="user.code"
        type="number"
        name="code"
        placeholder="请输入验证码"
        required
        :rules="userFrom.code"
        maxlength="6"
      >
        <i
          slot="left-icon"
          class=" iconfont icon-yanzhengma"
        ></i>
        <template #button>
          <van-count-down
            :time="1000 * 5 "
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow =false"
          />
          <van-button
            v-else
            size="small"
            type="default"
            round
            class="code"
            native-type="button"
            @click="onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button
          round
          block
          type="info"
          native-type="submit"
        >提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 发送验证码接口 sendSms
import { loginAPI } from '@/api/user.js'
export default {
  name: 'MyLogin',
  data () {
    return {
      // 输入数据
      user: {
        // 13888888888
        // 13911111111
        mobile: '13888888888',
        code: '246810'
      },
      // 表单验证
      userFrom: {
        mobile: [
          { required: true, message: '请填写手机号' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      // 倒计时显示与隐藏
      isCountDownShow: false
    }
  },
  methods: {
    // 提交登录验证
    async onSubmit () {
      // 加载提示
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data: res } = await loginAPI(this.user)
        console.log(res)
        this.$store.commit('setUser', res.data)
        this.$toast.success('登录成功')
        // 跳回原来的页面，但不严谨
        this.$router.back()
      } catch (err) {
        if (err.respone.status === 400) {
          this.$toast.fail('手机号或验证码失败')
        } else {
          this.$toast.fail('登录失败，请重试', err)
        }
      }
    },
    // 发送手机号
    async onSendSms () {
      // console.log(123)
      // 验证手机号
      try {
        await this.$refs.loginRef.validate('mobile')
      } catch (err) {
        return this.$toast.fail('验证失败')
      }
      // 显示倒计时
      this.isCountDownShow = true

      // 请求发送验证码
      // try {
      // await sendSms(this.user.mobile)
      // this.$toast('发送成功')
      // } catch (err) {
      // this.isCountDownShow = false
      // if (err.response.status === 429) {
      // this.$toast('发送太频繁')
      // } else {
      // this.$toast.fail('发送失败')
      // }
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  // 图标大小
  .iconfont {
    font-size: 0.4625rem;
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
  .van-icon{
    color: #fff;
  }
}
</style>
