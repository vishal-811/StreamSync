import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";
import { EventEmitter, Readable } from "stream";

export const myEmitter = new EventEmitter();

dotenv.config();

const Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    accessKeyId: process.env.ACCESS_KEY_ID || "",
  },
});

export async function getDatafromS3(bucket_name: string, file_name: string): Promise<any> {
  const command = new GetObjectCommand({
    Bucket: bucket_name,
    Key: file_name,
  });

  try {
    const response = await Client.send(command);
    const stream = response.Body as Readable;
  
    if (!stream || !stream.readable) {
      throw new Error("Failed to get readable stream from S3");
    }
    return stream;
    
  } catch (error) {
    console.error("Error in getDatafromS3:", error);
    throw error;
  }
}

export async function uploadToS3(
  bucket_name: string,
  file_name: string,
  videoStream: Readable,
  quality: string
): Promise<void> {
  try {
    console.log(`Starting upload for ${quality}`);
    
    const upload = new Upload({
      client: Client,
      params: {
        Bucket: bucket_name,
        Key: `uploads/transcoded/${file_name}.mp4`,
        Body: videoStream,
        ContentType: 'video/mp4'
      },
      queueSize: 4, // number of concurrent upload parts
      partSize: 5 * 1024 * 1024, // 5MB part size
    });

    // Add upload progress monitoring
    await upload.done();
    console.log(`Upload completed for ${quality}`);
  } catch (error) {
    console.error(`Error in uploadToS3 for ${quality}:`, error);
    throw error;
  }
}