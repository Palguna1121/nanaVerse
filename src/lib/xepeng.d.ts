declare module 'xepeng-oauth-js' {
    export interface OAuthClientConfig {
        clientId: string;
        clientSecret?: string;
        baseUrl?: string;
        redirectUri: string;
        storage?: 'localStorage' | 'sessionStorage' | 'memory';
        scopes?: string[];
    }

    export class OAuthClient {
        constructor(config: OAuthClientConfig);
        getAuthorizationUrl(): Promise<string>;
        handleCallback(code?: string): Promise<{ access_token: string; refresh_token?: string; [key: string]: any }>;
        getUserInfo(): Promise<Record<string, any>>;
        logout(): void;
        isAuthenticated(): boolean;
    }
}

declare module 'xepeng-oauth-js/integration' {
    export interface IntegrationConfig {
        clientId: string;
        clientSecret: string;
        isProduction?: boolean;
        baseUrl?: string;
    }

    export interface OrderItem {
        amount: number;
        notes?: string;
        product_description?: string;
        product_name: string;
    }

    export interface PaymentLinkGenerateOptions {
        expired_at?: string;
        callback_url?: string;
        success_url?: string;
        cancel_url?: string;
    }

    export interface IntegrationResponse<T = any> {
        status: string;
        message: string;
        data: T;
        item?: T; // For backward compatibility if needed
    }

    export class OrderResource {
        create(items: OrderItem[]): Promise<IntegrationResponse>;
        update(uid: string, items: OrderItem[], status?: string): Promise<IntegrationResponse>;
        get(uid: string): Promise<IntegrationResponse>;
    }

    export class PaymentLinkResource {
        generate(orderUid: string, options?: PaymentLinkGenerateOptions): Promise<IntegrationResponse>;
    }

    export class XepengIntegrationClient {
        constructor(config: IntegrationConfig);
        orders(): OrderResource;
        paymentLinks(): PaymentLinkResource;
    }
}
