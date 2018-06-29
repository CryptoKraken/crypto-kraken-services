import { FieldsSelector, FieldsSelectorResult } from './types';

export type FieldGuardsMap<T> = {
    [P in keyof T]: ((value: any) => value is T[P]) | (
        T[P] extends Array<infer U> ? (
            { this?: ((value: any) => value is T[P]), every: FieldGuardsMap<U> | ((value: any) => value is U) }
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
    every: ((value: any) => boolean) | RawFieldGuardsMap;
}

interface RawFieldsSelector {
    [fieldName: string]: boolean | RawFieldsSelector;
}

const isThisOwnerFieldsGuardsMap = (data: any): data is { this: (value: any) => boolean } => data.this;
const isArrayFieldsGuardsMap = (data: any): data is RawArrayFieldsGuardsMap => data && data.every;
const checkObject = (
    obj: any, fieldGuardMap: RawFieldGuardsMap, checkFields: RawFieldsSelector | boolean = true
): boolean => {
    if (!checkFields || (checkFields !== true && !Object.keys(checkFields).length))
        return true;
    return Object.getOwnPropertyNames(fieldGuardMap)
        .filter(fieldName => {
            return fieldName !== 'this' && (
                checkFields === true || checkFields[fieldName] === true || typeof checkFields[fieldName] === 'object'
            );
        })
        .every(fieldName => {
            const fieldValue = obj[fieldName];
            const guard = fieldGuardMap[fieldName];
            if (typeof guard === 'function')
                return guard(fieldValue);

            const isThisGuardTrue = !isThisOwnerFieldsGuardsMap(guard) || guard.this(fieldValue);
            if (!isThisGuardTrue)
                return false;
            const nextCheckFields = typeof checkFields === 'boolean' ? checkFields : checkFields[fieldName];
            if (isArrayFieldsGuardsMap(guard))
                return (fieldValue as any[])
                    .every(element => {
                        if (typeof guard.every === 'function')
                            return guard.every(element);
                        return checkObject(element, guard.every, nextCheckFields);
                    });
            return checkObject(fieldValue, guard, nextCheckFields);
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
