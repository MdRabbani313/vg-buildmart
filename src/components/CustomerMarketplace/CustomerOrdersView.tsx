import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText, 
  Star, 
  Phone, 
  ChevronRight, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

interface CustomerOrdersViewProps {
  onViewInvoice: (order: Order) => void;
}

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({ onViewInvoice }) => {
  const { orders, addOrderReview } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in_transit':
      case 'dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'material_preparation':
      case 'transport_assigned':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'supplier_confirmed':
      case 'payment_confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    addOrderReview(selectedOrder.id, reviewRating, reviewText);
    setShowReviewModal(false);
    setReviewText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-500" />
            Consignment Tracking & Orders
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time material order tracking across supplier preparation, dispatch, logistics and on-site delivery
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500 mt-1">Browse materials in our catalog and place your first order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Order Selection List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-1">
              Active & Past Orders ({orders.length})
            </h3>
            {orders.map((order) => {
              const isSelected = order.id === selectedOrder?.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-white shadow-md ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800 line-clamp-1">
                      {order.items.map(i => `${i.quantity} ${i.unit} ${i.productName}`).join(', ')}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">{order.deliverySite.siteName}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">
                      ₹{order.grandTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(order.orderDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Order Tracking & Dispatch Details */}
          {selectedOrder && (
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">{selectedOrder.orderNumber}</span>
                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supplier: <strong className="text-slate-800">{selectedOrder.supplierName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewInvoice(selectedOrder)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>GST Tax Invoice</span>
                  </button>
                  {selectedOrder.status === 'completed' && !selectedOrder.rating && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Logistics & Driver Contact Card */}
              {selectedOrder.driverName && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Assigned Logistics Consignment
                      </span>
                    </div>
                    <p className="text-sm font-black text-white">
                      Vehicle: {selectedOrder.vehicleRegNumber} ({selectedOrder.vehicleType || 'Commercial Heavy Tipper'})
                    </p>
                    <p className="text-xs text-slate-300">
                      Driver: <strong className="text-white">{selectedOrder.driverName}</strong> • {selectedOrder.transporterName}
                    </p>
                  </div>

                  {selectedOrder.driverMobile && (
                    <a
                      href={`tel:${selectedOrder.driverMobile}`}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors shadow-md shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Driver ({selectedOrder.driverMobile})</span>
                    </a>
                  )}
                </div>
              )}

              {/* Order Tracking Timeline */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Order Fulfillment & Delivery Timeline
                </h4>
                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedOrder.timeline.map((step, idx) => {
                    return (
                      <div key={idx} className="relative flex items-start gap-3">
                        <div
                          className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                            step.done
                              ? 'bg-emerald-500 ring-4 ring-emerald-100'
                              : 'bg-slate-300'
                          }`}
                        >
                          {step.done ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                              {step.label}
                            </span>
                            {step.timestamp && (
                              <span className="text-[11px] font-semibold text-slate-500">
                                {step.timestamp}
                              </span>
                            )}
                          </div>
                          {step.note && (
                            <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/80 mt-1">
                              {step.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Site Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  Consignment Destination Site
                </h4>
                <p className="text-xs font-bold text-slate-900">{selectedOrder.deliverySite.siteName}</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {selectedOrder.deliverySite.address}, {selectedOrder.deliverySite.city} - {selectedOrder.deliverySite.pincode}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Site Contact: {selectedOrder.deliverySite.contactPerson} ({selectedOrder.deliverySite.contactMobile})
                </p>
              </div>

              {/* Proof of Delivery (POD) card if completed */}
              {selectedOrder.podDetails && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Proof of Delivery (POD) Verified on Site</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Handed over to: <strong>{selectedOrder.podDetails.recipientName}</strong> ({selectedOrder.podDetails.recipientMobile})
                  </p>
                  <p className="text-xs text-slate-600">
                    Timestamp: {selectedOrder.podDetails.deliveredAt}
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    Site Remarks: "{selectedOrder.podDetails.remarks}"
                  </p>
                </div>
              )}

              {/* Existing Review display */}
              {selectedOrder.rating && (
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= (selectedOrder.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-800 ml-1">Buyer Quality Rating</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{selectedOrder.reviewFeedback}"</p>
                </div>
              )}

              {/* Order Cost Breakdown */}
              <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Materials Subtotal:</span>
                  <span className="font-bold text-slate-900">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18% / 28%):</span>
                  <span className="font-bold text-slate-900">₹{selectedOrder.gstTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Freight & Unloading:</span>
                  <span className="font-bold text-slate-900">₹{selectedOrder.deliveryFee.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Volume Discount:</span>
                    <span className="font-bold">-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                  <span className="font-black text-slate-900 text-sm">Grand Total (Incl. GST):</span>
                  <span className="font-black text-amber-600 text-lg">
                    ₹{selectedOrder.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Payment Term: {selectedOrder.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                  <span className="font-semibold text-emerald-600">Status: {selectedOrder.paymentStatus.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Rate Delivery & Material Quality
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Feedback for Order {selectedOrder.orderNumber} delivered by {selectedOrder.supplierName}
            </p>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Overall Material Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= reviewRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Site Engineer Remarks (Weight accuracy, packaging, unloading efficiency)
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="e.g. Weighbridge slip matched site weight within 0.2%. Cement bags were dry and sealed."
                  className="w-full text-xs font-medium border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-slate-300 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Rating</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
