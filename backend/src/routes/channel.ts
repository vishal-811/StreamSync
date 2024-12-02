import Router from "express";
import { z } from "zod";
const router = Router();

import prisma from "../lib/index";
import { authMiddleware } from "../middlewares";

const channelSchema = z.object({
  name: z.string(),
  description: z.string(),
  slug: z.string(), // unique constraints for a channel.
});

router.post("/channels", authMiddleware, async (req, res) => {
  const channelPayload = channelSchema.safeParse(req.body);
  if (!channelPayload.success) {
    res.json({ msg: "Inavlid inputs" });
    return;
  }
  const { name, description, slug } = channelPayload.data;

  try {
    const slugAlreadyExist = await prisma.channel.findFirst({
      where: {
        slug: slug,
      },
    });
    if (slugAlreadyExist) {
      res.status(409).json({ msg: "channel already exist, conflict" });
      return;
    }
    const userId = req.userId;
    console.log(userId);
    if(!userId)return;

    const channel = await prisma.channel.create({
      data: {
        name: name,
        description: description,
        slug: slug,
        userId : parseInt(userId)
      },
    });

    res.status(201).json({ msg: "Channel created successfully", channelId : channel.id });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Internal setrver error" });
    return;
  }
});



router.get("/channels/:slug", authMiddleware, async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.json({ msg: "No slug is provided" });
    return;
  }
  const channelDetails = await prisma.channel.findFirst({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
  if (!channelDetails) {
    res.json({ msg: "No channel exist with this; slug" });
    return;
  }

  const videoDetails = await prisma.video.findMany({
    where: {
      channelId: channelDetails.id, // this will be the channel id
    },
    select: {
      id: true,
      title: true,
      thumbnail_url: true,
    },
  });
  if (!videoDetails) {
    res.status(200).json({ msg: "No videos exist on this channel id" });
  }

  res.status(200).json({
    msg: "Video fetched sucess",
    channel: {
      channelDetails,
      videos: [
        {
          videoDetails,
        },
      ],
    },
  });
});



export default router;
