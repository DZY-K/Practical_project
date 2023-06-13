<template>
  <div class="search">
    <!-- 搜索框 -->
    <form action="/" class="searchForm">
  <van-search
    v-model="value"
    show-action
    placeholder="请输入搜索关键词"
    background="#3395FC"
    @search="onSearch"
    @cancel="onCancel"
    shape="round"
    @focus="isResultShow=false"
  />
</form>
  <searchResult v-if="isResultShow" :value="value"></searchResult>
  <searchSuggest v-else-if="value" :value="value" @search="onSearch"></searchSuggest>
  <searchHistory v-else></searchHistory>
  </div>
</template>

<script>
import searchHistory from '@/views/search/component/searchHistory.vue'
import searchSuggest from '@/views/search/component/searchSuggest.vue'
import searchResult from '@/views/search/component/searchResult.vue'
export default {
  name: 'MySearch',
  components: {
    searchHistory,
    searchSuggest,
    searchResult
  },
  data () {
    return {
      value: '',
      isResultShow: false
    }
  },
  methods: {
    onSearch (val) {
      // this.$toast(val)
      this.isResultShow = true
      this.value = val
    },
    // 点击取消事件
    onCancel () {
      this.$toast('取消')
    }
  }
}
</script>

<style lang="less" scoped>
.search{
  padding-top: 108px;
  .van-search__action{
    color: #fff;
  }
  .searchForm{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }
}
</style>
