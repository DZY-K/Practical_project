<template>
  <van-cell
    title="单元格"
    value="内容"
    class="article-item"
    :to="`/article/${article.art_id}`"
  >
    <div
      class="title van-multi-ellipsis--l2"
      slot="title"
    >{{ article.title }}</div>
    <div
      class="label"
      slot="label"
    >
      <div
        class="cover"
        v-if="article.cover.type === 3"
      >
        <div class="cover-item" v-for="(img,index) in article.cover.images" :key="index">
          <van-image
            width="100"
            height="100"
            :src="img"
            fit="cover"
            class="cover-img"
          />
        </div>
      </div>
      <div class="art-main">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime}}</span>
      </div>
    </div>

    <van-image
      slot="default"
      v-if="article.cover.type === 1"
      class="cover-right"
      fit="cover"
      :src="article.cover.images[0]"
    />

  </van-cell>
</template>

<script>
export default {
  name: 'MyArticle',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.article-item{
  .title{
font-size: 32px;
color: #3a3a3a;
  }
  .van-cell__value{
    flex: unset;
    width: 232px;
    height: 146px;
    padding-right: 25px;
  }
  .cover-right{
    width: 232px;
height: 146px;
  }
  .art-main{
    font-size: 22px;
    color: #4b4b4b;
    margin-right: 25px;
    span{
      margin: 0 10px;
    }
  }
  .cover{
    display: flex;
    .cover-item{
      flex: 1;
      height: 146px;
      &:not(:last-child){
        padding-right: 4px;
      }
      .cover-img{
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
