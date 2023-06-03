const express = require('express')
const compression = require('compression')
const app = express()
app.use(compression())
// 托管静态资源
app.use(express.static('./dist'))
app.listen(82, () => console.log(`Example app listening on port http://127.0.0.1:82`))