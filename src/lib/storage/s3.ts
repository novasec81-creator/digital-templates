import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * S3/R2 client. Cloudflare R2 uses the standard S3 protocol — you only need to
 * set S3_ENDPOINT. AWS S3 works out of the box (omit S3_ENDPOINT).
 */
export function getS3Client() {
  return new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
    forcePathStyle: Boolean(process.env.S3_ENDPOINT), // required for R2
  });
}

function getBucket(): string {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET is not set");
  return bucket;
}

/**
 * Generates a short-lived signed URL for a stored file. The file bucket key is
 * never exposed to the client — only the presigned URL, valid a few minutes.
 */
export async function createPresignedDownloadUrl(
  fileKey: string,
  ttlSeconds = Number(process.env.PRESIGNED_URL_TTL ?? 300)
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: fileKey,
  });
  return getSignedUrl(getS3Client(), command, { expiresIn: ttlSeconds });
}

export async function uploadFile(
  fileKey: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: fileKey,
    Body: body,
    ContentType: contentType,
  });
  await getS3Client().send(command);
}

export async function headFile(fileKey: string): Promise<boolean> {
  try {
    await getS3Client().send(
      new HeadObjectCommand({ Bucket: getBucket(), Key: fileKey })
    );
    return true;
  } catch {
    return false;
  }
}