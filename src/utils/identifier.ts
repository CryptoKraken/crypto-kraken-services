export type Identified<T> = T & { readonly id: string; };

export const isIdentified = <T>(instance: T): instance is Identified<T> => {
    return !!instance && !!(instance as any).id && typeof (instance as any).id === 'string';
};
