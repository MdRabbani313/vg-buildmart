import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Building2, 
  ShoppingCart, 
  MapPin, 
  Bell, 
  RotateCcw, 
  Truck, 
  ShieldCheck, 
  Factory, 
  HardHat, 
  CheckCircle2, 
  X,
  FileSpreadsheet
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  activeCustomerTab: 'catalog' | 'quotes' | 'orders';
  setActiveCustomerTab: (tab: 'catalog' | 'quotes' | 'orders') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, activeCustomerTab, setActiveCustomerTab }) => {
  const { 
    role, 
    setRole, 
    customer, 
    cart, 
    notifications, 
    dismissNotification, 
    selectedAddress, 
    setSelectedAddress, 
    resetAllDemoData,
    orders,
    quotations
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const cartItemCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
  const pendingQuotesCount = quotations.filter(q => q.status === 'quoted' || q.status === 'pending_supplier').length;

  const roleConfigs: { id: UserRole; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'customer',
      title: 'Buyer Marketplace',
      subtitle: 'Builders & Contractors',
      icon: <HardHat className="w-4 h-4" />,
      color: 'bg-amber-500 text-slate-900',
    },
    {
      id: 'supplier',
      title: 'Supplier Portal',
      subtitle: 'Cement & Steel Plants',
      icon: <Factory className="w-4 h-4" />,
      color: 'bg-blue-600 text-white',
    },
    {
      id: 'admin',
      title: 'Admin & CRM',
      subtitle: 'HQ Business Operations',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'bg-emerald-600 text-white',
    },
    {
      id: 'driver',
      title: 'Driver POD App',
      subtitle: 'Mobile Delivery Consignment',
      icon: <Truck className="w-4 h-4" />,
      color: 'bg-purple-600 text-white',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-xl">
      {/* Top utility ticker */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            VG BUILDMART DIRECT DISPATCH
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">
            Bulk Cement (OPC/PPC) • Primary TMT Fe550D • Blue Basalt Aggregates • M-Sand
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 hidden sm:inline">
            Logged as: <strong className="text-white">{role === 'customer' ? customer.companyName : role === 'supplier' ? 'UltraTech / Tata Authorized Depot' : role === 'admin' ? 'Platform HQ Admin (Gulab R.)' : 'Driver Ramesh Yadav'}</strong>
          </span>
          <button
            onClick={() => {
              if (confirm('Reset demo state back to initial pre-seeded data?')) {
                resetAllDemoData();
              }
            }}
            title="Reset simulated data"
            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                VG <span className="text-amber-400">BUILDMART</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Construction Material Direct Marketplace</p>
          </div>
        </div>

        {/* Role Switcher tabs (Proposal requirement: Multi-role ecosystem) */}
        <div className="hidden lg:flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
          {roleConfigs.map(cfg => {
            const isActive = role === cfg.id;
            return (
              <button
                key={cfg.id}
                onClick={() => setRole(cfg.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? `${cfg.color} shadow-sm font-bold`
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {cfg.icon}
                <span>{cfg.title}</span>
              </button>
            );
          })}
        </div>

        {/* Actions right side */}
        <div className="flex items-center gap-3">
          {/* Construction Site Selector (For customer mode) */}
          {role === 'customer' && (
            <button
              onClick={() => setShowAddressModal(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg cursor-pointer transition-colors max-w-[200px] truncate"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{selectedAddress.siteName}</span>
            </button>
          )}

          {/* Mobile Role Dropdown */}
          <div className="lg:hidden">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-slate-800 text-amber-300 text-xs font-bold border border-slate-700 rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none"
            >
              <option value="customer">Buyer Marketplace</option>
              <option value="supplier">Supplier Portal</option>
              <option value="admin">Admin & CRM</option>
              <option value="driver">Driver POD App</option>
            </select>
          </div>

          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Notifications & Alerts"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification popup */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    Marketplace & Logistics Updates
                  </h4>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No new notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="py-2.5 flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-white">{n.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-500">{n.time}</span>
                        </div>
                        <button
                          onClick={() => dismissNotification(n.id)}
                          className="text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon (Customer mode) */}
          {role === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-extrabold uppercase">Order Cart</span>
              {cartItemCount > 0 && (
                <span className="w-5 h-5 bg-slate-950 text-amber-400 text-xs font-black rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Sub-bar for Customer role navigation */}
      {role === 'customer' && (
        <div className="bg-slate-800/60 border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setActiveCustomerTab('catalog')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeCustomerTab === 'catalog'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Material Catalog & Bulk Slabs
              </button>
              <button
                onClick={() => setActiveCustomerTab('quotes')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeCustomerTab === 'quotes'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>Bulk Quotations (RFQ)</span>
                {pendingQuotesCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCustomerTab === 'quotes' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {pendingQuotesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveCustomerTab('orders')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeCustomerTab === 'orders'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>My Active Orders</span>
                {activeOrdersCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCustomerTab === 'orders' ? 'bg-slate-950 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {activeOrdersCount}
                  </span>
                )}
              </button>
            </div>
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                GST Invoicing Guaranteed
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                Certified Weight Slips
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Address Switcher Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                Select Construction Site Location
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Deliveries, freight rates, and supplier stock availability are calculated based on your active site destination.
            </p>

            <div className="mt-4 space-y-3">
              {customer.addresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddressModal(false);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-800/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {addr.siteName}
                        {addr.isDefault && (
                          <span className="text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-medium border border-amber-500/30">
                            HQ Site
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{addr.address}, {addr.city} - {addr.pincode}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Incharge: {addr.contactPerson} ({addr.contactMobile})</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
