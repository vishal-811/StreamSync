
import React, { useState, useCallback } from 'react'
import { Upload, Video, ImageIcon, X, CheckCircle, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const VideoUploadPage : React.FC= () => {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [dragActive, setDragActive] = useState({
    video: false,
    thumbnail: false,
  })
  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    thumbnail: 0,
  })
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const [videoUrl, setVideoUrl] = useState<string>()

  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent, type: 'video' | 'thumbnail', active: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive((prev) => ({ ...prev, [type]: active }))
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, type: 'video' | 'thumbnail') => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive((prev) => ({ ...prev, [type]: false }))

    const file = e.dataTransfer.files[0]
    if (type === 'video' && file.type.startsWith('video/')) {
      setVideoFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    } else if (type === 'thumbnail' && file.type.startsWith('image/')) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }, [])

  const handleFileChange = useCallback((type: 'video' | 'thumbnail') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === 'video') {
        setVideoFile(file)
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        setThumbnailFile(file)
        setThumbnailPreview(URL.createObjectURL(file))
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
  
    try {
      const response = await axios.post(
        "http://localhost:3000/api/videos/upload",
        { title, description },
        { withCredentials: true }
      );
  
      if (response.status === 201) {
        const { preSignedUrl, videoId } = response.data;
  
        if (videoFile) {
          const arrayBuffer = await videoFile.arrayBuffer();
  
          const s3Response = await axios.put(preSignedUrl, arrayBuffer, {
            headers: { "Content-Type": videoFile.type },
          });
  

          const videoUrl = s3Response.config.url?.split("?")[0];
          console.log("THe video url looks like ",videoUrl);
  
          setVideoUrl(videoUrl)

          const updateResponse = await axios.put(
            "http://localhost:3000/api/videos/update",
            { videoId, video_url: videoUrl },
            { withCredentials: true }
          );
  
          if (updateResponse.status === 201) {
            navigate('/uservideos');
          }
        }
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setUploading(false);
    }
      // Reset form
      setVideoFile(null)
      setThumbnailFile(null)
      setTitle('')
      setDescription('')
      setPreviewUrl('')
      setThumbnailPreview('')
      setUploadProgress({ video: 0, thumbnail: 0 })
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272711_1px,transparent_1px),linear-gradient(to_bottom,#27272711_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-4xl mx-auto"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-orange-500 mb-2 tracking-tight">
          Upload Your Masterpiece
        </h1>
        <p className="text-zinc-400 text-center mb-4 md:mb-8  text-lg sm:text-xl font-medium">
          Upload and Watch Videos With your Friends
        </p>

        <Card className="bg-zinc-900/50 shadow-2xl backdrop-blur-sm border border-zinc-800/50">
          <CardContent className="p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Video Upload Section */}
                <div
                  className={`space-y-2 sm:space-y-4 ${
                    dragActive.video ? 'ring-2 ring-orange-500' : ''
                  }`}
                  onDragOver={(e) => handleDrag(e, 'video', true)}
                  onDragLeave={(e) => handleDrag(e, 'video', false)}
                  onDrop={(e) => handleDrop(e, 'video')}
                >
                  <Label className="text-lg sm:text-xl font-semibold text-zinc-300 mb-2 block">
                    Video File
                  </Label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center h-56 sm:h-72 flex flex-col justify-center items-center transition-colors duration-300
                      ${
                        dragActive.video
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                  >
                    {!videoFile ? (
                      <div className="space-y-2 sm:space-y-4">
                        <Video className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-orange-500" />
                        <div>
                          <Label
                            htmlFor="video-upload"
                            className="cursor-pointer bg-orange-500 text-zinc-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg inline-block text-sm sm:text-base"
                          >
                            Choose Video
                          </Label>
                          <Input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleFileChange('video')}
                          />
                          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-400">
                            or drag and drop your video file
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-4">
                        <video
                          className="mx-auto max-h-32 sm:max-h-40 rounded-lg shadow-lg"
                          controls
                          src={previewUrl}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setVideoFile(null)
                            setPreviewUrl('')
                          }}
                          className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 text-sm sm:text-base"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove Video
                        </Button>
                      </div>
                    )}
                  </motion.div>
                  {uploadProgress.video > 0 && (
                    <div className="mt-2">
                      <Progress value={uploadProgress.video} className="w-full bg-zinc-700" />
                      <p className="text-sm text-zinc-400 mt-1">{uploadProgress.video}% uploaded</p>
                    </div>
                  )}
                </div>

                {/* Thumbnail Upload Section */}
                <div
                  className={`space-y-2 sm:space-y-4 ${
                    dragActive.thumbnail ? 'ring-2 ring-orange-500' : ''
                  }`}
                  onDragOver={(e) => handleDrag(e, 'thumbnail', true)}
                  onDragLeave={(e) => handleDrag(e, 'thumbnail', false)}
                  onDrop={(e) => handleDrop(e, 'thumbnail')}
                >
                  <Label className="text-lg sm:text-xl font-semibold text-zinc-300 mb-2 block">
                    Thumbnail
                  </Label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center h-56 sm:h-72 flex flex-col justify-center items-center transition-colors duration-300
                      ${
                        dragActive.thumbnail
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                  >
                    {!thumbnailFile ? (
                      <div className="space-y-2 sm:space-y-4">
                        <ImageIcon className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-orange-500" />
                        <div>
                          <Label
                            htmlFor="thumbnail-upload"
                            className="cursor-pointer bg-orange-500 text-zinc-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg inline-block text-sm sm:text-base"
                          >
                            Choose Thumbnail
                          </Label>
                          <Input
                            id="thumbnail-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange('thumbnail')}
                          />
                          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-400">
                            or drag and drop your image file
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-4">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="mx-auto max-h-32 sm:max-h-40 rounded-lg shadow-lg object-contain"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setThumbnailFile(null)
                            setThumbnailPreview('')
                          }}
                          className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 text-sm sm:text-base"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove Thumbnail
                        </Button>
                      </div>
                    )}
                  </motion.div>
                  {uploadProgress.thumbnail > 0 && (
                    <div className="mt-2">
                      <Progress value={uploadProgress.thumbnail} className="w-full bg-zinc-700" />
                      <p className="text-sm text-zinc-400 mt-1">{uploadProgress.thumbnail}% uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <Label
                    htmlFor="title"
                    className="text-lg sm:text-xl font-semibold text-zinc-300 mb-2 block"
                  >
                    Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800/50 text-zinc-100 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500/50 focus:ring-opacity-50 transition-all duration-300 hover:bg-zinc-800"
                    placeholder="Enter an engaging title"
                    required
                  />
                  {title && (
                    <CheckCircle
                      className="absolute right-3 top-12 text-orange-500"
                      size={20}
                    />
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="description"
                    className="text-lg sm:text-xl font-semibold text-zinc-300 mb-2 block"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800/50 text-zinc-100 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500/50 focus:ring-opacity-50 transition-all duration-300 hover:bg-zinc-800"
                    rows={4}
                    placeholder="Tell viewers about your video"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!videoFile || !title || uploading}
                className={`w-full py-4 sm:py-5 px-6 sm:px-8 rounded-lg text-zinc-900 font-semibold transition-all duration-300 text-base sm:text-lg ${
                  !videoFile || !title || uploading
                    ? 'bg-zinc-700 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-4 border-zinc-900 border-t-orange-500"></div>
                    <span>Uploading your masterpiece...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span>Share Your Creation</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-zinc-900 p-6 rounded-lg shadow-lg flex items-center space-x-4 border border-orange-500">
              <Sparkles className="text-orange-500 h-8 w-8" />
              <p className="text-xl font-semibold text-zinc-100">Upload Successful!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VideoUploadPage

