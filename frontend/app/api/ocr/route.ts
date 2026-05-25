import { ImageAnnotatorClient } from "@google-cloud/vision";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

type OcrSuccessResponse = {
  text: string;
  status: "ok" | "no_text";
  userMessage?: string;
  retryHint?: string;
};

type OcrErrorCode =
  | "invalid_request"
  | "image_empty"
  | "image_too_large"
  | "image_read_failed"
  | "vision_auth_failed"
  | "vision_config_missing"
  | "vision_config_invalid"
  | "vision_permission_denied"
  | "vision_request_failed";

type OcrErrorResponse = {
  error: string;
  code?: OcrErrorCode;
  details?: string;
  userMessage: string;
  retryHint?: string;
  recoverable: boolean;
};

let visionClient: ImageAnnotatorClient | null = null;

const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;
const OCR_RETRY_MESSAGE = "読み取れませんでした";
const OCR_RETRY_HINT =
  "ラベルが見えるように、明るさや角度を変えてもう一度撮影してください。";
const OCR_SERVICE_MESSAGE =
  "読み取り処理が一時的にうまくいきませんでした。時間をおいて再度お試しください。";

class OcrConfigError extends Error {
  constructor(
    message: string,
    readonly code: OcrErrorCode,
  ) {
    super(message);
    this.name = "OcrConfigError";
  }
}

function normalizePrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, "\n");
}

function getPrivateKeyFormat(privateKey?: string) {
  return {
    hasValue: Boolean(privateKey),
    hasBeginMarker: Boolean(privateKey?.includes("-----BEGIN PRIVATE KEY-----")),
    hasEndMarker: Boolean(privateKey?.includes("-----END PRIVATE KEY-----")),
    hasEscapedNewlines: Boolean(privateKey?.includes("\\n")),
    hasActualNewlines: Boolean(privateKey?.includes("\n")),
  };
}

function logOcrEnvironment(source: string, privateKey?: string) {
  console.info("[OCR] Google Vision credential source:", {
    source,
    isVercel: Boolean(process.env.VERCEL || process.env.VERCEL_ENV),
    hasCredentialsJson: Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
    hasClientEmail: Boolean(process.env.GOOGLE_CLOUD_CLIENT_EMAIL),
    hasProjectId: Boolean(process.env.GOOGLE_CLOUD_PROJECT),
    privateKeyFormat: getPrivateKeyFormat(privateKey),
  });
}

function parseCredentialsJson(credentialsJson: string) {
  try {
    const parsed = JSON.parse(credentialsJson) as unknown;
    const credentials = (
      typeof parsed === "string" ? JSON.parse(parsed) : parsed
    ) as {
      client_email?: string;
      private_key?: string;
      project_id?: string;
    };

    if (!credentials.client_email || !credentials.private_key) {
      throw new Error(
        "GOOGLE_APPLICATION_CREDENTIALS_JSON must include client_email and private_key.",
      );
    }

    return {
      ...credentials,
      private_key: normalizePrivateKey(credentials.private_key),
    };
  } catch (error) {
    throw new OcrConfigError(
      `Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON: ${
        error instanceof Error ? error.message : "unknown parse error"
      }`,
      "vision_config_invalid",
    );
  }
}

function getVisionClient() {
  if (visionClient) {
    return visionClient;
  }

  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const clientEmail = process.env.GOOGLE_CLOUD_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY
    ? normalizePrivateKey(process.env.GOOGLE_CLOUD_PRIVATE_KEY)
    : undefined;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

  if (credentialsJson) {
    const credentials = parseCredentialsJson(credentialsJson);
    logOcrEnvironment("GOOGLE_APPLICATION_CREDENTIALS_JSON", credentials.private_key);

    visionClient = new ImageAnnotatorClient({
      credentials,
      fallback: true,
      projectId: projectId ?? credentials.project_id,
    });
    return visionClient;
  }

  if (clientEmail && privateKey) {
    logOcrEnvironment("GOOGLE_CLOUD_CLIENT_EMAIL/GOOGLE_CLOUD_PRIVATE_KEY", privateKey);

    visionClient = new ImageAnnotatorClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      fallback: true,
      projectId,
    });
    return visionClient;
  }

  if (isVercel) {
    logOcrEnvironment("missing", privateKey);
    throw new OcrConfigError(
      "Google Vision OCR requires GOOGLE_APPLICATION_CREDENTIALS_JSON or GOOGLE_CLOUD_CLIENT_EMAIL/GOOGLE_CLOUD_PRIVATE_KEY in Vercel.",
      "vision_config_missing",
    );
  }

  logOcrEnvironment("application_default_credentials", privateKey);
  visionClient = new ImageAnnotatorClient({ fallback: true, projectId });
  return visionClient;
}

