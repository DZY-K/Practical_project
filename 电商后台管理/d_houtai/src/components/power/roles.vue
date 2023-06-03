<template>
  <div class="roles-continer">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addRightVisible = true">添加角色</el-button>
      <!-- 表格 -->
      <el-table :data="rolesList" stripe border>
        <!-- 扩展表单  expand-->
        <el-table-column type="expand">
          <!-- layout 布局 -->
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children"
              :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)"> {{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                      {{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <!-- closable删除按钮  -->
                    <el-tag closable @close="removeRightById(scope.row, item3.id)" type="warning"
                      v-for="item3 in item2.children" :key="item3.id">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
              <!-- <el-col :span="19"></el-col> -->
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <!-- slot-scope="scope" 可获得当前数据-->
          <template slot-scope="scope">
            <!-- 修改提示消息 -->
            <el-tooltip effect="dark" content="修改" placement="top" enterable :hide-after=1000>
              <el-button type="primary" icon="el-icon-edit" size="small" @click="getEditRoles(scope.row.id)">
                编辑
              </el-button>
            </el-tooltip>
            <!-- 删除提示消息 -->
            <el-tooltip effect="dark" content="删除" placement="top" enterable :hide-after=1000>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="reomveRoles(scope.row.id)">
                删除</el-button>
            </el-tooltip>
            <!-- 分配角色提示消息 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" enterable :hide-after=1000>
              <el-button type="warning" icon="el-icon-setting" size="small"
                @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="30%" @close="removeRightDialogVisible">
      <el-tree :data="rightList" :props="treeProps" node-key="id" default-expand-all show-checkbox
        :default-checked-keys="defKey" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRightVisible" width="50" @close="addRightDialog">
      <el-form :model="addRolesList" label-width="80px" ref="addRightRef" :rules="addRightRules">
        <el-form-item label="角色名称" prop="roleName" >
          <el-input v-model="addRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" >
          <el-input v-model="addRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="修改" :visible.sync="editRightVisible" width="50%" @close="editRightDialog">
      <el-form :model="editRoles" label-width="70px" ref="editRolesRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightVisible = false">取
          消</el-button>
        <el-button type="primary" @click="setsEditRoles">确
          定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'MyRoles',
  data () {
    return {
      // 角色权限数据
      rolesList: [],
      // 分配权限数据
      rightList: [],
      // 分配权限对话框显示与隐藏
      setRightDialogVisible: false,
      // 树形空件的属性绑定控件
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的id值的数组
      defKey: [],
      // 即将分配权限的id
      roleId: '',
      // 添加角色对话框显示与隐藏
      addRightVisible: false,
      // 编辑角色对话框显示与隐藏
      editRightVisible: false,
      addRolesList: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色信息根据id获得数据
      editRoles: {},
      // 添加表单验证
      addRightRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色权限失败')
      this.$message.success('获取角色权限成功')
      this.rolesList = res.data
    },
    // 根据id删除相应的权限 role角色ID,rightId 权限ID
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('删除权限成功')
      // this.getRolesList()
      // 把数据直接给当前角色
      role.children = res.data
    },
    // 获取分配权限数据--tree 树形控件
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限数据失败')
      // this.$message.success('获取权限数据成功')
      this.rightList = res.data
      // console.log(this.rightList)
      this.setRightDialogVisible = true
      this.getLeafKey(role, this.defKey)
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkey数组中
    getLeafKey (node, arr) {
      // 如果当前node节点不包括children属性，则是三级节点
      if (!node.children) {
        // 是三级节点就把id添加到数组中
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKey(item, arr)
      })
    },
    // 关闭分配权限，清空已有数据
    removeRightDialogVisible () {
      this.defKey = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) return this.$message.error('分配失败')
      console.log(res)
      this.$message.success('分配成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 添加角色
    async addRoles () {
      const { data: res } = await this.$http.post('roles', this.addRolesList)
      if (res.meta.status !== 201) return this.$message.error('添加失败')
      this.$message.success('添加成功')
      this.getRolesList()
    },
    // 添加角色对话框重置
    addRightDialog () {
      this.$refs.addRightRef.resetFields()
      this.setRightDialogVisible = false
    },
    // 编辑角色对话框重置
    editRightDialog () {
      this.$refs.editRolesRef.resetFields()
      this.editRightVisible = false
    },
    // 根据ID获得修改角色数据
    async getEditRoles (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      // console.log(res)
      this.$message.success('获取成功')
      this.editRoles = res.data
      this.editRightVisible = true
    },
    // 修改角色提交
    async setsEditRoles () {
      // this.editRoles.id 已经获取了数据
      const { data: res } = await this.$http.put('roles/' + this.editRoles.roleId, {
        roleName: this.editRoles.roleName,
        roleDesc: this.editRoles.roleDesc
      })
      // console.log(this.editRoles.roleId)
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }
      // console.log(res)
      // this.editRoles = res.data
      this.$message.success('修改成功')
      this.getRolesList()
      this.editRightVisible = false
    },
    // 根据id删除角色
    async reomveRoles (id) {
      // console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdbottom {
  border-bottom: 1px solid #eee;
  margin: 0 50px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
