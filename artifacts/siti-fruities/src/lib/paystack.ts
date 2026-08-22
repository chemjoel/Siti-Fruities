/**
 * SITI FRUITIES — Paystack Client Helper
 *
 * Securely initializes Paystack Popup payment in the browser
 * using VITE_PAYSTACK_PUBLIC_KEY.
 */

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

interface PaystackOptions {
  email: string;
  amount: number; // in Naira (will be converted to Kobo)
  reference: string;
  metadata?: Record<string, any>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

export const loadPaystackScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.PaystackPop) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const payWithPaystack = async (options: PaystackOptions): Promise<void> => {
  if (!PAYSTACK_PUBLIC_KEY) {
    console.warn('Paystack Public Key not configured in VITE_PAYSTACK_PUBLIC_KEY. Using direct payment confirmation fallback.');
    // Simulate successful payment for dev/testing when key is not configured
    setTimeout(() => {
      options.onSuccess(options.reference);
    }, 1000);
    return;
  }

  const loaded = await loadPaystackScript();
  if (!loaded || !window.PaystackPop) {
    alert('Could not load Paystack payment gateway. Please check your internet connection.');
    options.onClose();
    return;
  }

  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: options.email || 'customer@sitifruities.com',
    amount: Math.round(options.amount * 100), // convert Naira to Kobo
    currency: 'NGN',
    ref: options.reference,
    metadata: options.metadata || {},
    callback: (response: any) => {
      const ref = response.reference || response.trxref || options.reference;
      options.onSuccess(ref);
    },
    onClose: () => {
      options.onClose();
    },
  });

  handler.openIframe();
};
