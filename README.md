# 睡了么 - 每日签到应用

一个简单的每日签到应用，如果超过两天没有签到，系统会自动发送邮件提醒。

## 功能特性

- 用户注册和登录
- 每日签到功能
- 个人账户信息查看
- 签到记录图表展示
- 超过两天未签到自动邮件提醒

## 本地开发

1. 克隆项目
2. 安装依赖：`npm install`
3. 配置环境变量：
   - 复制 `.env.example` 为 `.env`
   - 填入你的 Gmail 邮箱和应用密码
4. 启动服务：`npm start`
5. 访问：`http://localhost:3000`

## 部署到 Render.com（免费）

Render.com 提供免费套餐，非常适合部署这类应用。

### 步骤：

1. **创建 GitHub 仓库**
   - 将代码推送到 GitHub 仓库

2. **登录 Render**
   - 访问 [render.com](https://render.com)
   - 使用 GitHub 账号登录

3. **创建新的 Web Service**
   - 点击 "New +"
   - 选择 "Web Service"
   - 连接你的 GitHub 仓库

4. **配置部署设置**
   - **名称**：填写任意名称
   - **环境**：Node
   - **构建命令**：`npm install`
   - **启动命令**：`node server.js`
   - **实例类型**：Free（免费）

5. **添加环境变量**
   - 在 "Advanced" 部分，点击 "Add Environment Variable"
   - 添加以下变量：
     ```
     GMAIL_EMAIL=your-email@gmail.com
     GMAIL_PASSWORD=your-app-password
     PORT=3000
     ```
   - ⚠️ **注意**：使用 Gmail 需要生成应用密码，不是普通密码
     - 访问 https://myaccount.google.com/security
     - 开启两步验证
     - 生成应用密码

6. **部署**
   - 点击 "Create Web Service"
   - 等待部署完成（约 2-3 分钟）
   - 部署完成后会获得一个公网 URL，如：`https://died-or-not.onrender.com`

7. **分享应用**
   - 将获得的 URL 分享给其他人即可
   - 例如：`https://died-or-not.onrender.com/index.html`

## 部署到 Railway.app（有免费额度）

Railway 也是不错的选择，提供一定的免费额度。

### 步骤：

1. **创建 GitHub 仓库**（同上）

2. **登录 Railway**
   - 访问 [railway.app](https://railway.app)
   - 使用 GitHub 账号登录

3. **创建新项目**
   - 点击 "New Project"
   - 点击 "Deploy from GitHub repo"
   - 选择你的仓库

4. **配置环境变量**
   - 在项目设置中添加环境变量：
     ```
     GMAIL_EMAIL=your-email@gmail.com
     GMAIL_PASSWORD=your-app-password
     PORT=3000
     ```

5. **部署**
   - 点击 "Deploy"
   - 等待部署完成
   - 获得公网 URL 并分享

## Gmail 应用密码获取方法

1. 登录 [Google 账号](https://myaccount.google.com/)
2. 进入"安全性"页面
3. 确保"两步验证"已开启
4. 找到"应用密码"选项
5. 选择"邮件"和"其他（自定义名称）"
6. 输入应用名称（如"睡了么"）
7. 点击"生成"
8. 复制生成的 16 位密码（不含空格）
9. 在部署时使用这个密码作为 `GMAIL_PASSWORD`

## 技术栈

- **前端**：HTML, CSS, JavaScript
- **后端**：Node.js, Express
- **数据库**：JSON 文件存储
- **图表库**：Chart.js
- **邮件服务**：Nodemailer + Gmail SMTP

## 注意事项

- 免费套餐有一定的资源限制，访问量过大可能会暂停服务
- 数据存储在服务器的 JSON 文件中，建议定期备份
- 邮件发送需要稳定的 SMTP 服务
- 免费部署平台可能有休眠策略，首次访问可能需要等待启动

## 许可证

MIT License
