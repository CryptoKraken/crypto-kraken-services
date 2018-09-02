import { FieldGuardsMap } from '../../guards';

export interface TradingViewError {
    /**
     * Status code.
     */
    s: 'error';
    /**
     * Error message.
     */
    errmsg?: string;
}

export const tradingViewErrorGuardsMap: FieldGuardsMap<TradingViewError> = {
    s: (value: any): value is TradingViewError['s'] => value === 'error',
    errmsg: (value: any): value is string | undefined => value === undefined || typeof value === 'string'
};
