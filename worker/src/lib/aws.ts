import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();


const Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    accessKeyId: process.env.ACCESS_KEY_ID || "",
  },
});

export async function getDatafromS3(bucket_name: string, file_name: string) {
  const command = new GetObjectCommand({
    Bucket: bucket_name,
    Key: file_name,
  });

  try {
    const response = await Client.send(command);
    const data = response.Body;
    if (data) {
      return data;
    } else {
      console.log("Error in getting data from the s3");
    }
  } catch (error) {
    console.log("Error in worker node is", error);
  }
}



export async function uploadToS3(
  bucket_name: string,
  file_name: string,
  TranscodeVideos: any
) {
  
  const command = new PutObjectCommand({
    Bucket : bucket_name,
    Key :`uploads/transcoded/${file_name}`
  })
  try {
    const response = await Client.send(command);
    console.log("The  response from  s3 on completion of transcode video upload", response);
  } catch (error) {
    console.log("Something went wrong in the put the data in s3, after transcoding");
  }
}