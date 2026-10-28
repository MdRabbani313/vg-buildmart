import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  MapPin, 
  Truck, 
  AlertCircle,
  ShieldCheck 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const { cart, updateCartQuantity, removeFromCart, getCartSummary, selectedAddress } = useApp();

  if (!isOpen) return null;

  const summary = getCartSummary();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                <ShoppingCart className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-black">Material Procurement Cart</h3>
                <p className="text-xs text-slate-400">{summary.itemCount} Units Selected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Site Destination Banner */}
          <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-bold truncate">Site: {selectedAddress.siteName}</span>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold">{selectedAddress.city}</span>
          </div>

          {/* Cart Item List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <ShoppingCart className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">Your material cart is empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Select cement bags, TMT rebars, or stone aggregates from our catalog to build your order.
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const itemTotal = item.selectedPricePerUnit * item.quantity;
                return (
                  <div
                    key={item.product.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                          {item.product.brand} • {item.product.grade}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Supplier: {item.product.supplierName}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Remove material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                      {/* Qty modifier */}
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - (item.product.unit === 'bag' ? 50 : 1))}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold text-slate-900 min-w-16 text-center">
                          {item.quantity} {item.product.unit}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + (item.product.unit === 'bag' ? 50 : 1))}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          @ ₹{item.selectedPricePerUnit.toLocaleString('en-IN')}/{item.product.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 bg-slate-900 text-white border-t border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Materials Subtotal:</span>
                  <span className="font-bold text-white">₹{summary.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Applicable GST (Calculated Item-wise):</span>
                  <span className="font-bold text-amber-400">+₹{summary.gstTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    Estimated Direct Freight:
                  </span>
                  <span className="font-bold text-white">+₹{summary.deliveryFee.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <div>
                  <span className="text-xs text-slate-400 block">Total Payable (All-Inclusive):</span>
                  <span className="text-xl font-black text-amber-400">
                    ₹{summary.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-amber-500/20 mt-3"
              >
                <span>Proceed to Order Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                GST e-Invoicing & Weighment Slips Guaranteed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
