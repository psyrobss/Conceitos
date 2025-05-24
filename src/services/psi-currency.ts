/**
 * Represents the exchange rate between a fictional currency (Psi) and a real currency (e.g., USD).
 */
export interface ExchangeRate {
  /**
   * The exchange rate of Psi to USD (e.g., 1 Psi = 0.5 USD).
   */
  psiToUsd: number;
}

/**
 * Asynchronously retrieves the current exchange rate for Psi currency.
 *
 * @returns A promise that resolves to an ExchangeRate object containing the Psi to USD exchange rate.
 */
export async function getExchangeRate(): Promise<ExchangeRate> {
  // TODO: Implement this by calling an API.
  return {
    psiToUsd: 0.75,
  };
}

/**
 * Represents the result of a payment transaction in Psi currency.
 */
export interface PaymentResult {
  /**
   * Indicates whether the payment was successful.
   */
  success: boolean;
  /**
   * A message providing details about the payment result.
   */
  message: string;
}

/**
 * Asynchronously processes a payment in Psi currency.
 *
 * @param amount The amount of Psi to be paid.
 * @returns A promise that resolves to a PaymentResult object indicating the success or failure of the payment.
 */
export async function processPayment(amount: number): Promise<PaymentResult> {
  // TODO: Implement this by calling an API.

  return {
    success: true,
    message: `Payment of ${amount} Psi was successful.`, 
  };
}
