<template>
  <div class="my-container">
    <!-- 头部未登录 -->
    <div
      class="header no-login"
      v-if="!user"
    >
      <div
        class="login-btn"
        @click="$router.push('/login')"
      >
        <img
          class="mobile-img"
          src="@/assets/mobile.png"
          alt=""
        >
        <span class="text"> 登录 / 注册</span>
      </div>
    </div>

    <!-- 头部登录 -->
    <div
      class="header user-info"
      v-else
    >
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            round
            cover
            :src="userInfo.photo"
          />
          <span class="user-name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button
            size="mini"
            round
            class="rg-btn"
          >编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <div class="top">{{ userInfo.art_count }}</div>
          <div class="bottom">头条</div>
        </div>
        <div class="data-item">
          <div class="top">{{ userInfo.follow_count }}</div>
          <div class="bottom">关注</div>
        </div>
        <div class="data-item">
          <div class="top">{{ userInfo.fans_count }}</div>
          <div class="bottom">粉丝</div>
        </div>
        <div class="data-item">
          <div class="top">{{ userInfo.like_count }}</div>
          <div class="bottom">获赞</div>
        </div>
      </div>
    </div>

    <!-- 主要功能 -->
    <div class="main">
      <div class="collect-history">
        <div class="collect">
          <i
            class="iconfont icon-shoucang "
            slot="icon"
          ></i>
          <span class="text">收 藏</span>
        </div>
        <div class="history">
          <i
            class="iconfont icon-lishi "
            slot="icon"
          ></i>
          <span class="text">历 史</span>
        </div>
      </div>
      <div class="message-stu">
          <van-cell
            title="消息通知"
            is-link
          />
          <van-cell
            title="小智同学"
            is-link
          />
      </div>
    </div>
    <!-- 退出登录 -->
    <div class="exit-login" v-if="user" @click="logout">
      退出登录
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { userInfoAPI } from '@/api/user'
export default {
  name: 'MyMY',
  data () {
    return {
      // 获取用户个人信息
      userInfo: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 退出登录
    logout () {
      this.$dialog.confirm({
        title: '确认退出码'
      })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          this.$toast('取消执行')
        })
    },
    // 获取用户个人信息
    async getUserInfo () {
      try {
        const { data: res } = await userInfoAPI()
        this.userInfo = res.data
        // console.log(res)
      } catch (err) {
        this.$toast('获取失败')
      }
    }
  },
  created () {
    if (this.user) {
      this.getUserInfo()
    }
  }

}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url('@/assets/banner.png');
    background-size: cover;
  }

  // 未登录
  .no-login {
    display: flex;
    justify-content: center;
    align-items: center;

    .login-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .mobile-img {
        width: 134px;
        height: 134px;
        margin-bottom: 15px;
      }

      .text {
        font-size: 28px;
        color: #ffffff;
      }
    }
  }

  // 登录
  .user-info {
    .base-info {
      height: 231px;
      padding: 74px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .user-name {
          font-size: 30px;
          color: #ffffff;
          margin-left: 23px;
        }

        .avatar {
          width: 132px;
          height: 132px;
          border: 1px solid #ffffff;
        }
      }

      .right {
        .rg-btn {
          padding: 0 20px;
          font-size: 20px;
          color: #8c8c8c;
        }
      }
    }

    .data-stats {
      display: flex;
      justify-content: center;
      align-items: center;

      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #ffffff;

        .top {
          font-style: 36px;
        }

        .bottom {
          font-size: 23px;
        }
      }
    }
  }

  // 主要功能
  .main {
    background-color: #f5f7f9;

    .collect-history {
      display: flex;
      justify-content: space-around;
      height: 140px;
      background-color: #ffffff;
      padding: 28px 0 21px 0;

      .collect {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        i.iconfont {
          color: #ef7373;
        }
      }

      .history {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        i.iconfont {
          color: #ff9d1d;
        }
      }

      .collect .text,
      .history .text {
        font-size: 28px;
        margin-top: 16px;
      }

      .collect i.iconfont,
      .history i.iconfont {
        font-size: 45px;
      }
    }
    .message-stu{
      margin-top: 10px;
    }
  }
  .exit-login{
    height: 104px;
    text-align: center;
    line-height: 104px;
    background-color: #ffffff;
    font-size: 30px;
    color: #d86262;
    margin-top: 10px;
  }
}
</style>
