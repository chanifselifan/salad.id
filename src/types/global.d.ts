declare module 'midtrans-client' {
  export class Snap {
    constructor(config: {
      isProduction: boolean;
      serverKey: string;
      clientKey?: string;
    });

    createTransaction(params: any): Promise<{
      token: string;
      redirect_url: string;
    }>;
  }

  export class CoreApi {
    constructor(config: {
      isProduction: boolean;
      serverKey: string;
      clientKey?: string;
    });

    transaction: {
      status(orderId: string): Promise<any>;
      cancel(orderId: string): Promise<any>;
    };
  }
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks?: any) => void;
      embed?: (token: string, options?: any) => void; // tambahin biar error hilang
    };
  }
}

export {};
