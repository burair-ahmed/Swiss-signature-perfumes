import { NextResponse } from 'next/server';
import { verifyAdminRole } from '@/lib/auth';
import { getStoredOrders } from '@/lib/orders-store';

export async function GET(request: Request) {
  const authResult = verifyAdminRole(request, ['admin', 'super_admin']);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const orders = getStoredOrders();

  // CSV Headers
  const headers = [
    'Order ID',
    'Date',
    'Customer Name',
    'Email',
    'Phone',
    'Street Address',
    'City',
    'Country',
    'Postal Code',
    'Items Purchased',
    'Subtotal (PKR)',
    'Shipping Fee (PKR)',
    'Total Amount (PKR)',
    'Payment Method',
    'Order Status',
    'Notes'
  ];

  const rows = orders.map(order => {
    const customerName = `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim();
    const itemsSummary = order.items.map(i => `${i.name} (${i.selectedVolume || 'Std'}) x${i.quantity}`).join('; ');
    const formattedDate = new Date(order.createdAt).toLocaleString('en-US');

    return [
      `"${order.id}"`,
      `"${formattedDate}"`,
      `"${customerName.replace(/"/g, '""')}"`,
      `"${(order.customer.email || '').replace(/"/g, '""')}"`,
      `"${(order.customer.phone || '').replace(/"/g, '""')}"`,
      `"${(order.customer.address || '').replace(/"/g, '""')}"`,
      `"${(order.customer.city || '').replace(/"/g, '""')}"`,
      `"${(order.customer.country || 'Pakistan').replace(/"/g, '""')}"`,
      `"${(order.customer.postalCode || '').replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      order.subtotal,
      order.shippingFee,
      order.total,
      `"${(order.paymentMethod || 'cod').toUpperCase()}"`,
      `"${order.status}"`,
      `"${(order.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const filename = `swiss_orders_export_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
