import { FieldsSelector, FieldsSelectorResult } from 'src';

/* These tests are created for type checking only. It shouldn't execute */
describe.skip('The types:', () => {
    describe('the fields selector', () => {
        interface UncheckedType {
            x: boolean;
            y: string;
            z: number;
        }

        interface TestType {
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

        const instance: TestType = {} as any;
        const check = <S extends FieldsSelector<TestType>>(
            obj: TestType, fieldsSelector: S
        ): FieldsSelectorResult<TestType, S, UncheckedType> => {
            throw new Error('This method should not be called!');
        };
        const checked = <T>(value: T): T extends UncheckedType ? { no: true } : { yes: true } => {
            throw new Error('This method should not be called!');
        };

        it('should return unchecked result when a selector equals an empty object', () => {
            const result = check(instance, {});

            checked(result.numberField).no;
            checked(result.stringField).no;
            checked(result.booleanField).no;
            checked(result.objectField).no;
            checked(result.arrayField).no;
        });

        it('should return checked fields when a selector contains true values for corresponding fields', () => {
            const result = check(instance, {
                numberField: true,
                stringField: true,
                booleanField: true
            });

            checked(result.numberField).yes;
            checked(result.stringField).yes;
            checked(result.booleanField).yes;
            checked(result.arrayField).no;
        });

        it('should return a full checked object when a selector field with its name equals true', () => {
            const result = check(instance, {
                numberField: true,
                arrayField: true,
                objectField: true
            });

            checked(result.numberField).yes;
            checked(result.stringField).no;
            checked(result.booleanField).no;
            checked(result.objectField).yes;
            checked(result.arrayField).yes;
            checked(result.objectField.numberField).yes;
            checked(result.objectField.stringField).yes;
            checked(result.objectField.objectField1).yes;
            checked(result.objectField.objectField1.stringField1).yes;
            checked(result.objectField.objectField1.stringField2).yes;
            checked(result.objectField.objectField2).yes;
            checked(result.objectField.objectField2.stringField1).yes;
            checked(result.objectField.objectField2.stringField2).yes;
        });

        it('should return a checked object with corresponding checked and unchecked fields', () => {
            const result = check(instance, {
                numberField: true,
                objectField: {
                    stringField: true,
                    objectField1: {
                        stringField2: true
                    }
                }
            });

            checked(result.numberField).yes;
            checked(result.stringField).no;
            checked(result.booleanField).no;
            checked(result.objectField).yes;
            checked(result.objectField.numberField).no;
            checked(result.objectField.stringField).yes;
            checked(result.objectField.objectField1).yes;
            checked(result.objectField.objectField1.stringField1).no;
            checked(result.objectField.objectField1.stringField2).yes;
            checked(result.objectField.objectField2).no;
        });

        it('should return a full checked array of an object when a selector field with its name equals true', () => {
            const result = check(instance, {
                numberField: true,
                arrayField: true
            });

            checked(result.numberField).yes;
            checked(result.stringField).no;
            checked(result.booleanField).no;
            checked(result.arrayField).yes;
            checked(result.arrayField.map(element => element)).yes;
            checked(result.arrayField[0].numberField1).yes;
            checked(result.arrayField[0].numberField2).yes;
            checked(result.arrayField[0].arrayField[0].stringField1).yes;
            checked(result.arrayField[0].arrayField[0].stringField2).yes;
        });

        it('should return a checked array with corresponding checked and unchecked fields', () => {
            const result = check(instance, {
                numberField: true,
                stringField: true,
                arrayField: {
                    numberField1: true,
                    arrayField: {
                        stringField2: true
                    }
                }
            });

            checked(result.numberField).yes;
            checked(result.stringField).yes;
            checked(result.booleanField).no;
            checked(result.arrayField).yes;
            checked(result.arrayField.map(element => element)).yes;
            checked(result.arrayField[0].numberField1).yes;
            checked(result.arrayField[0].numberField2).no;
            checked(result.arrayField[0].arrayField[0].stringField1).no;
            checked(result.arrayField[0].arrayField[0].stringField2).yes;
        });
    });
});
