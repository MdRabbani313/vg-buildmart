import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Order, Quotation, BulkPriceSlab } from '../../types';
import { 
  Factory, 
  Package, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Layers, 
  DollarSign, 
  Truck, 
  Send,
  Building,
  Star,
  MapPin,
  X
} from 'lucide-react';

export const SupplierPortalView: React.FC = () => {
  const { 
    suppliers, 
    products, 
    orders, 
    quotations, 
    updateProductStock, 
    addProduct, 
    respondToQuotation, 
    updateOrderStatus 
  } = useApp();

  // Active supplier state (default to primary UltraTech / Tata supplier)
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0].id);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'quotes' | 'orders'>('dashboard');

  // Quotation Response Form State
  const [respondingQuote, setRespondingQuote] = useState<Quotation | null>(null);
  const [quotedRate, setQuotedRate] = useState<number>(360);
  const [freightRate, setFreightRate] = useState<number>(15000);
  const [validityDays, setValidityDays] = useState<number>(5);
  const [supplierTerms, setSupplierTerms] = useState<string>('Ex-plant Bhiwandi stockyard. Grade test certificate included.');

  // Add Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'cement' | 'steel' | 'stone' | 'sand_bricks' | 'blocks'>('cement');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdGrade, setNewProdGrade] = useState('');
  const [newProdUnit, setNewProdUnit] = useState<'bag' | 'tonne' | 'piece' | 'cu.ft'>('bag');
  const [newProdBasePrice, setNewProdBasePrice] = useState<number>(350);
  const [newProdSellingPrice, setNewProdSellingPrice] = useState<number>(380);
  const [newProdMoq, setNewProdMoq] = useState<number>(100);
  const [newProdStock, setNewProdStock] = useState<number>(2000);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdGst, setNewProdGst] = useState<number>(28);

  const currentSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  // Supplier filtered entities
  const supplierProducts = products.filter(p => p.supplierId === currentSupplier.id);
  const supplierOrders = orders.filter(o => o.supplierId === currentSupplier.id);
  const supplierQuotes = quotations.filter(q => q.supplierId === currentSupplier.id || q.supplierName.includes(currentSupplier.companyName));

  // Analytics Metrics
  const totalRevenue = supplierOrders.reduce((acc, o) => acc + o.grandTotal, 0);
  const activeOrdersCount = supplierOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
  const pendingQuotesCount = supplierQuotes.filter(q => q.status === 'pending_supplier').length;

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingQuote) return;

    const updatedItems = respondingQuote.items.map(item => ({
      ...item,
      quotedUnitPrice: quotedRate,
      total: quotedRate * item.quantity,
    }));

    respondToQuotation(respondingQuote.id, updatedItems, freightRate, supplierTerms, validityDays);
    setRespondingQuote(null);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProdName,
      category: newProdCategory,
      brand: newProdBrand,
      grade: newProdGrade,
      unit: newProdUnit,
      basePrice: newProdBasePrice,
      sellingPrice: newProdSellingPrice,
      moq: newProdMoq,
      stockQuantity: newProdStock,
      isAvailable: true,
      supplierId: currentSupplier.id,
      supplierName: currentSupplier.companyName,
      location: currentSupplier.city,
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80',
      description: newProdDesc || 'Premium grade construction material directly supplied from certified mill stockyards.',
      specs: {
        'Grade': newProdGrade,
        'Packaging': 'Industrial standard packaging',
        'Testing': 'IS standard mill test certified',
      },
      bulkSlabs: [
        { minQty: newProdMoq, discountPercent: 0, pricePerUnit: newProdSellingPrice },
        { minQty: newProdMoq * 5, discountPercent: 5.0, pricePerUnit: Math.round(newProdSellingPrice * 0.95) }
      ],
      gstRate: newProdGst,
      featured: false,
    });
    setShowAddProductModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Supplier Profile Banner & Switcher */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20 shrink-0">
            <Factory className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black text-white">{currentSupplier.companyName}</h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Verified Plant
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
              <span>GSTIN: <strong className="text-slate-200 font-mono">{currentSupplier.gstin}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {currentSupplier.warehouseLocations.join(' | ')}
              </span>
            </p>
          </div>
        </div>

        {/* Switch active supplier entity */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          <span className="text-[11px] font-bold text-slate-400 px-2">Depot Account:</span>
          <select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="bg-slate-900 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
          >
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.companyName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Fulfillment Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog & Slabs ({supplierProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'quotes'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Customer RFQ Quotes</span>
          {pendingQuotesCount > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingQuotesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Dispatch & Orders ({supplierOrders.length})</span>
        </button>
      </div>

      {/* Tab 1: Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Total Delivered Value</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                Platform Commission: {currentSupplier.commissionRate}%
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Active Shipments</span>
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-blue-600 mt-2">
                {activeOrdersCount}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Across Mumbai & Pune corridors
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Pending RFQ Quotes</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-amber-600 mt-2">
                {pendingQuotesCount}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Awaiting commercial review
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Quality & Delivery Score</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">
                {currentSupplier.rating} / 5.0
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Based on verified site weighbridge receipts
              </span>
            </div>
          </div>

          {/* Quick Orders Pipeline */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center justify-between">
              <span>Orders Requiring Supplier Action</span>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-blue-600 hover:text-blue-700 text-xs font-bold cursor-pointer"
              >
                View All Orders &rarr;
              </button>
            </h3>

            {supplierOrders.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No orders assigned to this plant yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {supplierOrders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ord.orderNumber}</span>
                        <span className="text-slate-500">• {ord.customerCompany}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">
                        {ord.items.map(i => `${i.quantity} ${i.unit} ${i.productName}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900">
                        ₹{ord.grandTotal.toLocaleString('en-IN')}
                      </span>
                      <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full uppercase text-[10px]">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Inventory & Catalog Management */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Plant Inventory & Quantity Slabs</h3>
              <p className="text-xs text-slate-500">Configure stock availability, minimum order quantity, and bulk tier discounts.</p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Material</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Material Name</th>
                  <th className="p-3.5">Grade / Unit</th>
                  <th className="p-3.5 text-right">Selling Price</th>
                  <th className="p-3.5 text-center">MOQ</th>
                  <th className="p-3.5 text-center">Stock Available</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <span className="text-[11px] text-slate-500">{p.brand}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {p.grade}
                      </span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">per {p.unit}</span>
                    </td>
                    <td className="p-3.5 text-right font-black text-slate-900">
                      ₹{p.sellingPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-700">
                      {p.moq} {p.unit}s
                    </td>
                    <td className="p-3.5 text-center">
                      <input
                        type="number"
                        value={p.stockQuantity}
                        onChange={(e) => updateProductStock(p.id, parseInt(e.target.value) || 0, p.isAvailable)}
                        className="w-24 text-center border border-slate-300 rounded-lg py-1 font-bold text-xs"
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => updateProductStock(p.id, p.stockQuantity, !p.isAvailable)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer ${
                          p.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {p.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <span className="text-[11px] text-blue-600 font-semibold">
                        {p.bulkSlabs.length} Bulk Slabs Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Customer RFQ Quotations */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Commercial RFQ Requests</h3>
            <p className="text-xs text-slate-500">Respond with negotiated unit pricing, validity dates, and freight arrangements.</p>
          </div>

          {supplierQuotes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No quotation requests assigned to this depot.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {supplierQuotes.map((q) => (
                <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                        {q.quoteNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{q.customerCompany}</span>
                      <span className="text-xs text-slate-500">({q.customerName} - {q.customerMobile})</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {q.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Site Location:</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{q.siteLocation}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Required Material & Qty:</span>
                      <p className="font-bold text-slate-900 mt-0.5">
                        {q.items.map(i => `${i.productName} (${i.quantity} ${i.unit}s)`).join(', ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Buyer Target Rate:</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        ₹{q.items[0]?.targetPrice?.toLocaleString('en-IN') || '-'} / {q.items[0]?.unit}
                      </p>
                    </div>
                  </div>

                  {q.customerRemarks && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                      Buyer Notes: "{q.customerRemarks}"
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end pt-2">
                    {q.status === 'pending_supplier' ? (
                      <button
                        onClick={() => {
                          setRespondingQuote(q);
                          setQuotedRate(q.items[0]?.targetPrice ? Math.round(q.items[0].targetPrice * 1.02) : 365);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Plant Quotation</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        Quoted: ₹{q.grandTotal?.toLocaleString('en-IN')} (Valid till {q.validityDate})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Order Dispatch & Production */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Plant Order Dispatch Management</h3>
            <p className="text-xs text-slate-500">Confirm new orders, update weighing & bundling, and notify logistics coordinators.</p>
          </div>

          <div className="space-y-4">
            {supplierOrders.map((ord) => (
              <div key={ord.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900">{ord.orderNumber}</span>
                    <span className="text-xs text-slate-500 ml-2">Buyer: <strong>{ord.customerCompany}</strong></span>
                  </div>
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Material Items:</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {ord.items.map(i => `${i.quantity} ${i.unit} ${i.productName}`).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Destination Site:</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {ord.deliverySite.siteName}, {ord.deliverySite.city}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Gross Order Value:</span>
                    <span className="font-black text-slate-900 mt-0.5 block">
                      ₹{ord.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Net Supplier Payout:</span>
                    <span className="font-black text-emerald-700 mt-0.5 block">
                      ₹{ord.supplierPayout.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Workflow Buttons for Supplier */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-600 font-medium">Update Plant Fulfillment Phase:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {ord.status === 'order_placed' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'supplier_confirmed', 'Stock allocated at factory yard')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer"
                      >
                        Confirm Stock & Order
                      </button>
                    )}
                    {ord.status === 'supplier_confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'material_preparation', 'Bundling & gross weighment started')}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer"
                      >
                        Mark Material in Preparation
                      </button>
                    )}
                    {ord.status === 'material_preparation' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'transport_assigned', 'Awaiting truck arrival at plant')}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer"
                      >
                        Request Transporter Truck
                      </button>
                    )}
                    {ord.status === 'transport_assigned' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'dispatched', `Loaded on ${ord.vehicleRegNumber || 'truck'} & weighed`)}
                        className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer"
                      >
                        Mark Truck Dispatched
                      </button>
                    )}
                    {(ord.status === 'dispatched' || ord.status === 'in_transit' || ord.status === 'completed') && (
                      <span className="text-xs font-semibold text-slate-500">
                        Consignment is managed by assigned transporter & driver.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote Response Modal */}
      {respondingQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Submit Quotation for {respondingQuote.quoteNumber}
              </h3>
              <button onClick={() => setRespondingQuote(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="mt-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-500 block">Buyer Entity:</span>
                <p className="font-bold text-slate-900">{respondingQuote.customerCompany} ({respondingQuote.siteLocation})</p>
                <p className="text-slate-600 mt-1">
                  Qty: {respondingQuote.items[0]?.quantity} {respondingQuote.items[0]?.unit}s (Target: ₹{respondingQuote.items[0]?.targetPrice})
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Offered Unit Rate (₹/{respondingQuote.items[0]?.unit})</label>
                <input
                  type="number"
                  required
                  value={quotedRate}
                  onChange={(e) => setQuotedRate(parseInt(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Freight & Loading (₹)</label>
                <input
                  type="number"
                  required
                  value={freightRate}
                  onChange={(e) => setFreightRate(parseInt(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quote Validity (Days)</label>
                <input
                  type="number"
                  required
                  value={validityDays}
                  onChange={(e) => setValidityDays(parseInt(e.target.value) || 3)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Supplier Commercial Remarks & Terms</label>
                <textarea
                  rows={2}
                  value={supplierTerms}
                  onChange={(e) => setSupplierTerms(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRespondingQuote(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  Send Quotation to Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">List New Construction Material</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Material Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. UltraTech Super Weather Pro Cement"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
                  >
                    <option value="cement">Cement (OPC/PPC)</option>
                    <option value="steel">TMT Steel Rods</option>
                    <option value="stone">Stone Aggregates</option>
                    <option value="sand_bricks">M-Sand & Sand</option>
                    <option value="blocks">AAC Blocks</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sales Unit</label>
                  <select
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
                  >
                    <option value="bag">Bag (50 kg)</option>
                    <option value="tonne">Tonne (MT)</option>
                    <option value="piece">Piece (Block)</option>
                    <option value="cu.ft">Cubic Feet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    placeholder="e.g. UltraTech / Tata / JSW"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade / Specification</label>
                  <input
                    type="text"
                    required
                    value={newProdGrade}
                    onChange={(e) => setNewProdGrade(e.target.value)}
                    placeholder="e.g. OPC 53 / Fe550D / 20mm"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdSellingPrice}
                    onChange={(e) => setNewProdSellingPrice(parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Order Qty (MOQ)</label>
                  <input
                    type="number"
                    required
                    value={newProdMoq}
                    onChange={(e) => setNewProdMoq(parseInt(e.target.value) || 1)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Stock</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  Publish to Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
