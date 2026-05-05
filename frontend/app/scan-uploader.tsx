"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type OcrResponse = {
  text: string;
};

type DistilleryCandidate = {
  name: string;
  keywords: string[];
};

const distilleryCandidates: DistilleryCandidate[] = [
  { name: "Yamazaki", keywords: ["yamazaki", "山崎"] },
  { name: "Hakushu", keywords: ["hakushu", "白州"] },
  { name: "Yoichi", keywords: ["yoichi", "余市"] },
  { name: "Miyagikyo", keywords: ["miyagikyo", "宮城峡"] },
  { name: "Glenmorangie", keywords: ["glenmorangie"] },
  { name: "The Glenlivet", keywords: ["glenlivet"] },
  { name: "Balvenie", keywords: ["balvenie"] },
  { name: "Bowmore", keywords: ["bowmore"] },
  { name: "Talisker", keywords: ["talisker"] },
  { name: "Caol Ila", keywords: ["caol ila", "caolila"] },
  { name: "Aberlour", keywords: ["aberlour"] },
  { name: "Bunnahabhain", keywords: ["bunnahabhain"] },
  { name: "Arran", keywords: ["arran"] },
  { name: "Kavalan", keywords: ["kavalan"] },
];

const unknownDistillery: DistilleryCandidate = {
  name: "Unknown",
  keywords: [],
};

function normalizeOcrText(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function findDistilleryCandidate(text: string) {
  if (!text) {
    return unknownDistillery;
  }

  return (
    distilleryCandidates.find((candidate) =>
      [candidate.name, ...candidate.keywords].some((keyword) =>
        text.includes(keyword.toLowerCase()),
      ),
    ) ?? unknownDistillery
  );
}

export function ScanUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResponse | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const normalizedText = ocrResult ? normalizeOcrText(ocrResult.text) : "";
  const distilleryCandidate = findDistilleryCandidate(normalizedText);

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
          <h3>整形後のOCRテキスト</h3>
          <pre className="helper normalizedText">{normalizedText || "Unknown"}</pre>
          <article className="distilleryCandidateCard">
            <div>
              <p className="candidateLabel">蒸留所候補</p>
              <h3>{distilleryCandidate.name}</h3>
            </div>
            <button
              className="button"
              onClick={() => {
                console.log("Selected distillery candidate:", distilleryCandidate);
              }}
              type="button"
            >
              このボトルで見る
            </button>
          </article>
        </div>
      ) : null}
    </section>
  );
}
