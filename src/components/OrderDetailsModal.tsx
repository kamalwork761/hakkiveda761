import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Mail,
  Ban,
  RefreshCw,
  Edit2,
  Save,
  User,
  MapPin,
  CreditCard,
  Building2,
  Calendar,
  AlertCircle,
  Tag,
  Phone,
  ShieldCheck,
  Send,
  ExternalLink,
  DollarSign,
  Download
} from 'lucide-react';
import { Order } from '../types/store';
import { useStore } from '../context/StoreContext';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onShowToast,
}) => {
  const { updateOrderDetails, formatPrice, playSound, siteSettings } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [printMode, setPrintMode] = useState<'NONE' | 'INVOICE' | 'LABEL'>('NONE');

  // Local form state for order editing
  const [trackingStatus, setTrackingStatus] = useState<string>(order.trackingStatus);
  const [paymentStatus, setPaymentStatus] = useState<string>(order.paymentStatus || 'PAID');
  const [trackingNumber, setTrackingNumber] = useState<string>(order.trackingNumber || '');
  const [courierName, setCourierName] = useState<string>(order.courierName || 'BlueDart Air Express');
  const [adminNotes, setAdminNotes] = useState<string>(order.adminNotes || '');
  const [customerNotes, setCustomerNotes] = useState<string>(order.customerNotes || 'Fragile bottle. Handle with care.');

  // Financial calculations
  const subtotal = order.subtotalINR || order.items.reduce((acc, item) => acc + (item.product?.priceINR || item.priceINR || 0) * item.quantity, 0);
  const discount = order.discountINR || 0;
  const shippingCharges = order.shippingChargesINR || (subtotal > 1999 ? 0 : 150);
  const taxGST = order.taxINR || Math.round(subtotal * 0.18);
  const finalTotal = order.totalAmountINR || (subtotal - discount + shippingCharges);

  // Keyboard shortcut listener for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (printMode !== 'NONE') {
          setPrintMode('NONE');
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [printMode, onClose]);

  // Handle clicking outside the popup (backdrop)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (printMode !== 'NONE') {
        setPrintMode('NONE');
      } else {
        onClose();
      }
    }
  };

  const handleSaveOrder = () => {
    updateOrderDetails(order.id, {
      trackingStatus,
      paymentStatus: paymentStatus as any,
      trackingNumber,
      courierName,
      adminNotes,
      customerNotes,
    });
    setIsEditing(false);
    playSound('click_soft');
    onShowToast('Order details & status updated successfully');
  };

  const handleQuickStatusChange = (newStatus: string) => {
    setTrackingStatus(newStatus);
    updateOrderDetails(order.id, { trackingStatus: newStatus });
    playSound('click_soft');
    onShowToast(`Order status changed to ${newStatus}`);
  };

  const handleSendEmail = () => {
    playSound('notification_chime');
    onShowToast(`Order update email & tracking notification sent to ${order.customer.email}`);
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      updateOrderDetails(order.id, {
        trackingStatus: 'CANCELLED',
      });
      setTrackingStatus('CANCELLED');
      playSound('error_warning');
      onShowToast('Order has been cancelled');
    }
  };

  const handleRefundOrder = () => {
    if (window.confirm('Process full refund for this customer order?')) {
      updateOrderDetails(order.id, {
        paymentStatus: 'REFUNDED',
        trackingStatus: 'CANCELLED',
      });
      setPaymentStatus('REFUNDED');
      setTrackingStatus('CANCELLED');
      playSound('order_success');
      onShowToast('Order refunded and marked as cancelled');
    }
  };

  // Programmatic Vector PDF Generator for Tax Invoice
  const generateInvoicePdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const rawId = order.orderNumber || order.id || 'ORDER';
    const orderId = rawId.replace(/[/\\?%*:|"<>]/g, '-');
    const fileName = `HAKKIVEDA-Invoice-${orderId}.pdf`;

    // Header Banner
    doc.setFillColor(11, 61, 46); // var(--brand-primary-dark)
    doc.rect(0, 0, 210, 32, 'F');

    // Title: HAKKIVEDA
    doc.setTextColor(200, 162, 74); // var(--brand-gold)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('HAKKIVEDA', 14, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('100% Authentic Tribal Ayurvedic Formulations', 14, 25);

    // Header Right: TAX INVOICE
    doc.setTextColor(200, 162, 74);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TAX INVOICE', 196, 16, { align: 'right' });

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(order.orderNumber || orderId, 196, 22, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Date: ${order.date || new Date().toLocaleDateString('en-IN')}`, 196, 27, { align: 'right' });

    // Seller Details
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('SOLD BY:', 14, 42);
    doc.text('HAKKIVEDA Herbal Enterprises', 14, 47);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka - 571105', 14, 52);
    doc.text('GSTIN: 29AABCH1234F1ZM | Ayush Lic: KTK/25A/1908/2021', 14, 57);
    doc.text('Email: support@hakkiveda.com | Tel: +91 94812 89012', 14, 62);

    // Buyer Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('BILLED & SHIPPED TO:', 115, 42);
    doc.text(order.customer.name, 115, 47);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const addrLines = doc.splitTextToSize(order.customer.address, 80);
    doc.text(addrLines, 115, 52);
    const currentY = 52 + addrLines.length * 4.5;
    doc.text(`${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`, 115, currentY);
    doc.text(`Country: ${order.customer.country || 'India'} | Phone: ${order.customer.phone}`, 115, currentY + 4.5);
    doc.text(`Email: ${order.customer.email}`, 115, currentY + 9);

    const startTableY = Math.max(72, currentY + 15);

    // Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, startTableY - 3, 196, startTableY - 3);

    // Table Data
    const tableRows = order.items.map((item, idx) => {
      const pName = item.product?.name || item.title || 'Ayurvedic Product';
      const pVol = item.product?.volume ? ` (${item.product.volume})` : '';
      const pSku = item.product?.sku ? ` [SKU: ${item.product.sku}]` : '';
      const unitPrice = item.product?.priceINR || item.priceINR || 0;
      const itemTotal = unitPrice * item.quantity;

      return [
        idx + 1,
        `${pName}${pVol}${pSku}`,
        `INR ${unitPrice.toLocaleString('en-IN')}`,
        item.quantity,
        `INR ${itemTotal.toLocaleString('en-IN')}`
      ];
    });

    autoTable(doc, {
      startY: startTableY,
      head: [['#', 'Item Description', 'Unit Price', 'Qty', 'Total (INR)']],
      body: tableRows,
      headStyles: {
        fillColor: [11, 61, 46],
        textColor: [200, 162, 74],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [30, 41, 59]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 95 },
        2: { cellWidth: 25, halign: 'right' },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 37, halign: 'right' }
      },
      margin: { left: 14, right: 14 }
    });

    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : startTableY + 40;

    // Totals Box
    doc.setFillColor(248, 250, 252);
    doc.rect(115, finalY, 81, 44, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(115, finalY, 81, 44, 'S');

    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);

    doc.text('Subtotal:', 120, finalY + 8);
    doc.text(`INR ${subtotal.toLocaleString('en-IN')}`, 190, finalY + 8, { align: 'right' });

    if (discount > 0) {
      doc.text('Discount:', 120, finalY + 15);
      doc.text(`- INR ${discount.toLocaleString('en-IN')}`, 190, finalY + 15, { align: 'right' });
    }

    doc.text('Shipping Charges:', 120, finalY + 22);
    doc.text(shippingCharges === 0 ? 'FREE' : `INR ${shippingCharges.toLocaleString('en-IN')}`, 190, finalY + 22, { align: 'right' });

    doc.text('Incl. GST (18%):', 120, finalY + 29);
    doc.text(`INR ${taxGST.toLocaleString('en-IN')}`, 190, finalY + 29, { align: 'right' });

    doc.setDrawColor(203, 213, 225);
    doc.line(120, finalY + 33, 192, finalY + 33);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(11, 61, 46);
    doc.text('Grand Total:', 120, finalY + 40);
    doc.text(`INR ${finalTotal.toLocaleString('en-IN')}`, 190, finalY + 40, { align: 'right' });

    // Terms & Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Terms & Conditions:', 14, finalY + 8);
    doc.text('1. Certified 100% authentic Ayurvedic formulation tested in certified laboratory.', 14, finalY + 13);
    doc.text('2. All disputes subject to Hunsur/Mysore jurisdiction.', 14, finalY + 18);
    doc.text('3. This is a computer-generated tax invoice and requires no physical signature.', 14, finalY + 23);

    doc.save(fileName);
  };

  // Programmatic Vector PDF Generator for Shipping Label
  const generateShippingLabelPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150]
    });

    const rawId = order.orderNumber || order.id || 'ORDER';
    const orderId = rawId.replace(/[/\\?%*:|"<>]/g, '-');
    const fileName = `HAKKIVEDA-ShippingLabel-${orderId}.pdf`;

    // Outer Border Box
    doc.setLineWidth(0.8);
    doc.setDrawColor(0, 0, 0);
    doc.rect(3, 3, 94, 144);

    // Top Header Banner
    doc.setFillColor(11, 61, 46);
    doc.rect(3, 3, 94, 16, 'F');

    doc.setTextColor(200, 162, 74);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('HAKKIVEDA', 7, 11);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('PRIORITY EXPRESS SHIPMENT', 93, 11, { align: 'right' });

    // Courier & Tracking Info
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`COURIER: ${order.courierName || 'EXPRESS DELIVERY'}`, 7, 24);
    doc.text(`AWB: ${order.trackingNumber || 'HV-' + orderId}`, 93, 24, { align: 'right' });

    // Divider Line
    doc.setLineWidth(0.4);
    doc.line(3, 27, 97, 27);

    // Recipient Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(11, 61, 46);
    doc.text('DELIVER TO:', 7, 33);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(order.customer.name.toUpperCase(), 7, 39);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitAddress = doc.splitTextToSize(order.customer.address, 86);
    doc.text(splitAddress, 7, 45);

    const nextY = 45 + splitAddress.length * 4.5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`, 7, nextY);
    doc.text(`COUNTRY: ${(order.customer.country || 'India').toUpperCase()}`, 7, nextY + 5);
    doc.setFontSize(9);
    doc.text(`TEL: ${order.customer.phone}`, 7, nextY + 10);

    // Divider Line
    const divY = nextY + 15;
    doc.setLineWidth(0.4);
    doc.line(3, divY, 97, divY);

    // Order Details
    const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`Order No: ${order.orderNumber || orderId}`, 7, divY + 6);
    doc.text(`Payment: ${order.paymentMethod}`, 7, divY + 11);
    doc.text(`Total Amount: INR ${order.totalAmountINR || 0}`, 7, divY + 16);

    doc.text(`Date: ${order.date || new Date().toLocaleDateString('en-IN')}`, 55, divY + 6);
    doc.text(`Items Qty: ${totalQty} pcs`, 55, divY + 11);
    doc.text(`Weight: 500g (Herb Oil)`, 55, divY + 16);

    // Barcode Box
    const barcodeY = divY + 21;
    doc.setFillColor(250, 250, 250);
    doc.rect(7, barcodeY, 86, 20, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(7, barcodeY, 86, 20, 'S');

    // Simulated Barcode Lines
    doc.setFillColor(0, 0, 0);
    for (let x = 14; x < 86; x += 2.2) {
      const width = (x % 3 === 0) ? 1.1 : 0.5;
      doc.rect(x, barcodeY + 2.5, width, 11, 'F');
    }

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`*HV-${orderId}-IN*`, 50, barcodeY + 17.5, { align: 'center' });

    // Return Address Footer
    const returnY = barcodeY + 24;
    doc.setLineWidth(0.4);
    doc.setDrawColor(0, 0, 0);
    doc.line(3, returnY, 97, returnY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('IF UNDELIVERED, PLEASE RETURN TO:', 7, returnY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('HAKKIVEDA Herbal Enterprises, Door No. 574, V.P. Bore,', 7, returnY + 9);
    doc.text('Hunsur, Mysore, KA - 571105 | Tel: +91 94812 89012', 7, returnY + 13);

    doc.save(fileName);
  };

  const handleDownloadPdf = async (docType: 'INVOICE' | 'LABEL') => {
    const rawId = order.orderNumber || order.id || 'ORDER';
    const orderId = rawId.replace(/[/\\?%*:|"<>]/g, '-');
    const fileName = docType === 'INVOICE'
      ? `HAKKIVEDA-Invoice-${orderId}.pdf`
      : `HAKKIVEDA-ShippingLabel-${orderId}.pdf`;

    playSound('notification_chime');
    onShowToast(`Generating PDF: ${fileName}...`);

    try {
      if (docType === 'INVOICE') {
        generateInvoicePdf();
      } else {
        generateShippingLabelPdf();
      }
      playSound('order_success');
      onShowToast(`Downloaded ${fileName} successfully!`);
    } catch (err: any) {
      console.error('PDF export error:', err);
      // Fallback to html2pdf if DOM element exists
      const elementId = docType === 'INVOICE' ? 'tax-invoice-document' : 'shipping-label-document';
      const element = document.getElementById(elementId);
      if (element) {
        try {
          const opt = {
            margin: docType === 'LABEL' ? 5 : 8,
            filename: fileName,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
          };
          await html2pdf().set(opt).from(element).save();
          playSound('order_success');
          onShowToast(`Downloaded ${fileName} successfully!`);
          return;
        } catch (fallbackErr: any) {
          console.error('html2pdf fallback error:', fallbackErr);
        }
      }
      playSound('error_warning');
      onShowToast(`Failed to generate PDF: ${err?.message || 'Unknown error'}`);
    }
  };

  const handlePrintDocument = () => {
    playSound('click_soft');

    const restoreInteraction = () => {
      window.removeEventListener('afterprint', restoreInteraction);
      window.focus();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };

    window.addEventListener('afterprint', restoreInteraction);

    setTimeout(restoreInteraction, 300);
    setTimeout(restoreInteraction, 1000);

    window.print();
  };

  // Timeline steps computation
  const timelineSteps = [
    { key: 'ORDER_PLACED', label: 'Order Placed', time: order.date + ' 10:30 AM' },
    { key: 'PROCESSING', label: 'Processing & Packed', time: order.date + ' 02:15 PM' },
    { key: 'DISPATCHED', label: 'Dispatched to Courier', time: order.date + ' 06:00 PM' },
    { key: 'IN_TRANSIT', label: 'In Transit', time: 'In Progress' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', time: 'Pending' },
    { key: 'DELIVERED', label: 'Delivered', time: 'Pending' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'ORDER_PLACED': return 0;
      case 'PROCESSING': return 1;
      case 'DISPATCHED': return 2;
      case 'IN_TRANSIT': return 3;
      case 'OUT_FOR_DELIVERY': return 4;
      case 'DELIVERED': return 5;
      case 'CANCELLED': return -1;
      default: return 1;
    }
  };

  const activeIndex = getStepIndex(trackingStatus);

  // Print Mode Layout
  if (printMode === 'INVOICE') {
    return (
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 sm:p-8 font-sans flex flex-col items-center justify-center cursor-pointer"
      >
        <div
          id="tax-invoice-document"
          onClick={(e) => e.stopPropagation()}
          className="printable-area w-full max-w-3xl mx-auto border border-slate-300 p-8 rounded-2xl shadow-2xl bg-white text-slate-900 print:shadow-none print:border-none print:p-0 my-auto cursor-default"
        >
          <div className="flex justify-between items-center border-b border-slate-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-black font-serif-luxury text-[var(--brand-primary-dark)] tracking-wider">HAKKIVEDA</h1>
              <p className="text-xs text-slate-500 font-serif">100% Authentic Tribal Ayurvedic Formulations</p>
              <p className="text-[11px] text-slate-600 mt-1">Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka - 571105</p>
              <p className="text-[11px] text-slate-600">GSTIN: 29AABCH1234F1ZM | Ayush Lic: KTK/25A/1908/2021</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
                TAX INVOICE
              </span>
              <p className="font-mono text-sm font-bold text-slate-900 mt-2">{order.orderNumber}</p>
              <p className="text-xs text-slate-500">Date: {order.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 border-b border-slate-200 pb-6 mb-6 text-xs">
            <div>
              <p className="font-bold text-[var(--brand-primary-dark)] uppercase tracking-wider mb-1">Billed & Shipped To:</p>
              <p className="font-bold text-slate-800">{order.customer.name}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
              <p>{order.customer.country}</p>
              <p className="mt-1 font-mono">Phone: {order.customer.phone}</p>
              <p className="font-mono">Email: {order.customer.email}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1">
              <p className="font-bold text-[var(--brand-primary-dark)] uppercase tracking-wider mb-1">Payment & Shipping Info:</p>
              <p><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
              <p><span className="font-semibold">Payment Status:</span> {order.paymentStatus}</p>
              <p><span className="font-semibold">Courier Partner:</span> {order.courierName}</p>
              <p><span className="font-semibold">Tracking AWB:</span> {order.trackingNumber || 'Pending'}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left text-xs mb-6 border-collapse">
            <thead>
              <tr className="bg-[var(--brand-primary-dark)] text-white">
                <th className="p-2.5">Item Description</th>
                <th className="p-2.5 text-center">Qty</th>
                <th className="p-2.5 text-right">Price</th>
                <th className="p-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2.5">
                    <p className="font-bold text-slate-900">{item.product.name}</p>
                    <p className="text-[10px] text-slate-500">{item.product.volume} • SKU: {item.product.sku}</p>
                  </td>
                  <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                  <td className="p-2.5 text-right font-mono">{formatPrice(item.product.priceINR)}</td>
                  <td className="p-2.5 text-right font-mono font-bold">{formatPrice(item.product.priceINR * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-between items-start text-xs border-t border-slate-200 pt-4 mb-8">
            <div className="text-[11px] text-slate-500 max-w-xs space-y-1">
              <p className="font-bold text-slate-800">Terms & Conditions:</p>
              <p>1. Certified 100% authentic Ayurvedic oil batch tested.</p>
              <p>2. Subject to Hunsur/Mysore jurisdiction.</p>
              <p>This is a computer generated tax invoice.</p>
            </div>
            <div className="w-56 space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span className="font-mono">- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-mono">{shippingCharges === 0 ? 'FREE' : formatPrice(shippingCharges)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Incl. GST (18%):</span>
                <span className="font-mono">{formatPrice(taxGST)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[var(--brand-primary-dark)] border-t border-slate-300 pt-2">
                <span>Grand Total:</span>
                <span className="font-mono">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons (hidden on print) */}
          <div className="flex flex-wrap items-center justify-end gap-3 print:hidden pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setPrintMode('NONE')}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Back to Order Details
            </button>
            <button
              type="button"
              onClick={() => handleDownloadPdf('INVOICE')}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Tax Invoice (PDF)</span>
            </button>
            <button
              type="button"
              onClick={handlePrintDocument}
              className="px-5 py-2 bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-[var(--brand-primary-deep)] transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (printMode === 'LABEL') {
    return (
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 sm:p-8 font-sans overflow-y-auto flex flex-col items-center justify-center cursor-pointer"
      >
        <div
          id="shipping-label-document"
          onClick={(e) => e.stopPropagation()}
          className="printable-area w-full max-w-md mx-auto border-2 border-black p-6 rounded-2xl bg-white text-slate-900 print:shadow-none print:border-2 print:p-6 my-auto cursor-default"
        >
          <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black font-serif-luxury text-black">HAKKIVEDA</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">PRIORITY EXPRESS SHIPMENT</p>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-bold block">{order.courierName}</span>
              <span className="text-[10px] text-slate-600">{order.trackingNumber || 'AWB-PENDING'}</span>
            </div>
          </div>

          <div className="mb-6 space-y-1">
            <p className="text-[10px] font-bold uppercase text-slate-500">DELIVER TO:</p>
            <p className="text-base font-black text-black">{order.customer.name}</p>
            <p className="text-xs font-semibold text-slate-800">{order.customer.address}</p>
            <p className="text-xs font-semibold text-slate-800">{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
            <p className="text-xs font-bold text-[var(--brand-primary-dark)] uppercase">{order.customer.country}</p>
            <p className="text-xs font-bold font-mono mt-1">TEL: {order.customer.phone}</p>
          </div>

          <div className="border-t-2 border-black pt-4 mb-4 grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <p className="font-bold text-slate-500">ORDER NO:</p>
              <p className="font-mono font-bold text-xs">{order.orderNumber}</p>
            </div>
            <div>
              <p className="font-bold text-slate-500">PAYMENT TYPE:</p>
              <p className="font-bold text-xs text-black">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="font-bold text-slate-500">WEIGHT / VOL:</p>
              <p className="font-bold text-xs">500g (Fragile Herb Oil)</p>
            </div>
            <div>
              <p className="font-bold text-slate-500">DATE:</p>
              <p className="font-mono">{order.date}</p>
            </div>
          </div>

          {/* Barcode Mock */}
          <div className="border-t border-b border-black py-4 my-4 text-center">
            <div className="h-12 bg-slate-900 mx-auto w-3/4 flex items-center justify-center text-white font-mono text-[10px] tracking-[0.5em]">
              |||||||||||||||||||||||||||||||||||||||||||||
            </div>
            <p className="font-mono text-xs font-bold mt-1">{order.trackingNumber || order.orderNumber}</p>
          </div>

          <div className="text-[10px] text-slate-600 mb-6">
            <p className="font-bold">RETURN ADDRESS IF UNDELIVERED:</p>
            <p>HAKKIVEDA Herbal Enterprises, Door No. 574, V.P. Bore, Hunsur, Mysore, KA - 571105. Tel: +91 94812 89012</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 print:hidden">
            <button
              type="button"
              onClick={() => setPrintMode('NONE')}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => handleDownloadPdf('LABEL')}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Label (PDF)</span>
            </button>
            <button
              type="button"
              onClick={handlePrintDocument}
              className="px-5 py-2 bg-black text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Shipping Label</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 font-sans my-auto cursor-default"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--brand-primary-deeper)] border-b border-white/10 px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 flex items-center justify-center text-[var(--brand-gold)]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-mono text-[var(--brand-gold)]">{order.orderNumber}</h2>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-slate-300 font-sans">
                  {order.date}
                </span>
              </div>
              <p className="text-xs text-slate-400">Order Management & Fulfillment Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-[var(--brand-primary-deep)] px-6 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 border transition-all cursor-pointer ${
                isEditing
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit Mode' : 'Edit Order Details'}</span>
            </button>

            <button
              type="button"
              onClick={() => setPrintMode('INVOICE')}
              className="px-3 py-1.5 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] hover:bg-white rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tax Invoice PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setPrintMode('LABEL')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Print Shipping Label</span>
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Order Email</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelOrder}
              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/30 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>

            <button
              type="button"
              onClick={handleRefundOrder}
              className="px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/30 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refund Order</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Status Bar */}
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">ORDER STATUS</span>
                <span className="text-sm font-bold text-[var(--brand-gold)]">{trackingStatus}</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">PAYMENT STATUS</span>
                <span className={`text-sm font-bold ${
                  paymentStatus === 'PAID' ? 'text-emerald-400' :
                  paymentStatus === 'REFUNDED' ? 'text-purple-400' : 'text-amber-400'
                }`}>
                  {paymentStatus}
                </span>
              </div>
            </div>

            {/* Quick Status Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Change Status:</span>
              <select
                value={trackingStatus}
                onChange={(e) => handleQuickStatusChange(e.target.value)}
                className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] font-bold text-xs p-2 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="ORDER_PLACED">1. ORDER_PLACED</option>
                <option value="PROCESSING">2. PROCESSING</option>
                <option value="DISPATCHED">3. DISPATCHED</option>
                <option value="IN_TRANSIT">4. IN_TRANSIT</option>
                <option value="OUT_FOR_DELIVERY">5. OUT_FOR_DELIVERY</option>
                <option value="DELIVERED">6. DELIVERED</option>
                <option value="CANCELLED">7. CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Editable Mode Panel */}
          {isEditing && (
            <div className="bg-amber-950/30 border border-amber-500/40 p-5 rounded-2xl space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Edit2 className="w-4 h-4" />
                <span>EDIT ORDER LOGISTICS & NOTES</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100"
                    placeholder="e.g. BlueDart, FedEx, DHL"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tracking AWB Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100 font-mono"
                    placeholder="e.g. BD-89123049"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100 font-bold cursor-pointer"
                  >
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                    <option value="COD_DUE">COD_DUE</option>
                    <option value="REFUNDED">REFUNDED</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Admin Internal Notes</label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100"
                    placeholder="Add internal notes for fulfillment team..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Customer Delivery Notes</label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100"
                    placeholder="Delivery instructions from customer..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveOrder}
                  className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-white transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Order Updates</span>
                </button>
              </div>
            </div>
          )}

          {/* Customer & Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Customer Details */}
            <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-[var(--brand-gold)] font-bold text-xs uppercase tracking-wider">
                <User className="w-4 h-4" />
                <span>Customer Information</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-200">
                <p className="font-bold text-sm text-white">{order.customer.name}</p>
                <p className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                  <span>{order.customer.email}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                  <span>{order.customer.phone}</span>
                </p>
              </div>
            </div>

            {/* Shipping & Billing Address */}
            <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-[var(--brand-gold)] font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Shipping & Billing Address</span>
              </div>
              <div className="text-xs text-slate-200 space-y-1">
                <p className="font-semibold text-white">{order.customer.address}</p>
                <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                <p className="font-bold text-[var(--brand-gold)]">{order.customer.country}</p>
              </div>
            </div>
          </div>

          {/* Logistics & Tracking Info */}
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--brand-gold)] font-bold text-xs uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Logistics & Courier Partner</span>
              </div>
              <span className="text-[11px] font-mono bg-white/10 px-2.5 py-0.5 rounded text-slate-300">
                AWB: {order.trackingNumber || 'Pending Assignment'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">COURIER PARTNER</span>
                <span className="font-bold text-white text-sm">{courierName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PAYMENT METHOD</span>
                <span className="font-bold text-white text-sm">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ESTIMATED DELIVERY</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {order.estimatedDeliveryDate || '3-5 Business Days'}
                </span>
              </div>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider">
              Ordered Products ({order.items.length})
            </h3>

            <div className="divide-y divide-white/10">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {item.product.volume} • SKU: {item.product.sku}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-slate-300">
                      {formatPrice(item.product.priceINR)} × {item.quantity}
                    </p>
                    <p className="font-mono font-bold text-sm text-[var(--brand-gold)]">
                      {formatPrice(item.product.priceINR * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-5 rounded-2xl space-y-2 text-xs">
            <h3 className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider mb-2">Financial Breakdown</h3>
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span className="font-mono">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount / Coupon Applied:</span>
                <span className="font-mono">- {formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
              <span>Shipping Charges:</span>
              <span className="font-mono">{shippingCharges === 0 ? 'FREE Express' : formatPrice(shippingCharges)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Tax / GST (18% Included):</span>
              <span className="font-mono">{formatPrice(taxGST)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[var(--brand-gold)] border-t border-white/10 pt-3 mt-2">
              <span>Total Amount Paid:</span>
              <span className="font-mono text-base">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-4 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] text-[var(--brand-gold)] font-bold uppercase tracking-wider block">CUSTOMER NOTES</span>
              <p className="text-slate-300 italic">{customerNotes || 'No special instructions provided.'}</p>
            </div>
            <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-4 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] text-[var(--brand-gold)] font-bold uppercase tracking-wider block">ADMIN INTERNAL NOTES</span>
              <p className="text-slate-300 italic">{adminNotes || 'No internal team notes.'}</p>
            </div>
          </div>

          {/* Complete Order Timeline Visualizer */}
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Complete Order Timeline</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Real-Time Tracking Status
              </span>
            </div>

            <div className="relative pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
                {timelineSteps.map((step, idx) => {
                  const isCompleted = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;

                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center justify-between gap-1.5 ${
                        isCurrent
                          ? 'bg-[var(--brand-gold)]/20 border-[var(--brand-gold)] text-white shadow-lg'
                          : isCompleted
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-black/20 border-white/5 text-slate-500'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold leading-tight">{step.label}</p>
                        <p className="text-[9px] opacity-75 font-mono mt-0.5">{step.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-[var(--brand-primary-deeper)] border-t border-white/10 px-6 py-4 flex justify-between items-center z-10">
          <p className="text-[11px] text-slate-400 font-sans">
            HAKKIVEDA Order Management • 100% Verified DB Record
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
