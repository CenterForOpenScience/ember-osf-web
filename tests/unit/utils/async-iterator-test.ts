import { chainPages, memoize } from 'ember-osf-web/utils/async-iterator';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Utility | async-iterator', () => {
    test('chainPages', async assert => {
        const gen1 = async function *() {
            yield [1, 2];
            yield [3, 4];
            return [5];
        };

        const gen2 = async function *() {
            yield [6, 7];
            return [8, 9];
        };

        const results = [];
        const gen = chainPages(gen1(), gen2(), 2);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const result = await gen.next();
            results.push(result.value);
            if (result.done) {
                break;
            }
        }

        assert.deepEqual(results, [
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 8],
            [9],
        ]);
    });

    test('chainPages | round results', async assert => {
        const gen1 = async function *() {
            yield [1, 2];
            yield [3, 4];
            return [5];
        };

        const gen2 = async function *() {
            yield [6, 7];
            yield [8, 9];
            return [10];
        };

        const results = [];
        const gen = chainPages(gen1(), gen2(), 2);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const result = await gen.next();
            results.push(result.value);
            if (result.done) {
                break;
            }
        }

        assert.deepEqual(results, [
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 8],
            [9, 10],
        ]);
    });

    test('memoize', async assert => {
        const stub = sinon.stub().returns(10);

        const memoized = memoize(async function *() {
            for (let i = 0; i < 5; i++) {
                yield stub();
            }
        }());

        for (let i = 0; i < 3; i++) {
            for await (const x of memoized()) {
                assert.equal(x, 10);
            }
        }

        sinon.assert.callCount(stub, 5);
    });
});
