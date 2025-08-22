/**
 * Payment payload validation utilities
 */

/**
 * Validates a payment intent payload
 * @param {Object} payload - The payment payload to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validatePaymentPayload(payload) {
  const errors = [];

  if (!payload) {
    errors.push('Payload is required');
    return { isValid: false, errors };
  }

  if (!payload.amount || typeof payload.amount !== 'number' || payload.amount <= 0) {
    errors.push('Amount must be a positive number');
  }

  if (!payload.currency || typeof payload.currency !== 'string') {
    errors.push('Currency is required and must be a string');
  }

  if (payload.currency && !['usd', 'eur', 'gbp'].includes(payload.currency.toLowerCase())) {
    errors.push('Currency must be one of: usd, eur, gbp');
  }

  if (payload.description && typeof payload.description !== 'string') {
    errors.push('Description must be a string');
  }

  if (payload.metadata && typeof payload.metadata !== 'object') {
    errors.push('Metadata must be an object');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a webhook payload
 * @param {Object} payload - The webhook payload to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validateWebhookPayload(payload) {
  const errors = [];

  if (!payload) {
    errors.push('Webhook payload is required');
    return { isValid: false, errors };
  }

  if (!payload.type || typeof payload.type !== 'string') {
    errors.push('Event type is required');
  }

  if (!payload.data || typeof payload.data !== 'object') {
    errors.push('Event data is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validatePaymentPayload,
  validateWebhookPayload
};
