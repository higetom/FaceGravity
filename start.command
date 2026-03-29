#!/bin/bash

# FaceGravity - ワンクリック起動スクリプト

cd "$(dirname "$0")/dist"

clear
echo ""
echo "  ╔═══════════════════════════════════════╗"
echo "  ║                                       ║"
echo "  ║        FaceGravity                    ║"
echo "  ║   姿勢を変えたら、顔が変わった。     ║"
echo "  ║                                       ║"
echo "  ╚═══════════════════════════════════════╝"
echo ""
echo "  アプリを起動中..."
echo ""
echo "  ブラウザで自動的に開きます"
echo "  開かない場合: http://localhost:8080"
echo ""
echo "  終了するには: Ctrl + C"
echo "  ─────────────────────────────────────"
echo ""

# ポートが使用中なら解放
lsof -ti :8080 | xargs kill 2>/dev/null

# ブラウザを自動で開く
(sleep 1 && open "http://localhost:8080") &

# Python3で静的ファイルを配信（macOS標準搭載）
python3 -m http.server 8080
