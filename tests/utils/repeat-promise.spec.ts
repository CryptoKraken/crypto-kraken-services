import { expect } from 'chai';
import { RepeatPromise } from '../../src/utils';
import { fail } from 'assert';

describe('The RepeatPromise', () => {
    it('should repeat a body', async () => {
        let callCounter = 0;
        const value = await new RepeatPromise<number>((resolve, reject) => {
            callCounter++;
            if (callCounter < 3)
                reject('A custom reason');
            else
                resolve(500);
        }, 4);

        expect(callCounter).to.equal(3);
        expect(value).to.equal(500);

    });

    it('should repeat a asynchronous body', async () => {
        let callCounter = 0;
        const value = await new RepeatPromise<number>((resolve, reject) => {
            setTimeout(() => {
                callCounter++;
                if (callCounter < 3)
                    reject('A custom reason');
                else
                    resolve(500);
            }, 2);
        }, 4);

        expect(callCounter).to.equal(3);
        expect(value).to.equal(500);
    });

    it('should throw an error when the number of attempts has been exceeded', async () => {
        let callCounter = 0;
        try {
            await new RepeatPromise<number>((resolve, reject) => {
                setTimeout(() => {
                    callCounter++;
                    reject(`A custom reason: ${callCounter}`);
                }, 2)
            }, 4);

            throw new Error('This test should throw an exception');
        }
        catch (error) {
            expect(error).to.eql('A custom reason: 5');
        }
    });

    it('should be finished after all attempts', async () => {
        let callCounter = 0;
        try {
            await new RepeatPromise<number>((resolve, reject) => {
                setTimeout(() => {
                    callCounter++;
                    reject(`A custom reason: ${callCounter}`);
                }, 2)
            }, 4);
        }
        catch (error) {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    expect(callCounter).to.eql(5);
                    resolve();
                }, 10);
            });
        }
    });
});