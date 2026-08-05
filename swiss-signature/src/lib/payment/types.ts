export interface PaymentIntentRequest {
  amount: number; // in cents
  currency: string;
  orderId: string;
  customerEmail: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentGateway {
  name: string;
  createPaymentIntent(req: PaymentIntentRequest): Promise<{ clientSecret?: string; redirectUrl?: string }>;
  confirmPayment(transactionId: string): Promise<PaymentResult>;
}
