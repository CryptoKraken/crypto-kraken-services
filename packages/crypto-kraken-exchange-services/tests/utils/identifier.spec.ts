import { expect } from 'chai';
import { Identified, isIdentified } from '../../src/utils';

describe('isIdentified', () => {
    it('should identify an object correctly', () => {
        const obj = {
            field1: 'value1',
            field2: 'value2'
        };

        const identifiedObj1: Identified<typeof obj> = { ...obj, id: 'id1' };
        const identifiedObj2: Identified<typeof obj> = { ...obj, id: 'id2' };

        expect(isIdentified(obj)).to.be.false;
        expect(isIdentified(identifiedObj1)).to.be.true;
        expect(isIdentified(identifiedObj2)).to.be.true;
    });
});
