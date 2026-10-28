import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShoppingCart, 
  FileText, 
  ShieldCheck, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Calculator, 
  Layers, 
  TrendingDown 
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onRequestQuote: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onRequestQuote }) => {
  const { addToCart } = useApp();
  const [calcQty, setCalcQty] = useState<number>(product ? product.moq * 2 : 100);

  if (!product) return null;

  // Compute unit price
  const computeUnitPrice = (qty: number): number => {
    if (!product.bulkSlabs || product.bulkSlabs.length === 0) return product.sellingPrice;
    const slab = [...product.bulkSlabs]
      .sort((a, b) => b.minQty - a.minQty)
      .find(s => qty >= s.minQty);
    return slab ? slab.pricePerUnit : product.sellingPrice;
  };

  const unitPrice = computeUnitPrice(calcQty);
  const basePrice = product.sellingPrice;
  const subtotal = unitPrice * calcQty;
  const gstAmount = (subtotal * product.gstRate) / 100;
  const total = subtotal + gstAmount;
  const totalSavings = (basePrice - unitPrice) * calcQty;

  const handleAddToCart = () => {
    addToCart(product, calcQty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
              {product.category.replace('_', ' ')}
            </span>
            <span className="text-sm font-bold text-slate-800">{product.brand} • {product.grade}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Top row: Image & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="relative rounded-2xl overflow-hidden shadow-md bg-slate-100 aspect-4/3">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-400 font-bold text-xs px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>BIS Certified & Mill Tested</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md text-white p-2.5 rounded-xl text-xs flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  {product.supplierName} ({product.location})
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Price slab table */}
              <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  Tiered Bulk Pricing Schedule
                </h4>
                <div className="space-y-2">
                  {product.bulkSlabs.map((slab, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                        calcQty >= slab.minQty && (!slab.maxQty || calcQty <= slab.maxQty)
                          ? 'bg-amber-100/70 border border-amber-300 font-bold text-slate-900'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>
                        Tier {i + 1}: {slab.minQty} {slab.maxQty ? `to ${slab.maxQty}` : '+'} {product.unit}s
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">
                          ₹{slab.pricePerUnit.toLocaleString('en-IN')}/{product.unit}
                        </span>
                        {slab.discountPercent > 0 && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {slab.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick specs */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block">Minimum Order Quantity</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{product.moq} {product.unit}s</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block">Current Available Stock</span>
                  <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{product.stockQuantity.toLocaleString()} {product.unit}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Technical Specifications & Compliance Data
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">{key}</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Project Bulk Cost Calculator */}
          <div className="border-t border-slate-200 pt-6 bg-slate-900 text-white p-6 sm:p-7 rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-base font-bold flex items-center gap-2 text-white">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  Site Procurement Cost Estimator
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Input your construction site requirement to calculate tiered rates, GST, and savings.
                </p>
              </div>

              {totalSavings > 0 && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  You Save ₹{Math.round(totalSavings).toLocaleString('en-IN')} on this volume!
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Slider & Quantity control */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-300">Target Quantity ({product.unit}s):</span>
                    <span className="text-amber-400 font-extrabold text-sm">{calcQty.toLocaleString()} {product.unit}s</span>
                  </div>
                  <input
                    type="range"
                    min={product.moq}
                    max={product.unit === 'bag' ? 5000 : 100}
                    step={product.unit === 'bag' ? 50 : 1}
                    value={calcQty}
                    onChange={(e) => setCalcQty(parseInt(e.target.value) || product.moq)}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>MOQ: {product.moq}</span>
                    <span>50% Stock</span>
                    <span>Max {product.unit === 'bag' ? '5,000' : '100'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Direct input:</span>
                  <input
                    type="number"
                    min={product.moq}
                    value={calcQty}
                    onChange={(e) => setCalcQty(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                    className="bg-slate-800 border border-slate-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg w-28 text-center"
                  />
                  <span className="text-xs text-slate-400">{product.unit}s</span>
                </div>
              </div>

              {/* Price Breakdown card */}
              <div className="md:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Unit Rate Applied:</span>
                  <span className="font-bold text-white">₹{unitPrice.toLocaleString('en-IN')}/{product.unit}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Material Subtotal:</span>
                  <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>GST ({product.gstRate}%):</span>
                  <span className="font-bold text-amber-400">+₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between items-baseline">
                  <span className="font-bold text-white text-sm">Estimated Total:</span>
                  <span className="font-black text-amber-400 text-lg">₹{Math.round(total).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestQuote(product);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-600 hover:border-slate-500 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Request Custom Bulk RFQ</span>
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-500/20"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add {calcQty} {product.unit}s to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
