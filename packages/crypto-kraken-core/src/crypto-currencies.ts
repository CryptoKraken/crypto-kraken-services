export interface CryptoCurrency {
    name: string;
    ticker: string;
}

export interface CryptoCoin extends CryptoCurrency {
    explorerUrls: string[];
    totalSupply: number | undefined;
    maxSupply: number | undefined;
}

export interface CryptoToken extends CryptoCurrency {
    platformCoin: CryptoCoin;
}

export enum EthereumTokenType {
    ERC20 = 'ERC-20', ERC223 = 'ERC-223', ER721 = 'ERC-721'
}
export interface EthereumToken extends CryptoToken {
    type: EthereumTokenType;
    contractAddress: string;
    decimals: number;
    totalSupply: number;
}
