"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type OcrResponse = {
  text: string;
};

export function ScanUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResponse | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setOcrResult(null);
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
    setOcrResult(null);
    setError("");

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("OCR response:", data);

      if (!response.ok) {
        setError(data.error ?? "OCR に失敗しました。");
        return;
      }

      setOcrResult(data as OcrResponse);
    } catch {
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

      {ocrResult ? (
        <div className="resultCard">
          <h3>OCR 結果</h3>
          <pre className="helper">{ocrResult.text}</pre>
        </div>
      ) : null}
    </section>
  );
}
