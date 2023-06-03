<template>
  <div class="order-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" clearable v-model="orderParams.query" @clear="getOrdersList">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="ordersList" style="width: 100%" border stripe fit>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="97px">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="97px">
          <!-- tab标签 -->
          <template slot-scope="scope">
            <el-tag type='danger' effect="plain" color="#FEF0F0" v-if="scope.row.order_pay === '0'">
              未付款
            </el-tag>
            <el-tag type='info' effect="plain" color="#F0F9EB" v-else>
              已付款
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="97px">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <!-- slot-scope="scope" 可获得当前数据-->
          <template>
            <!-- 修改提示消息 -->
            <el-tooltip effect="dark" content="修改" placement="top" enterable :hide-after=1000>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox">
              </el-button>
            </el-tooltip>
            <!-- 物流进度提示消息 -->
            <el-tooltip effect="dark" content="物流进度" placement="top" enterable :hide-after=1000 >
              <el-button type="success" icon="el-icon-location" size="mini" @click="showLogistics"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="orderParams.pagenum" :page-sizes="[1, 5, 8, 10]" :page-size="orderParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="30%" @close="editClose">
      <el-form :model="addAddressForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addAddressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="logDialogVisible" width="30%">
      <span>{{ logContext }}</span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '@/components/order/citydata'
export default {
  name: 'MyOrder',
  data () {
    return {
      // 订单列表数据
      ordersList: [],
      // 请求参数
      orderParams: {
        // 输入的内容
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页的数量
        pagesize: 8
      },
      // 表单数据
      addAddressForm: {
        address1: [],
        address2: ''
      },
      // 总数
      total: 0,
      // 编辑对话框 显示与隐藏
      editDialogVisible: false,
      // 表单验证
      editRules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      // 物流进度显示与隐藏
      logDialogVisible: false,
      // 物流信息
      logContext: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.orderParams
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      // console.log(res)
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 绑定每页的数量
    handleSizeChange (val) {
      this.pagesize = val
    },
    // 绑定当前页码
    handleCurrentChange (val) {
      this.pagenum = val
    },
    // 展示对话框
    showBox () {
      this.editDialogVisible = true
    },
    // 关闭表单重置
    editClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击物流进度
    async showLogistics () {
      // 供测试的物流单号 1106975712662
      // const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // console.log(res)
      // if (res.meta.status !== 200) return this.$message.error('查看失败')
      this.logDialogVisible = true
      // this.logContext = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
