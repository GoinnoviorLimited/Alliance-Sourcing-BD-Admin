import { HeroContent } from '@/lib/types'
import Link from 'next/link'

interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      {content.backgroundImage && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${content.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
          {content.headline}
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8 md:mb-12 max-w-2xl mx-auto">
          {content.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {content.primaryButton && (
            <Link
              href={content.primaryButton.url}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              {content.primaryButton.text}
            </Link>
          )}

          {content.secondaryButton && (
            <Link
              href={content.secondaryButton.url}
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-3 rounded-lg transition-all"
            >
              {content.secondaryButton.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
