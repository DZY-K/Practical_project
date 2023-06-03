<template>
  <div class="addGood-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 消息 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm"
        label-position="top">
        <el-tabs tab-position="left" style="height: 100%;" v-model="activeIndex" :before-leave="beforeTabLeave"
          @tab-click="tabClicked">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <div class="block">
                <el-cascader v-model="addForm.goods_cat" :options="goodCateList" :props="cateProps"
                  @change="handleChange"></el-cascader>
              </div>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyParamsList" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="items" v-for="(items, i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name + '  :'" v-for="(item, i) in onlyParamsList" :key="i">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action 上传文件的url地址 上传到后台数据库 -->
            <!-- :file-list="fileList" 文件列表 -->
            <el-upload :action="upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture"
              :headers="headers" :on-success="uploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- 文本 -->
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <!-- 提交按钮 -->
            <el-button type="primary" class="subBtn" @click="submitContent">提交</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="picDialogVisible" width="80%">
      <img :src="picPreview" alt="" class="picImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'MyAddGood',
  data () {
    return {
      // 步骤条与tab栏 同步激活的索引
      activeIndex: '0',
      // 添加表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 上传图片
        pics: [],
        // 商品介绍
        goods_introduce: '',
        // 商品参数
        attrs: []
      },
      // 验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品分类', trigger: 'blur' }]
      },
      // 分类的数据
      goodCateList: [],
      // 配置
      cateProps: {
        expandTrigger: 'hover',
        //  看到的分类名称
        label: 'cat_name',
        // 选中的 id
        value: 'cat_id',
        // 子级
        children: 'children'
      },
      // 分类参数列表
      // many
      manyParamsList: [],
      // only
      onlyParamsList: [],
      // 文件上传路径
      upload: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 给上传图片设置请求头
      headers: {
        Authorization:
          // 添加token
          window.sessionStorage.getItem('token')
      },
      // 图片预览
      picPreview: '',
      // 图片预览显示与隐藏
      picDialogVisible: false
    }
  },
  created () {
    this.getGoodCateList()
  },
  methods: {
    async getGoodCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      // console.log(res)
      this.goodCateList = res.data
    },
    // 级联选择器选中项变化，触发该函数
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 只有满足条件tab栏才能切换
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // tab栏选中时触发
    async tabClicked () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取参数失败')
        // console.log(res.data)
        res.data.forEach(item => {
          // console.log(item)
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyParamsList = res.data
        console.log(res.data)
      }
      if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取参数失败')
        // console.log(res.data)
        this.onlyParamsList = res.data
      }
    },
    // 上传图片预览
    handlePreview (file) {
      console.log(file)
      this.picPreview = file.response.data.url
      this.picDialogVisible = true
    },
    // 上传成功后的事件
    uploadSuccess (response) {
      // console.log(response)
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 移除上传的图片
    handleRemove (file) {
      console.log(file)
      const filePath = file.response.tmp_path
      const i = this.addForm.pics.findIndex(x => {
        return x.pic === filePath
      })
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 提交商品内容
    submitContent () {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        // 让goods_cat 转成字符串
        const addFormCopy = _.cloneDeep(this.addForm)
        addFormCopy.goods_cat = addFormCopy.goods_cat.join(',')
        // 动态参数
        this.manyParamsList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs = newInfo
        })
        // 静态属性
        this.onlyParamsList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs = newInfo
        })
        addFormCopy.attrs = this.addForm.attrs
        // console.log(addFormCopy)
        // 添加商品-最后一步
        const { data: res } = await this.$http.post('goods', addFormCopy)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        console.log(res)
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-form-item {
  margin: 10px;
}

.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.picImg {
  width: 100%;
}

.subBtn {
  margin-top: 10px;
}
</style>
