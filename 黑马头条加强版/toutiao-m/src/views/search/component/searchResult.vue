<template>
  <div class="searchResult">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error="error"
      error-text="加载失败"
    >
      <van-cell
        v-for="(item,index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { searchResult } from '@/api/search'
export default {
  name: 'searchResult',
  props: {
    value: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      // 页码
      page: 1,
      // 每页的数量
      per_page: 20,
      // 加载失败提示
      error: false
    }
  },
  methods: {
    async onLoad () {
      // 请求获取数据
      try {
        const { data: res } = await searchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.value
        })
        // console.log(res)
        // 将数据添加到数组列表中
        const { results } = res.data
        this.list.push(...results)
        // 将本次加载中的loading关闭
        this.loading = false
        // 判断是否还有数据
        if (res.data.results.length) {
          // 如果有更新下一页数据页码
          this.page++
        } else {
          // 如果没有，加载状态finished设置为结束
          this.finished = true
        }
      } catch (err) {
        // 加载失败提示
        this.error = false
        this.loading = false
      }
    }
  }
}
</script>

<style>
</style>
