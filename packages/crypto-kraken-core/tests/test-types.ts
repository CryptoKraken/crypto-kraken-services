export interface TestType {
    numberField: number;
    stringField: string;
    booleanField: boolean;
    objectField: {
        numberField: number;
        stringField: string;
        objectField1: {
            stringField1: string;
            stringField2: string;
        };
        objectField2: {
            stringField1: string;
            stringField2: string;
        };
    };
    arrayField: Array<{
        numberField1: number;
        numberField2: number;
        arrayField: Array<{
            stringField1: string;
            stringField2: string;
        }>
    }>;
}
