export interface CurrencyPair {
    0: string;
    1: string;
}

export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends Array<infer U> ? ReadonlyArray<DeepReadonly<U>> : DeepReadonly<T[P]>;
};

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export type GuardFieldsSelector<T> = {
    [P in keyof T]: T[P] extends Array<infer U> ?
    GuardFieldsSelector<U> : (T[P] extends object ? GuardFieldsSelector<T[P]> : true);
};

export type GuardFieldsSelectorMapper<Type, Selector> = {
    [P in keyof Type]: Type[P] extends Array<infer U> ?
    (P extends keyof Selector ? Array<GuardFieldsSelectorMapper<U, Selector[P]>> : any) :
    (P extends keyof Selector ? GuardFieldsSelectorMapper<Type[P], Selector[P]> : any);
};

export type GuardResult<Type, Selector extends DeepPartial<GuardFieldsSelector<Type>>> =
    GuardFieldsSelectorMapper<Type, Selector>;
