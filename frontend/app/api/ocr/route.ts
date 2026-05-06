import { ImageAnnotatorClient } from "@google-cloud/vision";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type OcrSuccessResponse = {
  text: string;
};

type OcrErrorResponse = {
  error: string;
};

let visionClient: ImageAnnotatorClient | null = null;

function parseCredentialsJson(credentialsJson: string) {
  try {
    const credentials = JSON.parse(credentialsJson) as {
      client_email?: string;
      private_key?: string;
      project_id?: string;
    };

    if (!credentials.client_email || !credentials.private_key) {
      throw new Error(
        "GOOGLE_APPLICATION_CREDENTIALS_JSON must include client_email and private_key.",
      );
    }

    return credentials;
  } catch (error) {
    throw new Error(
      `Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON: ${
        error instanceof Error ? error.message : "unknown parse error"
      }`,
    );
  }
}

function getVisionClient() {
  if (visionClient) {
    return visionClient;
  }

  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const clientEmail = process.env.GOOGLE_CLOUD_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

  if (credentialsJson) {
    const credentials = parseCredentialsJson(credentialsJson);

    visionClient = new ImageAnnotatorClient({
      credentials,
      fallback: true,
      projectId: projectId ?? credentials.project_id,
    });
    return visionClient;
  }

  if (clientEmail && privateKey) {
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
    throw new Error(
      "Google Vision OCR requires GOOGLE_APPLICATION_CREDENTIALS_JSON or GOOGLE_CLOUD_CLIENT_EMAIL/GOOGLE_CLOUD_PRIVATE_KEY in Vercel.",
    );
  }

  visionClient = new ImageAnnotatorClient({ fallback: true, projectId });
  return visionClient;
}

function jsonError(message: string, status: number) {
  return NextResponse.json<OcrErrorResponse>({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return jsonError("Send an image file in the image field.", 400);
    }

    if (!image.type.startsWith("image/")) {
      return jsonError("Only image files are supported.", 400);
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const client = getVisionClient();
    const [result] = await client.textDetection({
      image: { content: imageBuffer.toString("base64") },
    });

    const text = result.textAnnotations?.[0]?.description?.trim() ?? "";
    console.log("[OCR] textDetection result:", text);

    return NextResponse.json<OcrSuccessResponse>({ text });
  } catch (error) {
    console.error("[OCR] textDetection failed:", error);
    return jsonError("OCR processing failed.", 500);
  }
}
