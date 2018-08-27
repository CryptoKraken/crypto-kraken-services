import { FieldGuardsMap, isArray, isBoolean, isString } from 'crypto-kraken-core';

export interface KuCoinTradingViewKLineConfig {
    supports_marks: boolean;
    supports_time: boolean;
    supports_search: boolean;
    supports_group_request: boolean;
    supported_resolutions: string[];
}

export const kuCoinTradingViewKLineConfigGuardsMap: FieldGuardsMap<KuCoinTradingViewKLineConfig> = {
    supports_marks: isBoolean,
    supports_time: isBoolean,
    supports_search: isBoolean,
    supports_group_request: isBoolean,
    supported_resolutions: {
        this: isArray,
        every: isString
    }
};
