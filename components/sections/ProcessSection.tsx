import { ProcessContent } from '@/lib/types'

interface ProcessSectionProps {
  content: ProcessContent
}

export function ProcessSection({ content }: ProcessSectionProps) {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            {content.title}
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < content.steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gray-200 -translate-x-4" />
              )}

              {/* Step Card */}
              <div className="relative bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="text-4xl md:text-5xl mb-4">{step.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>

                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
