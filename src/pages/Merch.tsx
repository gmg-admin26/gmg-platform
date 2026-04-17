import { Link } from 'react-router-dom';
import { ShoppingBag, Shirt, Package, Store, TrendingUp, ArrowRight } from 'lucide-react';

export default function Merch() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-black to-rose-900/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-8 backdrop-blur-sm">
            <span className="text-pink-400 text-sm font-medium">Merchandise & Products</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Merchandise, Apparel,<br />and Consumer Products</h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            GMG helps artists expand into merchandise, apparel, and product businesses.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-xl shadow-pink-500/40"
          >
            Explore Merch
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Product Showcase</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From apparel to accessories, build a complete product line for your fans
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-32">
            {[
              { name: 'Artist Apparel', category: 'Premium T-Shirts & Hoodies' },
              { name: 'Limited Edition', category: 'Exclusive Drops' },
              { name: 'Accessories', category: 'Hats, Bags & More' },
            ].map((product, i) => (
              <div key={i} className="group relative h-80 bg-gradient-to-br from-pink-950/30 to-rose-950/30 rounded-2xl border border-pink-500/30 overflow-hidden hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(236,72,153,0.1)_50%,transparent_75%)]"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <ShoppingBag className="w-6 h-6 text-pink-400 mb-2" />
                  <div className="text-xl font-bold text-white mb-1">{product.name}</div>
                  <div className="text-sm text-gray-400">{product.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShoppingBag className="w-10 h-10" />}
              title="Merchandise Strategy"
              description="Strategic planning to identify the best merchandise opportunities for your brand."
            />
            <FeatureCard
              icon={<Shirt className="w-10 h-10" />}
              title="Apparel Development"
              description="Design and production of high-quality apparel that resonates with your audience."
            />
            <FeatureCard
              icon={<Store className="w-10 h-10" />}
              title="E-Commerce Systems"
              description="Complete e-commerce infrastructure to sell directly to fans."
            />
            <FeatureCard
              icon={<Package className="w-10 h-10" />}
              title="Product Expansion"
              description="Explore new product categories and revenue opportunities beyond traditional merch."
            />
            <FeatureCard
              icon={<TrendingUp className="w-10 h-10" />}
              title="Retail Opportunities"
              description="Connect with retail partners and expand distribution channels."
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">Turn Fans Into Customers</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Merchandise isn't just about t-shirts anymore. Build a complete product ecosystem that deepens fan connections and creates sustainable revenue.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-semibold text-lg transition-all hover:scale-105"
          >
            Partner With Us
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-pink-500 transition-all hover:scale-105">
      <div className="text-pink-400 mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
