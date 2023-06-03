<template>
  <div class="home-container">
    <el-container>
      <!-- 头部 -->
      <el-header class="el-header">
        <div class="left">
          <img src="@/assets/heima.png" alt="">
          <h1>电商后台管理系统</h1>
        </div>
        <el-button type="info" @click="setOut" size="medium">退出</el-button>
      </el-header>
      <!-- 侧边和主体 -->
      <el-scroll style="height: 100%;">
      <el-container class="el-container">

        <el-aside :width="collapse ? '64px' : '250px'" class="el-aside">
          <div class="toggle-btn" @click="toggleBtn">| | |</div>
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" class="el-menu" unique-opened
            :collapse="collapse" :collapse-transition="false" router default-active="activePath">
            <!-- 一级菜单 -->
            <el-submenu :index="items.order + ''" v-for="items in menuList" :key="items.id">
              <template slot="title">
                <i :class="iconObj[items.id]" class="icon_one"></i>
                <span>{{ items.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/' + item.path" v-for="item in items.children" :key="item.id"
                @click="activePathBtn('/' + item.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ item.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main class="el-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-scroll>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'MyHome',
  data () {
    return {
      // 一级二级菜单
      menuList: [],
      // 一级菜单字体图标，但目前数字属性无法加引号
      iconObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // iconObjStr: {},
      // 收缩菜单
      collapse: false,
      // 一级菜单高亮
      activePath: ''
    }
  },
  created () {
    // 请求数据
    this.getMenu()
    // 一级菜单高亮
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击退出
    setOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenu () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },

    // 收缩菜单
    toggleBtn () {
      this.collapse = !this.collapse
    },
    // 一级菜单高亮
    activePathBtn (activePath) {
      sessionStorage.setItem('activePath', activePath)
    }

  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  overflow: hidden;

  .el-header {
    display: flex;
    padding-left: 0;
    justify-content: space-between;
    background-color: #373d41;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      width: 280px;

      h1 {
        color: #fff;
        margin-left: 10px;
      }
    }
  }

  .el-container {
    height: 100%;

    .el-aside {

      overflow: hidden;
      background-color: #333744;

      .el-menu {
        border-right: 0;
      }
    }

    .el-main {
      background-color: #eaedf1;
    }

    // .textColor{
    // color: #fff;
    // }
    .toggle-btn {
      background-color: #4A5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      cursor: pointer;
    }

    .icon_one {
      margin-right: 10px;
    }
  }
  // 隐藏elementui可视窗口出现滚动条
  //注意样式最好添加scoped，防止污染其他界面
::-webkit-scrollbar {
    //滚动条宽高，如果不需要显示滚动条可设置宽高为0
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
    //滚动条颜色和圆角
  background-color: #dbd9d9;
  border-radius: 3px;
}
}</style>
