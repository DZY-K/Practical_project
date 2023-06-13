<template>
  <div class="editChannel">
    <!-- 我的编辑 -->
    <van-cell :border="false">
      <div
        slot="title"
        class="editTitle"
      > 我的编辑</div>
      <van-button
        round
        type="danger"
        plain
        size="mini"
        @click="isEdit=!isEdit"
      >{{ !isEdit ? '编辑' : '完成'}}</van-button>
    </van-cell>
    <van-grid
      :column-num="4"
      :border="false"
      direction="horizontal"
      gutter="20px"
    >
      <van-grid-item
        v-for="(value,index) in channelList"
        :key="index"
        class="gridStyle grid-style"
        @click="toggtoChannel(index,value.id)"
      >
      <van-icon slot="icon" name="close" v-show="isEdit && !reChannel.includes(value.id)"></van-icon>
        <span
          slot="text"
          class="text"
          :class="{active : active === index}"
        >{{ value.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div
        slot="title"
        class="editTitle"
      > 频道推荐</div>
    </van-cell>
    <van-grid
      :column-num="4"
      :border="false"
      direction="horizontal"
      gutter="20px"
    >
      <van-grid-item
        v-for="(value,index) in recommendChannel"
        :key="index"
        :text="value.name"
        icon="plus"
        class="gridStyle grid_style"
        @click="addChannel(value)"
      />
    </van-grid>
  </div>
</template>

<script>
import { channelAPI, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/units/storage'

export default {
  name: 'MyEditChannel',
  props: {
    channelList: {
      type: Array,
      require: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  data () {
    return {
      // 全部频道
      channelLists: [],
      // 使用props 数据
      channel_List: this.channelList,
      // 编辑显示与隐藏
      isEdit: false,
      // 推荐频道隐藏
      reChannel: [0]
    }
  },
  computed: {
    // 总频道筛选
    recommendChannel () {
      const channels = []
      this.channelLists.forEach(item => {
        const ret = this.channelList.find(i => {
          return i.id === item.id
        })
        if (!ret) {
          channels.push(item)
        }
      })
      return channels
    },
    // 获取token
    ...mapState(['user'])
  },
  created () {
    this.getChannelAPI()
  },
  methods: {
    // 获取所有频道
    async getChannelAPI () {
      try {
        const { data: res } = await channelAPI()
        // console.log(res)
        this.channelLists = res.data.channels
      } catch (err) {
        this.$toast('获取失败')
      }
    },
    // 添加频道
    async addChannel (val) {
      this.channel_List.push(val)
      // 数据持久化处理
      if (this.user) {
        // 已登陆，并把数据接口放在线上
        try {
          await addUserChannel({
            id: val.id,
            seq: this.channel_List.length
          })
        } catch (err) {
          this.$toast('获取失败')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNEL', this.channel_List)
      }
    },
    // 切换频道
    toggtoChannel (index, id) {
      // 编辑下架我的频道
      if (this.isEdit) {
        // 点击推荐则不删除
        if (this.reChannel.includes(index)) {
          return
        }
        // console.log(value, index)
        // 删除频道项
        this.channel_List.splice(index, 1)
        if (index <= this.active) {
          this.$emit('active_id', this.active - 1, true)
        }
        // 处理持久化
        this.deleteChannel(id)
      } else {
        // 没有编辑跳转频道
        this.$emit('active_id', index, false)
      }
    },
    // 删除频道持久化
    async deleteChannel (id) {
      try {
        if (this.user) {
        // 已登陆
          await deleteUserChannel(id)
        } else {
        // 未登录
          setItem('TOUTIAO_CHANNEL', this.channel_List)
        }
      } catch (err) {
        this.$toast('删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.editChannel {
  padding: 90px 0;
  .van-button {
    width: 103px;
    height: 48px;
    font-size: 30px;
    border: 1px #f97878 solid;
  }
  .editTitle {
    font-size: 32px;
  }
  .van-grid {
    margin-bottom: 74px;
    /deep/ .grid-style {
      position: relative;
      .van-grid-item__icon {
        font-size: 15px;
        position: absolute;
        top: -10px;
        right: 30px;
        z-index: 3;
        color: #cacaca;
      }
      .van-grid-item__text,
      text {
        margin-left: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper{
        position: unset;
      }
      .van-icon{
        position: unset;
      }
      .van-icon-close{
        position: absolute;
         top: -10px;
         right: 30px;
      }
    }
    /deep/ .gridStyle {
      width: 160px;
      height: 86px;
      font-size: 28px;
      color: #222222;
      margin-top: 48px;
      font-weight: bold;
      .van-grid-item__content {
        background: #f4f5f6;
        white-space: nowrap;
      }
    }
    /deep/ .grid_style {
      .van-grid-item__icon {
        font-size: 28px;
      }
      .van-grid-item__text {
        margin-left: 0;
      }
    }
  }
}
</style>
