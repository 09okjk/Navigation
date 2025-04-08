# 工具导航平台

一个用于汇总和管理各种工具网站的前端应用程序，使用Vue 3、TypeScript和Tailwind CSS构建。

## 功能特点

- 集中管理各种工具网站的信息
- 记录工具名称、描述、维护人、版本号和网址
- 支持按名称、维护人或描述进行搜索
- 支持添加、编辑和删除工具
- 数据保存在服务器端，实现多用户数据共享
- 响应式设计，适配各种屏幕尺寸

## 技术栈

- Vue 3 - 渐进式JavaScript框架
- TypeScript - 类型安全的JavaScript超集
- Tailwind CSS - 实用优先的CSS框架
- Vite - 现代前端构建工具
- Express.js - Node.js Web应用框架（后端）

## 本地开发

### 前提条件

- Node.js (v14.0.0或更高版本)
- npm (v6.0.0或更高版本)

### 安装依赖

```bash
npm install
```

### 启动前端开发服务器

```bash
npm run dev
```

### 启动后端服务器

```bash
cd server
npm install
npm run dev
```

启动后，服务器将在端口 9436 上运行，并且可以在局域网内访问。在局域网内的其他设备上，可以使用以下地址访问应用：

```
http://<服务器局域网IP>:9436
```

要查找您的局域网IP，可以在命令行中运行 `ipconfig` （Windows）或 `ifconfig` （Linux/Mac）。

### 构建生产版本

```bash
npm run build
```

## 在Ubuntu系统中部署

以下是在Ubuntu系统上部署该应用的步骤：

### 1. 安装必要的软件

```bash
# 更新软件包列表
sudo apt update

# 安装Node.js和npm
sudo apt install -y nodejs npm

# 安装更新版本的Node.js (如果需要)
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
npm -v

# 安装Nginx作为Web服务器
sudo apt install -y nginx
```

### 2. 克隆或上传项目

```bash
# 方法1：使用Git克隆项目
git clone <您的项目仓库URL> /var/www/html/Navigation

# 方法2：手动上传项目到服务器
# 使用scp、rsync或其他工具将项目文件上传到服务器
```

### 3. 构建项目

```bash
# 进入项目目录
cd /var/www/html/Navigation

# 安装前端依赖并构建
npm install
npm run build

# 安装后端依赖
cd server
npm install
```

### 4. 配置Nginx和启动后端服务

```bash
# 创建Nginx配置文件
sudo nano /etc/nginx/sites-available/tools-navigation

# 添加以下配置，将前端请求代理到后端服务
server {
    listen 80;
    server_name your-domain.com; # 替换为您的域名或服务器IP

    # 前端静态文件
    location / {
        root /var/www/html/Navigation/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端API代理
    location /api/ {
        proxy_pass http://localhost:9436;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 创建符号链接启用站点
sudo ln -s /etc/nginx/sites-available/tools-navigation /etc/nginx/sites-enabled/

# 测试Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 设置后端服务自动启动（使用systemctl）

1. 创建一个 systemd 服务文件：

```bash
sudo nano /etc/systemd/system/tools-navigation-api.service
```

2. 在文件中添加以下内容：

```ini
[Unit]
Description=Tools Navigation API Service
After=network.target

[Service]
ExecStart=/usr/bin/node /var/www/html/Navigation/server/server.js
WorkingDirectory=/var/www/html/Navigation/server
Restart=always
User=www-data
Group=www-data
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

3. 保存并关闭文件后，执行以下命令以启用和启动服务：

```bash
# 重新加载 systemd 配置
sudo systemctl daemon-reload

# 启用服务开机启动
sudo systemctl enable tools-navigation-api

# 启动服务
sudo systemctl start tools-navigation-api
```

4. 检查服务状态：

```bash
sudo systemctl status tools-navigation-api
```

### 对后续操作的影响

- 使用 `systemctl` 替代 PM2 后，您无需再使用 PM2 的命令（如 `pm2 start`、`pm2 restart` 等）来管理服务。
- 服务的日志可以通过 `journalctl` 查看，例如：

```bash
sudo journalctl -u tools-navigation-api
```

- 如果需要重启服务，可以使用以下命令：

```bash
sudo systemctl restart tools-navigation-api
```

- 如果您已经使用 PM2 配置了服务，请确保停止并移除 PM2 管理的服务，以避免冲突：

```bash
pm2 stop tools-navigation-api
pm2 delete tools-navigation-api
pm2 unstartup
```

通过 `systemctl` 管理服务，您可以更好地与系统的服务管理工具集成，同时减少对第三方工具（如 PM2）的依赖。

```

### 5. 配置防火墙（如果启用）

```bash
# 允许HTTP流量
sudo ufw allow 'Nginx HTTP'
```

### 6. 设置SSL（可选但推荐）

```bash
# 安装Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取并配置SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期证书
sudo systemctl status certbot.timer
```

## 维护与更新

当需要更新应用时，执行以下步骤：

```bash
# 进入项目目录
cd /var/www/html/Navigation

# 拉取最新代码（如果使用Git）
git pull

# 更新前端
npm install
npm run build

# 更新后端
cd server
# 添加权限
sudo chown -R $USER:$USER /var/www/html/Navigation
npm install
sudo systemctl restart tools-navigation-api

# 如果需要，重启Nginx
sudo systemctl restart nginx
```

## 故障排除

- 如果网站无法访问，检查Nginx状态：`sudo systemctl status nginx`
- 查看Nginx错误日志：`sudo tail -f /var/log/nginx/error.log`
- 检查后端API服务状态：`pm2 status tools-navigation-api`
- 查看后端日志：`pm2 logs tools-navigation-api`
- 确保防火墙允许HTTP/HTTPS流量：`sudo ufw status`
- 如果数据无法保存或加载，检查数据文件权限：`ls -la /var/www/tools-navigation/server/data/`

## 许可证

MIT
