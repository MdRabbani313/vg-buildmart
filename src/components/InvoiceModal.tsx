import React from 'react';
import { Order } from '../types';
import { X, Printer, Download, Building2, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNo = `INV-${order.orderNumber.replace('VGB-', '')}`;
  const invoiceDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Split GST into CGST & SGST (each 50%)
  const cgst = order.gstTotal / 2;
  const sgst = order.gstTotal / 2;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 flex flex-col max-h-[95vh]">
        {/* Modal bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold">Tax Invoice Preview • {invoiceNo}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 sm:p-10 overflow-y-auto text-slate-800 text-xs font-sans space-y-6 bg-white" id="printable-invoice">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900">
                  VG <span className="text-amber-600">BUILDMART</span>
                </span>
                <span className="text-[10px] font-bold uppercase bg-slate-900 text-amber-400 px-2 py-0.5 rounded">
                  B2B DIRECT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                VG Buildmart Infrastructure & Supply Technologies Private Limited
              </p>
              <p className="text-[11px] text-slate-500">
                Corporate HQ: Plot 18, MIDC Central Road, Andheri East, Mumbai 400093
              </p>
              <p className="text-[11px] font-mono text-slate-700 font-bold mt-0.5">
                GSTIN: 27AABCV8812D1Z4 • PAN: AABCV8812D
              </p>
            </div>

            <div className="text-right">
              <span className="text-base font-black text-slate-900 uppercase tracking-wider block">
                TAX INVOICE
              </span>
              <p className="font-mono font-bold text-slate-900 text-sm mt-1">{invoiceNo}</p>
              <p className="text-slate-500 mt-0.5">Date: {invoiceDate}</p>
              <p className="text-slate-500">PO Ref: {order.orderNumber}</p>
            </div>
          </div>

          {/* Supplier & Consignee Details */}
          <div className="grid grid-cols-2 gap-8 border-b border-slate-200 pb-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Fulfilling Manufacturer / Stockyard:
              </span>
              <p className="font-bold text-slate-900 text-sm">{order.supplierName}</p>
              <p className="text-slate-600 mt-0.5">Primary Depot / Plant Works</p>
              <p className="text-slate-500 font-mono mt-0.5">Dispatched Under e-Way Bill System</p>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To & Site Consignee:
              </span>
              <p className="font-bold text-slate-900 text-sm">{order.customerCompany}</p>
              <p className="text-slate-600 mt-0.5">Attn: {order.customerName}</p>
              <p className="text-slate-600 font-mono font-bold">GSTIN: {order.customerId === 'cust-1' ? '27AABCA7654C1Z3' : 'UNREGISTERED'}</p>
              <p className="text-slate-500 mt-0.5">
                Site: {order.deliverySite.siteName}, {order.deliverySite.address}, {order.deliverySite.city} - {order.deliverySite.pincode}
              </p>
            </div>
          </div>

          {/* Logistics summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">Transport Logistics Partner</span>
              <span className="font-bold text-slate-900">{order.transporterName || 'VG Direct Fleet'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Assigned Vehicle Reg.</span>
              <span className="font-mono font-bold text-slate-900">{order.vehicleRegNumber || 'Designated Heavy Tipper'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Consignment Driver</span>
              <span className="font-bold text-slate-900">{order.driverName || 'Verified Fleet Captain'}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white text-[11px] font-bold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Material & Technical Specifications</th>
                  <th className="p-3">HSN Code</th>
                  <th className="p-3 text-center">Qty & Unit</th>
                  <th className="p-3 text-right">Taxable Rate (₹)</th>
                  <th className="p-3 text-right">GST %</th>
                  <th className="p-3 text-right">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {order.items.map((item, index) => {
                  const hsn = item.productName.toLowerCase().includes('cement')
                    ? '2523'
                    : item.productName.toLowerCase().includes('steel') || item.productName.toLowerCase().includes('tmt')
                    ? '7214'
                    : '2517';

                  return (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400 font-bold">{index + 1}</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{item.productName}</span>
                        <span className="text-[10px] text-slate-500">{item.brand} • Grade: {item.grade}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{hsn}</td>
                      <td className="p-3 text-center font-bold text-slate-800">
                        {item.quantity.toLocaleString()} {item.unit}s
                      </td>
                      <td className="p-3 text-right font-semibold text-slate-800">
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right text-slate-600 font-bold">
                        {item.gstRate}%
                      </td>
                      <td className="p-3 text-right font-black text-slate-900">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Material Subtotal:</span>
                <span className="font-bold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Central GST (CGST):</span>
                <span className="font-bold text-slate-900">₹{Math.round(cgst).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State GST (SGST):</span>
                <span className="font-bold text-slate-900">₹{Math.round(sgst).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Direct Site Freight Charges:</span>
                <span className="font-bold text-slate-900">₹{order.deliveryFee.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Special Project Rebate:</span>
                  <span className="font-bold">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-baseline">
                <span className="font-black text-slate-900 text-sm">Total Invoice Value:</span>
                <span className="font-black text-amber-600 text-lg">
                  ₹{order.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 text-right">
                Payment Mode: {order.paymentMethod.replace('_', ' ').toUpperCase()} • Status: {order.paymentStatus.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Footer declaration */}
          <div className="border-t border-slate-200 pt-5 grid grid-cols-2 gap-6 text-[10px] text-slate-500">
            <div>
              <p className="font-bold text-slate-700 uppercase">Declaration & Terms:</p>
              <p className="mt-1 leading-relaxed">
                We declare that this invoice shows the actual price of the construction materials described and that all particulars are true and correct. Certified weighbridge slip attached at destination.
              </p>
            </div>
            <div className="text-right flex flex-col justify-between">
              <p className="font-bold text-slate-700">For VG Buildmart Platforms Pvt Ltd</p>
              <div className="mt-6">
                <span className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
                  Authorized Signatory (Digital Stamp)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
