<template>
  <div class="searchSuggest">
    <van-cell
      icon="search"
      v-for="(item,index) in suggestList"
      :key="index"
      @click="$emit('search',item)"
    >
      <div
        slot="title"
        v-html="highLight(item)"
      ></div>
    </van-cell>
  </div>
</template>

<script>
import { searchSuggest } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'searchSuggest',
  props: {
    // 父组件文本框的值
    value: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      // 搜索建议列表
      suggestList: []
    }
  },
  watch: {
    // 侦听父传子的value的数据变化
    value: {
      // handler (value) {
      // console.log(value)
      // this.getSuggestList(value)
      // },
      // 文本框优化--防抖--lodash
      handler: debounce(function (value) {
        this.getSuggestList(value)
        // console.log(value)
      }, 500),
      immediate: true
    }
  },
  created () {},
  methods: {
    // 获取搜索建议
    async getSuggestList (q) {
      try {
        const { data: res } = await searchSuggest(q)
        // console.log(res)
        this.suggestList = res.data.options
      } catch (err) {
        this.$toast('获取失败')
      }
    },
    // 搜索关键字高亮
    highLight (item) {
      // console.log(item)
      const highLightStr = `<span class="active">${this.value}</span>`
      // console.log(highLightStr)
      // 正则表达式
      // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动new RegExp
      // RegExp正则表达式构造函数
      // 参数1:匹配模式字符串,它会根据这个字符串创建正则对象
      // 参数2:匹配模式，要写到字符串中
      const reg = new RegExp(this.value, 'gi')
      // console.log(reg)
      if (item == null) {
        return
      }
      const i = item.replace(reg, highLightStr)
      return i
    }
  }
}
</script>

<style lang="less" scoped>
.searchSuggest {
  /deep/span.active {
    color: #349cfe;
  }
}
</style>
