import { CheckoutManager } from './checkout/checkout.js';

export function initPayment() {
    return new CheckoutManager();
}
