import VideoPlayerComponent from '@/components/videoPlayerComponent'

export default function VideoPlayer() {
  // Replace this with your actual S3 presigned URL
//   const videoSrc = "https://your-s3-bucket.s3.amazonaws.com/your-video.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...";

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col items-center justify-center p-4">
      <VideoPlayerComponent src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" poster="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D" />
    </main>
  )
}

