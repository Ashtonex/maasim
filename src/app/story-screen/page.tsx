import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Play, Sparkles, Tv, Video } from 'lucide-react'
import { getYouTubeEmbedUrl, getYouTubeThumbnail, youtubeVideos } from '@/data/youtubeVideos'

export const dynamic = 'force-dynamic'

export default function StoryScreenPage() {
  const featuredVideo = youtubeVideos[0]
  const featuredEmbedUrl = getYouTubeEmbedUrl(featuredVideo.youtubeUrl)

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans selection:bg-maasim-cyan selection:text-black pb-20 overflow-x-hidden">
      <nav className="sticky top-4 z-40 px-4 pt-4">
        <div className="bg-white/90 backdrop-blur-md border-4 border-black rounded-full px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between max-w-6xl mx-auto gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-black text-white p-2 rounded-full group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={20} strokeWidth={3} />
            </div>
            <span className="font-black text-lg hidden sm:block">Back to Home</span>
          </Link>

          <Link
            href="/#bookshelf"
            className="bg-maasim-yellow text-black px-5 py-2 rounded-full font-black border-2 border-black shadow-[4px_4px_0px_0px_#D81B60] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#D81B60] transition-all active:scale-95"
          >
            Browse Books
          </Link>
        </div>
      </nav>

      <main className="px-6 pt-10">
        <section className="max-w-6xl mx-auto relative">
          <div className="absolute -top-10 left-[-10px] w-24 h-24 rounded-full bg-maasim-cyan/30 border-4 border-black blur-sm" />
          <div className="absolute right-0 top-20 w-28 h-28 rounded-full bg-maasim-pink/30 border-4 border-black blur-sm" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-maasim-lime px-5 py-2 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_#D81B60] mb-7 -rotate-2">
                <Tv className="w-5 h-5 text-black" />
                <span className="font-black text-black tracking-wide">STORY SCREEN</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] mb-7">
                Press Play on
                <br />
                <span className="text-maasim-magenta relative inline-block">
                  Story Magic
                  <svg className="absolute -bottom-4 left-0 w-full h-4 text-maasim-cyan" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-800 font-bold max-w-2xl leading-relaxed mb-8">
                A playful video shelf for sing-alongs, story moments, and little bursts of creativity from the Maasim world.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#video-library"
                  className="group inline-flex items-center justify-center bg-black text-white text-lg px-8 py-4 rounded-3xl font-black shadow-[8px_8px_0px_0px_#C6FF00] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#C6FF00] transition-all active:scale-95"
                >
                  Watch the Library
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                </a>
                <Link
                  href={featuredVideo.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-white text-black text-lg px-8 py-4 rounded-3xl font-black border-4 border-black shadow-[6px_6px_0px_0px_#00BCD4] hover:-translate-y-1 transition-all"
                >
                  <Play size={20} fill="black" />
                  Open on YouTube
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-maasim-yellow rounded-[2rem] border-4 border-black rotate-2" />
              <div className="relative overflow-hidden rounded-[2rem] border-4 border-black bg-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] aspect-video">
                {featuredEmbedUrl ? (
                  <iframe
                    className="h-full w-full"
                    src={featuredEmbedUrl}
                    title={featuredVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section id="video-library" className="max-w-6xl mx-auto mt-24">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_#00BCD4] mb-5">
              <Sparkles size={18} className="text-black" />
              <span className="font-black text-sm tracking-[0.2em] text-slate-900">CHANNEL PICKS</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">The Video Library</h2>
            <p className="text-lg md:text-xl font-bold text-slate-700 max-w-3xl mx-auto">
              A cheerful row of featured uploads ready for the homepage audience and easy to expand as the channel grows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {youtubeVideos.map((video, index) => {
              const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl)
              const thumbnail = getYouTubeThumbnail(video.youtubeUrl)
              const accentClasses = [
                'shadow-[8px_8px_0px_0px_#00BCD4]',
                'shadow-[8px_8px_0px_0px_#D81B60]',
                'shadow-[8px_8px_0px_0px_#C6FF00]',
              ]

              return (
                <article
                  key={video.id}
                  className={`bg-white rounded-[2rem] border-4 border-black p-4 md:p-5 ${accentClasses[index % accentClasses.length]} ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 hover:-translate-y-2 transition-all`}
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="inline-flex items-center gap-2 bg-maasim-yellow px-3 py-1 rounded-full border-2 border-black text-xs font-black uppercase tracking-wider">
                      <Video size={14} />
                      {video.tag}
                    </span>
                    <span className="font-black text-slate-500 text-sm">{video.duration}</span>
                  </div>

                  <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border-4 border-black bg-slate-100 mb-5">
                    {embedUrl ? (
                      <iframe
                        className="h-full w-full"
                        src={embedUrl}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : thumbnail ? (
                      <Image src={thumbnail} alt={video.title} fill className="object-cover" />
                    ) : null}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-3">{video.title}</h3>
                  <p className="text-slate-700 font-bold leading-relaxed mb-5 min-h-20">{video.description}</p>

                  <Link
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-3 w-full bg-black text-white py-4 rounded-2xl font-black border-2 border-black hover:bg-slate-900 transition-colors"
                  >
                    Watch on YouTube
                    <ArrowRight size={18} strokeWidth={3} />
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
