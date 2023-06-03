<template>
  <div class="use-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="el-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 行长度用layout布局 -->
      <!-- 输入框和按钮 -->
      <el-row :gutter="20">
        <!-- 搜索 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="userListAPI.query" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加内容 -->
        <el-col :span="4"><el-button type="primary" @click="addlogVisible = true">添加用户</el-button></el-col>
      </el-row>
      <!-- tab表格 -->
      <!-- stripe隔行变色 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- scope.row当前userList数据 -->
          <template slot-scope="scope">
            <!-- 开关 -->
            <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <!-- slot-scope="scope" 可获得当前数据-->
          <template slot-scope="scope">
            <!-- 修改提示消息 -->
            <el-tooltip effect="dark" content="修改" placement="top" enterable :hide-after=1000>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogVisiblebtn(scope.row.id)">
              </el-button>
            </el-tooltip>
            <!-- 删除提示消息 -->
            <el-tooltip effect="dark" content="删除" placement="top" enterable :hide-after=1000>
              <el-button type="primary" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配角色提示消息 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" enterable :hide-after=1000>
              <el-button type="primary" icon="el-icon-setting" size="mini" @click="getAlloRoles(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="userListAPI.pagenum" :page-sizes="[1, 2, 3, 5]" :page-size="userListAPI.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加-对话框 -->
    <el-dialog title="添加内容" :visible.sync="addlogVisible" width="50%" @close="addDialogClose">
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
    </el-dialog>
    <!-- 修改提示框 -->
    <el-dialog title="修改" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editUser" :rules="editRules" label-width="70px" ref="editFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="alloRolesVisible" width="50%" >
      <p>当前用户 : {{ alloList.username }}</p>
      <p>当前角色 : {{ alloList.role_name }}</p>
      <div>
        分配新角色
        <el-select v-model="selectedRoles" placeholder="请选择"  clearable>
          <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alloRolesVisible = false">取
          消</el-button>
        <el-button type="primary" @click="changeRoles">确
          定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyUser',
  data () {
    // 自定义验证规则
    // 邮箱
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      userList: [],
      total: 0,
      userListAPI: {
        // 输入的内容
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页的数量
        pagesize: 5
      },
      // 添加-对话框的显示与隐藏
      addlogVisible: false,
      // 修改-对话框的显示与隐藏
      editDialogVisible: false,
      // 分配角色对话框显示与隐藏
      alloRolesVisible: false,
      // 添加用户内容
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''

      },
      // 编辑用户信息根据id获得数据
      editUser: {},
      // 被分配角色数据
      alloList: {},
      // 所有角色数据列表
      rolesList: [],
      // 绑定分配的角色
      selectedRoles: '',
      // 添加验证规则
      addRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }

        ]
      },
      // 编辑验证规则
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.userListAPI
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.userList = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听pagesize 页码改变
    handleSizeChange (val) {
      // console.log(val)
      this.userListAPI.pagesize = val
      this.getUserList()
    },
    // 监听当前页中页码值的改变
    handleCurrentChange (val) {
      // console.log(val)
      this.userListAPI.pagenum = val
      this.getUserList()
    },
    // 开关状态改变
    async userStatusChange (userinfo) {
      // console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        this.$message.error('更新状态失败')
      }
      this.$message.success('更新状态成功')
    },
    // 对话框表单重置
    // 使用ref引用 resetFields()重置方法
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加新用户
    addUser () {
      // console.log(this.$refs.addFormRef)
      // 发送之前进行表单预校验 validate
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // console.log(valid)
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.addlogVisible = false
      })
    },
    // 修改确定隐藏对话框
    editUsers () {
      // 表单预验证
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 发起修改请求
        const { data: res } = await this.$http.put('users/' + this.editUser.id, {
          email: this.editUser.email,
          mobile: this.editUser.mobile
        })
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        // this.addlogVisible = false
      })
      this.getUserList()
      this.editDialogVisible = false
    },
    // 点击编辑显示对话框
    async editDialogVisiblebtn (id) {
      // console.log(id)
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户失败')
      this.$message.success('获取用户成功')
      this.editUser = res.data
    },
    // 编辑表单重置
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 删除单个用户 弹框
    removeUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取分配数据
    async getAlloRoles (alloList) {
      this.alloList = alloList
      this.alloRolesVisible = true
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
    },
    // 改变（分配）角色
    async changeRoles () {
      if (!this.selectedRoles) {
        return this.$message.error('请分配角色')
      }
      const { data: res } = await this.$http.put(`users/${this.alloList.id}/role`, {
        rid: this.selectedRoles
      })
      // console.log(this.selectedRoles)
      if (res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.alloRolesVisible = false
      this.getUserList()
      // 清空选择的内容
      this.selectedRoles = ''
    }
    // 重置复选框

  }
}
</script>

<style></style>
