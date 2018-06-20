import { expect } from 'chai';
import { foo } from '../src/index';

describe('A dummy spec', () => {
    it('A dummy test', () => expect(foo()).to.eql(1));
});
