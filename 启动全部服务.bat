@echo off
chcp 65001 >nul 2>&1
title 乌东文旅 - 服务启动中

echo.
echo   ╔══════════════════════════════════════╗
echo   ║  🏔️  乌东文旅「衣食住行」平台       ║
echo   ╚══════════════════════════════════════╝
echo.
echo   正在启动三个服务窗口，每个窗口启动需要几秒钟...
echo.

echo   [1/3] 启动后端API (端口3000)
start "乌东文旅-后端API" cmd /k "cd /d %~dp0backend && echo 后端API启动中... && npx ts-node src/index.ts"

echo   [2/3] 启动PC网页端 (端口5173)
start "乌东文旅-PC网页" cmd /k "cd /d %~dp0web && echo PC网页端启动中... && npx vite --port 5173"

echo   [3/3] 启动管理后台 (端口5174)
start "乌东文旅-管理后台" cmd /k "cd /d %~dp0admin && echo 管理后台启动中... && npx vite --port 5174"

echo.
echo   ┌──────────────────────────────────────┐
echo   │  服务正在启动，请等待各窗口显示       │
echo   │  "ready" 或 "服务已启动" 字样         │
echo   │                                      │
echo   │  后端就绪后，点击下方链接即可访问：    │
echo   │                                      │
echo   │  🌐 PC网页端: http://localhost:5173  │
echo   │  ⚙️ 管理后台: http://localhost:5174  │
echo   │  🔌 后端API:  http://localhost:3000  │
echo   │                                      │
echo   │  🔑 管理员: admin / 123456            │
echo   └──────────────────────────────────────┘
echo.

:: 等待10秒让服务启动
echo   等待服务启动中...
timeout /t 10 /nobreak

:: 打开项目入口页面
start "" "%~dp0打开网页端.html"

echo.
echo   已打开入口页面！如果服务还没就绪，请稍等片刻再刷新页面。
echo   按任意键关闭此窗口（不影响已启动的服务）...
pause >nul
