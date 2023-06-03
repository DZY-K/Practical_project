const express = require('express')
const app = express()
// 导入 cors 中间件
const cors = require('cors')
// token加密
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 在node.js中传递body参数必须用body-Parser进行解析
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// 将 cors 注册为全局中间件
app.use(cors())
// 配置解析表单数据的中间件
app.use(express.urlencoded({extended:false}))
// 优化res.send()代码
// 需要多次调用 res.send() 向客户端响应 处理失败 的结果
// 响应数据的中间件
app.use((req,res,next)=>{
  res.cc = function(err,status=1){
    res.send({
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message:err instanceof Error ? err.message : err
    })
  }
  next()
})
// 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api\//]}))
// 导入用户路由模块
const useRouter = require('./router/user')
app.use('/api',useRouter)
// 全局错误级别中间件中，捕获验证失败的错误，并把验证失败的结果响应给客户端
const joi = require('joi')
app.use((err,req,res,next)=>{
  if(err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
    if(err.name==='UnauthorizedError') return res.cc('身份认证失败')
  res.cc(err)
})
app.listen(3007,()=>{
  console.log('api server running at http://127.0.0.1:3007');
})