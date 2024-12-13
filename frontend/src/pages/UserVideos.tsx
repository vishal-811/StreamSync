import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Loader2, Upload } from 'lucide-react'
import { VideoCard } from '@/components/videoCard'
import { RecentUploadCard } from '@/components/recentUpload'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navbar'

interface Video {
  id: string;
  thumbnail: string;
  title: string;
  uploadDate: string;
  description: string;
  videoLink: string;
  shareLink: string;
  views: number;
  duration: string;
}

const recentUpload: Video = {
  id: "recent1",
  thumbnail:
    "https://images.unsplash.com/photo-1682686581660-3693f0c588d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  title: "Exploring Hidden Waterfalls",
  uploadDate: new Date().toISOString(),
  description:
    "Join me on an adventure to discover breathtaking hidden waterfalls in the heart of the rainforest. This video showcases the raw beauty of nature and the thrill of exploration.",
  videoLink: "#",
  shareLink: "https://streamsync.com/watch/hidden-waterfalls",
  views: 15420,
  duration: "18:32",
};

const generateRandomVideo = (id: number): Video => {
  const titles = [
    'Urban Photography Tips',
    'Cooking Italian Pasta',
    // 'Beginner's Guide to Yoga',
    'DIY Home Decor Ideas',
    'Travel Vlog: Tokyo',
    'Mastering Guitar Basics',
    'Mindfulness Meditation',
    'Extreme Sports Compilation',
    'Retro Gaming Marathon',
    'Sustainable Living Hacks'
  ]

  const descriptions = [
    'Learn how to capture stunning urban landscapes with these pro tips.',
    'Authentic Italian pasta recipes made easy for home cooks.',
    'Start your yoga journey with these beginner-friendly poses and routines.',
    'Transform your living space with these creative and budget-friendly DIY ideas.',
    'Experience the vibrant culture and hidden gems of Tokyo through our eyes.',
    'Master the fundamentals of guitar playing with easy-to-follow lessons.',
    'Reduce stress and improve focus with guided mindfulness exercises.',
    'Adrenaline-pumping footage of various extreme sports from around the world.',
    'Nostalgic gaming session featuring classic titles from the 80s and 90s.',
    'Simple and effective ways to reduce your carbon footprint and live sustainably.'
  ]

  const randomDate = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
  const randomViews = Math.floor(Math.random() * 100000) + 1000
  const randomDuration = `${Math.floor(Math.random() * 20) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`

  return {
    id: `video${id}`,
    thumbnail: `https://picsum.photos/seed/${id}/640/360`,
    title: titles[id % titles.length],
    uploadDate: randomDate.toISOString(),
    description: descriptions[id % descriptions.length],
    videoLink: '#',
    shareLink: `https://streamsync.com/watch/video${id}`,
    views: randomViews,
    duration: randomDuration
  }
}

export default function UserVideos() {
  const [scrolled, setScrolled] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { ref, inView } = useInView({
    threshold: 0,
  })

  

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (inView && !loading && hasMore) {
      loadMoreVideos()
    }
  }, [inView])

  const navigate = useNavigate();

  const loadMoreVideos = async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulating API call with random data generation
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newVideos = Array.from({ length: 6 }, (_, i) => generateRandomVideo((page - 1) * 6 + i))
      setVideos((prevVideos) => [...prevVideos, ...newVideos])
      setPage((prevPage) => prevPage + 1)
      setHasMore(page < 5) // Limit to 5 pages for this example
    } catch (err) {
      setError('An error occurred while fetching videos. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative antialiased">

      <div className="fixed inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 pointer-events-none" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272711_1px,transparent_1px),linear-gradient(to_bottom,#27272711_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />
     <Navbar/>
     
      {/* Main content */}
      <main className="relative pt-32 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-zinc-100 mb-4">My Videos</h1>
            <p className="text-zinc-400 text-lg">Manage and view all your uploaded content in one place.</p>
          </motion.div>

          {/* Recent upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-zinc-200 mb-6">Recent Upload</h2>
            <RecentUploadCard
              {...recentUpload}
              onShareClick={() => {/* Implement share functionality */ }}
            />
          </motion.div>

          {/* Videos grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-zinc-200 mb-6">All Uploads</h2>
            <div className="grid relative grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <VideoCard {...video} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center mt-8"
            >
              {error}
            </motion.div>
          )}

          {/* Loading indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-8"
            >
              <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
            </motion.div>
          )}

          {/* Infinite scroll trigger */}
          {hasMore && !loading && (
            <div ref={ref} className="h-20" />
          )}

          {/* No more videos message */}
          {!hasMore && videos.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-400 text-center mt-8"
            >
              You've reached the end of your video list.
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

