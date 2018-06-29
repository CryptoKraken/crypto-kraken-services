import { FieldsSelector, FieldsSelectorResult } from './types';

export type FieldGuardsMap<T> = {
    [P in keyof T]: ((value: any) => value is T[P]) | (
        T[P] extends Array<infer U> ? (
            { this?: ((value: any) => value is T[P]), every: FieldGuardsMap<U> }
        ) : (
            T[P] extends object ? (
                { this?: ((value: any) => value is T[P]) } & FieldGuardsMap<T[P]>
            ) : never
        )
    );
};

interface RawFieldGuardsMap {
    [fieldName: string]: ((value: any) => boolean) | RawFieldGuardsMap | RawObjectFieldsGuardsMap;
}

type RawObjectFieldsGuardsMap = RawFieldGuardsMap & {
    this?: (value: any) => boolean;
};

interface RawArrayFieldsGuardsMap {
    this?: (value: any) => boolean;
    every: {
        [fieldName: string]: RawFieldGuardsMap;
    };
}

interface RawFieldsSelector {
    [fieldName: string]: boolean | RawFieldsSelector;
}

const isThisOwnerFieldsGuardsMap = (data: any): data is { this: (value: any) => boolean } => data.this;
const isRawArrayFieldsGuardsMap = (data: any): data is RawArrayFieldsGuardsMap => data && data.every;
const checkObject = (
    obj: any, fieldGuardMap: RawFieldGuardsMap, checkFields: RawFieldsSelector | boolean = true
): boolean => {
    return Object.getOwnPropertyNames(fieldGuardMap)
        .filter(fieldName => fieldName !== 'this')
        .every(fieldName => {
            const fieldValue = obj[fieldName];
            const guard = fieldGuardMap[fieldName];
            const thisTrue = !isThisOwnerFieldsGuardsMap(guard) || guard.this(fieldValue);
            if (!thisTrue)
                return false;

            if (isRawArrayFieldsGuardsMap(guard))
                return (fieldValue as any[])
                    // TODO: replace true
                    .every(element => checkObject(element, guard.every, true));

            if (typeof guard === 'function')
                return guard(fieldValue);
            return checkObject(
                fieldValue, guard, typeof checkFields === 'boolean' ? checkFields : checkFields[fieldName]
            );
        });
};

export function is<T>(data: any, fieldGuardMap: FieldGuardsMap<T>): data is T;
export function is<T, S extends FieldsSelector<T>>(
    data: any, fieldGuardMap: FieldGuardsMap<T>, checkFields: S | undefined
): data is FieldsSelectorResult<T, S>;
export function is<T, S extends FieldsSelector<T>>(
    data: any, fieldGuardMap: FieldGuardsMap<T>, checkFields?: S
): data is T | FieldsSelectorResult<T, S> {
    return checkObject(data, fieldGuardMap as any, checkFields as any);
}
