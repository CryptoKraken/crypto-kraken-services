import { FieldsSelector, FieldsSelectorResult } from './types';

export type FieldGuardsMap<T> = {
    [P in keyof T]-?: ((value: any) => value is T[P]) | (
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

/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isArray = (value: any): value is any[] => Array.isArray(value);
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean';
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isFunction = (value: any): value is 'function' => typeof value === 'function';
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isNumber = (value: any): value is number => typeof value === 'number';
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isString = (value: any): value is string => typeof value === 'string';
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isSymbol = (value: any): value is 'symbol' => typeof value === 'symbol';
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isNullOrArray = (value: any): value is any[] => {
    return value === null || Array.isArray(value);
};
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isNullOrBoolean = (value: any): value is boolean => {
    return value === null || typeof value === 'boolean';
};
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isNullOrFunction = (value: any): value is 'function' => {
    return value === null || typeof value === 'function';
};
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isNullOrNumber = (value: any): value is number | null => {
    return value === null || typeof value === 'number';
};
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isNullOrString = (value: any): value is string | null => {
    return value === null || typeof value === 'string';
};
/**
 * This guard is needed for to avoid excessive using of memory.
 * It should be used in guards map for simple type of fields.
 * You shouldn't use them inside other guards, you should use native guards instead of.
 */
export const isNullOrSymbol = (value: any): value is 'symbol' => {
    return value === null || typeof value === 'symbol';
};
