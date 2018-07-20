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

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type FieldsSelector<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? (
        FieldsSelector<U> | true
    ) : (
        T[P] extends object ? FieldsSelector<T[P]> | true : true
    );
};

type FieldsSelectorMapper<Type, Selector, UncheckedType = any> = {
    [P in keyof Type]: P extends keyof Selector ? (
        Selector[P] extends true ? (
            Type[P]
        ) : (
            Type[P] extends Array<infer U> ? Array<FieldsSelectorMapper<U, Selector[P], UncheckedType>>
            : FieldsSelectorMapper<Type[P], Selector[P], UncheckedType>
        )
    ) : UncheckedType;
};

/*
    It's impossible to call recursively this type because of the Selector's constraints
    (typescript [2.9.1] shows an error in this case), so we extract the logic into a separate internal type:
    the FieldsSelectorMapper type.
*/
export type FieldsSelectorResult<Type, Selector extends FieldsSelector<Type>, UncheckedType = any> =
    FieldsSelectorMapper<Type, Selector, UncheckedType>;
