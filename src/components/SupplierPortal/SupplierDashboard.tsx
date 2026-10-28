import React, { useState, useMemo } from 'react';
import { Supplier, Order, Product, Quotation } from '../../types';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Truck, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  BarChart3, 
  PieChart, 
  Activity, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface SupplierDashboardProps {
  supplier: Supplier;
  orders: Order[];
  products: Product[];
  quotations: Quotation[];
  onNavigateToOrders: () => void;
  onNavigateToQuotes: () => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;
}

export const SupplierDashboard: React.FC<SupplierDashboardProps> = ({
  supplier,
  orders,
  products,
  quotations,
  onNavigateToOrders,
  onNavigateToQuotes,
  onUpdateOrderStatus
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'volume'>('revenue');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Filter supplier orders
  const supplierOrders = useMemo(() => {
    return orders.filter(o => o.supplierId === supplier.id || o.supplierName.includes(supplier.companyName));
  }, [orders, supplier]);

  // Real-time computed metrics
  const activeOrders = useMemo(() => {
    return supplierOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  }, [supplierOrders]);

  const activeOrdersCount = activeOrders.length;

  const totalDeliveredOrders = useMemo(() => {
    return supplierOrders.filter(o => o.status === 'completed');
  }, [supplierOrders]);

  const totalRevenue = useMemo(() => {
    return supplierOrders.reduce((acc, o) => acc + o.grandTotal, 0);
  }, [supplierOrders]);

  const netSupplierPayout = useMemo(() => {
    return supplierOrders.reduce((acc, o) => acc + o.supplierPayout, 0);
  }, [supplierOrders]);

  // Average Fulfillment Time calculation (simulated realistic metrics based on supplier category)
  // e.g. Cement plants avg 24h, Steel hubs avg 36h, Stone quarries avg 18h
  const avgFulfillmentHours = useMemo(() => {
    if (supplier.categories.includes('steel')) return 32.4;
    if (supplier.categories.includes('cement')) return 24.8;
    return 19.2;
  }, [supplier]);

  // Monthly Revenue Data for Chart
  const revenueChartData = useMemo(() => {
    if (timeRange === '7d') {
      return [
        { label: 'Mon', revenue: 142000, payout: 137030, volumeMT: 35, orders: 2 },
        { label: 'Tue', revenue: 285000, payout: 275025, volumeMT: 68, orders: 4 },
        { label: 'Wed', revenue: 410000, payout: 395650, volumeMT: 95, orders: 5 },
        { label: 'Thu', revenue: 198000, payout: 191070, volumeMT: 48, orders: 3 },
        { label: 'Fri', revenue: 560000, payout: 540400, volumeMT: 130, orders: 7 },
        { label: 'Sat', revenue: 320000, payout: 308800, volumeMT: 74, orders: 4 },
        { label: 'Sun', revenue: 95000, payout: 91675, volumeMT: 22, orders: 1 },
      ];
    } else if (timeRange === '30d') {
      return [
        { label: 'Week 1', revenue: 980000, payout: 945700, volumeMT: 240, orders: 14 },
        { label: 'Week 2', revenue: 1240000, payout: 1196600, volumeMT: 310, orders: 18 },
        { label: 'Week 3', revenue: 1460000, payout: 1408900, volumeMT: 375, orders: 22 },
        { label: 'Week 4 (Current)', revenue: 1170000, payout: 1129050, volumeMT: 295, orders: 17 },
      ];
    } else {
      return [
        { label: 'Aug 2026', revenue: 3450000, payout: 3329250, volumeMT: 850, orders: 52 },
        { label: 'Sep 2026', revenue: 4120000, payout: 3975800, volumeMT: 1020, orders: 64 },
        { label: 'Oct 2026', revenue: 4850000, payout: 4680250, volumeMT: 1210, orders: 78 },
      ];
    }
  }, [timeRange]);

  const maxChartValue = Math.max(...revenueChartData.map(d => chartMetric === 'revenue' ? d.revenue : d.volumeMT));

  // Fulfillment Phase breakdown (Hours per stage)
  const fulfillmentBreakdown = [
    { stage: 'Order Confirmation & Batch Allocation', hours: 2.4, percent: 10, color: 'bg-blue-500' },
    { stage: 'Weighbridge Gross & Pallet Bundling', hours: 4.8, percent: 20, color: 'bg-amber-500' },
    { stage: 'Highway Truck Transit Corridors', hours: 14.6, percent: 58, color: 'bg-purple-600' },
    { stage: 'Site Offloading & Tare Verification', hours: 3.0, percent: 12, color: 'bg-emerald-500' },
  ];

  // Status breakdown of current active orders
  const statusStats = useMemo(() => {
    return {
      placed: supplierOrders.filter(o => o.status === 'order_placed').length,
      confirmed: supplierOrders.filter(o => o.status === 'supplier_confirmed').length,
      prep: supplierOrders.filter(o => o.status === 'material_preparation').length,
      assigned: supplierOrders.filter(o => o.status === 'transport_assigned').length,
      inTransit: supplierOrders.filter(o => o.status === 'in_transit' || o.status === 'dispatched').length,
      completed: supplierOrders.filter(o => o.status === 'completed').length,
    };
  }, [supplierOrders]);

  return (
    <div className="space-y-6">
      {/* Top Real-Time Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Metric 1: Active Orders */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Active Consignments
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {activeOrdersCount}
                </span>
                <span className="text-xs font-bold text-slate-500">In Pipeline</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {statusStats.inTransit} on road • {statusStats.prep} in plant bundling
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +18.4%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">vs last month</span>
            </div>
          </div>

          {/* Mini Status Gauge */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1">
            <div 
              style={{ width: `${Math.max(15, (statusStats.placed / (activeOrdersCount || 1)) * 100)}%` }} 
              className="h-1.5 rounded-full bg-amber-400" 
              title="Awaiting Confirmation"
            />
            <div 
              style={{ width: `${Math.max(25, (statusStats.prep / (activeOrdersCount || 1)) * 100)}%` }} 
              className="h-1.5 rounded-full bg-blue-500" 
              title="Material Prep"
            />
            <div 
              style={{ width: `${Math.max(30, (statusStats.inTransit / (activeOrdersCount || 1)) * 100)}%` }} 
              className="h-1.5 rounded-full bg-purple-600" 
              title="In Transit"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> New ({statusStats.placed})</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Prep ({statusStats.prep})</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span> Transit ({statusStats.inTransit})</span>
          </div>
        </div>

        {/* Metric 2: Average Fulfillment Time */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Avg Fulfillment Time
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {avgFulfillmentHours}
                </span>
                <span className="text-xs font-extrabold text-slate-600">Hours</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Order confirmation to verified site tare delivery
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                <ArrowDownRight className="w-3.5 h-3.5" />
                -3.2 hrs
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Faster dispatch</span>
            </div>
          </div>

          {/* SLA Badge */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Platform 48h SLA:</span>
            <span className="font-extrabold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 97.4% On-Time
            </span>
          </div>
        </div>

        {/* Metric 3: Total Revenue */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Total Depot Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  ₹{(totalRevenue / 100000).toFixed(1)}L
                </span>
                <span className="text-xs font-bold text-slate-500">GMV</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                Net Payout: ₹{netSupplierPayout.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +24.1%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">YOY growth</span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Platform Take-Rate:</span>
            <span className="font-extrabold text-slate-800">{supplier.commissionRate}% Commission</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Revenue & Volume Velocity Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">
                  {chartMetric === 'revenue' ? 'Revenue & Commercial Payout Trajectory' : 'Dispatched Volume Velocity (Metric Tonnes)'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time gross transactional value processed through VG Buildmart
              </p>
            </div>

            {/* Controls: Metric Switch & Timeframe */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
                <button
                  onClick={() => setChartMetric('revenue')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    chartMetric === 'revenue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Revenue (₹)
                </button>
                <button
                  onClick={() => setChartMetric('volume')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    chartMetric === 'volume' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Volume (MT)
                </button>
              </div>

              <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
                {(['7d', '30d', '90d'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 rounded-lg uppercase transition-colors cursor-pointer ${
                      timeRange === range ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive SVG Bar & Trend Chart */}
          <div className="h-64 w-full flex flex-col justify-end pt-4">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-200 relative">
              {/* Background horizontal guide lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-200 w-full"></div>
                <div className="border-b border-dashed border-slate-200 w-full"></div>
                <div className="border-b border-dashed border-slate-200 w-full"></div>
              </div>

              {revenueChartData.map((item, index) => {
                const val = chartMetric === 'revenue' ? item.revenue : item.volumeMT;
                const heightPercent = Math.max(12, Math.round((val / maxChartValue) * 100));
                const isHovered = hoveredBarIndex === index;

                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredBarIndex(index)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] px-3 py-1.5 rounded-xl shadow-xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
                        <span className="font-bold block">{item.label}</span>
                        {chartMetric === 'revenue' ? (
                          <>
                            <span className="text-amber-400 font-black">Gross: ₹{item.revenue.toLocaleString('en-IN')}</span>
                            <span className="text-emerald-400 block text-[10px]">Payout: ₹{item.payout.toLocaleString('en-IN')}</span>
                          </>
                        ) : (
                          <span className="text-amber-400 font-black">{item.volumeMT} MT ({item.orders} Orders)</span>
                        )}
                      </div>
                    )}

                    {/* Dual bar or single bar */}
                    <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-300 ${
                          isHovered
                            ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                            : 'bg-gradient-to-t from-blue-700 to-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs font-semibold text-slate-500 mt-2 px-2">
              {revenueChartData.map((item, idx) => (
                <span key={idx} className="text-center flex-1">{item.label}</span>
              ))}
            </div>
          </div>

          {/* Chart Footer Highlights */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="w-3 h-3 rounded bg-blue-600"></span>
                Gross Platform Value
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                Net Plant Payout
              </span>
            </div>
            <span className="text-slate-400">
              *Taxes and logistics fees calculated at site dispatch
            </span>
          </div>
        </div>

        {/* Right Column: Fulfillment Time Breakdown & SLA Benchmarks */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stage Duration Breakdown Chart */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900">
                  Fulfillment Stage Velocity
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Average duration spent per order phase
              </p>
            </div>

            {/* Horizontal Stage Bars */}
            <div className="space-y-3 text-xs">
              {fulfillmentBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-semibold line-clamp-1">{item.stage}</span>
                    <span className="font-mono font-bold text-slate-900 shrink-0 ml-2">
                      {item.hours}h ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${item.percent}%` }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Compliance Badge */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  Grade A Stockyard Rating
                </span>
                <p className="text-[11px] text-emerald-700 leading-snug mt-0.5">
                  Over 98% of consignments are bundled, weighed, and ready for driver pickup within 6 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                Pending Workflows
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={onNavigateToOrders}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="font-bold">Active Orders Dispatch</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="font-black text-amber-400">{activeOrdersCount}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={onNavigateToQuotes}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">Pending RFQ Quotes</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="font-black text-amber-400">
                    {quotations.filter(q => q.status === 'pending_supplier').length}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Active Consignments Action Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Active Consignments Requiring Plant Action
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live dispatches synchronized with transporters and site engineers
            </p>
          </div>

          <button
            onClick={onNavigateToOrders}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All {supplierOrders.length} Orders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {activeOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
            <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">All current orders have been fulfilled</p>
            <p className="text-[11px] text-slate-500 mt-0.5">New incoming orders from builders will appear here instantly.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {activeOrders.slice(0, 4).map((ord) => (
              <div key={ord.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                    <span className="font-semibold text-slate-700">• {ord.customerCompany}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.2 rounded font-medium">
                      Site: {ord.deliverySite.siteName}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {ord.items.map(i => `${i.quantity} ${i.unit} ${i.productName}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-black text-slate-900 block">
                      ₹{ord.grandTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Payout: ₹{ord.supplierPayout.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-blue-200">
                    {ord.status.replace('_', ' ')}
                  </span>

                  {/* 1-Click Status Advancer */}
                  {ord.status === 'order_placed' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'supplier_confirmed', 'Stock allocated')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Confirm Stock
                    </button>
                  )}
                  {ord.status === 'supplier_confirmed' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'material_preparation', 'Bundling & tare weighment started')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Start Preparation
                    </button>
                  )}
                  {ord.status === 'material_preparation' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'transport_assigned', 'Awaiting transporter vehicle')}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Request Transporter
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
