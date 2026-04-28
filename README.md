# Whisky Scanner

Whisky Scanner は、ウイスキーボトルのラベル画像をアップロードし、OCR を使って候補ボトルを返す Web アプリの MVP を目指す個人開発プロジェクトです。

この初期構成では、まず以下がローカルで動く状態を用意しています。

- `frontend`: Next.js + TypeScript の仮トップ画面
- `backend`: FastAPI の API サーバー
- `db`: PostgreSQL
- `docker compose up --build` で一括起動

## ディレクトリ構成

```text
.
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |   `-- health.py
|   |   |-- core/
|   |   |   `-- config.py
|   |   |-- db/
|   |   |   `-- session.py
|   |   |-- services/
|   |   |   `-- ocr.py
|   |   `-- main.py
|   |-- Dockerfile
|   |-- pyproject.toml
|   `-- requirements.txt
|-- frontend/
|   |-- app/
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- public/
|   |   `-- .gitkeep
|   |-- Dockerfile
|   |-- next.config.js
|   |-- package.json
|   `-- tsconfig.json
|-- .env.example
|-- .gitignore
|-- docker-compose.yml
`-- README.md
```

## セットアップ

1. `.env.example` を `.env` にコピーします。

```powershell
Copy-Item .env.example .env
```

2. Docker Desktop を起動します。

3. 以下を実行します。

```powershell
docker compose up --build
```

4. 起動後、以下にアクセスします。

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend healthcheck: [http://localhost:8000/health](http://localhost:8000/health)

## 主要なエンドポイント

- `GET /health`
  - API の起動確認
  - DB 接続確認

## 開発メモ

- OCR の本実装はまだ入れていません
- `backend/app/services/ocr.py` に差し替え用インターフェースだけ用意しています
- 今は「まず確実に起動する」ことを優先した最小構成です

## 次に進めやすいタスク例

- 画像アップロード API の追加
- OCR ダミー実装の追加
- 候補 3 件を返す簡易レスポンスの追加
- フロントから API を呼ぶ画面の追加
