import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Product,
  CustomerProfile,
  Order,
  Quotation,
  Lead,
  Supplier,
  Transporter,
  Vehicle,
  Driver,
  CartItem,
  OrderStatus,
  LeadStage,
  ProofOfDelivery,
  DeliverySiteAddress
} from '../types';
import {
  initialProducts,
  initialCustomerProfile,
  initialOrders,
  initialQuotations,
  initialLeads,
  initialSuppliers,
  initialTransporters,
  initialVehicles,
  initialDrivers
} from '../data/mockData';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  time: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  products: Product[];
  customer: CustomerProfile;
  orders: Order[];
  quotations: Quotation[];
  leads: Lead[];
  suppliers: Supplier[];
  transporters: Transporter[];
  vehicles: Vehicle[];
  drivers: Driver[];
  cart: CartItem[];
  notifications: AppNotification[];
  selectedAddress: DeliverySiteAddress;
  setSelectedAddress: (address: DeliverySiteAddress) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartSummary: () => { subtotal: number; gstTotal: number; deliveryFee: number; total: number; itemCount: number };
  
  // Order Actions
  placeOrder: (paymentMethod: Order['paymentMethod'], deliveryFee?: number) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  assignTransporterAndDriver: (orderId: string, transporterId: string, vehicleId: string, driverId: string) => void;
  submitProofOfDelivery: (orderId: string, pod: ProofOfDelivery) => void;
  addOrderReview: (orderId: string, rating: number, feedback: string) => void;
  
  // Quotation Actions
  createQuotationRequest: (quoteData: Partial<Quotation> & { items: Quotation['items'] }) => Quotation;
  respondToQuotation: (quoteId: string, quotedItems: Quotation['items'], freightEstimate: number, supplierNotes: string, validityDays: number) => void;
  acceptQuotationAndCreateOrder: (quoteId: string) => Order | null;
  rejectQuotation: (quoteId: string) => void;
  
  // Product / Supplier Actions
  updateProductStock: (productId: string, newStock: number, isAvailable: boolean) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateSupplierStatus: (supplierId: string, status: Supplier['status'], commissionRate?: number) => void;
  
  // CRM Lead Actions
  addLead: (lead: Omit<Lead, 'id' | 'leadNumber' | 'createdAt'>) => void;
  updateLeadStage: (leadId: string, stage: LeadStage) => void;
  addLeadNote: (leadId: string, noteText: string, author: string) => void;
  convertLeadToCustomer: (leadId: string) => void;
  
  // Logistics Actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  addDriver: (driver: Omit<Driver, 'id' | 'totalDeliveries' | 'rating'>) => void;
  
  // Notification Actions
  dismissNotification: (id: string) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'vg_buildmart_data_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}products`);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}customer`);
    return saved ? JSON.parse(saved) : initialCustomerProfile;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}orders`);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}quotations`);
    return saved ? JSON.parse(saved) : initialQuotations;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}leads`);
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}suppliers`);
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [transporters] = useState<Transporter[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}transporters`);
    return saved ? JSON.parse(saved) : initialTransporters;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}vehicles`);
    return saved ? JSON.parse(saved) : initialVehicles;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}drivers`);
    return saved ? JSON.parse(saved) : initialDrivers;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}cart`);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedAddress, setSelectedAddress] = useState<DeliverySiteAddress>(
    customer.addresses.find(a => a.isDefault) || customer.addresses[0]
  );

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Active Shipment in Transit',
      message: 'Consignment VGB-2026-1001 is on the road with Driver Ramesh Yadav.',
      type: 'info',
      time: 'Just now',
    }
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}customer`, JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}quotations`, JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}leads`, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}suppliers`, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}vehicles`, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}drivers`, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}cart`, JSON.stringify(cart));
  }, [cart]);

  const addNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 5)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Helper for product slab calculation
  const getProductPriceForQty = (product: Product, qty: number): number => {
    if (!product.bulkSlabs || product.bulkSlabs.length === 0) {
      return product.sellingPrice;
    }
    // Find best matching slab
    const applicableSlab = [...product.bulkSlabs]
      .sort((a, b) => b.minQty - a.minQty)
      .find(slab => qty >= slab.minQty);
    
    return applicableSlab ? applicableSlab.pricePerUnit : product.sellingPrice;
  };

  // Cart Management
  const addToCart = (product: Product, quantity: number) => {
    const effectivePrice = getProductPriceForQty(product, quantity);
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const newPrice = getProductPriceForQty(product, newQty);
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQty, selectedPricePerUnit: newPrice }
            : item
        );
      } else {
        return [...prev, { product, quantity, selectedPricePerUnit: effectivePrice }];
      }
    });
    addNotification('Added to Order Cart', `${quantity} ${product.unit} of ${product.brand} added at ₹${effectivePrice.toLocaleString('en-IN')}/${product.unit}`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const effectivePrice = getProductPriceForQty(item.product, quantity);
          return { ...item, quantity, selectedPricePerUnit: effectivePrice };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartSummary = () => {
    let subtotal = 0;
    let gstTotal = 0;
    let totalWeightTons = 0;

    cart.forEach(item => {
      const itemSub = item.selectedPricePerUnit * item.quantity;
      subtotal += itemSub;
      const gst = (itemSub * item.product.gstRate) / 100;
      gstTotal += gst;

      // Approximate tonnage for freight calculation
      if (item.product.unit === 'tonne') {
        totalWeightTons += item.quantity;
      } else if (item.product.unit === 'bag') {
        totalWeightTons += (item.quantity * 50) / 1000;
      } else if (item.product.unit === 'piece') {
        totalWeightTons += (item.quantity * 16) / 1000;
      }
    });

    // Base delivery fee formula: ₹2500 base + ₹350 per ton
    const deliveryFee = cart.length > 0 ? Math.max(3500, Math.round(2500 + totalWeightTons * 350)) : 0;
    const total = subtotal + gstTotal + deliveryFee;

    return {
      subtotal,
      gstTotal,
      deliveryFee,
      total,
      itemCount: cart.reduce((acc, curr) => acc + curr.quantity, 0),
    };
  };

  // Place Order
  const placeOrder = (paymentMethod: Order['paymentMethod'], customDeliveryFee?: number): Order => {
    if (cart.length === 0) throw new Error('Cart is empty');

    const summary = getCartSummary();
    const finalDeliveryFee = customDeliveryFee !== undefined ? customDeliveryFee : summary.deliveryFee;
    const finalGrandTotal = summary.subtotal + summary.gstTotal + finalDeliveryFee;

    // Group items or pick the primary supplier
    const primarySupplier = suppliers.find(s => s.id === cart[0].product.supplierId) || suppliers[0];
    const orderNum = `VGB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      customerId: customer.id,
      customerName: customer.name,
      customerMobile: customer.mobile,
      customerCompany: customer.companyName,
      deliverySite: selectedAddress,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        grade: item.product.grade,
        quantity: item.quantity,
        unit: item.product.unit,
        unitPrice: item.selectedPricePerUnit,
        totalPrice: item.selectedPricePerUnit * item.quantity,
        gstRate: item.product.gstRate,
        gstAmount: (item.selectedPricePerUnit * item.quantity * item.product.gstRate) / 100,
      })),
      subtotal: summary.subtotal,
      gstTotal: summary.gstTotal,
      deliveryFee: finalDeliveryFee,
      discount: 0,
      grandTotal: finalGrandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : paymentMethod === 'credit_line' ? 'authorized' : 'pending',
      paymentReference: paymentMethod === 'razorpay' ? `pay_RZP_${Math.floor(1000000 + Math.random() * 9000000)}` : undefined,
      status: 'order_placed',
      supplierId: primarySupplier.id,
      supplierName: primarySupplier.companyName,
      expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orderDate: new Date().toISOString(),
      timeline: [
        { status: 'order_placed', label: 'Order Confirmed by Buyer', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true, note: 'Order successfully logged in system' },
        { status: 'supplier_confirmed', label: 'Manufacturer Order Confirmation', timestamp: '', done: false },
        { status: 'payment_confirmed', label: 'Payment / Credit Authorization', timestamp: paymentMethod === 'razorpay' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '', done: paymentMethod === 'razorpay' },
        { status: 'material_preparation', label: 'Material Weighment & Loading', timestamp: '', done: false },
        { status: 'transport_assigned', label: 'Vehicle & Driver Allocated', timestamp: '', done: false },
        { status: 'dispatched', label: 'Dispatched from Supplier Yard', timestamp: '', done: false },
        { status: 'in_transit', label: 'In Transit to Construction Site', timestamp: '', done: false },
        { status: 'delivered', label: 'Delivered at Site & Inspection', timestamp: '', done: false },
        { status: 'completed', label: 'POD Verification & Billing Closure', timestamp: '', done: false }
      ],
      platformCommission: Math.round(summary.subtotal * (primarySupplier.commissionRate / 100)),
      supplierPayout: Math.round(summary.subtotal * (1 - primarySupplier.commissionRate / 100)),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    addNotification('Order Confirmed!', `Order ${newOrder.orderNumber} placed for ₹${finalGrandTotal.toLocaleString('en-IN')}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;

        const updatedTimeline = ord.timeline.map(step => {
          if (step.status === status) {
            return {
              ...step,
              done: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
              note: note || step.note,
            };
          }
          return step;
        });

        return {
          ...ord,
          status,
          timeline: updatedTimeline,
        };
      })
    );
    addNotification('Order Updated', `Order ${orderId} moved to status: ${status.replace('_', ' ').toUpperCase()}`);
  };

  const assignTransporterAndDriver = (orderId: string, transporterId: string, vehicleId: string, driverId: string) => {
    const selectedTrans = transporters.find(t => t.id === transporterId);
    const selectedVeh = vehicles.find(v => v.id === vehicleId);
    const selectedDriv = drivers.find(d => d.id === driverId);

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        const updatedTimeline = ord.timeline.map(step => {
          if (step.status === 'transport_assigned') {
            return {
              ...step,
              done: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Vehicle: ${selectedVeh?.registrationNumber} | Driver: ${selectedDriv?.name} (${selectedDriv?.mobile})`,
            };
          }
          return step;
        });

        return {
          ...ord,
          status: 'transport_assigned',
          transporterId,
          transporterName: selectedTrans?.companyName,
          vehicleId,
          vehicleRegNumber: selectedVeh?.registrationNumber,
          vehicleType: selectedVeh?.type,
          driverId,
          driverName: selectedDriv?.name,
          driverMobile: selectedDriv?.mobile,
          timeline: updatedTimeline,
        };
      })
    );

    // Update vehicle & driver status
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status: 'on_trip' } : v));
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status: 'on_delivery' } : d));

    addNotification('Logistics Allocated', `Transporter & driver ${selectedDriv?.name} assigned to Order`);
  };

  const submitProofOfDelivery = (orderId: string, pod: ProofOfDelivery) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        const updatedTimeline = ord.timeline.map(step => {
          if (step.status === 'delivered' || step.status === 'completed') {
            return {
              ...step,
              done: true,
              timestamp: pod.deliveredAt,
              note: `Received by: ${pod.recipientName} (${pod.recipientMobile}). Verified.`,
            };
          }
          return step;
        });

        return {
          ...ord,
          status: 'completed',
          podDetails: pod,
          timeline: updatedTimeline,
        };
      })
    );

    addNotification('Proof of Delivery Uploaded', `Consignment delivered to ${pod.recipientName} at construction site`);
  };

  const addOrderReview = (orderId: string, rating: number, feedback: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        return { ...ord, rating, reviewFeedback: feedback };
      })
    );
    addNotification('Thank you!', 'Your feedback has been submitted to VG Buildmart');
  };

  // Quotation Request Management
  const createQuotationRequest = (quoteData: Partial<Quotation> & { items: Quotation['items'] }): Quotation => {
    const quoteNum = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newQuote: Quotation = {
      id: 'quote-' + Date.now(),
      quoteNumber: quoteNum,
      customerId: customer.id,
      customerName: customer.name,
      customerMobile: customer.mobile,
      customerCompany: customer.companyName,
      siteLocation: quoteData.siteLocation || selectedAddress.address,
      requiredDeliveryDate: quoteData.requiredDeliveryDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      supplierId: quoteData.supplierId || 'supp-1',
      supplierName: quoteData.supplierName || 'UltraTech Regional Stockyard & Logistics',
      items: quoteData.items,
      status: 'pending_supplier',
      validityDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      paymentTerms: 'Negotiated on bulk confirmation',
      customerRemarks: quoteData.customerRemarks || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setQuotations(prev => [newQuote, ...prev]);

    // Automatically create a CRM Lead for sales executives to follow up!
    const estimatedVal = newQuote.items.reduce((acc, curr) => acc + (curr.targetPrice || 0) * curr.quantity, 0) || 500000;
    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      leadNumber: `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      company: customer.companyName,
      location: quoteData.siteLocation || 'Mumbai Area',
      businessType: customer.customerType,
      materialRequirement: newQuote.items.map(i => `${i.productName} (${i.quantity} ${i.unit})`).join(', '),
      estimatedQuantity: `${newQuote.items.reduce((a, c) => a + c.quantity, 0)} Units`,
      potentialValue: estimatedVal,
      source: 'quotation_request',
      stage: 'new_lead',
      assignedExecutive: 'Gulab Rabbani (Head of Sales)',
      followUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      conversionProbability: 60,
      notes: [
        {
          id: 'n-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          author: 'System Auto-Capture',
          text: `Captured RFQ ${newQuote.quoteNumber} for site: ${newQuote.siteLocation}`,
        }
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads(prev => [newLead, ...prev]);

    addNotification('Quotation Request Sent', `RFQ ${quoteNum} sent to supplier. Sales CRM lead automatically logged.`);
    return newQuote;
  };

  const respondToQuotation = (
    quoteId: string,
    quotedItems: Quotation['items'],
    freightEstimate: number,
    supplierNotes: string,
    validityDays: number
  ) => {
    setQuotations(prev =>
      prev.map(q => {
        if (q.id !== quoteId) return q;
        const sub = quotedItems.reduce((acc, curr) => acc + (curr.quotedUnitPrice || 0) * curr.quantity, 0);
        const taxes = Math.round(sub * 0.18); // standard avg gst
        const total = sub + taxes + freightEstimate;
        const validityDate = new Date(Date.now() + validityDays * 86400000).toISOString().split('T')[0];

        return {
          ...q,
          status: 'quoted',
          items: quotedItems,
          quotationSubtotal: sub,
          taxes,
          freightEstimate,
          grandTotal: total,
          supplierNotes,
          validityDate,
        };
      })
    );
    addNotification('Quotation Submitted', `Supplier quotation submitted for RFQ ${quoteId}`);
  };

  const acceptQuotationAndCreateOrder = (quoteId: string): Order | null => {
    const q = quotations.find(item => item.id === quoteId);
    if (!q || !q.grandTotal) return null;

    const orderNum = `VGB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      customerId: q.customerId,
      customerName: q.customerName,
      customerMobile: q.customerMobile,
      customerCompany: q.customerCompany,
      deliverySite: selectedAddress,
      items: q.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        brand: item.brand,
        grade: 'Bulk Spec',
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.quotedUnitPrice || item.targetPrice || 0,
        totalPrice: (item.quotedUnitPrice || item.targetPrice || 0) * item.quantity,
        gstRate: 18,
        gstAmount: Math.round(((item.quotedUnitPrice || 0) * item.quantity * 0.18)),
      })),
      subtotal: q.quotationSubtotal || 0,
      gstTotal: q.taxes || 0,
      deliveryFee: q.freightEstimate || 0,
      discount: 0,
      grandTotal: q.grandTotal,
      paymentMethod: 'credit_line',
      paymentStatus: 'authorized',
      paymentReference: `RFQ-CONV-${q.quoteNumber}`,
      status: 'supplier_confirmed',
      supplierId: q.supplierId,
      supplierName: q.supplierName,
      expectedDeliveryDate: q.requiredDeliveryDate,
      orderDate: new Date().toISOString(),
      timeline: [
        { status: 'order_placed', label: 'Quotation Converted into Purchase Order', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true, note: `Approved under ${q.paymentTerms}` },
        { status: 'supplier_confirmed', label: 'Supplier Agreed Production Slot', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
        { status: 'payment_confirmed', label: 'Commercial Credit Approved', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
        { status: 'material_preparation', label: 'Material Weighment & Loading', timestamp: '', done: false },
        { status: 'transport_assigned', label: 'Transport Assignment', timestamp: '', done: false },
        { status: 'dispatched', label: 'Dispatched', timestamp: '', done: false },
        { status: 'in_transit', label: 'In Transit', timestamp: '', done: false },
        { status: 'delivered', label: 'Delivered', timestamp: '', done: false },
        { status: 'completed', label: 'Completed', timestamp: '', done: false }
      ],
      platformCommission: Math.round((q.quotationSubtotal || 0) * 0.03),
      supplierPayout: Math.round((q.quotationSubtotal || 0) * 0.97),
    };

    setOrders(prev => [newOrder, ...prev]);
    setQuotations(prev => prev.map(item => item.id === quoteId ? { ...item, status: 'converted_to_order' } : item));
    addNotification('Quotation Converted!', `Quotation ${q.quoteNumber} converted to active Order ${orderNum}`);
    return newOrder;
  };

  const rejectQuotation = (quoteId: string) => {
    setQuotations(prev => prev.map(item => item.id === quoteId ? { ...item, status: 'rejected' } : item));
    addNotification('Quotation Declined', `RFQ ${quoteId} has been rejected.`);
  };

  // Product Updates
  const updateProductStock = (productId: string, newStock: number, isAvailable: boolean) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stockQuantity: newStock, isAvailable } : p))
    );
    addNotification('Catalog Updated', `Stock and availability updated successfully.`);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
    };
    setProducts(prev => [newProduct, ...prev]);
    addNotification('Product Added', `${newProduct.name} listed successfully.`);
  };

  const updateSupplierStatus = (supplierId: string, status: Supplier['status'], commissionRate?: number) => {
    setSuppliers(prev =>
      prev.map(s => {
        if (s.id !== supplierId) return s;
        return {
          ...s,
          status,
          commissionRate: commissionRate !== undefined ? commissionRate : s.commissionRate,
        };
      })
    );
    addNotification('Supplier Status Changed', `Supplier status set to ${status.toUpperCase()}`);
  };

  // CRM Lead Updates
  const addLead = (leadData: Omit<Lead, 'id' | 'leadNumber' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead-' + Date.now(),
      leadNumber: `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads(prev => [newLead, ...prev]);
    addNotification('Lead Created', `New prospect ${newLead.name} logged into sales pipeline.`);
  };

  const updateLeadStage = (leadId: string, stage: LeadStage) => {
    setLeads(prev =>
      prev.map(lead => (lead.id === leadId ? { ...lead, stage } : lead))
    );
    addNotification('Pipeline Updated', `Lead stage moved to ${stage.replace('_', ' ').toUpperCase()}`);
  };

  const addLeadNote = (leadId: string, noteText: string, author: string) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId) return lead;
        const newNote = {
          id: 'note-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          author,
          text: noteText,
        };
        return {
          ...lead,
          notes: [newNote, ...lead.notes],
        };
      })
    );
  };

  const convertLeadToCustomer = (leadId: string) => {
    setLeads(prev =>
      prev.map(lead => (lead.id === leadId ? { ...lead, stage: 'converted', conversionProbability: 100 } : lead))
    );
    addNotification('Customer Acquired!', 'Lead converted into an active customer account.');
  };

  // Logistics
  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVeh: Vehicle = {
      ...vehicleData,
      id: 'veh-' + Date.now(),
    };
    setVehicles(prev => [...prev, newVeh]);
    addNotification('Vehicle Added', `Vehicle ${newVeh.registrationNumber} added to transport fleet.`);
  };

  const addDriver = (driverData: Omit<Driver, 'id' | 'totalDeliveries' | 'rating'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: 'driver-' + Date.now(),
      totalDeliveries: 0,
      rating: 5.0,
    };
    setDrivers(prev => [...prev, newDriver]);
    addNotification('Driver Registered', `${newDriver.name} added to driver directory.`);
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}products`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}customer`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}orders`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}quotations`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}leads`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}suppliers`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}vehicles`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}drivers`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}cart`);

    setProducts(initialProducts);
    setCustomer(initialCustomerProfile);
    setOrders(initialOrders);
    setQuotations(initialQuotations);
    setLeads(initialLeads);
    setSuppliers(initialSuppliers);
    setVehicles(initialVehicles);
    setDrivers(initialDrivers);
    setCart([]);
    addNotification('Data Reset', 'All demo entities and orders have been reset to factory state.');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        products,
        customer,
        orders,
        quotations,
        leads,
        suppliers,
        transporters,
        vehicles,
        drivers,
        cart,
        notifications,
        selectedAddress,
        setSelectedAddress,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartSummary,
        placeOrder,
        updateOrderStatus,
        assignTransporterAndDriver,
        submitProofOfDelivery,
        addOrderReview,
        createQuotationRequest,
        respondToQuotation,
        acceptQuotationAndCreateOrder,
        rejectQuotation,
        updateProductStock,
        addProduct,
        updateSupplierStatus,
        addLead,
        updateLeadStage,
        addLeadNote,
        convertLeadToCustomer,
        addVehicle,
        addDriver,
        dismissNotification,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
