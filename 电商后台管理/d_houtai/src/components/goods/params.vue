<template>
  <div class="params-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="警告提示的文案" type="warning" show-icon :closable="false">
      </el-alert>
      <el-form class="cartForm">
        <el-form-item label="选择商品分类">
          <!-- options 指定数据源 级联选择器 -->
          <el-cascader v-model="paramsValue" :options="paramsList" :props="cascaderProps" @change="paramsChange"
            clearable></el-cascader>
        </el-form-item>
      </el-form>
      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true">添加动态参数</el-button>
          <!-- 表格数据 -->
          <el-table :data="manyDataList" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tab 标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable :disable-transitions="false"
                  @close="handleClose(i, scope.row)">
                  {{ item }}
                </el-tag>
                <!-- 文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <!-- slot-scope="scope" 可获得当前数据 -->
              <template slot-scope="scope">
                <!-- 修改提示消息 -->
                <el-tooltip effect="dark" content="修改" placement="top" enterable :hide-after=1000>
                  <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">
                    编辑
                  </el-button>
                </el-tooltip>
                <!-- 删除提示消息 -->
                <el-tooltip effect="dark" content="删除" placement="top" enterable :hide-after=1000>
                  <el-button type="danger" icon="el-icon-delete" size="small" @click="remmoveParam(scope.row.attr_id)">
                    删除</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true">添加静态参数</el-button>
          <!-- 表格数据 -->
          <el-table :data="onlyDataList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tab 标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable :disable-transitions="false"
                  @close="handleClose(i, scope.row)">
                  {{ item }}
                </el-tag>
                <!-- 文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tab 标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable :disable-transitions="false"
                  @close="handleClose(i, scope.row)">
                  {{ item }}
                </el-tag>
                <!-- 文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <!-- slot-scope="scope" 可获得当前数据 -->
              <template slot-scope="scope">
                <!-- 修改提示消息 -->
                <el-tooltip effect="dark" content="修改" placement="top" enterable :hide-after=1000>
                  <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">
                    编辑
                  </el-button>
                </el-tooltip>
                <!-- 删除提示消息 -->
                <el-tooltip effect="dark" content="删除" placement="top" enterable :hide-after=1000>
                  <el-button type="danger" icon="el-icon-delete" size="small" @click="remmoveParam(scope.row.attr_id)">
                    删除</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addParamsDialogVisible" width="30%" @close="addResetClose">
      <!-- 表单验证 -->
      <el-form :model="addParams" :rules="addParamsRules" ref="addParamsRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsVisible">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog :title="'编辑' + titleText" :visible.sync="editParamsDialogVisible" width="30%" @close="editResetClose">
      <!-- 表单验证 -->
      <el-form :model="editParams" :rules="editParamsRules" ref="editParamsRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsVisible">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyParams',
  data () {
    return {
      // 获取分类列表
      paramsList: [],
      // 双向绑定选定的数据
      paramsValue: [],
      // 配置级联选择器
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // tab标签配置
      activeName: 'many',
      // 参数数据
      manyDataList: [],
      onlyDataList: [],
      // 添加参数对话框显示与隐藏
      addParamsDialogVisible: false,
      // 添加参数表单绑定数据
      addParams: {
        attr_name: ''
      },
      // 表单校验规则
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 编辑对话框的显示与隐藏
      editParamsDialogVisible: false,
      // 修改参数表单绑定数据
      editParams: {},
      // 修改参数表单校验规则
      editParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getParamsList()
  },
  computed: {
    // 按钮禁用
    isBtnDisabled () {
      if (this.paramsValue.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中三级分类的id
    cateId () {
      if (this.paramsValue.length === 3) {
        return this.paramsValue[2]
      }
      return null
    },
    // 共用添加对话框
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态参数'
    }
  },
  methods: {
    // 获取分类数据
    async getParamsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      // console.log(res)
      this.paramsList = res.data
    },
    // 监听级联选择器选中项变化
    paramsChange () {
      this.getParamsData()
    },
    // 点击tab标签
    handleClick () {
      // console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData () {
      // 不是三级分类 清空渲染数据
      if (this.paramsValue.length !== 3) {
        this.paramsValue = []
        this.manyDataList = []
        this.onlyDataList = []
      }
      // 选定分类后发起请求，
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      // 遍历配置
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // tab 文本框 显示与隐藏
        item.inputVisible = false
        // tab文本框 绑定数据
        item.inputValue = ''
      })
      // console.log(res.data)
      if (this.activeName === 'many') {
        this.manyDataList = res.data
      } else {
        this.onlyDataList = res.data
      }
    },
    // 添加参数表单重置
    addResetClose () {
      this.$refs.addParamsRef.resetFields()
    },
    // 添加参数
    addParamsVisible () {
      // 表单预验证
      this.$refs.addParamsRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addParams.attr_name,
          attr_sel: this.activeName
        })
        // console.log(this.paramsValue)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.addParamsDialogVisible = false
        this.getParamsData()
      })
    },
    // 打开对话框
    async showEditDialog (id) {
      this.editParamsDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) this.$message.error('获取失败')
      // console.log(res)
      this.editParams = res.data
    },
    // 修改参数表单重置
    editResetClose () {
      this.$refs.editParamsRef.resetFields()
    },
    // 编辑对话框
    editParamsVisible () {
      // 表单预验证
      this.$refs.editParamsRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParams.attr_id}`, {
          attr_name: this.editParams.attr_name,
          attr_sel: this.activeName
        })
        // console.log(this.paramsValue)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        // console.log(res)
        this.$message.success('修改成功')
        this.editParamsDialogVisible = false
        this.getParamsData()
      })
    },
    // 删除参数
    async remmoveParam (id) {
      const removeConfirm = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (removeConfirm !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('删除失败') }
      this.$message.success('删除成功')
      this.getParamsData()
    },
    // 文本框失去焦点或按下enter触发
    handleInputConfirm (val) {
      // 没输入内容
      if (val.inputValue.trim().length === 0) {
        val.inputValue = ''
        val.inputVisible = false
        return
      }
      // 输入了内容
      val.attr_vals.push(val.inputValue.trim())
      val.inputValue = ''
      val.inputVisible = false
      // 发起请求，保存数据
      this.saveAttrVals(val)
    },
    // 发起请求，保存数据 - 封装
    async saveAttrVals (val) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${val.attr_id}`, {
        attr_name: val.attr_name,
        attr_sel: val.attr_sel,
        attr_vals: val.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('添加失败')
      val.inputVisible = false
    },
    // 删除tab标签
    handleClose (i, val) {
      val.attr_vals.splice(i, 1)
      this.saveAttrVals(val)
    },
    // 展示文本框
    showInput (val) {
      val.inputVisible = true
      // 文本框自动获得焦点
      // $nextTick 作用：当页面元素渲染完成之后，才会指定回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cartForm {
  margin-top: 15px;
}

.el-tag {
  margin: 15px;
}

.input-new-tag {
  width: 120px;
}</style>
