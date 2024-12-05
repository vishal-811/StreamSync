import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Calendar, Share2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'


interface VideoCardProps {
  thumbnail: string
  title: string
  uploadDate: string
  description: string
  videoLink: string
  shareLink: string
}

export function VideoCard({ thumbnail, title, uploadDate, description, videoLink }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <motion.div
      className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-700/50"
      whileHover={{
        scale: 1.03,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative aspect-video">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Play className="text-white w-16 h-16 opacity-75 hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-zinc-100 mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-zinc-500 text-xs mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{format(new Date(uploadDate), "MMM d, yyyy")}</span>
        </div>
        <div className="flex space-x-2">
          <motion.a
            href={videoLink}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-zinc-950 text-center py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Watch Video
            <ExternalLink className="w-4 h-4 ml-1" />
          </motion.a>
              <motion.button
                onClick={() => {
                  navigator.share({
                    title: "Share Your Links with the others.",
                  })
                }}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-center py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Watch Together
                <Share2 className="w-4 h-4 ml-1" />
              </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

