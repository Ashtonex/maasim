export type YouTubeVideo = {
  id: string
  title: string
  description: string
  youtubeUrl: string
  duration: string
  tag: string
}

export const youtubeVideos: YouTubeVideo[] = [
  {
    id: 'story-time-spark',
    title: 'Story Time Spark',
    description: 'A bright, story-led feature video to welcome families into the world of Maasim Creatives.',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    duration: '3 min',
    tag: 'Featured',
  },
  {
    id: 'giggle-corner',
    title: 'Giggle Corner',
    description: 'A playful watch-along video that keeps the energy fun and light for young readers.',
    youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    duration: '2 min',
    tag: 'Watch Along',
  },
  {
    id: 'creative-club',
    title: 'Creative Club',
    description: 'A behind-the-scenes style clip for crafts, imagination, and story-inspired activities.',
    youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    duration: '1 min',
    tag: 'Behind The Scenes',
  },
]

export function getYouTubeVideoId(url: string) {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#/]+)/,
    /embed\/([^?&#/]+)/,
    /shorts\/([^?&#/]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

export function getYouTubeEmbedUrl(url: string, options?: { autoplay?: boolean; loop?: boolean; muted?: boolean }) {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })

  if (options?.autoplay) params.set('autoplay', '1')
  if (options?.muted) params.set('mute', '1')
  if (options?.loop) {
    params.set('loop', '1')
    params.set('playlist', videoId)
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
}

export function getYouTubeThumbnail(url: string) {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null

  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}
