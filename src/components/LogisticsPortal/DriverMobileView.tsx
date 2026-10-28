import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, ProofOfDelivery } from '../../types';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Camera, 
  FileCheck, 
  PenTool, 
  ShieldCheck, 
  AlertTriangle,
  Building,
  RotateCcw
} from 'lucide-react';

export const DriverMobileView: React.FC = () => {
  const { orders, drivers, vehicles, updateOrderStatus, submitProofOfDelivery } = useApp();

  // Active driver identity
  const [selectedDriverId, setSelectedDriverId] = useState<string>(drivers[0]?.id || 'driver-1');
  const activeDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];

  // Active assigned delivery orders
  const assignedOrders = orders.filter(
    o => o.driverId === activeDriver.id || (!o.driverId && o.status === 'transport_assigned')
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(assignedOrders[0]?.id || orders[0]?.id || '');
  const activeOrder = orders.find(o => o.id === selectedOrderId) || assignedOrders[0] || orders[0];

  // POD form state
  const [podRecipientName, setPodRecipientName] = useState('Sanjay Deshmukh (Site Incharge)');
  const [podRecipientMobile, setPodRecipientMobile] = useState('+91 98900 77210');
  const [podRemarks, setPodRemarks] = useState('Full consignment unloaded and stacked at batching yard. Net weight verified with weighbridge slip.');
  const [podVerified, setPodVerified] = useState(true);
  const [podSignature, setPodSignature] = useState(true);
  const [isSubmittingPod, setIsSubmittingPod] = useState(false);

  const handleStatusAdvancement = (newStatus: OrderStatus, noteText: string) => {
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.id, newStatus, noteText);
  };

  const handlePodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    setIsSubmittingPod(true);
    setTimeout(() => {
      const pod: ProofOfDelivery = {
        recipientName: podRecipientName,
        recipientMobile: podRecipientMobile,
        deliveredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
        remarks: podRemarks,
        signatureConfirmed: podSignature,
        materialVerified: podVerified,
        photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80',
      };
      submitProofOfDelivery(activeOrder.id, pod);
      setIsSubmittingPod(false);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Driver Simulation Console Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Driver PWA Console
              </span>
              <h2 className="text-sm font-black text-white">{activeDriver?.name}</h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">License No.</span>
            <span className="text-xs font-mono font-bold text-amber-400">{activeDriver?.licenseNumber}</span>
          </div>
        </div>

        {/* Switch Driver Toggle */}
        <div className="mt-3 flex items-center justify-between text-xs bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <span className="text-slate-400 text-[11px] font-semibold">Active Fleet Captain:</span>
          <select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="bg-slate-900 text-amber-400 font-bold text-xs px-2 py-1 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
          >
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.rating}★ • {d.totalDeliveries} trips)</option>
            ))}
          </select>
        </div>
      </div>

      {/* Select active consignment tab */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {orders.map((ord) => {
          const isSelected = ord.id === activeOrder?.id;
          return (
            <button
              key={ord.id}
              onClick={() => setSelectedOrderId(ord.id)}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{ord.orderNumber}</span>
              <span className="text-[10px] block opacity-80">{ord.deliverySite.siteName.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Delivery Consignment Card */}
      {activeOrder && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
          {/* Status badge & PO */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="font-mono font-bold text-slate-900 text-xs">{activeOrder.orderNumber}</span>
              <span className="text-slate-500 text-xs block mt-0.5">Buyer: <strong>{activeOrder.customerCompany}</strong></span>
            </div>
            <span className="bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
              {activeOrder.status.replace('_', ' ')}
            </span>
          </div>

          {/* Route details: Pickup Plant -> Site Destination */}
          <div className="relative pl-6 space-y-4 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {/* Pickup */}
            <div className="relative">
              <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">
                A
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pickup Yard / Depot
                </span>
                <p className="font-bold text-slate-900 text-xs mt-0.5">{activeOrder.supplierName}</p>
                <p className="text-slate-500 text-[11px]">Primary Dispatch Scale & Crane</p>
              </div>
            </div>

            {/* Destination */}
            <div className="relative">
              <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-bold">
                B
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Consignment Site Destination
                </span>
                <p className="font-bold text-slate-900 text-xs mt-0.5">{activeOrder.deliverySite.siteName}</p>
                <p className="text-slate-600 text-[11px]">{activeOrder.deliverySite.address}, {activeOrder.deliverySite.city}</p>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={`tel:${activeOrder.deliverySite.contactMobile}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Site Incharge ({activeOrder.deliverySite.contactPerson})</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Material & Tonnage Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Manifest Materials
            </span>
            {activeOrder.items.map((i, idx) => (
              <div key={idx} className="flex justify-between items-center font-bold text-slate-900">
                <span>{i.productName} ({i.brand})</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-amber-700">
                  {i.quantity} {i.unit}s
                </span>
              </div>
            ))}
          </div>

          {/* Real-time Status Update Action Step */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <h4 className="text-xs font-bold text-slate-800">Trip Stage Actions</h4>

            {activeOrder.status === 'transport_assigned' && (
              <button
                onClick={() => handleStatusAdvancement('dispatched', 'Material loaded on truck and gross tare weighment recorded at plant.')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Confirm Pickup & Gate Departure</span>
              </button>
            )}

            {activeOrder.status === 'dispatched' && (
              <button
                onClick={() => handleStatusAdvancement('in_transit', 'Truck on highway route to construction site. ETA 2 hours.')}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span>Update: En Route / In Transit</span>
              </button>
            )}

            {activeOrder.status === 'in_transit' && (
              <button
                onClick={() => handleStatusAdvancement('delivered', 'Truck reached site entrance gate. Waiting for bay clearance.')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Arrived at Construction Site</span>
              </button>
            )}

            {/* Proof of Delivery Form (active when order is reached or in final step) */}
            {(activeOrder.status === 'delivered' || activeOrder.status === 'in_transit') && (
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Camera className="w-4 h-4" />
                  <span>Submit Proof of Delivery (POD)</span>
                </div>

                <form onSubmit={handlePodSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold">Receiver Name & Designation</label>
                    <input
                      type="text"
                      required
                      value={podRecipientName}
                      onChange={(e) => setPodRecipientName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold">Receiver Mobile (For OTP/SMS)</label>
                    <input
                      type="tel"
                      required
                      value={podRecipientMobile}
                      onChange={(e) => setPodRecipientMobile(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold">Weighment & Unloading Remarks</label>
                    <textarea
                      rows={2}
                      value={podRemarks}
                      onChange={(e) => setPodRemarks(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-1.5 pt-1 text-[11px]">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={podVerified}
                        onChange={(e) => setPodVerified(e.target.checked)}
                        className="rounded accent-amber-500"
                      />
                      <span>Certified weighbridge slip physically handed to site engineer</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={podSignature}
                        onChange={(e) => setPodSignature(e.target.checked)}
                        className="rounded accent-amber-500"
                      />
                      <span>Physical or digital sign-off verified</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingPod}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors mt-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isSubmittingPod ? 'Uploading POD & Closing Trip...' : 'Submit POD & Complete Delivery'}</span>
                  </button>
                </form>
              </div>
            )}

            {activeOrder.status === 'completed' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-900">Trip Completed & POD Synced</p>
                <p className="text-[11px] text-emerald-700">
                  Received by {activeOrder.podDetails?.recipientName || 'Site Staff'}. All records archived.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
