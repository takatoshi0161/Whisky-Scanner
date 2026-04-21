import { ScanUploader } from "./scan-uploader";

async function getHealthStatus() {
  const apiBaseUrl =
    process.env.INTERNAL_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://backend:8000";

  try {
    const response = await fetch(`${apiBaseUrl}/health`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { status: "unavailable", database: "unknown" };
    }

    return response.json();
  } catch {
    return { status: "unavailable", database: "unknown" };
  }
}

export default async function HomePage() {
  const health = await getHealthStatus();

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Whisky Scanner</p>
        <h1>ラベル画像から、候補ボトルを返す MVP をここから始めます。</h1>
        <p className="lead">
          まずは画像を 1 枚アップロードして、OCR のダミー結果と候補 3 件を返す
          最小構成です。本実装の OCR はあとから差し替えられるようにしてあります。
        </p>
      </section>

      <section className="panel">
        <h2>現在の接続状態</h2>
        <dl className="statusList">
          <div>
            <dt>API</dt>
            <dd>{health.status}</dd>
          </div>
          <div>
            <dt>Database</dt>
            <dd>{health.database}</dd>
          </div>
        </dl>
      </section>

      <ScanUploader />

      <section className="panel">
        <h2>MVP スコープ</h2>
        <p>画像 1 枚アップロード → OCR → 候補 3 件表示</p>
      </section>
    </main>
  );
}
