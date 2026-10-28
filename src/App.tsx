/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CustomerMarketplaceView } from './components/CustomerMarketplace/CustomerMarketplaceView';
import { CustomerQuotesView } from './components/CustomerMarketplace/CustomerQuotesView';
import { CustomerOrdersView } from './components/CustomerMarketplace/CustomerOrdersView';
import { ProductDetailModal } from './components/CustomerMarketplace/ProductDetailModal';
import { QuoteRequestModal } from './components/CustomerMarketplace/QuoteRequestModal';
import { CartDrawer } from './components/CustomerMarketplace/CartDrawer';
import { CheckoutModal } from './components/CustomerMarketplace/CheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { SupplierPortalView } from './components/SupplierPortal/SupplierPortalView';
import { AdminPortalView } from './components/AdminPortal/AdminPortalView';
import { DriverMobileView } from './components/LogisticsPortal/DriverMobileView';
import { Product, Order } from './types';
import { Building2, ShieldCheck, Truck, Scale, MapPin, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, setRole, customer } = useApp();

  // Navigation states
  const [activeCustomerTab, setActiveCustomerTab] = useState<'catalog' | 'quotes' | 'orders'>('catalog');

  // Modal states
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const handleOrderSuccess = (order: Order) => {
    setActiveCustomerTab('orders');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header with Role Switcher & Cart */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        activeCustomerTab={activeCustomerTab}
        setActiveCustomerTab={setActiveCustomerTab}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Render role-specific portal */}
        {role === 'customer' && (
          <>
            {activeCustomerTab === 'catalog' && (
              <CustomerMarketplaceView
                onSelectProduct={(prod) => setDetailProduct(prod)}
                onRequestQuote={(prod) => setQuoteProduct(prod)}
              />
            )}
            {activeCustomerTab === 'quotes' && (
              <CustomerQuotesView
                onGoToOrders={() => setActiveCustomerTab('orders')}
              />
            )}
            {activeCustomerTab === 'orders' && (
              <CustomerOrdersView
                onViewInvoice={(ord) => setInvoiceOrder(ord)}
              />
            )}
          </>
        )}

        {role === 'supplier' && <SupplierPortalView />}

        {role === 'admin' && <AdminPortalView />}

        {role === 'driver' && <DriverMobileView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">
                  VG <span className="text-amber-400">BUILDMART</span>
                </span>
                <span className="text-[10px] font-bold uppercase bg-slate-800 text-amber-300 px-2 py-0.5 rounded">
                  Direct B2B Network
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Centralized Digital Marketplace for Cement, Stone Aggregates, TMT Steel & Logistics Fulfillment
              </p>
            </div>

            {/* Quick Portal Switch Links in footer */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold mr-1">Switch View:</span>
              <button
                onClick={() => { setRole('customer'); setActiveCustomerTab('catalog'); }}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  role === 'customer' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                Buyer Marketplace
              </button>
              <button
                onClick={() => setRole('supplier')}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  role === 'supplier' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                Supplier Portal
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  role === 'admin' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                Admin HQ & CRM
              </button>
              <button
                onClick={() => setRole('driver')}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  role === 'driver' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                Driver POD App
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© 2026 VG Buildmart Platforms. Engineered as per Project Proposal SOW v1.0.</p>
            <div className="flex items-center gap-4">
              <span>Prepared for: Gulab Rabbani & VG Buildmart</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Ready for Vercel / Cloud Deployment</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onRequestQuote={(prod) => {
          setDetailProduct(null);
          setQuoteProduct(prod);
        }}
      />

      <QuoteRequestModal
        product={quoteProduct}
        onClose={() => setQuoteProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <InvoiceModal
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
