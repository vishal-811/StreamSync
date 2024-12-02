import { Router } from "express";
import { string, z } from "zod";
import prisma from "../lib";
import { VideoProcessStatus } from "@prisma/client";
import { authMiddleware } from "../middlewares";
import { bucket,  postPreSignedUrl } from "../lib/aws";
import { client } from "..";
const router = Router();

const uploadSchema = z.object({
  title: z.string(),
  description : z.optional(string()),
  // qualities: z.array(string()),
  // thumbnail_url: z.string(),
});

// Implementing pagination
router.get("/feed", async (req, res) => {
  try {
    let currentPage = req.query.page || 1;
    currentPage = parseInt(String(currentPage), 10);
    const perPage = 20;
    let take = currentPage * perPage;
    const skip = (currentPage - 1) * perPage;

    const videoDetails = await prisma.video.findMany({
      skip: skip,
      take: take,
    });
    res
      .status(200)
      .json({ msg: "Video fetched sucessfully", videos: videoDetails });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
    return;
  }
});


router.post("/upload", authMiddleware, async (req, res) => {

  console.log(req.body)
  const uploadPayload = uploadSchema.safeParse(req.body);
  if (!uploadPayload.success) {
    res.json({
      msg: "Invalid inputs",
    });
    return;
  }

  const userId = req.userId;
  if (!userId) return;
  try {
    const channelId = await prisma.channel.findFirst({
      where: {
        userId: parseInt(userId),
      },
      select: {
        id: true,
      },
    });
    // if (!channelId) {
    //   res.json({ msg: "Please create a channel" });
    //   return;
    // }
    const { title, description } = uploadPayload.data;
    
    const url = await postPreSignedUrl(title);

    const uploadVideo = await prisma.video.create({
      data: {
        title: title,
        description : description,
        processing_status: VideoProcessStatus.preprocessing,
        thumbnail_url: "",
        created_at: new Date(),
        creatorId: parseInt(userId),
        // channelId: channelId.id,
        channelId :1
      },
    });
    res
      .status(201)
      .json({ msg: "success", preSignedUrl : url, videoId  : uploadVideo.id});
    return;

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
    return;
  }
});

// Update Router.
router.put('/update', authMiddleware, async(req,res)=>{
   const payload = req.body;
   console.log(payload)
   if(!payload.videoId){
    res.json({msg :"Please provide a videoId"});
    return;
   }

   try {
    const isVideoExist = await prisma.video.findFirst({
      where:{
         id : payload.videoId
      }
  });
  if(!isVideoExist){
   res.json({msg :"No video exist with this video ID"});
   return;
  }

  const videoDetails = await prisma.video.update({
      where:{
        id : payload.videoId
      },
      data :{
         video_url : payload.video_url,
         processing_status : VideoProcessStatus.uploaded
      }
  })
  // send the data to the prisma queue.
  client.lPush('data',JSON.stringify({bucket_name : bucket, file_name : `uploads/raw/${videoDetails.title}`}));
  console.log("Data sent successfully to the queue");
  res.status(201).json({msg :"Video uploaded Sucessfully", videoDetails : videoDetails});
  return;
   } catch (error) {
    res.status(500).json({msg :"Internal server Error"});
    return;
   }
})


router.get("/:video_id", authMiddleware, async (req, res) => {
  const video_id = req.params.video_id;
  if (!video_id) {
    res.json({ msg: "Please provide a specific video id" });
    return;
  }

  const videDetails = await prisma.video.findFirst({
    where: {
      id: parseInt(video_id),
    },
    select: {
      id: true,
      title: true,
      thumbnail_url: true,
      creatorId: true,
    },
  });
  if (!videDetails) {
    res.json({ msg: "No video exist with this videoId" });
    return;
  }

  const username = await prisma.user.findFirst({
    where: {
      id: videDetails.creatorId,
    },
    select: {
      username: true,
    },
  });
  if (!username) {
    res.json({ msg: "No user has this video, something went wrong" });
    return;
  }

  res.status(200).json({
    msg: "Video fetched sucessfully",
    videoDetails: {
      videDetails,
      username,
    },
  });
});

export default router;
