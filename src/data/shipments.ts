import { ShipmentData, OrderSummary, CartItem, IndianCourierName, ShipmentStage } from '../types';

/**
 * Builds a realistic, live regional Indian courier tracking dataset
 * specifically for an ORDERED ITEM from the user's order history.
 */
export function buildShipmentForOrderedItem(
  order: OrderSummary,
  cartItem: CartItem
): ShipmentData {
  const courier: IndianCourierName =
    order.shippingMethod === 'express'
      ? 'Blue Dart Express'
      : order.shippingMethod === 'courier'
      ? 'Shadowfax Metro'
      : 'Delhivery';

  const city = order.customer.city || 'Bengaluru';
  const state = order.customer.state || 'Karnataka';
  const pincode = order.customer.postalCode || '560038';
  const recipientName = order.customer.fullName || 'Patron';

  // Seed pseudo AWB number based on order ID
  const hash = order.orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const awbPrefix = courier === 'Blue Dart Express' ? 'BLU' : courier === 'Delhivery' ? 'DLV' : 'SHD';
  const awbNumber = `${awbPrefix}-${(hash * 9876543).toString().padEnd(11, '0').slice(0, 11)}`;

  // Determine stage based on order date or express status
  const orderTime = new Date(order.createdAt).getTime();
  const hoursSinceOrder = (Date.now() - orderTime) / (1000 * 60 * 60);

  const stageWeights: Record<ShipmentStage, number> = {
    order_confirmed: 1,
    artisan_packed: 2,
    dispatched_hub: 3,
    in_transit: 4,
    out_for_delivery: 5,
    delivered: 6,
  };

  let currentStage: ShipmentStage = 'artisan_packed';
  if (hoursSinceOrder > 48) {
    currentStage = 'delivered';
  } else if (hoursSinceOrder > 24) {
    currentStage = 'out_for_delivery';
  } else if (hoursSinceOrder > 12) {
    currentStage = 'in_transit';
  } else if (hoursSinceOrder > 4) {
    currentStage = 'dispatched_hub';
  }

  const currentWeight = stageWeights[currentStage];

  const courierContact =
    courier === 'Blue Dart Express'
      ? '1860-233-1234 (Toll Free) · bluedart.com'
      : courier === 'Delhivery'
      ? '0124-6719500 · support@delhivery.com'
      : '080-68172000 · shadowfax.in';

  return {
    orderId: order.orderId,
    awbNumber,
    courierName: courier,
    courierContact,
    estimatedDelivery: order.estimatedDelivery || 'In 2-3 business days',
    currentStage,
    deliveryAddress: {
      recipientName,
      city,
      state,
      pincode,
    },
    itemsSummary: [
      {
        name: cartItem.product.name,
        quantity: cartItem.quantity,
        image: cartItem.product.image,
      },
    ],
    otpRequiredForDelivery: true,
    deliveryAgent:
      currentStage === 'out_for_delivery'
        ? {
            name: 'Ramesh Gowda',
            phone: '+91 98452 71092',
            maskedOtp: '•••• (sent to mobile)',
          }
        : undefined,
    checkpoints: [
      {
        id: 'cp-1',
        timestamp: 'Order Day · 10:15 AM',
        location: `${cartItem.product.craftOrigin} Cluster`,
        status: 'Artisan Authentication & Quality Check',
        description: `Handcrafted ${cartItem.product.name} inspected and sealed in zero-plastic archival casing.`,
        completed: true,
      },
      {
        id: 'cp-2',
        timestamp: 'Order Day · 04:30 PM',
        location: 'Central Vanya Packaging Atelier',
        status: 'Handloom Potli Packaging & Dispatch',
        description: `Consignment manifests generated and handed over to ${courier}.`,
        completed: true,
        isCurrent: currentStage === 'artisan_packed',
      },
      {
        id: 'cp-3',
        timestamp: 'Next Day · 06:40 AM',
        location: 'Nelamangala / Western Logistics Hub',
        status: 'Inbound Air Freight / Zonal Sort',
        description: 'Processed through automated conveyor sortation and cleared air screening.',
        completed: currentWeight >= 3,
        isCurrent: currentStage === 'dispatched_hub',
      },
      {
        id: 'cp-4',
        timestamp: 'In Transit',
        location: `${city} Regional Delivery Station, ${state}`,
        status: 'Sorted to Destination Delivery Route',
        description: `Consignment arrived at ${city} local delivery station for last-mile vehicle routing.`,
        completed: currentWeight >= 4,
        isCurrent: currentStage === 'in_transit',
      },
      {
        id: 'cp-5',
        timestamp: currentStage === 'out_for_delivery' ? 'Today · 08:30 AM' : 'Estimated for Delivery Day',
        location: `${order.customer.address}, ${city} - ${pincode}`,
        status: 'Out for Doorstep Hand-off',
        description: 'Assigned to courier executive. Recipient SMS OTP required upon physical delivery.',
        completed: currentWeight >= 5,
        isCurrent: currentStage === 'out_for_delivery',
      },
    ],
  };
}
