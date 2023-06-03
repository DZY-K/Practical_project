<template>
  <div class="categories-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addCateShow">添加分类</el-button>
      <!-- 用tree-table插件渲染表格 -->
      <tree-table :data="cateList" class="tree-table" :columns="columns" :selection-type="false" :expand-type="false"
        border show-index index-text="#" :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope
            .row.cat_deleted === false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:lightcoral"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <!-- 修改提示消息 -->
          <el-tooltip effect="dark" content="修改" placement="top" enterable :hide-after=1000>
            <el-button type="primary" icon="el-icon-edit" size="small">
              编辑
            </el-button>
          </el-tooltip>
          <!-- 删除提示消息 -->
          <el-tooltip effect="dark" content="删除" placement="top" enterable :hide-after=1000>
            <el-button type="danger" icon="el-icon-delete" size="small">
              删除</el-button>
          </el-tooltip>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum" :page-sizes="[1, 2, 3, 5]" :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCatelogVisible" width="50%" @close="addCateDialogClose">
      <el-form :model="addCateList" label-width="100px" ref="addCateRef" :rules="addCateRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateList.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 指定数据源 级联选择器 -->
          <el-cascader v-model="addCateValue" :options="parentsCateList" :props="cascaderProps"
            @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatelogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyCategories',
  data () {
    return {
      // 分类列表
      cateList: [],
      // 查询条件
      querInfo: {
        type: 3,
        // 当前页码
        pagenum: 1,
        // 每页的数量
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          // 列名称
          label: '分类名称',
          // 这一列数据
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 定义模板列
          type: 'template',
          // 定义模板列名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类对话框显示与隐藏
      addCatelogVisible: false,
      // 添加分类表单数据对象
      addCateList: {
        cat_name: '',
        // 分类的等级 默认添加一级分类
        cat_level: 0,
        // 父级分类的id
        cat_pid: 0
      },
      // 添加表单验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级的分类列表
      parentsCateList: [],
      // 级联选择器配置选项
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 选中的父级分类的id数组
      addCateValue: []

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) return this.$message.error('分类数据获取成功')
      this.cateList = res.data.result
      this.total = res.data.total
      // console.log(res)
    },
    // 监听pagesize 的改变
    handleSizeChange (newsize) {
      this.querInfo.pagesize = newsize
      this.getCateList()
    },
    // 监听pagenum 的改变
    handleCurrentChange (newnum) {
      this.querInfo.pagenum = newnum
      this.getCateList()
    },
    // 重置添加表单
    addCateDialogClose () {
      this.$refs.addCateRef.resetFields()
      this.addCateList.cat_level = 0
      this.addCateList.cat_pid = 0
      this.addCateValue = []
    },
    // 展示添加对话框并发请求
    async addCateShow () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.parentsCateList = res.data
      this.addCatelogVisible = true
      // console.log(res)
    },
    // 选择项发生变化
    handleChange () {
      // console.log(this.addCateValue)
      // 如果addCateValue的length>0（有选项）  证明选中父级分类
      if (this.addCateValue.length > 0) {
        // 父级分类的id
        this.addCateList.cat_pid = this.addCateValue[this.addCateValue.length - 1]
        this.addCateList.cat_level = this.addCateValue.length
      } else {
        this.addCateList.cat_pid = 0
        this.addCateList.cat_level = 0
      }
    },
    addCate () {
      // console.log(this.addCateList)
      this.$refs.addCateRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateList)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getCateList()
        this.addCatelogVisible = false
      })
    }

  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
