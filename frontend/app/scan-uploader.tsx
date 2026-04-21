"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type ScanCandidate = {
  name: string;
  score: number;
};

type ScanResponse = {
  filename: string;
  ocr_text: string;
  candidates: ScanCandidate[];
};

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export function ScanUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("画像ファイルを1枚選択してください。");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${apiBaseUrl}/scan`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setResult(null);
        setError(data.detail ?? "スキャンに失敗しました。");
        return;
      }

      setResult(data);
    } catch {
      setResult(null);
      setError("API に接続できませんでした。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>ラベル画像を試す</h2>
      <form className="uploadForm" onSubmit={handleSubmit}>
        <label className="fileField">
          <span>画像ファイル</span>
          <input accept="image/*" onChange={handleFileChange} type="file" />
        </label>
        <button className="button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "スキャン中..." : "候補を表示する"}
        </button>
      </form>

      {file ? <p className="helper">選択中: {file.name}</p> : null}
      {error ? <p className="errorText">{error}</p> : null}

      {result ? (
        <div className="resultCard">
          <p className="helper">OCR 結果: {result.ocr_text}</p>
          <h3>候補 3 件</h3>
          <ol className="candidateList">
            {result.candidates.map((candidate) => (
              <li key={candidate.name}>
                <span>{candidate.name}</span>
                <strong>{Math.round(candidate.score * 100)}%</strong>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
