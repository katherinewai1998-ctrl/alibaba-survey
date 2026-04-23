import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// 使用环境变量配置端口（腾讯云 CloudBase 默认使用 8080）
const PORT = parseInt(process.env.PORT) || parseInt(process.env.SERVER_PORT) || 8080

// 管理密码（可以通过环境变量配置）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// 静态文件服务
app.use(express.static(join(__dirname, '../public')))

// 明确路由：多个问卷页面
app.get('/index-cloud-ai.html', (req, res) => {
  res.sendFile(join(__dirname, '../public/index-cloud-ai.html'))
})

app.get('/index-ecommerce-office.html', (req, res) => {
  res.sendFile(join(__dirname, '../public/index-ecommerce-office.html'))
})

app.get('/cloud-ai', (req, res) => {
  res.sendFile(join(__dirname, '../public/index-cloud-ai.html'))
})

app.get('/ecommerce-office', (req, res) => {
  res.sendFile(join(__dirname, '../public/index-ecommerce-office.html'))
})

// 数据文件路径
const dataDir = join(__dirname, '../data')
const dataFile = join(dataDir, 'submissions.json')

// 确保数据目录存在
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

// 读取数据
function loadData() {
  try {
    if (existsSync(dataFile)) {
      const data = readFileSync(dataFile, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('读取数据失败:', error)
  }
  return []
}

// 保存数据
function saveData(data) {
  writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8')
}

// 简单的会话存储（内存中）
const sessions = new Map()

// 验证管理员会话中间件
function requireAdmin(req, res, next) {
  const sessionId = req.headers['x-session-id']
  
  if (!sessionId) {
    return res.status(401).json({ error: '未授权访问', code: 'NO_SESSION' })
  }
  
  const session = sessions.get(sessionId)
  
  if (!session || session.expires < Date.now()) {
    sessions.delete(sessionId)
    return res.status(401).json({ error: '会话已过期', code: 'SESSION_EXPIRED' })
  }
  
  // 更新会话过期时间
  session.expires = Date.now() + 24 * 60 * 60 * 1000 // 24 小时
  sessions.set(sessionId, session)
  
  next()
}

// API 路由

// 获取所有提交（需要管理员权限）
app.get('/api/submissions', requireAdmin, (req, res) => {
  try {
    const submissions = loadData()
    res.json(submissions)
  } catch (error) {
    console.error('获取数据失败:', error)
    res.status(500).json({ error: '获取数据失败' })
  }
})

// 提交新问卷（公开访问，不需要权限）
app.post('/api/submissions', (req, res) => {
  try {
    const data = req.body
    const id = uuidv4()
    
    const submissions = loadData()
    submissions.push({
      id,
      ...data
    })
    saveData(submissions)
    
    res.json({ success: true, id })
  } catch (error) {
    console.error('提交数据失败:', error)
    res.status(500).json({ error: '提交数据失败' })
  }
})

// 删除提交（需要管理员权限）
app.delete('/api/submissions/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params
    const submissions = loadData()
    const filtered = submissions.filter(s => s.id !== id)
    
    if (filtered.length === submissions.length) {
      return res.status(404).json({ error: '未找到记录' })
    }
    
    saveData(filtered)
    res.json({ success: true })
  } catch (error) {
    console.error('删除数据失败:', error)
    res.status(500).json({ error: '删除数据失败' })
  }
})

// 获取统计信息（需要管理员权限）
app.get('/api/stats', requireAdmin, (req, res) => {
  try {
    const submissions = loadData()
    
    const total = submissions.length
    const today = new Date().toDateString()
    const todayCount = submissions.filter(s => new Date(s.submittedAt).toDateString() === today).length
    const bUsers = submissions.filter(s => s.userType?.includes('B 端') || s.userType === '两者都是').length
    const cUsers = submissions.filter(s => s.userType?.includes('C 端') || s.userType === '两者都是').length
    
    res.json({ total, today: todayCount, bUsers, cUsers })
  } catch (error) {
    console.error('获取统计失败:', error)
    res.status(500).json({ error: '获取统计失败' })
  }
})

// 管理员登录
app.post('/api/login', (req, res) => {
  try {
    const { password } = req.body
    
    if (!password) {
      return res.status(400).json({ error: '请输入密码' })
    }
    
    if (password === ADMIN_PASSWORD) {
      // 生成会话 ID
      const sessionId = uuidv4()
      sessions.set(sessionId, {
        id: sessionId,
        isAdmin: true,
        expires: Date.now() + 24 * 60 * 60 * 1000 // 24 小时过期
      })
      
      res.json({ 
        success: true, 
        sessionId,
        expires: 24 * 60 * 60 // 过期时间（秒）
      })
    } else {
      res.status(401).json({ error: '密码错误' })
    }
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({ error: '登录失败' })
  }
})

// 管理员登出
app.post('/api/logout', (req, res) => {
  const sessionId = req.headers['x-session-id']
  if (sessionId) {
    sessions.delete(sessionId)
  }
  res.json({ success: true })
})

// 验证会话
app.get('/api/verify', requireAdmin, (req, res) => {
  res.json({ valid: true })
})

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 启动服务器
// 腾讯云 CloudBase / 阿里云 SAE / Vercel 都支持
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在端口 ${PORT}`)
    console.log(`📊 API 端点：/api/submissions`)
    console.log(`🔐 管理密码：${ADMIN_PASSWORD}`)
    console.log(`💚 健康检查：/health`)
  })
}

// 生产环境直接启动
if (process.env.NODE_ENV === 'production') {
  startServer()
} else {
  // 开发环境也启动
  startServer()
}

// 导出给 Serverless 平台使用
export default app
