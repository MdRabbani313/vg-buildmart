import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Send, FileText, Calendar, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';

interface QuoteRequestModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ product, onClose }) => {
  const { customer, selectedAddress, createQuotationRequest, suppliers } = useApp();

  const [quantity, setQuantity] = useState<number>(product ? product.moq * 3 : 500);
  const [targetPrice, setTargetPrice] = useState<number>(product ? Math.round(product.sellingPrice * 0.95) : 360);
  const [deliveryDate, setDeliveryDate] = useState<string>(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [siteLocation, setSiteLocation] = useState<string>(
    `${selectedAddress.siteName}, ${selectedAddress.address}, ${selectedAddress.city}`
  );
  const [paymentTerms, setPaymentTerms] = useState<string>('30-day builder credit terms');
  const [remarks, setRemarks] = useState<string>(
    'Requires batch mill test certificate and certified weighbridge slips upon arrival.'
  );

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createQuotationRequest({
      supplierId: product.supplierId,
      supplierName: product.supplierName,
      siteLocation,
      requiredDeliveryDate: deliveryDate,
      paymentTerms,
      customerRemarks: remarks,
      items: [
        {
          productId: product.id,
          productName: product.name,
          brand: product.brand,
          quantity,
          unit: product.unit,
          targetPrice,
          total: quantity * targetPrice,
        }
      ]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950">
                <FileText className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold">Request Bulk Quotation (RFQ)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Direct negotiation with manufacturer & authorized primary stockyard
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Material highlight */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Selected Material</span>
              <h4 className="text-xs font-bold text-slate-900">{product.name}</h4>
              <span className="text-[11px] text-slate-600">Supplier: {product.supplierName}</span>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg">
              {product.grade}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Requested Quantity ({product.unit})
              </label>
              <input
                type="number"
                min={product.moq}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">MOQ: {product.moq} {product.unit}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Price / {product.unit} (₹)
              </label>
              <input
                type="number"
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Catalog: ₹{product.sellingPrice}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Site Delivery Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Commercial Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              >
                <option value="30-day builder credit terms">30-Day Builder Credit Terms</option>
                <option value="50% advance, 50% on dispatch">50% Advance, 50% on Dispatch</option>
                <option value="100% advance online settlement">100% Advance Online Settlement</option>
                <option value="Letter of Credit (LC) 45 days">Letter of Credit (LC) 45 Days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Destination Construction Site & Unloading Access
            </label>
            <input
              type="text"
              required
              value={siteLocation}
              onChange={(e) => setSiteLocation(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              placeholder="Full site address and vehicle entry access"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Technical Remarks & Quality Conditions
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              placeholder="Any specific batch, cut lengths, or unloading cranes required..."
            />
          </div>

          {/* Value preview */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Estimated Purchase Value:</span>
            <span className="text-slate-900 font-extrabold text-sm">
              ₹{(quantity * targetPrice).toLocaleString('en-IN')} + GST
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit RFQ to Supplier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
