import { createClient } from "redis";
import { getDatafromS3 , uploadToS3} from "./lib/aws";
import { PassThrough } from "stream";
import  ffmpeg from 'fluent-ffmpeg'

async function handleTranscodeVideo(data: any) {
  const { bucket_name, file_name } = JSON.parse(data?.element);
  let rawVideo = await getDatafromS3(bucket_name, file_name);
  const qualities = ["360p", "480p", "720p"];

  const transcodePromises = qualities.map((quality) =>
    TranscodeVideo(rawVideo, quality)
      .then((outputVideo) => {
        console.log("The output of transcode video is", outputVideo)
        const transcodedFileName = `${file_name}_${quality}`;
        return uploadToS3(bucket_name, transcodedFileName, outputVideo);
      })
      .then(() => {
        console.log(`Transcoded video (${quality}) uploaded to S3 successfully`);
      })
  );

  // Wait for all transcoding and uploads to complete.
  await Promise.all(transcodePromises);
}


async function TranscodeVideo(inputVideo: any, quality: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    console.log(typeof inputVideo);
    let ffmpegCommand = ffmpeg(inputVideo).format("mp4").videoCodec("libx264");
    switch (quality) {
      case "360p":
        ffmpegCommand = ffmpegCommand.size("640x360");
        break;
      case "480p":
        ffmpegCommand = ffmpegCommand.size("854x480");
        break;
      case "720p":
        ffmpegCommand = ffmpegCommand.size("1280x720");
        break;
      default:
        console.error("Invalid video quality:", quality);
        reject(new Error("Invalid quality"));
        return;
    }

    const outputStream = new PassThrough();
    ffmpegCommand
      .pipe(outputStream, { end: true })
      .on("end", () => {
        console.log(`Transcoding completed for quality: ${quality}`);
        const chunks: Buffer[] = [];
        outputStream.on("data", (chunk) => chunks.push(chunk));
        outputStream.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", (error) => {
        console.error(`Error during transcoding for quality ${quality}:`, error);
      });
  });
}



async function Start() {
  try {
    const client = await createClient();
    client.connect();
    console.log("Connected to the redis sucessfully");
    while (true) {
      const data = await client.brPop("data", 0);
      if (data) {
        handleTranscodeVideo(data);
      }
    }
  } catch (error) {
    console.log("Error in connecting with redis queue");
  }
}

Start();
