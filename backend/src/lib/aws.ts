import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv"

dotenv.config();

const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    accessKeyId: process.env.ACCESS_KEY_ID || "",
  },
});

export const bucket = "youtube-live";

export async function postPreSignedUrl(filename: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: `uploads/raw/${filename}`,
    ContentType: "video/mp4",
  });

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 6000,
  });
  return signedUrl;
}

export async function getPreSignedUrl(filename: string, quality: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: `process/${filename}/${quality}`,
  });

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 10000,
  });
  return signedUrl;
}
