import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, FileText, CheckCircle2, TrendingDown, Layers, MapPin, Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onRequestQuote: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct, onRequestQuote }) => {
  const { addToCart } = useApp();
  const [selectedQty, setSelectedQty] = useState<number>(product.moq);

  // Compute tier price based on selectedQty
  const computeUnitPrice = (qty: number): number => {
    if (!product.bulkSlabs || product.bulkSlabs.length === 0) return product.sellingPrice;
    const slab = [...product.bulkSlabs]
      .sort((a, b) => b.minQty - a.minQty)
      .find(s => qty >= s.minQty);
    return slab ? slab.pricePerUnit : product.sellingPrice;
  };

  const activeUnitPrice = computeUnitPrice(selectedQty);
  const baseUnitPrice = product.sellingPrice;
  const isDiscounted = activeUnitPrice < baseUnitPrice;
  const discountPercent = isDiscounted
    ? Math.round(((baseUnitPrice - activeUnitPrice) / baseUnitPrice) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(product, selectedQty);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Product Image & Badges */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
        
        {/* Category tag */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10">
            {product.category.replace('_', ' ')}
          </span>
          <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-md">
            {product.grade}
          </span>
        </div>

        {/* Stock / Location status */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="flex items-center gap-1 text-[11px] font-medium drop-shadow-sm text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {product.location}
          </span>
          <span className="text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {product.stockQuantity.toLocaleString()} {product.unit}s Available
          </span>
        </div>
      </div>

      {/* Body details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold text-slate-700">{product.brand}</span>
            <span>GST: {product.gstRate}%</span>
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Bulk Tier Slabs preview */}
          <div className="mt-3 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1 text-slate-800">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                Bulk Tier Pricing
              </span>
              <span className="text-[10px] text-slate-500">MOQ: {product.moq} {product.unit}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              {product.bulkSlabs.map((slab, idx) => {
                const isActive = selectedQty >= slab.minQty && (!slab.maxQty || selectedQty <= slab.maxQty);
                return (
                  <div
                    key={idx}
                    className={`py-1 px-1.5 rounded-lg border text-[10px] transition-colors ${
                      isActive
                        ? 'border-amber-500 bg-amber-50 font-bold text-amber-900'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <div>{slab.minQty}{slab.maxQty ? `-${slab.maxQty}` : '+'} {product.unit}</div>
                    <div className="text-slate-900 font-extrabold mt-0.5">₹{slab.pricePerUnit.toLocaleString('en-IN')}</div>
                    {slab.discountPercent > 0 && (
                      <div className="text-emerald-600 font-semibold">{slab.discountPercent}% OFF</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing & Order controls */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-xs text-slate-500">Effective Unit Price:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">
                  ₹{activeUnitPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-medium">/{product.unit}</span>
                {isDiscounted && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{baseUnitPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {isDiscounted && (
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                <TrendingDown className="w-3.5 h-3.5" />
                {discountPercent}% SAVED
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-600">Qty ({product.unit}):</span>
            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden flex-1 bg-white">
              <button
                type="button"
                onClick={() => setSelectedQty(Math.max(product.moq, selectedQty - (product.unit === 'bag' ? 50 : 5)))}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min={product.moq}
                step={product.unit === 'bag' ? 50 : 1}
                value={selectedQty}
                onChange={(e) => setSelectedQty(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                className="w-full text-center text-xs font-bold text-slate-900 py-1.5 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSelectedQty(selectedQty + (product.unit === 'bag' ? 50 : 5))}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => onRequestQuote(product)}
              className="flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold py-2 px-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Request Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
