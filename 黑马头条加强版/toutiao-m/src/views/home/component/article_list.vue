<template>
  <div class="article_list">
    <!-- 列表 -->
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :success-text="finishedText" success-duration="1500">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
    >
    <articleItem v-for="(item,index) in list" :key="index" :title="item.aut_name" :article="item"/>
      <!-- <van-cell -->
        <!-- v-for="(item,index) in list" -->
        <!-- :key="index" -->
        <!-- :title="item.aut_name" -->
      <!-- /> -->
    </van-list>
  </van-pull-refresh>
  </div>
</template>

<script>
import articleItem from '@/components/articleItem'
import { articlesAPI } from '@/api/article'
export default {
  name: 'MyArticle_list',
  props: {
    channel: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      error: false,
      refreshing: false,
      finishedText: ''
    }
  },
  methods: {
    // 上拉加载
    async onLoad () {
      try {
        const { data: res } = await articlesAPI({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now()
        })
        // console.log(res)
        this.list.push(...res.data.results)
        this.loading = false
        if (res.data.results.length) {
          this.timestamp = res.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
    // 下拉刷新
    async onRefresh () {
      try {
        const { data: res } = await articlesAPI({
          channel_id: this.channel.id,
          timestamp: Date.now()
        })
        // console.log(res)
        this.list.unshift(...res.data.results)
        this.finishedText = `刷新了${res.data.results.length}数据`
        this.refreshing = false
      } catch (err) {
        this.finishedText = '刷新失败'
        this.refreshing = false
      }
    }
  },
  components: {
    articleItem
  }
}
</script>

<style lang="less" scoped>
.article_list{
  height: 79vh;
  overflow-y: auto;
}
</style>
