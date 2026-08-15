/**
 * End-to-end customer checkout flow, using @storentia/sdk exactly as a
 * storefront would. Run stages 1-4 on your server (they need the customer's
 * session/JWT); stage 5 is the one piece that must run in the shopper's
 * browser, because that's where the gateway widget lives.
 *
 * Prereqs:
 *   - A public store token for this store (Dashboard > Settings > Storefront API)
 *   - The store has a payment app configured (checkout.paymentCapability)
 *
 * Run: npx ts-node examples/checkout-flow.ts
 */
import { Storentia } from '../src';

const PUBLIC_STORE_TOKEN = process.env.STORENTIA_STORE_TOKEN!;
const STORE_ID = process.env.STORENTIA_STORE_ID!;
const CUSTOMER_EMAIL = process.env.CUSTOMER_EMAIL!;

const storentia = new Storentia({
  clientId: '',
  clientSecret: '',
  baseUrl: process.env.STORENTIA_API_URL, // defaults to https://apis.storentia.com
});

async function main() {
  // 1. Log the customer in — email + one-time code, no passwords on this schema.
  await storentia.auth.sendAuthenticationEmail(CUSTOMER_EMAIL, PUBLIC_STORE_TOKEN);
  const code = await readCodeFromWherever(); // however you collect it from the shopper
  await storentia.auth.verifyAuthenticationEmail(CUSTOMER_EMAIL, code, PUBLIC_STORE_TOKEN);
  // storentia.auth now holds the customer JWT; every call below is scoped to them.

  // 2. Build the cart.
  await storentia.carts.addItem({ productId: 'product-uuid-here', quantity: 2 });
  const cart = await storentia.carts.get();
  console.log(`Cart has ${cart.items.length} line item(s)`);

  // 3. Bail out early if this store can't take payments — cheaper than
  //    discovering it after the customer has filled in card details.
  const capability = await storentia.orders.paymentCapability(STORE_ID);
  if (!capability.available) {
    throw new Error(`Checkout unavailable: ${capability.reason}`);
  }

  // 4. Turn the cart into an order. The price on each line is trusted from
  //    the cart's own product data, not typed in by the client.
  const totalAmount = cart.items.reduce(
    (sum, item) => sum + (item.product?.sellingPrice ?? 0) * item.quantity,
    0
  );
  const { order, checkout } = await storentia.orders.createOrder({
    currency: 'INR',
    totalAmount,
    items: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product?.sellingPrice ?? 0,
    })),
  });
  if (!order || !checkout) {
    throw new Error('Order could not be started for payment');
  }
  console.log(`Order ${order.id} created, awaiting payment via ${checkout.provider}`);

  // 5. Hand `checkout` to the browser. It's fully publishable — see
  //    checkout-widget.html, which branches on checkout.provider to open
  //    the right gateway's widget (Razorpay and Cashfree work differently:
  //    Razorpay hands back a signature the browser confirms immediately via
  //    confirmPayment; Cashfree hands back nothing to verify, so the caller
  //    calls syncPayment(order.id) instead, which asks Cashfree directly).
  //    Never assume a specific provider here — a store only ever returns
  //    the gateway it actually has configured.

  // 6. After confirmPayment/syncPayment resolves (or on a page reload /
  //    return_url visit), poll for the final state — a gateway callback or
  //    the reconciler can still lag behind either call.
  const settled = await pollUntilSettled(order.id);
  console.log(`Order ${settled.id} is now ${settled.status} / ${settled.paymentStatus}`);
}

async function pollUntilSettled(orderId: string, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    const order = await storentia.orders.getOrder(orderId);
    if (order.paymentStatus !== 'PENDING') return order;
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error('Payment still pending after polling window');
}

declare function readCodeFromWherever(): Promise<string>;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
