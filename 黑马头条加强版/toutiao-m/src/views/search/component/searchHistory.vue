<template>
  <div class="searchHistory">
    <van-cell
      title="单元格"
      :border="false"
    >
      <span>全部删除</span>
      <span>完成</span>
      <van-icon name="delete-o" />
    </van-cell>
    <van-cell
      title="单元格"
      :border="false"
    >
      <van-icon name="close" />
    </van-cell>
    <van-cell
      title="单元格"
      :border="false"
    >
      <van-icon name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'searchHistory'
}
</script>

<style>
</style>
