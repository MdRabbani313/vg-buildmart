export type UserRole = 'customer' | 'supplier' | 'admin' | 'transporter' | 'driver';

export type CustomerType = 
  | 'Individual' 
  | 'Contractor' 
  | 'Builder' 
  | 'Dealer' 
  | 'Construction Company';

export type ProductCategory = 
  | 'cement' 
  | 'steel' 
  | 'stone' 
  | 'sand_bricks' 
  | 'blocks';

export type MaterialUnit = 'bag' | 'tonne' | 'piece' | 'cu.ft';

export interface BulkPriceSlab {
  minQty: number;
  maxQty?: number;
  discountPercent: number;
  pricePerUnit: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  grade: string;
  unit: MaterialUnit;
  basePrice: number;
  sellingPrice: number;
  moq: number; // Minimum Order Quantity
  stockQuantity: number;
  isAvailable: boolean;
  supplierId: string;
  supplierName: string;
  location: string;
  imageUrl: string;
  description: string;
  specs: Record<string, string>;
  bulkSlabs: BulkPriceSlab[];
  gstRate: number; // 18 or 28%
  featured?: boolean;
}

export interface DeliverySiteAddress {
  id: string;
  siteName: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  contactMobile: string;
  isDefault?: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  mobile: string;
  email: string;
  companyName: string;
  customerType: CustomerType;
  gstin?: string;
  addresses: DeliverySiteAddress[];
  creditLimit: number;
  creditUsed: number;
  registeredDate: string;
}

export interface QuoteItem {
  productId: string;
  productName: string;
  brand: string;
  quantity: number;
  unit: MaterialUnit;
  targetPrice?: number;
  quotedUnitPrice?: number;
  total: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerCompany: string;
  siteLocation: string;
  requiredDeliveryDate: string;
  supplierId: string;
  supplierName: string;
  items: QuoteItem[];
  status: 'pending_supplier' | 'quoted' | 'revised' | 'accepted' | 'rejected' | 'converted_to_order' | 'expired';
  quotationSubtotal?: number;
  taxes?: number;
  freightEstimate?: number;
  grandTotal?: number;
  validityDate: string;
  paymentTerms: string;
  supplierNotes?: string;
  customerRemarks?: string;
  createdAt: string;
}

export type OrderStatus = 
  | 'order_placed' 
  | 'supplier_confirmed' 
  | 'payment_confirmed' 
  | 'material_preparation' 
  | 'transport_assigned' 
  | 'dispatched' 
  | 'in_transit' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  grade: string;
  quantity: number;
  unit: MaterialUnit;
  unitPrice: number;
  totalPrice: number;
  gstRate: number;
  gstAmount: number;
}

export interface TimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note?: string;
  done: boolean;
}

export interface ProofOfDelivery {
  recipientName: string;
  recipientMobile: string;
  deliveredAt: string;
  remarks: string;
  signatureConfirmed: boolean;
  photoUrl?: string;
  materialVerified: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerCompany: string;
  deliverySite: DeliverySiteAddress;
  items: OrderItem[];
  subtotal: number;
  gstTotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  paymentMethod: 'razorpay' | 'neft_rtgs' | 'credit_line' | 'cash_on_delivery';
  paymentStatus: 'paid' | 'pending' | 'authorized' | 'failed';
  paymentReference?: string;
  status: OrderStatus;
  supplierId: string;
  supplierName: string;
  transporterId?: string;
  transporterName?: string;
  vehicleId?: string;
  vehicleRegNumber?: string;
  vehicleType?: string;
  driverId?: string;
  driverName?: string;
  driverMobile?: string;
  expectedDeliveryDate: string;
  orderDate: string;
  timeline: TimelineEvent[];
  platformCommission: number; // in INR
  supplierPayout: number; // in INR
  podDetails?: ProofOfDelivery;
  rating?: number;
  reviewFeedback?: string;
}

export type LeadStage = 
  | 'new_lead' 
  | 'contacted' 
  | 'requirement_identified' 
  | 'quotation_shared' 
  | 'negotiation' 
  | 'converted' 
  | 'lost';

export interface LeadNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface Lead {
  id: string;
  leadNumber: string;
  name: string;
  mobile: string;
  email: string;
  company: string;
  location: string;
  businessType: CustomerType;
  materialRequirement: string;
  estimatedQuantity: string;
  potentialValue: number;
  source: 'website_inquiry' | 'quotation_request' | 'referral' | 'field_sales' | 'campaign';
  stage: LeadStage;
  assignedExecutive: string;
  followUpDate: string;
  conversionProbability: number; // 0 - 100%
  notes: LeadNote[];
  createdAt: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  gstin: string;
  city: string;
  state: string;
  warehouseLocations: string[];
  serviceableDistricts: string[];
  categories: ProductCategory[];
  commissionRate: number; // e.g., 3.5%
  status: 'approved' | 'pending_verification' | 'suspended';
  rating: number;
  totalOrders: number;
  totalRevenue: number;
  joinedDate: string;
}

export interface Vehicle {
  id: string;
  transporterId: string;
  registrationNumber: string;
  type: '10 Ton Tipper' | '25 Ton Multi-axle' | '40 Ton Trailer' | 'Pickup Light Truck';
  capacityTonnes: number;
  status: 'available' | 'on_trip' | 'maintenance';
  fitnessExpiry: string;
}

export interface Driver {
  id: string;
  transporterId: string;
  name: string;
  mobile: string;
  licenseNumber: string;
  assignedVehicleId?: string;
  status: 'available' | 'on_delivery' | 'off_duty';
  totalDeliveries: number;
  rating: number;
}

export interface Transporter {
  id: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  city: string;
  serviceableAreas: string[];
  gstin: string;
  status: 'active' | 'pending' | 'suspended';
  ratePerKm: number;
  ratePerTonne: number;
  totalTrips: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPricePerUnit: number;
}
