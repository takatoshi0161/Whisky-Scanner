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

function getVisionClient() {
  if (visionClient) {
    return visionClient;
  }

  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const clientEmail = process.env.GOOGLE_CLOUD_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const projectId = process.env.GOOGLE_CLOUD_PROJECT;

  if (credentialsJson) {
    visionClient = new ImageAnnotatorClient({
      credentials: JSON.parse(credentialsJson),
      projectId,
    });
    return visionClient;
  }

  if (clientEmail && privateKey) {
    visionClient = new ImageAnnotatorClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      projectId,
    });
    return visionClient;
  }

  visionClient = new ImageAnnotatorClient({ projectId });
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
