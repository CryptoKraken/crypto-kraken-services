import { CurrencyPair } from "../../core";
import { YobitUtils } from "./yobit-utils";

export const YobitConstants = {
    rootServerUrl: 'https://yobit.net/api/3',
    getOrderBookUri: (pair: CurrencyPair) => `/trades/${YobitUtils.getPairSymbol(pair)}`
}