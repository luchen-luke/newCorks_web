# Corks — Web prototype (newCorks_web)

这是基于仓库里的 PRD (Corks_PRD.md) 快速搭建的一个 Next.js 前端原型。目标是把 PRD 中的核心功能以可运行的 web demo 形式实现：聚会、酒吧探索、酒类百科、社区流与用户首页。

# newCorks_web — Corks prototype

这是基于你提供的 PRD（Corks）生成的 Next.js 原型站点，包含聚会、酒吧、百科、社区与用户页面，并带有内存 Mock API。

## 快速开始（Windows / PowerShell）

1. 打开 PowerShell，进入项目目录：

```powershell
cd "d:\code programs\newCorks_web"
```

2. 安装依赖：

```powershell
npm install
```

3. 启动开发服务器：

```powershell
npm run dev
```

4. 打开浏览器访问：

```
http://localhost:3000
```

如果你看到 ERR_CONNECTION_REFUSED（无法访问 localhost:3000），请按下面的“排障检查”逐项排查。

---

## 排障检查（无法访问 localhost:3000）

按顺序检查下面几项：

1) 确认服务是否已启动

在 PowerShell 中看启动日志（通常会输出类似 "ready - started server on http://localhost:3000"）。如果没有，请先运行 `npm run dev` 并观察是否有错误。

2) 确认 Node/npm 是否可用

```powershell
node -v
npm -v
```

3) 检查端口占用或监听状态

在 PowerShell 中执行：

```powershell
netstat -aon | findstr ":3000"
# 或 (PowerShell 5.1 推荐)
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

如果发现已有进程占用端口，可查看 PID：

```powershell
tasklist /fi "PID eq <PID_FROM_NETSTAT>"
```

4) 检查是否在 WSL、VM、远端容器或远程主机运行

如果你在 WSL/容器中运行开发服务器，要确保端口已转发到 Windows 主机，或改为把 server 绑定到 0.0.0.0 并从 Windows 访问。

5) 检查防火墙/安全软件

本地访问通常不受防火墙限制，但某些安全软件会阻断端口。临时关闭防火墙或允许 3000 端口（保存更改后再打开）以排查是否为防火墙原因。

6) 读取开发服务器日志

把 `npm run dev` 的完整输出复制给我（如果出现错误或堆栈），我可以帮你分析。

---

## 我还可以为你做的事情

- 远程帮助你启动服务并提供日志分析（如果你把日志粘贴过来）
- 把项目迁移到 Docker 环境并提供 Docker Compose 启动脚本（避免主机差异）
- 改进项目配置，例如将 dev server 绑定到 0.0.0.0、设置 PORT 环境变量、或调试启动错误

如果你愿意，请告诉我你刚才如何启动服务器（或把终端中报错/日志的内容发给我），我会继续帮你定位并修复问题。

---

## 使用 PostgreSQL + Redis 本地开发（Docker）

我已经为项目添加了 `prisma/schema.prisma`、`docker-compose.yml`、`Dockerfile` 以及 `.env.example`，你可以用 Docker 快速在本地运行 Postgres 和 Redis：

```powershell
# 启动本地 postgres 与 redis 并运行 app dev server（需要 Docker Desktop）
docker-compose up --build
```

或者在本机安装 Node 后，按下面步骤把数据库初始化为本地 Postgres（先把 .env 设置好）：

```powershell
npm install
npm run prisma:generate
# 创建或运行迁移（如果你运行在本地 Postgres）
npm run prisma:migrate
npm run dev
```

如果 `prisma migrate` 报错或者你使用 Docker 中的数据库，请使用 `DATABASE_URL` 对应的容器地址并确保服务正在运行（docker-compose up）。

---

## 部署与生产环境提示

- 使用 Docker Compose（生产）:

```powershell
docker-compose -f docker-compose.prod.yml up --build -d
```

- 使用 Kubernetes：示例 manifests 在 `deploy/k8s` 下（请把 secrets 和镜像地址替换为你自己的）

- 使用 Vercel：Next.js 可直接部署到 Vercel。注意：PRISMA 需要连接到数据库（你需要在 Vercel env 中设置 DATABASE_URL、REDIS_URL、JWT_SECRET），并在部署后运行迁移或使用 CI 进行迁移。

---

如果你希望，我可以继续做：把 API 测试套件补齐、为关键端点添加更多的输入校验/权限控制、或把项目完全转换为 TypeScript + CI 管线（GitHub Actions），并模拟生产环境的部署流程。


## 运行（Windows / PowerShell）

1. 安装依赖（推荐 Node 18+）

```powershell
cd "d:\code programs\newCorks_web"
npm install
```

2. 开发服务器

```powershell
npm run dev
```

3. 在浏览器打开 http://localhost:3000

## 已实现（演示 / Mock）

- 首页（聚会速览 + 推荐酒吧）
- 聚会模块：查看列表、创建聚会（POST 到 /api/meetups，为内存数据）
- 酒吧模块：酒吧列表（/api/bars）
- 酒类百科：文章列表（/api/knowledge）
- 社区：发布和查看帖子（/api/posts）
- 用户主页：简单信息与成就展示

> 注意：所有 API 都是内存级 mock（pages/api 下），仅用于演示；未接入真实数据库或用户认证。

## 文件结构要点

- `pages/` - Next.js 页面
- `pages/api/*` - mock API 路由
- `data/sampleData.js` - 示例数据源
- `components/*` - Layout、Navbar 等 UI 组件

如果你希望我把这个 prototype 补充为完整的全栈应用（加入数据库、Prisma schema、身份体系、真实聊天/实时功能），我可以继续扩展。

---

## TypeScript / 验证 / 测试 / CI（已集成）

此仓库现在已升级并集成了下列功能：

- TypeScript：服务器端库与 API 路由已迁移为 TypeScript（部分前端页面/组件也已迁移）
- 输入验证：使用 Zod 对关键 API 的输入进行校验
- 测试：Jest（单元 / Prisma 集成测试）与 Playwright（E2E）基础样例
- CI：GitHub Actions 工作流位于 `.github/workflows/ci.yml`，CI 会启动 Postgres 与 Redis 服务、运行 Prisma DB push、seed 数据、构建并启动服务器，然后运行 Jest 与 Playwright 测试

在 CI 或本地运行测试前请确保数据库环境变量正确（`.env` 中的 DATABASE_URL / REDIS_URL）。你可以在本地使用 `docker-compose up --build` 启动数据库服务以便测试。

