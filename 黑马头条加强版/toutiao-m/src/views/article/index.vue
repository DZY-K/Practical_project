<template>
  <div >
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ articlesDetails.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="articlesDetails.aut_name" :label="articlesDetails.pubdate">
        <template #icon>
          <img :src="articlesDetails.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <van-button type="info" size="mini" v-if="articlesDetails.is_followed" @click="onCare">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else @click="onCare">关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="articlesDetails.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" plain size="small">点赞</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
import { articlesDetails } from '@/api/article'
export default {
  name: 'MyArticle',
  data () {
    return {
      articlesDetails: {}
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      require: true
    }
  },
  created () {
    this.getArticlesDetails()
  },
  methods: {
    async getArticlesDetails () {
      try {
        const { data: res } = await articlesDetails(this.articleId)
        console.log(res)
        this.articlesDetails = res.data
      } catch (err) {
      }
    },
    // 关注或未关注
    async onCare () {
      try {
        if (this.articlesDetails.is_followed) {
          // 取消关注
          await deleteFollow(this.articlesDetails.aut_id)
        } else {
          // 添加关注
          await addFollow(this.articlesDetails.aut_id)
        }
        this.articlesDetails.is_followed = !this.articlesDetails.is_followed
      } catch (err) {
        if (err.response && err.response.status === 400) {
          return this.$toast('你不能关注你自己')
        }
        this.$toast('操作失败，请重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/.van-nav-bar__arrow{
  color: #fff;
}
.article-container {
  padding: 10px;
  margin-top: 90px;
}

.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;

  /deep/ img {
    width: 100%;
  }

  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;

  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}</style>
