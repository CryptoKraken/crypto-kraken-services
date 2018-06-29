import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { is } from 'src';
import { FieldGuardsMap } from 'src/guards';
import { TestType } from './test-types';
chai.use(sinonChai);

describe(`The generic 'is' guard`, () => {
    let testObj: TestType;
    let commonTestTypeGuardsMap: FieldGuardsMap<TestType>;
    const spy = (obj: any): void => {
        Object.getOwnPropertyNames(obj)
            .forEach(fieldName => {
                if (typeof obj[fieldName] === 'object')
                    spy(obj[fieldName]);
                else
                    sinon.spy(obj, fieldName);
            });
    };

    beforeEach(() => {
        testObj = {
            numberField: 123,
            stringField: 'Some string',
            booleanField: true,
            objectField: {
                numberField: 999,
                stringField: 'String from internal object',
                objectField1: {
                    stringField1: 'String 1 from objectField1',
                    stringField2: 'String 2 from objectField1'
                },
                objectField2: {
                    stringField1: 'String 1 from objectField2',
                    stringField2: 'String 2 from objectField2'
                }
            },
            arrayField: Array.from({ length: 3 }, (value, index) => ({
                numberField1: index,
                numberField2: index * 100,
                arrayField: Array.from({ length: 2 }, (internalValue, internalIndex) => ({
                    stringField1: `String 1 from [${index}].[${internalIndex}]`,
                    stringField2: `String 2 from [${index}].[${internalIndex}]`
                }))
            })),
        };
        commonTestTypeGuardsMap = {
            numberField: (value: any): value is number => typeof value === 'number',
            stringField: (value: any): value is string => typeof value === 'string',
            booleanField: (value: any): value is boolean => typeof value === 'boolean',
            objectField: {
                numberField: (value: any): value is number => typeof value === 'number',
                stringField: (value: any): value is string => typeof value === 'string',
                objectField1: {
                    stringField1: (value: any): value is string => typeof value === 'string',
                    stringField2: (value: any): value is string => typeof value === 'string'
                },
                objectField2: {
                    stringField1: (value: any): value is string => typeof value === 'string',
                    stringField2: (value: any): value is string => typeof value === 'string'
                }
            },
            arrayField: {
                every: {
                    numberField1: (value: any): value is number => typeof value === 'number',
                    numberField2: (value: any): value is number => typeof value === 'number',
                    arrayField: {
                        every: {
                            stringField1: (value: any): value is string => typeof value === 'string',
                            stringField2: (value: any): value is string => typeof value === 'string'
                        }
                    }
                }
            }
        };
    });

    it('should check an instance type by a guards map', () => {
        const guardsMap = commonTestTypeGuardsMap;
        if (typeof guardsMap.objectField === 'function' || typeof guardsMap.objectField.objectField2 === 'function'
            || typeof guardsMap.objectField.objectField1 === 'function'
            || typeof guardsMap.arrayField === 'function' || typeof guardsMap.arrayField.every === 'function'
            || typeof guardsMap.arrayField.every.arrayField === 'function'
            || typeof guardsMap.arrayField.every.arrayField.every === 'function') {
            expect.fail(`Wrong guards map`);
            return;
        }
        spy(guardsMap);

        expect(is<TestType>(testObj, guardsMap)).to.be.true;
        // Check that the guards of fields of primitive types should be called
        expect(guardsMap.numberField).to.have.been.calledOnceWith(testObj.numberField);
        expect(guardsMap.stringField).to.have.been.calledOnceWith(testObj.stringField);
        expect(guardsMap.booleanField).to.have.been.calledOnceWith(testObj.booleanField);
        // Check that the guards of fields of object types should be called
        expect(guardsMap.objectField.numberField).to.have.been.calledOnceWith(testObj.objectField.numberField);
        expect(guardsMap.objectField.stringField).to.have.been.calledOnceWith(testObj.objectField.stringField);
        expect(guardsMap.objectField.objectField1.stringField1)
            .to.have.been.calledOnceWith(testObj.objectField.objectField1.stringField1);
        expect(guardsMap.objectField.objectField1.stringField2)
            .to.have.been.calledOnceWith(testObj.objectField.objectField1.stringField2);
        expect(guardsMap.objectField.objectField2.stringField1)
            .to.have.been.calledOnceWith(testObj.objectField.objectField2.stringField1);
        expect(guardsMap.objectField.objectField2.stringField2)
            .to.have.been.calledOnceWith(testObj.objectField.objectField2.stringField2);
        // Check that the guards of fields of array types should be called
        expect(guardsMap.arrayField.every.numberField1)
            .to.have.been.callCount(3)
            .calledWith(testObj.arrayField[0].numberField1)
            .calledWith(testObj.arrayField[1].numberField1)
            .calledWith(testObj.arrayField[2].numberField1);
        expect(guardsMap.arrayField.every.numberField2)
            .to.have.been.callCount(3)
            .calledWith(testObj.arrayField[0].numberField2)
            .calledWith(testObj.arrayField[1].numberField2)
            .calledWith(testObj.arrayField[2].numberField2);
        expect(guardsMap.arrayField.every.arrayField.every.stringField1)
            .to.have.been.callCount(3 * 2)
            .calledWith(testObj.arrayField[0].arrayField[0].stringField1)
            .calledWith(testObj.arrayField[0].arrayField[1].stringField1)
            .calledWith(testObj.arrayField[1].arrayField[0].stringField1)
            .calledWith(testObj.arrayField[1].arrayField[1].stringField1)
            .calledWith(testObj.arrayField[2].arrayField[0].stringField1)
            .calledWith(testObj.arrayField[2].arrayField[1].stringField1);
        expect(guardsMap.arrayField.every.arrayField.every.stringField2)
            .to.have.been.callCount(3 * 2)
            .calledWith(testObj.arrayField[0].arrayField[0].stringField2)
            .calledWith(testObj.arrayField[0].arrayField[1].stringField2)
            .calledWith(testObj.arrayField[1].arrayField[0].stringField2)
            .calledWith(testObj.arrayField[1].arrayField[1].stringField2)
            .calledWith(testObj.arrayField[2].arrayField[0].stringField2)
            .calledWith(testObj.arrayField[2].arrayField[1].stringField2);
    });

    it('should not check a whole instance when one of fields guards returns false', () => {
        const guardsMap = commonTestTypeGuardsMap;
        if (typeof guardsMap.objectField === 'function' || typeof guardsMap.objectField.objectField2 === 'function'
            || typeof guardsMap.objectField.objectField1 === 'function'
            || typeof guardsMap.arrayField === 'function' || typeof guardsMap.arrayField.every === 'function'
            || typeof guardsMap.arrayField.every.arrayField === 'function'
            || typeof guardsMap.arrayField.every.arrayField.every === 'function') {
            expect.fail(`Wrong guards map`);
            return;
        }
        guardsMap.stringField = (value): value is string => false;

        spy(guardsMap);

        expect(is<TestType>(testObj, guardsMap)).to.be.false;
        expect(guardsMap.numberField).to.have.been.calledOnceWith(testObj.numberField);
        expect(guardsMap.stringField).to.have.been.calledOnceWith(testObj.stringField);

        expect(guardsMap.booleanField).to.have.not.been.called;
        expect(guardsMap.objectField.numberField).to.have.not.been.called;
        expect(guardsMap.objectField.stringField).to.have.not.been.called;
        expect(guardsMap.objectField.objectField1.stringField1).to.have.not.been.called;
        expect(guardsMap.objectField.objectField1.stringField2).to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.stringField1).to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.stringField2).to.have.not.been.called;
        expect(guardsMap.arrayField.every.numberField1).to.have.not.been.called;
        expect(guardsMap.arrayField.every.numberField2).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField1).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField2).to.have.not.been.called;
    });

    it(`should check an instance type by a guards map with 'this' guard of the object type`, () => {
        const guardsMap: FieldGuardsMap<TestType> = commonTestTypeGuardsMap;
        if (typeof guardsMap.objectField === 'function' || typeof guardsMap.objectField.objectField2 === 'function'
            || typeof guardsMap.objectField.objectField1 === 'function') {
            expect.fail(`Wrong guards map`);
            return;
        }

        guardsMap.objectField.this = (value: any): value is TestType['objectField'] => !!value;
        guardsMap.objectField.objectField2.this =
            (value: any): value is TestType['objectField']['objectField2'] => !!value;
        spy(guardsMap);

        expect(is<TestType>(testObj, guardsMap)).to.be.true;
        expect(guardsMap.objectField.objectField1.this).to.be.undefined;
        expect(guardsMap.objectField.this).to.have.been.calledOnceWith(testObj.objectField);
        expect(guardsMap.objectField.objectField2.this).to.have.been.calledOnceWith(testObj.objectField.objectField2);
        expect(guardsMap.objectField.numberField).to.have.been.calledOnceWith(testObj.objectField.numberField);
        expect(guardsMap.objectField.stringField).to.have.been.calledOnceWith(testObj.objectField.stringField);
        expect(guardsMap.objectField.objectField1.stringField1)
            .to.have.been.calledOnceWith(testObj.objectField.objectField1.stringField1);
        expect(guardsMap.objectField.objectField1.stringField2)
            .to.have.been.calledOnceWith(testObj.objectField.objectField1.stringField2);
        expect(guardsMap.objectField.objectField2.stringField1)
            .to.have.been.calledOnceWith(testObj.objectField.objectField2.stringField1);
        expect(guardsMap.objectField.objectField2.stringField2)
            .to.have.been.calledOnceWith(testObj.objectField.objectField2.stringField2);
    });

    it(`should not call object field guards when a 'this' guard returns false`, () => {
        const guardsMap: FieldGuardsMap<TestType> = commonTestTypeGuardsMap;
        if (typeof guardsMap.objectField === 'function' || typeof guardsMap.objectField.objectField2 === 'function'
            || typeof guardsMap.objectField.objectField1 === 'function') {
            expect.fail(`Wrong guards map`);
            return;
        }

        guardsMap.objectField.this = (value: any): value is TestType['objectField'] => false;
        guardsMap.objectField.objectField2.this =
            (value: any): value is TestType['objectField']['objectField2'] => !!value;

        spy(guardsMap);
        expect(is<TestType>(testObj, guardsMap)).to.be.false;

        expect(guardsMap.objectField.this).to.have.been.calledOnceWith(testObj.objectField);
        expect(guardsMap.objectField.numberField).to.have.not.been.called;
        expect(guardsMap.objectField.stringField).to.have.not.been.called;
        expect(guardsMap.objectField.objectField1.stringField1).to.have.to.have.not.been.called;
        expect(guardsMap.objectField.objectField1.stringField2).to.have.to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.this).to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.stringField1).to.have.to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.stringField2).to.have.to.have.not.been.called;
    });

    it(`should check an instance type by a guards map with 'this' guard of the array type`, () => {
        const guardsMap: FieldGuardsMap<TestType> = commonTestTypeGuardsMap;
        if (typeof guardsMap.arrayField === 'function' || typeof guardsMap.arrayField.every === 'function'
            || typeof guardsMap.arrayField.every.arrayField === 'function'
            || typeof guardsMap.arrayField.every.arrayField.every === 'function') {
            expect.fail(`Wrong guards map`);
            return;
        }

        guardsMap.arrayField.this = (value: any): value is TestType['arrayField'] => !!value;
        guardsMap.arrayField.every.arrayField.this =
            (value: any): value is TestType['arrayField'][0]['arrayField'] => !!value;
        spy(guardsMap);

        expect(is<TestType>(testObj, guardsMap)).to.be.true;
        expect(guardsMap.arrayField.this).to.have.been.calledOnceWith(testObj.arrayField);
        expect(guardsMap.arrayField.every.arrayField.this)
            .to.have.been.callCount(3)
            .calledWith(testObj.arrayField[0].arrayField)
            .calledWith(testObj.arrayField[1].arrayField)
            .calledWith(testObj.arrayField[2].arrayField);
        expect(guardsMap.arrayField.every.numberField1)
            .to.have.been.callCount(3)
            .calledWith(testObj.arrayField[0].numberField1)
            .calledWith(testObj.arrayField[1].numberField1)
            .calledWith(testObj.arrayField[2].numberField1);
        expect(guardsMap.arrayField.every.numberField2)
            .to.have.been.callCount(3)
            .calledWith(testObj.arrayField[0].numberField2)
            .calledWith(testObj.arrayField[1].numberField2)
            .calledWith(testObj.arrayField[2].numberField2);
        expect(guardsMap.arrayField.every.arrayField.every.stringField1)
            .to.have.been.callCount(3 * 2)
            .calledWith(testObj.arrayField[0].arrayField[0].stringField1)
            .calledWith(testObj.arrayField[0].arrayField[1].stringField1)
            .calledWith(testObj.arrayField[1].arrayField[0].stringField1)
            .calledWith(testObj.arrayField[1].arrayField[1].stringField1)
            .calledWith(testObj.arrayField[2].arrayField[0].stringField1)
            .calledWith(testObj.arrayField[2].arrayField[1].stringField1);
        expect(guardsMap.arrayField.every.arrayField.every.stringField2)
            .to.have.been.callCount(3 * 2)
            .calledWith(testObj.arrayField[0].arrayField[0].stringField2)
            .calledWith(testObj.arrayField[0].arrayField[1].stringField2)
            .calledWith(testObj.arrayField[1].arrayField[0].stringField2)
            .calledWith(testObj.arrayField[1].arrayField[1].stringField2)
            .calledWith(testObj.arrayField[2].arrayField[0].stringField2)
            .calledWith(testObj.arrayField[2].arrayField[1].stringField2);
    });

    it(`should not call array field guards when a 'this' guard returns false`, () => {
        const guardsMap: FieldGuardsMap<TestType> = commonTestTypeGuardsMap;
        if (typeof guardsMap.arrayField === 'function' || typeof guardsMap.arrayField.every === 'function'
            || typeof guardsMap.arrayField.every.arrayField === 'function'
            || typeof guardsMap.arrayField.every.arrayField.every === 'function') {
            expect.fail(`Wrong guards map`);
            return;
        }

        guardsMap.arrayField.this = (value: any): value is TestType['arrayField'] => false;
        guardsMap.arrayField.every.arrayField.this =
            (value: any): value is TestType['arrayField'][0]['arrayField'] => !!value;
        spy(guardsMap);

        expect(is<TestType>(testObj, guardsMap)).to.be.false;
        expect(guardsMap.arrayField.this).to.have.been.calledOnceWith(testObj.arrayField);
        expect(guardsMap.arrayField.every.numberField1).to.have.not.been.called;
        expect(guardsMap.arrayField.every.numberField2).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.this).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField1).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField2).to.have.not.been.called;
    });

    // tslint:disable-next-line:max-line-length
    it(`should be executed without a field checking when the checkFields argument is passed like an empty object`, () => {
        const guardsMap: FieldGuardsMap<TestType> = commonTestTypeGuardsMap;
        if (typeof guardsMap.objectField === 'function' || typeof guardsMap.objectField.objectField2 === 'function'
            || typeof guardsMap.objectField.objectField1 === 'function' || typeof guardsMap.arrayField === 'function'
            || typeof guardsMap.arrayField.every === 'function'
            || typeof guardsMap.arrayField.every.arrayField === 'function'
            || typeof guardsMap.arrayField.every.arrayField.every === 'function') {
            expect.fail(`Wrong guards map`);
            return;
        }
        spy(guardsMap);

        expect(is(testObj, guardsMap, {})).to.be.true;
        expect(guardsMap.numberField).to.have.not.been.called;
        expect(guardsMap.stringField).to.have.not.been.called;
        expect(guardsMap.booleanField).to.have.not.been.called;
        expect(guardsMap.objectField.numberField).to.have.not.been.called;
        expect(guardsMap.objectField.stringField).to.have.not.been.called;
        expect(guardsMap.objectField.objectField1.stringField1).to.have.not.been.called;
        expect(guardsMap.objectField.objectField1.stringField2).to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.stringField1).to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.stringField2).to.have.not.been.called;
        expect(guardsMap.arrayField.every.numberField1).to.have.not.been.called;
        expect(guardsMap.arrayField.every.numberField2).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField1).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField2).to.have.not.been.called;
    });

    it('should check only specific fields of primitive types', () => {
        const guardsMap: FieldGuardsMap<TestType> = commonTestTypeGuardsMap;
        if (typeof guardsMap.objectField === 'function' || typeof guardsMap.objectField.objectField2 === 'function'
            || typeof guardsMap.objectField.objectField1 === 'function' || typeof guardsMap.arrayField === 'function'
            || typeof guardsMap.arrayField.every === 'function'
            || typeof guardsMap.arrayField.every.arrayField === 'function'
            || typeof guardsMap.arrayField.every.arrayField.every === 'function') {
            expect.fail(`Wrong guards map`);
            return;
        }
        spy(guardsMap);

        expect(is(testObj, guardsMap, {
            numberField: true,
            booleanField: true
        })).to.be.true;
        expect(guardsMap.numberField).to.have.been.calledOnceWith(testObj.numberField);
        expect(guardsMap.stringField).to.have.not.been.called;
        expect(guardsMap.booleanField).to.have.been.calledOnceWith(testObj.booleanField);
        expect(guardsMap.objectField.numberField).to.have.not.been.called;
        expect(guardsMap.objectField.stringField).to.have.not.been.called;
        expect(guardsMap.objectField.objectField1.stringField1).to.have.not.been.called;
        expect(guardsMap.objectField.objectField1.stringField2).to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.stringField1).to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.stringField2).to.have.not.been.called;
        expect(guardsMap.arrayField.every.numberField1).to.have.not.been.called;
        expect(guardsMap.arrayField.every.numberField2).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField1).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField2).to.have.not.been.called;
    });

    it('should check only specific fields of primitive types and object types', () => {
        const guardsMap: FieldGuardsMap<TestType> = commonTestTypeGuardsMap;
        if (typeof guardsMap.objectField === 'function' || typeof guardsMap.objectField.objectField2 === 'function'
            || typeof guardsMap.objectField.objectField1 === 'function' || typeof guardsMap.arrayField === 'function'
            || typeof guardsMap.arrayField.every === 'function'
            || typeof guardsMap.arrayField.every.arrayField === 'function'
            || typeof guardsMap.arrayField.every.arrayField.every === 'function') {
            expect.fail(`Wrong guards map`);
            return;
        }
        spy(guardsMap);

        expect(is(testObj, guardsMap, {
            numberField: true,
            booleanField: true,
            objectField: {
                numberField: true,
                objectField1: {
                    stringField1: true
                },
                objectField2: true
            }
        })).to.be.true;
        expect(guardsMap.numberField).to.have.been.calledOnceWith(testObj.numberField);
        expect(guardsMap.stringField).to.have.not.been.called;
        expect(guardsMap.booleanField).to.have.been.calledOnceWith(testObj.booleanField);
        expect(guardsMap.objectField.numberField).to.have.been.calledOnceWith(testObj.objectField.numberField);
        expect(guardsMap.objectField.stringField).to.have.not.been;
        expect(guardsMap.objectField.objectField1.stringField1)
            .to.have.been.calledOnceWith(testObj.objectField.objectField1.stringField1);
        expect(guardsMap.objectField.objectField1.stringField2).to.have.not.been;
        expect(guardsMap.objectField.objectField2.stringField1)
            .to.have.been.calledOnceWith(testObj.objectField.objectField2.stringField1);
        expect(guardsMap.objectField.objectField2.stringField2)
            .to.have.been.calledOnceWith(testObj.objectField.objectField2.stringField2);
        expect(guardsMap.arrayField.every.numberField1).to.have.not.been.called;
        expect(guardsMap.arrayField.every.numberField2).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField1).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField2).to.have.not.been.called;
    });

    it('should check only specific fields of primitive types and array types', () => {
        const guardsMap: FieldGuardsMap<TestType> = commonTestTypeGuardsMap;
        if (typeof guardsMap.objectField === 'function' || typeof guardsMap.objectField.objectField2 === 'function'
            || typeof guardsMap.objectField.objectField1 === 'function' || typeof guardsMap.arrayField === 'function'
            || typeof guardsMap.arrayField.every === 'function'
            || typeof guardsMap.arrayField.every.arrayField === 'function'
            || typeof guardsMap.arrayField.every.arrayField.every === 'function') {
            expect.fail(`Wrong guards map`);
            return;
        }
        spy(guardsMap);

        expect(is(testObj, guardsMap, {
            numberField: true,
            booleanField: true,
            arrayField: {
                numberField1: true,
                arrayField: true
            }
        })).to.be.true;
        expect(guardsMap.numberField).to.have.been.calledOnceWith(testObj.numberField);
        expect(guardsMap.stringField).to.have.not.been.called;
        expect(guardsMap.booleanField).to.have.been.calledOnceWith(testObj.booleanField);
        expect(guardsMap.objectField.numberField).to.have.not.been.called;
        expect(guardsMap.objectField.stringField).to.have.not.been.called;
        expect(guardsMap.objectField.objectField1.stringField1).to.have.not.been.called;
        expect(guardsMap.objectField.objectField1.stringField2).to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.stringField1).to.have.not.been.called;
        expect(guardsMap.objectField.objectField2.stringField2).to.have.not.been.called;
        expect(guardsMap.arrayField.every.numberField1)
            .to.have.been.callCount(3)
            .calledWith(testObj.arrayField[0].numberField1)
            .calledWith(testObj.arrayField[1].numberField1)
            .calledWith(testObj.arrayField[2].numberField1);
        expect(guardsMap.arrayField.every.numberField2).to.have.not.been.called;
        expect(guardsMap.arrayField.every.arrayField.every.stringField1)
            .to.have.been.callCount(3 * 2)
            .calledWith(testObj.arrayField[0].arrayField[0].stringField1)
            .calledWith(testObj.arrayField[0].arrayField[1].stringField1)
            .calledWith(testObj.arrayField[1].arrayField[0].stringField1)
            .calledWith(testObj.arrayField[1].arrayField[1].stringField1)
            .calledWith(testObj.arrayField[2].arrayField[0].stringField1)
            .calledWith(testObj.arrayField[2].arrayField[1].stringField1);
        expect(guardsMap.arrayField.every.arrayField.every.stringField2)
            .to.have.been.callCount(3 * 2)
            .calledWith(testObj.arrayField[0].arrayField[0].stringField2)
            .calledWith(testObj.arrayField[0].arrayField[1].stringField2)
            .calledWith(testObj.arrayField[1].arrayField[0].stringField2)
            .calledWith(testObj.arrayField[1].arrayField[1].stringField2)
            .calledWith(testObj.arrayField[2].arrayField[0].stringField2)
            .calledWith(testObj.arrayField[2].arrayField[1].stringField2);
    });
});
