import { ProductsContent } from '@/lib/types'

interface ProductsSectionProps {
  content: ProductsContent
}

export function ProductsSection({ content }: ProductsSectionProps) {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.categories.map((category, index) => (
            <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-all">
              <div className="text-5xl md:text-6xl mb-6">{category.icon}</div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                {category.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
