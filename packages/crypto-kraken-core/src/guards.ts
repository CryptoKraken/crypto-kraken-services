import { FieldsSelector, FieldsSelectorResult } from './types';

export type FieldGuardsMap<T> = {
    [P in keyof T]: ((value: any) => value is T[P]) | (
        T[P] extends Array<infer U> ? (
            { this?: ((value: any) => value is T[P]), every: FieldGuardsMap<U> }
        ) : (
            T[P] extends object ? (
                { this?: ((value: any) => value is T[P]) } & FieldGuardsMap<T[P]>
            ) : FieldGuardsMap<T[P]>
        )
    );
};

interface RawFieldGuardsMap {
    [fieldName: string]: ((value: any) => boolean) | RawFieldGuardsMap;
}

interface RawFieldsSelector {
    [fieldName: string]: boolean | RawFieldsSelector;
}

export const checkObject = (
    obj: any, fieldGuardMap: RawFieldGuardsMap, checkFields: RawFieldsSelector | boolean = true
): boolean => {
    return Object.getOwnPropertyNames(fieldGuardMap)
        .every(fieldName => {
            const fieldValue = obj[fieldName];
            const guard = fieldGuardMap[fieldName];
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
