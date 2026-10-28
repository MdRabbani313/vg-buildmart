import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { ProductCard } from './ProductCard';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Truck, 
  Scale, 
  Building2, 
  FileSpreadsheet, 
  Layers,
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';

interface CustomerMarketplaceViewProps {
  onSelectProduct: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
}

export const CustomerMarketplaceView: React.FC<CustomerMarketplaceViewProps> = ({
  onSelectProduct,
  onRequestQuote,
}) => {
  const { products, customer } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'moq'>('featured');

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Materials', icon: '🏗️' },
    { id: 'cement', label: 'Cement (OPC / PPC)', icon: '🧱' },
    { id: 'steel', label: 'TMT Steel (Fe 550D)', icon: '🔩' },
    { id: 'stone', label: 'Basalt Aggregates', icon: '🪨' },
    { id: 'sand_bricks', label: 'M-Sand & Sand', icon: '⏳' },
    { id: 'blocks', label: 'AAC Light Blocks', icon: '🏢' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'price_high') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'moq') return a.moq - b.moq;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Hero Banner with Industrial Palette & Procurement Callouts */}
      <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative p-6 sm:p-10 lg:p-12 z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Direct Mill & Quarry Supply for {customer.companyName}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Procure Bulk Construction Materials with <span className="text-amber-400">Direct Mill Slabs</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Eliminate intermediary markups. Source certified OPC 53 cement, primary Fe550D TMT rebars, and machine-crushed basalt aggregates dispatched straight to your site.
          </p>

          {/* Value Props Strip */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-semibold">100% BIS Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300 font-semibold">Weighbridge Slips</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-slate-300 font-semibold">Site Tipper Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-slate-300 font-semibold">GST Invoicing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cement, steel grade, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500 shadow-sm"
              />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-500 shadow-sm cursor-pointer"
              >
                <option value="featured">Featured Materials</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="moq">Lowest MOQ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> construction materials available for direct dispatch
          </span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Direct Stockyard Rates
          </span>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No materials match your filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or select "All Materials" to see our full inventory.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onRequestQuote={onRequestQuote}
            />
          ))}
        </div>
      )}
    </div>
  );
};
