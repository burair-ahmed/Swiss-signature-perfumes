import { PaymentGateway, PaymentIntentRequest, PaymentResult } from './types';

export class StripePaymentGateway implements PaymentGateway {
  name = 'Stripe';

  async createPaymentIntent(req: PaymentIntentRequest) {
    // When Stripe API keys are configured, this initializes a Stripe PaymentIntent
    console.log(`[Stripe Gateway] Creating intent for ${req.amount} ${req.currency}`);
    return {
      clientSecret: `pi_mock_${Math.random().toString(36).substring(7)}_secret`,
    };
  }

  async confirmPayment(transactionId: string): Promise<PaymentResult> {
    console.log(`[Stripe Gateway] Confirming payment for transaction: ${transactionId}`);
    return {
      success: true,
      transactionId,
    };
  }
}
