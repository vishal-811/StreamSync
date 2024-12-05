import { motion } from 'framer-motion'
import { Calendar, ExternalLink, Share2, Play } from 'lucide-react'
import { format } from 'date-fns'

interface RecentUploadCardProps {
  thumbnail: string
  title: string
  uploadDate: string
  description: string
  videoLink: string
  onShareClick: () => void
  views: number
  duration: string
}

export function RecentUploadCard({ 
  thumbnail, 
  title, 
  uploadDate, 
  description, 
  videoLink, 
  views,
  duration
}: RecentUploadCardProps) {


  return (
    <motion.div
      className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-700/50 flex flex-col md:flex-row"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <div className="relative aspect-video md:w-2/5">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Play className="text-white w-16 h-16" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      <div className="p-6 flex flex-col justify-between md:w-3/5">
        <div>
          <h3 className="text-2xl font-bold text-zinc-100 mb-2">{title}</h3>
          <p className="text-zinc-400 text-sm mb-4">{description}</p>
          <div className="flex items-center text-zinc-500 text-xs mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{format(new Date(uploadDate), 'MMM d, yyyy')}</span>
          </div>
          <div className="text-zinc-500 text-xs mb-4">
            {views.toLocaleString()} views
          </div>
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
            onClick={()=>navigator.share({
              title :"Share Your Video with other"
            })}
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
  )
}

