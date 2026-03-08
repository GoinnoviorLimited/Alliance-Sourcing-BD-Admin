import { FooterContent } from '@/lib/types'
import Link from 'next/link'

interface FooterSectionProps {
  content: FooterContent
}

export function FooterSection({ content }: FooterSectionProps) {
  return (
    <footer className="bg-gray-900 text-white w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-700">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-3">{content.companyName}</h3>
            <p className="text-gray-300 leading-relaxed">{content.description}</p>

            {/* Social Links */}
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex gap-4 mt-6">
                {content.socialLinks.map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {social.platform}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {content.links.map((link, idx) => (
                <div key={idx}>
                  <Link
                    href={link.url}
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    {link.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          {content.copyright}
        </div>
      </div>
    </footer>
  )
}
