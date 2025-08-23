const { validatePaymentPayload, validateWebhookPayload } = require('../src/utils/validatePayload');

describe('Payment Payload Validation', () => {
  describe('validatePaymentPayload', () => {
    test('valid payment payload', () => {
      const payload = {
        amount: 1000,
        currency: 'usd',
        description: 'Test payment'
      };
      
      const result = validatePaymentPayload(payload);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('rejects missing amount', () => {
      const payload = { currency: 'eur' };
      const result = validatePaymentPayload(payload);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Amount must be a positive number');
    });

    test('rejects invalid currency', () => {
      const payload = {
        amount: 1000,
        currency: 'invalid'
      };
      
      const result = validatePaymentPayload(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Currency must be one of: usd, eur, gbp');
    });

    test('rejects negative amount', () => {
      const payload = {
        amount: -100,
        currency: 'usd'
      };
      
      const result = validatePaymentPayload(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Amount must be a positive number');
    });

    test('rejects null payload', () => {
      const result = validatePaymentPayload(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Payload is required');
    });
  });

  describe('validateWebhookPayload', () => {
    test('valid webhook payload', () => {
      const payload = {
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_123' } }
      };
      
      const result = validateWebhookPayload(payload);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('rejects missing type', () => {
      const payload = { data: { object: { id: 'pi_123' } } };
      const result = validateWebhookPayload(payload);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Event type is required');
    });

    test('rejects missing data', () => {
      const payload = { type: 'payment_intent.succeeded' };
      const result = validateWebhookPayload(payload);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Event data is required');
    });

    test('rejects null payload', () => {
      const result = validateWebhookPayload(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Webhook payload is required');
    });
  });
});
