import { ServicesContent } from '@/lib/types'

interface ServicesSectionProps {
  content: ServicesContent
}

export function ServicesSection({ content }: ServicesSectionProps) {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            {content.title}
          </h2>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {content.services.map((service, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="text-4xl md:text-5xl">{service.icon}</div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-3 leading-relaxed">{service.description}</p>
                {service.details && service.details.length > 0 && (
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="text-gray-600 text-sm flex items-start">
                        <span className="mr-2">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
