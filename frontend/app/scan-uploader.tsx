"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";

import {
  findDistilleryCandidate,
  normalizeOcrText,
} from "./lib/ocr-distillery";

type OcrResponse = {
  text: string;
  status?: "ok" | "no_text";
  userMessage?: string;
  retryHint?: string;
};

type OcrFailureResponse = {
  error?: string;
  code?: string;
  userMessage?: string;
  retryHint?: string;
  recoverable?: boolean;
};

const OCR_UPLOAD_MAX_BYTES = 4 * 1024 * 1024;
const OCR_UPLOAD_TARGET_BYTES = 3.5 * 1024 * 1024;
const OCR_IMAGE_MAX_DIMENSION = 1600;

function formatOcrFailureMessage(
  response?: Pick<OcrResponse | OcrFailureResponse, "userMessage" | "retryHint">,
) {
  const message = response?.userMessage ?? "読み取れませんでした";
  return response?.retryHint ? `${message}\n${response.retryHint}` : message;
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for OCR upload."));
    };
    image.src = objectUrl;
  });
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Failed to compress image for OCR upload."));
      },
      "image/jpeg",
      quality,
    );
  });
}

async function prepareImageForOcrUpload(file: File) {
  if (file.size <= OCR_UPLOAD_TARGET_BYTES || !file.type.startsWith("image/")) {
    return file;
  }

  const image = await loadImage(file);
  const largestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(1, OCR_IMAGE_MAX_DIMENSION / largestSide);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to prepare image canvas for OCR upload.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  let quality = 0.82;
  let blob = await canvasToJpegBlob(canvas, quality);

  while (blob.size > OCR_UPLOAD_TARGET_BYTES && quality > 0.58) {
    quality -= 0.08;
    blob = await canvasToJpegBlob(canvas, quality);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName || "ocr-upload"}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export function ScanUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResponse | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const normalizedText = ocrResult ? normalizeOcrText(ocrResult.text) : "";
  const distilleryCandidate = findDistilleryCandidate(normalizedText);
  const bottleCandidate = distilleryCandidate.bottles[0];
  const nextBottleRecommendation =
    bottleCandidate?.recommendation?.cardRecommendation ??
    bottleCandidate?.recommendationReasons[0] ??
    "今夜の気分に合わせて試しやすい一本";
  const nextBottleMood =
    bottleCandidate?.recommendationReasons[1] ??
    "静かな夜に、ゆっくり一杯を選びたい時向け";

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

    setIsSubmitting(true);
    setOcrResult(null);
    setError("");

    try {
      let uploadImage: File;

      try {
        uploadImage = await prepareImageForOcrUpload(file);
      } catch {
        setError(
          "画像を送信用に調整できませんでした\n別の画像を選ぶか、少し小さめに撮影して再度お試しください。",
        );
        return;
      }

      if (uploadImage.size > OCR_UPLOAD_MAX_BYTES) {
        setError(
          "画像が大きすぎるため読み取れませんでした\n少し小さめに撮影するか、画像サイズを下げて再度お試しください。",
        );
        return;
      }

      const formData = new FormData();
      formData.append("image", uploadImage, uploadImage.name);

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("OCR response:", data);

      if (!response.ok) {
        setError(formatOcrFailureMessage(data as OcrFailureResponse));
        return;
      }

      const ocrData = data as OcrResponse;

      if (ocrData.status === "no_text" || !ocrData.text?.trim()) {
        setError(formatOcrFailureMessage(ocrData));
        return;
      }

      setOcrResult(ocrData);
    } catch {
      setError(
        "読み取り処理に接続できませんでした。時間をおいて再度お試しください。",
      );
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
              <p className="candidateMeta">{distilleryCandidate.region}</p>
            </div>
            {bottleCandidate ? (
              <>
                <div className="bottleCandidateCard">
                  <div className="nextBottleHeader">
                    <p className="candidateLabel">次の一本候補</p>
                    <span className="nextBottleMood">{nextBottleMood}</span>
                  </div>
                  <h3>{bottleCandidate.name}</h3>
                  <p className="nextBottleLead">{nextBottleRecommendation}</p>
                  <div className="nextBottleFor">
                    <span>こういう人向け</span>
                    <p>{bottleCandidate.recommendedFor}</p>
                  </div>
                </div>
                <Link className="button buttonLink" href={`/bottles/${bottleCandidate.slug}`}>
                  詳細を見る
                </Link>
              </>
            ) : null}
          </article>
        </div>
      ) : null}
    </section>
  );
}
