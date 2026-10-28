import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  CreditCard, 
  Building2, 
  Truck, 
  ShieldCheck, 
  FileCheck,
  AlertTriangle 
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { 
    customer, 
    cart, 
    getCartSummary, 
    selectedAddress, 
    setSelectedAddress, 
    placeOrder 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const summary = getCartSummary();
  const availableCredit = customer.creditLimit - customer.creditUsed;
  const isCreditInsufficient = paymentMethod === 'credit_line' && summary.total > availableCredit;

  const handleConfirmOrder = () => {
    if (isCreditInsufficient) {
      alert('Order value exceeds currently available builder credit limit.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const order = placeOrder(paymentMethod);
      setIsProcessing(false);
      onClose();
      onOrderSuccess(order);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Procurement Confirmation
            </span>
            <h3 className="text-lg font-black text-white">Order Checkout & Commercial Terms</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          {/* Buyer & GSTIN Identity Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Purchasing Entity</span>
              <p className="font-extrabold text-slate-900 text-sm">{customer.companyName}</p>
              <p className="text-slate-600 font-medium">{customer.name} • {customer.customerType}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Registered GSTIN</span>
              <p className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded mt-0.5">
                {customer.gstin}
              </p>
            </div>
          </div>

          {/* Site Destination Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              Delivery Construction Site Location
            </label>
            <div className="space-y-2">
              {customer.addresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{addr.siteName}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{addr.address}, {addr.city} - {addr.pincode}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Site Incharge: {addr.contactPerson} ({addr.contactMobile})</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-500" />
              Select Payment & Commercial Settlement Terms
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Razorpay Online */}
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Instant Online Gateway</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">Instant</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  UPI, Corporate Net Banking, NEFT Virtual Account via Razorpay
                </p>
              </div>

              {/* Bank NEFT / RTGS */}
              <div
                onClick={() => setPaymentMethod('neft_rtgs')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'neft_rtgs'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Bank RTGS / NEFT Direct</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">Escrow</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Direct transfer to VG Buildmart verified settlement account
                </p>
              </div>

              {/* Builder Credit Line */}
              <div
                onClick={() => setPaymentMethod('credit_line')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'credit_line'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">30-Day Builder Credit</span>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">B2B Line</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Available: <strong className="text-emerald-700">₹{availableCredit.toLocaleString('en-IN')}</strong> of ₹{customer.creditLimit.toLocaleString('en-IN')}
                </p>
                {isCreditInsufficient && (
                  <p className="text-[10px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Insufficient credit line
                  </p>
                )}
              </div>

              {/* COD / Inspection */}
              <div
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">On-Site Unloading Inspection</span>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded">Weighment</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Verify weighbridge slips at site prior to payment release
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary & Totals */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-2 text-xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2">
              Billing & Commercial Totals
            </h4>
            <div className="flex justify-between text-slate-300">
              <span>Materials Subtotal ({cart.length} items):</span>
              <span className="font-bold text-white">₹{summary.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>GST Total (18% / 28%):</span>
              <span className="font-bold text-white">+₹{summary.gstTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Direct Site Transport & Unloading:</span>
              <span className="font-bold text-white">+₹{summary.deliveryFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
              <span className="font-black text-sm text-white">All-Inclusive Payable:</span>
              <span className="font-black text-amber-400 text-xl">
                ₹{summary.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Back to Cart
          </button>

          <button
            type="button"
            disabled={isProcessing || isCreditInsufficient}
            onClick={handleConfirmOrder}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
              isProcessing || isCreditInsufficient
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {isProcessing ? (
              <span>Generating PO & Securing Stock...</span>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                <span>Confirm Purchase Order (₹{summary.total.toLocaleString('en-IN')})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
