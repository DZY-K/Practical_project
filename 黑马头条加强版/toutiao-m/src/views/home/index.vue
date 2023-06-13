<template>
  <div class="home-container">
    <!-- 搜索框 -->
    <van-nav-bar
      class="sea-nav"
      fixed
    >
      <van-button
        slot="title"
        type="info"
        round
        size="small"
        class="search"
        icon="search"
        to="/search"
      >
        搜索</van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs
      v-model="active"
      animated
      swipeable
      class="tabs"
    >
      <van-tab
        :title="item.name"
        v-for="item in channelList"
        :key="item.id"
      >
        <!-- 子组件文章列表 -->
        <articleList :channel="item"></articleList>
      </van-tab>

      <!-- 占位 -->
      <div
        slot="nav-right"
        class="placehoder"
      ></div>
      <!-- 面包导航 -->
      <div
        class="hambur"
        slot="nav-right"
        @click="editShow=true"
      >
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 编辑弹出层 -->
    <van-popup
      v-model="editShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >

      <editChannel
        :channelList="channelList"
        :active="active"
        @active_id="onActiveId"
      />
    </van-popup>
  </div>
</template>

<script>
import editChannel from './component/editChannel.vue'
import articleList from './component/article_list.vue'
import { channelAPI } from '@/api/user'
import { mapState } from 'vuex'
import { getItem } from '@/units/storage'
export default {
  name: 'MyHome',

  components: {
    articleList,
    editChannel
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      active: 0,
      // 频道列表
      channelList: [],
      editShow: false
    }
  },
  created () {
    this.getChannelList()
  },
  methods: {
    async getChannelList () {
      // console.log(res)
      try {
        let channels = []
        if (this.user) {
          const { data: res } = await channelAPI()
          channels = res.data.channels
        } else {
          const localChannels = getItem('TOUTIAO_CHANNEL')
          if (localChannels) {
            channels = localChannels
          } else {
            const { data: res } = await channelAPI()
            channels = res.data.channels
          }
        }
        this.channelList = channels
      } catch (err) {
        this.$toast('获取失败')
      }
    },
    onActiveId (index, editShow = true) {
      // console.log(index)
      this.active = index
      this.editShow = editShow
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-bottom: 100px;
  padding-top: 160px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
      color: #fff;
    }
  }
  /deep/ .tabs {
    position: relative;
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      height: 83px;
      border-bottom: 1px solid #edeff3;
    }
    .placehoder {
      width: 66px;
      height: 82px;
      flex-shrink: 0;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 28px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__line {
      bottom: 0.1rem;
      width: 31px;
      height: 6px;
    }
    .van-tabs__nav--line {
      padding: 0;
    }
    .hambur {
      position: fixed;
      top: 93px;
      right: 0;
      width: 68px;
      height: 82px;
      text-align: center;
      line-height: 82px;
      // border-left: 1px solid #edeff3;
      background: #fff;
      opacity: 0.8;
      i.iconfont {
        font-size: 40px;
      }
      &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 2px;
        height: 80px;
        background-image: url('~@/assets/gradient-gray-line.png');
        background-size: contain;
      }
    }
  }
}
</style>
