import { CTAContent } from '@/lib/types'
import Link from 'next/link'

interface CTASectionProps {
  content: CTAContent
}

export function CTASection({ content }: CTASectionProps) {
  return (
    <section className="relative w-full py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8">
      {/* Background Image */}
      {content.backgroundImage && (
        <div
          className="absolute inset-0 opacity-30 rounded-lg"
          style={{
            backgroundImage: `url(${content.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {content.headline}
        </h2>

        <p className="text-lg text-gray-600 mb-8 md:mb-12">
          {content.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={content.primaryButton.url}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            {content.primaryButton.text}
          </Link>

          {content.secondaryButton && (
            <Link
              href={content.secondaryButton.url}
              className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg transition-all"
            >
              {content.secondaryButton.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
