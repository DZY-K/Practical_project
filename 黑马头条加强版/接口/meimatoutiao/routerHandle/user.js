// 路由处理函数模块中，专门负责存放每个路由对应的处理函数
// 导入数据库模块
const db = require('../db/index')
// 导入bcryptjs模块
// const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
const config = require('../config')
// 用户登录处理函数
exports.login = (req, res) => {
  const userinfo = req.body
  console.log(userinfo);
  // 根据用户名查询用户的数据
  const sql = `select * from ev_users where phoneNumber=?`
  db.query(sql, [userinfo.phoneNumber], (err, results) => {
    console.log(results[0]);
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('登录失败1')
    // 判断密码是否正确
    // bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
    // 给用户密码加密与数据库中的密码进行比较 返回值是布尔值（true 一致、false 不
    // 在生成 Token 字符串的时候，一定要剔除 密码 和 头像 的值
    const user = { ...results[0], code: '' }
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: '10h'
    })
    res.send({
      status: 0,
      message: '登录成功',
      // 'Bearer '一定要加空格
      token: 'Bearer ' + tokenStr
    })
  })

}