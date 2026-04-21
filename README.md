# Whisky Scanner

Whisky Scanner は、ウイスキーボトルのラベル画像をアップロードし、OCR を使って候補ボトルを返す Web アプリの MVP を目指す個人開発プロジェクトです。

この初期構成では、まず以下がローカルで動く状態を用意しています。

- `frontend`: Next.js + TypeScript のトップ画面
- `backend`: FastAPI の API サーバー
- `db`: PostgreSQL
- `docker compose up --build` で一括起動

加えて、いまは以下の MVP 入口まで実装しています。

- 画像 1 枚アップロード
- OCR ダミー結果の返却
- 候補 3 件の表示

## ディレクトリ構成

```text
.
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |   |-- health.py
|   |   |   `-- scan.py
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
|   |   |-- page.tsx
|   |   `-- scan-uploader.tsx
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
- `POST /scan`
  - 画像 1 枚をアップロード
  - OCR ダミー結果と候補 3 件を返却

## 動作確認の流れ

1. `http://localhost:3000` を開く
2. ラベル画像を 1 枚選ぶ
3. `候補を表示する` を押す
4. OCR 結果と候補 3 件が表示される

## 開発メモ

- OCR の本実装はまだ入れていません
- `backend/app/services/ocr.py` に差し替え用インターフェースだけ用意しています
- 今は「まず確実に起動する」ことを優先した最小構成です

## 次に進めやすいタスク例

- OCR の本実装を追加する
- 候補ロジックをダミーから置き換える
- 画像プレビューを表示する
- 候補詳細画面を作る
