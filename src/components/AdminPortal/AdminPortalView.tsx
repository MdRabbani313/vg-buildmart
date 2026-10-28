import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStage, Order, Supplier, CustomerType } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Truck, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Calendar, 
  Building, 
  ChevronRight,
  ArrowRight,
  AlertCircle,
  X,
  CreditCard,
  Layers,
  MapPin
} from 'lucide-react';

export const AdminPortalView: React.FC = () => {
  const { 
    orders, 
    leads, 
    suppliers, 
    customer, 
    transporters, 
    vehicles, 
    drivers, 
    products, 
    addLead, 
    updateLeadStage, 
    addLeadNote, 
    convertLeadToCustomer, 
    updateSupplierStatus, 
    assignTransporterAndDriver, 
    updateOrderStatus 
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'leads' | 'orders_dispatch' | 'suppliers' | 'customers' | 'finance' | 'reports'>('overview');

  // Leads CRM state
  const [leadViewMode, setLeadViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // New Lead form
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadMobile, setLeadMobile] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadLocation, setLeadLocation] = useState('Mumbai Suburbs');
  const [leadType, setLeadType] = useState<CustomerType>('Builder');
  const [leadRequirement, setLeadRequirement] = useState('');
  const [leadQty, setLeadQty] = useState('');
  const [leadValue, setLeadValue] = useState<number>(500000);
  const [leadExecutive, setLeadExecutive] = useState('Gulab Rabbani (Head of Sales)');

  // Dispatch Logistics Assignment Modal
  const [dispatchOrder, setDispatchOrder] = useState<Order | null>(null);
  const [selectedTransporterId, setSelectedTransporterId] = useState<string>(transporters[0]?.id || '');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [selectedDriverId, setSelectedDriverId] = useState<string>(drivers[0]?.id || '');

  // Aggregate Metrics
  const totalGMV = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalCommission = orders.reduce((acc, o) => acc + o.platformCommission, 0);
  const totalLeadsValue = leads.reduce((acc, l) => acc + l.potentialValue, 0);
  const activeShipmentsCount = orders.filter(o => o.status === 'in_transit' || o.status === 'dispatched').length;

  const pipelineStages: { id: LeadStage; label: string; color: string }[] = [
    { id: 'new_lead', label: 'New Inquiries', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    { id: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { id: 'requirement_identified', label: 'Requirement Defined', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { id: 'quotation_shared', label: 'Quotation Shared', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { id: 'converted', label: 'Customer Converted', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  ];

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      name: leadName,
      company: leadCompany,
      mobile: leadMobile,
      email: leadEmail,
      location: leadLocation,
      businessType: leadType,
      materialRequirement: leadRequirement,
      estimatedQuantity: leadQty,
      potentialValue: leadValue,
      source: 'field_sales',
      stage: 'new_lead',
      assignedExecutive: leadExecutive,
      followUpDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      conversionProbability: 40,
      notes: [
        {
          id: 'note-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          author: leadExecutive,
          text: 'Prospect captured and assigned for immediate site contact.',
        }
      ]
    });
    setShowAddLeadModal(false);
  };

  const handleAddNoteToLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;
    addLeadNote(selectedLead.id, newNoteText, 'Gulab Rabbani');
    setNewNoteText('');
  };

  const handleDispatchAssign = () => {
    if (!dispatchOrder) return;
    assignTransporterAndDriver(dispatchOrder.id, selectedTransporterId, selectedVehicleId, selectedDriverId);
    setDispatchOrder(null);
  };

  // CSV Export helper
  const handleExportCSV = (type: 'orders' | 'leads' | 'suppliers') => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'orders') {
      csvContent += 'Order Number,Customer Company,Site,Gross Total,GST,Status,Supplier,Order Date\n';
      orders.forEach(o => {
        csvContent += `"${o.orderNumber}","${o.customerCompany}","${o.deliverySite.siteName}","${o.grandTotal}","${o.gstTotal}","${o.status}","${o.supplierName}","${o.orderDate}"\n`;
      });
    } else if (type === 'leads') {
      csvContent += 'Lead Number,Company,Contact Name,Mobile,Potential Value,Stage,Assigned Executive\n';
      leads.forEach(l => {
        csvContent += `"${l.leadNumber}","${l.company}","${l.name}","${l.mobile}","${l.potentialValue}","${l.stage}","${l.assignedExecutive}"\n`;
      });
    } else {
      csvContent += 'Supplier Name,Contact,City,GSTIN,Commission Rate %,Status,Rating\n';
      suppliers.forEach(s => {
        csvContent += `"${s.companyName}","${s.contactPerson}","${s.city}","${s.gstin}","${s.commissionRate}","${s.status}","${s.rating}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VG_Buildmart_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-500/20 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">Central Operations & Sales HQ</h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Customer Acquisition • Plant Settlements • Logistics Dispatch • Revenue Audits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExportCSV('orders')}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Sales Lead</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>HQ Overview</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('leads')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'leads'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Lead CRM & Acquisition ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('orders_dispatch')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'orders_dispatch'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Dispatch & Transport Allocator ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('suppliers')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'suppliers'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Supplier Network ({suppliers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('customers')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'customers'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Buyer Accounts & Sites</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('finance')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'finance'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Revenue & Settlements</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('reports')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'reports'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export Analytics</span>
        </button>
      </div>

      {/* Tab 1: HQ Overview */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Platform Gross GMV</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">
                ₹{totalGMV.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                Across Cement, Steel & Aggregates
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>VG Commission Earned</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-amber-600 mt-2">
                ₹{totalCommission.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Average take rate: 3.2%
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Active Road Shipments</span>
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-blue-600 mt-2">
                {activeShipmentsCount}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Heavy tippers & multi-axles en route
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Sales Pipeline Potential</span>
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-purple-600 mt-2">
                ₹{totalLeadsValue.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {leads.length} active contractor prospects
              </span>
            </div>
          </div>

          {/* Quick summaries: Category Performance & Executive Conversion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center justify-between">
                <span>Procurement Volume by Material Category</span>
                <span className="text-xs text-slate-400 font-normal">MT & Bags</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>TMT Steel Reinforcement Bars (Fe550D)</span>
                    <span>₹1,146,460 (52%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-[52%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>OPC & PPC Cement (UltraTech / Ambuja)</span>
                    <span>₹238,020 (32%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full w-[32%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Basalt Stone Aggregates & M-Sand</span>
                    <span>₹77,800 (16%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-[16%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4">
                Sales Acquisition Team Leaderboard
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Gulab Rabbani (Head of Sales)</span>
                    <p className="text-[11px] text-slate-500">Pipeline: ₹4,795,000 • 3 Key Builders</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    82% Conv. Rate
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Priya Sharma (Key Accounts)</span>
                    <p className="text-[11px] text-slate-500">Pipeline: ₹1,000,000 • 2 Infra Companies</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    75% Conv. Rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Customer Acquisition & CRM Pipeline */}
      {activeAdminTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Customer Acquisition & Lead Pipeline</h3>
              <p className="text-xs text-slate-500">
                Track builders, contractors, and construction companies through the conversion funnel.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLeadViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  leadViewMode === 'kanban' ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Kanban Funnel
              </button>
              <button
                onClick={() => setLeadViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  leadViewMode === 'table' ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setShowAddLeadModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Prospect</span>
              </button>
            </div>
          </div>

          {/* Kanban Board View */}
          {leadViewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-4">
              {pipelineStages.map((stage) => {
                const stageLeads = leads.filter(l => l.stage === stage.id);
                return (
                  <div key={stage.id} className="bg-slate-100/80 rounded-2xl p-3 flex flex-col min-w-[210px]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs font-bold text-slate-800">
                      <span>{stage.label}</span>
                      <span className="bg-white text-slate-700 px-2 py-0.5 rounded-full text-[10px]">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      {stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="bg-white p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900">{lead.company}</span>
                            <span className="text-[10px] text-slate-400">{lead.businessType}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1">{lead.materialRequirement}</p>
                          <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-100">
                            <span className="font-black text-amber-600">₹{lead.potentialValue.toLocaleString('en-IN')}</span>
                            <span className="text-slate-500">{lead.conversionProbability}% prob.</span>
                          </div>
                          <div className="text-[9px] text-slate-400 flex items-center justify-between">
                            <span>{lead.assignedExecutive.split(' ')[0]}</span>
                            <span>Due: {lead.followUpDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Company & Contact</th>
                    <th className="p-3.5">Business Type</th>
                    <th className="p-3.5">Material Requirement</th>
                    <th className="p-3.5 text-right">Potential Value</th>
                    <th className="p-3.5 text-center">Pipeline Stage</th>
                    <th className="p-3.5">Executive</th>
                    <th className="p-3.5 text-center">Follow-up Due</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{l.company}</span>
                        <span className="text-[11px] text-slate-500">{l.name} • {l.mobile}</span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-700">{l.businessType}</td>
                      <td className="p-3.5 text-slate-600 max-w-xs truncate">{l.materialRequirement}</td>
                      <td className="p-3.5 text-right font-black text-slate-900">
                        ₹{l.potentialValue.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-center">
                        <select
                          value={l.stage}
                          onChange={(e) => updateLeadStage(l.id, e.target.value as LeadStage)}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-300 bg-white"
                        >
                          {pipelineStages.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">{l.assignedExecutive}</td>
                      <td className="p-3.5 text-center text-slate-600 font-medium">{l.followUpDate}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedLead(l)}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          View Logs
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Dispatch & Logistics Assignment */}
      {activeAdminTab === 'orders_dispatch' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Order Fulfillment & Logistics Dispatch Center</h3>
            <p className="text-xs text-slate-500">Allocate transporters, heavy tippers, and drivers for confirmed consignments.</p>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900">{ord.orderNumber}</span>
                    <span className="text-xs text-slate-500 ml-2">Site: <strong>{ord.deliverySite.siteName} ({ord.deliverySite.city})</strong></span>
                  </div>
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-slate-900 text-amber-400">
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Buyer Company:</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{ord.customerCompany}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Fulfilling Supplier:</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{ord.supplierName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assigned Transporter / Vehicle:</span>
                    <span className="font-bold text-blue-700 mt-0.5 block">
                      {ord.transporterName ? `${ord.transporterName} • ${ord.vehicleRegNumber}` : 'Not Allocated Yet'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assigned Driver:</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {ord.driverName ? `${ord.driverName} (${ord.driverMobile})` : 'Awaiting Assignment'}
                    </span>
                  </div>
                </div>

                {/* Transporter Allocation Controls */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-600">Logistics Action:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setDispatchOrder(ord);
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{ord.transporterId ? 'Re-allocate Logistics' : 'Assign Transporter & Driver'}</span>
                    </button>
                    {ord.status === 'in_transit' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'delivered', 'Truck arrived at site. Weighbridge verification in progress.')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Mark Arrived at Site
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Supplier Network Management */}
      {activeAdminTab === 'suppliers' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Authorized Manufacturer & Depot Partners</h3>
            <p className="text-xs text-slate-500">Verify plant credentials, calibrate platform commission rates, and review ratings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((s) => (
              <div key={s.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{s.companyName}</h4>
                    <p className="text-xs text-slate-500">{s.contactPerson} • {s.mobile}</p>
                    <p className="text-[11px] font-mono text-slate-600 mt-0.5">GSTIN: {s.gstin}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                    s.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {s.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Warehouses / Works:</span>
                    <span className="font-semibold text-slate-800">{s.warehouseLocations.join(', ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform Commission:</span>
                    <span className="font-extrabold text-amber-600">{s.commissionRate}% per order</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fulfillment Rating:</span>
                    <span className="font-bold text-slate-800">{s.rating} / 5.0 ({s.totalOrders} Dispatches)</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {s.status === 'pending_verification' ? (
                    <button
                      onClick={() => updateSupplierStatus(s.id, 'approved', 3.0)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      Verify & Approve Plant
                    </button>
                  ) : (
                    <button
                      onClick={() => updateSupplierStatus(s.id, 'suspended')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Suspend Access
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Customers & Sites */}
      {activeAdminTab === 'customers' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Contractor & Builder Accounts</h3>
            <p className="text-xs text-slate-500">Manage registered building companies, active project sites, and authorized credit lines.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-black text-slate-900">{customer.companyName}</h4>
                <p className="text-xs text-slate-500">Contact: {customer.name} • {customer.mobile} • {customer.email}</p>
                <p className="text-xs font-mono text-slate-600 font-bold mt-0.5">GSTIN: {customer.gstin}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Authorized Credit Line</span>
                <span className="text-base font-black text-emerald-700">
                  ₹{customer.creditUsed.toLocaleString('en-IN')} / ₹{customer.creditLimit.toLocaleString('en-IN')} Used
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Registered Site Unloading Locations
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {customer.addresses.map((addr) => (
                  <div key={addr.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-bold text-slate-900 block">{addr.siteName}</span>
                    <p className="text-slate-500 mt-1">{addr.address}, {addr.city} - {addr.pincode}</p>
                    <p className="text-slate-600 font-semibold mt-1">Incharge: {addr.contactPerson} ({addr.contactMobile})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Finance & Payouts */}
      {activeAdminTab === 'finance' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Commercial Settlement Ledger</h3>
            <p className="text-xs text-slate-500">Payment receipts, platform commission take-rate, and supplier payable balances.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Order Ref</th>
                  <th className="p-3.5">Fulfilling Supplier</th>
                  <th className="p-3.5 text-right">Gross GMV</th>
                  <th className="p-3.5 text-right">Platform Commission</th>
                  <th className="p-3.5 text-right">Supplier Payout</th>
                  <th className="p-3.5 text-center">Payment Term</th>
                  <th className="p-3.5 text-center">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{ord.orderNumber}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{ord.supplierName}</td>
                    <td className="p-3.5 text-right font-black text-slate-900">
                      ₹{ord.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-amber-600">
                      ₹{ord.platformCommission.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-emerald-700">
                      ₹{ord.supplierPayout.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center uppercase font-bold text-[10px] text-slate-600">
                      {ord.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 7: Reports & Analytics Export */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Operational & Financial Reports</h3>
            <p className="text-xs text-slate-500">Download reconciled CSV spreadsheets for accounting and executive review.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <FileSpreadsheet className="w-8 h-8 text-emerald-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-900">Order Transactions Ledger</h4>
                <p className="text-xs text-slate-500 mt-1">Complete order log with GST, supplier payout, and freight breakdown.</p>
              </div>
              <button
                onClick={() => handleExportCSV('orders')}
                className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Download Orders CSV
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <FileSpreadsheet className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-900">Sales Acquisition Leads Report</h4>
                <p className="text-xs text-slate-500 mt-1">Lead status, pipeline volume, follow-up dates, and conversion odds.</p>
              </div>
              <button
                onClick={() => handleExportCSV('leads')}
                className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Download Leads CSV
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <FileSpreadsheet className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-900">Supplier Performance Summary</h4>
                <p className="text-xs text-slate-500 mt-1">Depot listings, commission schedules, dispatch volumes, and ratings.</p>
              </div>
              <button
                onClick={() => handleExportCSV('suppliers')}
                className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Download Suppliers CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logistics Transporter & Driver Allocation Modal */}
      {dispatchOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-600" />
                Allocate Transporter for {dispatchOrder.orderNumber}
              </h3>
              <button onClick={() => setDispatchOrder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="font-bold text-slate-900">Destination: {dispatchOrder.deliverySite.siteName}</p>
                <p className="text-slate-600">{dispatchOrder.deliverySite.address}, {dispatchOrder.deliverySite.city}</p>
                <p className="text-slate-500 mt-1">
                  Materials: {dispatchOrder.items.map(i => `${i.quantity} ${i.unit} ${i.productName}`).join(', ')}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Transport Partner</label>
                <select
                  value={selectedTransporterId}
                  onChange={(e) => setSelectedTransporterId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                >
                  {transporters.map(t => (
                    <option key={t.id} value={t.id}>{t.companyName} ({t.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Fleet Vehicle (Tonnage)</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registrationNumber} • {v.type} ({v.capacityTonnes} MT)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Registered Driver</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.mobile}) • Rating: {d.rating}★</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchOrder(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDispatchAssign}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                >
                  Confirm Fleet Allocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail & Call Log Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedLead.company}</h3>
                <p className="text-xs text-slate-500">{selectedLead.name} • {selectedLead.mobile} • {selectedLead.location}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-500 block">Requirement:</span>
                  <span className="font-bold text-slate-900">{selectedLead.materialRequirement}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Potential Deal Value:</span>
                  <span className="font-black text-amber-600">₹{selectedLead.potentialValue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Conversion Button */}
              {selectedLead.stage !== 'converted' && (
                <button
                  type="button"
                  onClick={() => {
                    convertLeadToCustomer(selectedLead.id);
                    setSelectedLead({ ...selectedLead, stage: 'converted' });
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Convert Lead into Active Customer Account</span>
                </button>
              )}

              {/* Activity / Notes Thread */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Interaction History & Call Notes</h4>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {selectedLead.notes.map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-700">{n.author}</span>
                        <span>{n.date}</span>
                      </div>
                      <p className="text-slate-700 mt-1">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Log new note */}
              <form onSubmit={handleAddNoteToLead} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Log site visit, negotiation, or payment call..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-amber-400 px-4 py-2 rounded-xl font-bold cursor-pointer"
                >
                  Log
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Log New Builder / Contractor Lead</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    placeholder="e.g. Skyline Towers LLP"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Rajesh Khurana"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={leadMobile}
                    onChange={(e) => setLeadMobile(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Type</label>
                  <select
                    value={leadType}
                    onChange={(e) => setLeadType(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="Builder">Builder / Developer</option>
                    <option value="Contractor">Civil Contractor</option>
                    <option value="Construction Company">Construction Company</option>
                    <option value="Dealer">Material Dealer</option>
                    <option value="Individual">Individual Home Builder</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Material Requirement</label>
                <input
                  type="text"
                  required
                  value={leadRequirement}
                  onChange={(e) => setLeadRequirement(e.target.value)}
                  placeholder="e.g. 100 MT Fe550D TMT + 2000 Bags OPC Cement"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Potential Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={leadValue}
                    onChange={(e) => setLeadValue(parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Sales Executive</label>
                  <select
                    value={leadExecutive}
                    onChange={(e) => setLeadExecutive(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="Gulab Rabbani (Head of Sales)">Gulab Rabbani (Head of Sales)</option>
                    <option value="Priya Sharma (Key Accounts)">Priya Sharma (Key Accounts)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
