import { createClient } from "redis";
import { getDatafromS3, uploadToS3 } from "./lib/aws";
import { PassThrough, Readable } from "stream";
import ffmpeg from 'fluent-ffmpeg';

async function handleTranscodeVideo(data: any) {
  const { bucket_name, file_name } = JSON.parse(data?.element);
  const qualities = ["360p", "480p", "720p"];

  try {
    const transcodePromises = qualities.map(async (quality) => {
      const rawVideo = await getDatafromS3(bucket_name, file_name);
      const outputStream = await TranscodeVideo(rawVideo, quality);
      const transcodedFileName = `${file_name.split('.')[0]}_${quality}`;
      await uploadToS3(bucket_name, transcodedFileName, outputStream, quality);
    });

    await Promise.all(transcodePromises);
    console.log("All transcoding completed successfully");
  } catch (error) {
    console.error("Error in handleTranscodeVideo:", error);
    throw error;
  }
}

async function TranscodeVideo(inputStream: Readable, quality: string): Promise<PassThrough> {
  return new Promise((resolve, reject) => {
    const outputStream = new PassThrough();
    
    let ffmpegCommand = ffmpeg(inputStream)
      .outputFormat('mp4')
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-movflags frag_keyframe+empty_moov+default_base_moof',
        '-preset ultrafast'
      ]);

    switch (quality) {
      case "360p":
        ffmpegCommand.size("640x360").videoBitrate('800k');
        break;
      case "480p":
        ffmpegCommand.size("854x480").videoBitrate('1500k');
        break;
      case "720p":
        ffmpegCommand.size("1280x720").videoBitrate('2500k');
        break;
      default:
        reject(new Error(`Invalid quality: ${quality}`));
        return;
    }

    ffmpegCommand
      .on("error", (err, stdout, stderr) => {
        console.error(`FFmpeg error for ${quality}:`, stderr);
        outputStream.destroy(err);
        reject(err);
      })
      .on("end", () => {
        console.log(`Transcoding completed for quality: ${quality}`);
        outputStream.end();
      })
      .pipe(outputStream, { end: true });

    resolve(outputStream);
  });
}

async function Start() {
  try {
    const client = createClient();
    await client.connect();
    console.log("Connected to Redis successfully");
    
    while (true) {
      const data = await client.brPop("data", 0);
      if (data) {
        await handleTranscodeVideo(data);
      }
    }
  } catch (error) {
    console.error("Error in Redis connection:", error);
  }
}

Start();