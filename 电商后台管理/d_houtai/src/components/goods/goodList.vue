<template>
  <div class="goodsList-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="goodsListAPI.query" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加内容 -->
        <el-col :span="4"><el-button type="primary" @click="addGoods">添加商品</el-button></el-col>
      </el-row>
      <!-- tab表格 -->
      <!-- stripe隔行变色 -->
      <el-table :data="goodsList" style="width: 100%" border stripe fit>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="97px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="97px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <!-- slot-scope="scope" 可获得当前数据-->
          <template slot-scope="scope">
            <!-- 修改提示消息 -->
            <el-tooltip effect="dark" content="修改" placement="top" enterable :hide-after=1000>
              <el-button type="primary" icon="el-icon-edit" size="mini">
              </el-button>
            </el-tooltip>
            <!-- 删除提示消息 -->
            <el-tooltip effect="dark" content="删除" placement="top" enterable :hide-after=1000>
              <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="removeGoods(scope.row.goods_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="goodsListAPI.pagenum" :page-sizes="[1, 2, 3, 5]" :page-size="goodsListAPI.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加商品对话框 -->
    <!-- <el-dialog title="添加内容" :visible.sync="addlogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addRules" label-width="70px" ref="addFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addlogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  name: 'goodList',
  data () {
    return {
      // 参数
      goodsListAPI: {
        // 输入商品数据
        query: '',
        // 当前页码
        pagenum: 1,
        // 页码显示的条数
        pagesize: 5
      },
      // 商品数据
      goodsList: [],
      // 商品条数
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品数据
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.goodsListAPI
      })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 页码改变
    handleSizeChange (val) {
      this.goodsListAPI.pagesize = val
      this.getGoodsList()
    },
    // 页码值-一页商品的数量
    handleCurrentChange (val) {
      this.goodsListAPI.pagenum = val
      this.getGoodsList()
    },
    // 删除商品
    async removeGoods (id) {
      const goodsConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (goodsConfirm !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete('goods/' + id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除商品失败')
      this.getGoodsList()
    },
    addGoods () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style></style>