function jsonError(
  message: string,
  status: number,
  code?: OcrErrorCode,
  details?: string,
  userMessage = OCR_RETRY_MESSAGE,
  retryHint?: string,
  recoverable = true,
) {
  return NextResponse.json<OcrErrorResponse>(
    { error: message, code, details, userMessage, retryHint, recoverable },
    { status },
  );
}

function classifyOcrError(error: unknown): {
  code: OcrErrorCode;
  status: number;
  details: string;
  userMessage: string;
  retryHint?: string;
  recoverable: boolean;
} {
  if (error instanceof OcrConfigError) {
    return {
      code: error.code,
      status: 500,
      details: error.message,
      userMessage: OCR_SERVICE_MESSAGE,
      recoverable: false,
    };
  }

  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("invalid image") ||
    lowerMessage.includes("bad image") ||
    lowerMessage.includes("unsupported image") ||
    lowerMessage.includes("image decode") ||
    lowerMessage.includes("invalid_argument")
  ) {
    return {
      code: "image_read_failed",
      status: 422,
      details:
        "Google Vision could not read the uploaded image payload as an OCR target.",
      userMessage: OCR_RETRY_MESSAGE,
      retryHint: OCR_RETRY_HINT,
      recoverable: true,
    };
  }

  if (
    lowerMessage.includes("payload") ||
    lowerMessage.includes("too large") ||
    lowerMessage.includes("request entity")
  ) {
    return {
      code: "image_too_large",
      status: 413,
      details: "The uploaded image was too large for OCR processing.",
      userMessage: "画像が大きすぎるため読み取れませんでした",
      retryHint: "少し小さめに撮影するか、画像サイズを下げて再度お試しください。",
      recoverable: true,
    };
  }

  if (
    lowerMessage.includes("private key") ||
    lowerMessage.includes("pem") ||
    lowerMessage.includes("credential") ||
    lowerMessage.includes("authentication") ||
    lowerMessage.includes("invalid_grant")
  ) {
    return {
      code: "vision_auth_failed",
      status: 500,
      details:
        "Google Vision authentication failed. Check the Vercel service account JSON and private_key newline formatting.",
      userMessage: OCR_SERVICE_MESSAGE,
      recoverable: false,
    };
  }

  if (
    lowerMessage.includes("permission_denied") ||
    lowerMessage.includes("permission denied")
  ) {
    return {
      code: "vision_permission_denied",
      status: 500,
      details:
        "Google Vision rejected the request. Check that the Vision API is enabled and the service account has access.",
      userMessage: OCR_SERVICE_MESSAGE,
      recoverable: false,
    };
  }

  return {
    code: "vision_request_failed",
    status: 502,
    details:
      "Google Vision request failed. Check Vercel Function Logs for the safe OCR diagnostic entry.",
    userMessage: OCR_RETRY_MESSAGE,
    retryHint: OCR_RETRY_HINT,
    recoverable: true,
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return jsonError(
        "Send an image file in the image field.",
        400,
        "invalid_request",
        undefined,
        "画像ファイルを選択してください",
        undefined,
        true,
      );
    }

    if (!image.type.startsWith("image/")) {
      return jsonError(
        "Only image files are supported.",
        400,
        "invalid_request",
        undefined,
        "画像ファイルを選択してください",
        "JPEG、PNG、HEICなどの画像を選んでください。",
        true,
      );
    }

    if (image.size <= 0) {
      return jsonError(
        "The uploaded image file was empty.",
        400,
        "image_empty",
        undefined,
        "画像を読み取れませんでした",
        "別の画像を選んで再度お試しください。",
        true,
      );
    }

    if (image.size > MAX_IMAGE_SIZE_BYTES) {
      return jsonError(
        "The uploaded image file was too large.",
        413,
        "image_too_large",
        `${image.size} bytes`,
        "画像が大きすぎるため読み取れませんでした",
        "少し小さめに撮影するか、画像サイズを下げて再度お試しください。",
        true,
      );
    }

    console.info("[OCR] textDetection request:", {
      fileType: image.type,
      fileSize: image.size,
      isVercel: Boolean(process.env.VERCEL || process.env.VERCEL_ENV),
    });

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const client = getVisionClient();
    const [result] = await client.textDetection({
      image: { content: imageBuffer.toString("base64") },
    });

    const text = result.textAnnotations?.[0]?.description?.trim() ?? "";
    console.log("[OCR] textDetection result:", text);

    if (!text) {
      return NextResponse.json<OcrSuccessResponse>({
        text: "",
        status: "no_text",
        userMessage: OCR_RETRY_MESSAGE,
        retryHint: OCR_RETRY_HINT,
      });
    }

    return NextResponse.json<OcrSuccessResponse>({ text, status: "ok" });
  } catch (error) {
    const { code, status, details, userMessage, retryHint, recoverable } =
      classifyOcrError(error);
    console.error("[OCR] textDetection failed:", {
      code,
      details,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return jsonError(
      "OCR processing failed.",
      status,
      code,
      details,
      userMessage,
      retryHint,
      recoverable,
    );
  }
}
