import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Building, 
  MapPin, 
  Calendar, 
  ShieldCheck,
  XCircle,
  Truck
} from 'lucide-react';

interface CustomerQuotesViewProps {
  onGoToOrders: () => void;
}

export const CustomerQuotesView: React.FC<CustomerQuotesViewProps> = ({ onGoToOrders }) => {
  const { quotations, acceptQuotationAndCreateOrder, rejectQuotation } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            Bulk Material Quotations (RFQ)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Direct mill & plant quotation negotiation for commercial construction projects
          </p>
        </div>
      </div>

      {quotations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No quotation requests yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Browse our catalog for cement, TMT rebars, or stone aggregate and click "Request Quote" for customized high-volume pricing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotations.map((q) => {
            const isQuoted = q.status === 'quoted';
            const isPending = q.status === 'pending_supplier';
            const isConverted = q.status === 'converted_to_order';
            const isRejected = q.status === 'rejected';

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                      {q.quoteNumber}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Created: {q.createdAt}
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      • Validity: <strong className="text-slate-700">{q.validityDate}</strong>
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                        Awaiting Supplier Pricing
                      </span>
                    )}
                    {isQuoted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Quotation Received - Action Required
                      </span>
                    )}
                    {isConverted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                        Converted to Purchase Order
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Quotation Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Details grid */}
                <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Items and requirements */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Building className="w-4 h-4 text-amber-500" />
                      <span>Target Supplier: <strong className="text-slate-900">{q.supplierName}</strong></span>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>Site: {q.siteLocation}</span>
                    </div>

                    {/* Table of items */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mt-3">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-2.5">Material</th>
                            <th className="p-2.5 text-center">Quantity</th>
                            <th className="p-2.5 text-right">Target Rate</th>
                            {isQuoted && <th className="p-2.5 text-right text-emerald-700">Offered Rate</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {q.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 font-bold text-slate-800">
                                {item.productName}
                                <span className="block text-[10px] text-slate-500 font-normal">{item.brand}</span>
                              </td>
                              <td className="p-2.5 text-center font-bold text-slate-700">
                                {item.quantity} {item.unit}s
                              </td>
                              <td className="p-2.5 text-right text-slate-600">
                                ₹{item.targetPrice?.toLocaleString('en-IN') || '-'}
                              </td>
                              {isQuoted && (
                                <td className="p-2.5 text-right font-black text-emerald-700">
                                  ₹{item.quotedUnitPrice?.toLocaleString('en-IN')}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {q.customerRemarks && (
                      <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                        Buyer requirement: "{q.customerRemarks}"
                      </p>
                    )}

                    {q.supplierNotes && (
                      <p className="text-xs text-slate-700 font-medium bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                        Supplier terms: "{q.supplierNotes}"
                      </p>
                    )}
                  </div>

                  {/* Financial calculation & Conversion actions */}
                  <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Quotation Financial Summary
                      </h4>
                      {isQuoted ? (
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>Material Subtotal:</span>
                            <span className="font-bold text-slate-900">₹{q.quotationSubtotal?.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Applicable GST (18% Avg):</span>
                            <span className="font-bold text-slate-900">+₹{q.taxes?.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Estimated Freight & Loading:</span>
                            <span className="font-bold text-slate-900">+₹{q.freightEstimate?.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                            <span className="font-bold text-slate-900">Total Net Cost:</span>
                            <span className="font-black text-amber-600 text-lg">
                              ₹{q.grandTotal?.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-2">
                            Terms: {q.paymentTerms}
                          </p>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-xs text-slate-500">
                          <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-pulse" />
                          <span>Supplier sales team is calculating freight and mill rebate. You will receive an offer alert shortly.</span>
                        </div>
                      )}
                    </div>

                    {/* Conversion Button */}
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      {isQuoted && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              acceptQuotationAndCreateOrder(q.id);
                              onGoToOrders();
                            }}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept & Create Order</span>
                          </button>
                          <button
                            onClick={() => rejectQuotation(q.id)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {isConverted && (
                        <button
                          onClick={onGoToOrders}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Track in Active Orders</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
