export {};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    handler: (response: RazorpayPaymentResponse) => void;
    theme?: {
      color?: string;
    };
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    config?: {
      display?: {
        blocks?: {
          [key: string]: {
            name: string;
            instruments: {
              method: "upi" | "card" | "netbanking" | "wallet" | "paylater";
              banks?: string[];
              iins?: string[];
            }[];
          };
        };
        sequence?: string[];
        preferences?: {
          show_default_blocks?: boolean;
        };
      };
    };
  }

  interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
}
export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  keyId: string;
}

export interface VerifyPaymentPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
