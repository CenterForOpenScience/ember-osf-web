import { Request } from 'ember-cli-mirage';
import { setupTest } from 'ember-qunit';
import moment from 'moment';
import { module, test } from 'qunit';

import {
    dynamicSort,
    ProcessOptions,
    sort,
} from 'ember-osf-web/mirage/views/utils/-private';

function fakeRequest(queryParams: { [key: string]: string }): Request {
    return {
        requestBody: '',
        url: '',
        params: {},
        queryParams,
        method: '',
    };
}

module('Unit | Mirage | Views | Utils | dynamicSort', hooks => {
    setupTest(hooks);

    test('it can sort strings', assert => {
        const unsorted = [
            { attributes: { sortme: 'a' } },
            { attributes: { sortme: 'c' } },
            { attributes: { sortme: 'b' } },
        ];
        const expected = [
            { attributes: { sortme: 'a' } },
            { attributes: { sortme: 'b' } },
            { attributes: { sortme: 'c' } },
        ];
        const sorted = unsorted.sort(dynamicSort('sortme'));
        assert.deepEqual(sorted, expected);
    });

    test('it can reverse sort strings', assert => {
        const unsorted = [
            { attributes: { sortme: 'a' } },
            { attributes: { sortme: 'c' } },
            { attributes: { sortme: 'b' } },
        ];
        const expected = [
            { attributes: { sortme: 'c' } },
            { attributes: { sortme: 'b' } },
            { attributes: { sortme: 'a' } },
        ];
        const sorted = unsorted.sort(dynamicSort('-sortme'));
        assert.deepEqual(sorted, expected);
    });

    test('it can sort numbers', assert => {
        const unsorted = [
            { attributes: { sortme: 3 } },
            { attributes: { sortme: 1 } },
            { attributes: { sortme: 2 } },
        ];
        const expected = [
            { attributes: { sortme: 1 } },
            { attributes: { sortme: 2 } },
            { attributes: { sortme: 3 } },
        ];
        const sorted = unsorted.sort(dynamicSort('sortme'));
        assert.deepEqual(sorted, expected);
    });

    test('it can sort dates', assert => {
        const dateOne = moment().subtract(10, 'days');
        const dateTwo = moment().subtract(5, 'days');
        const dateThree = moment().subtract(1, 'days');
        const unsorted = [
            { attributes: { sortme: dateThree } },
            { attributes: { sortme: dateOne, unimportant: 'Hi' } },
            { attributes: { sortme: dateTwo } },
        ];
        const expected = [
            { attributes: { sortme: dateOne, unimportant: 'Hi' } },
            { attributes: { sortme: dateTwo } },
            { attributes: { sortme: dateThree } },
        ];
        const sorted = unsorted.sort(dynamicSort('sortme'));
        assert.deepEqual(sorted, expected);
    });
});

module('Unit | Mirage | Views | Utils | sort', hooks => {
    setupTest(hooks);

    test('it can sort', assert => {
        const request = fakeRequest({ sort: 'string' });
        const unsorted = [
            { attributes: { string: 'a', num: 3 } },
            { attributes: { string: 'c', num: 2 } },
            { attributes: { string: 'b', num: 1 } },
        ];
        const expected = [
            { attributes: { string: 'a', num: 3 } },
            { attributes: { string: 'b', num: 1 } },
            { attributes: { string: 'c', num: 2 } },
        ];
        const sorted = sort(request, unsorted, {});
        assert.deepEqual(sorted, expected);
    });

    test('it can use a different key', assert => {
        const request = fakeRequest({ sort: 'num' });
        const unsorted = [
            { attributes: { string: 'a', num: 3 } },
            { attributes: { string: 'c', num: 2 } },
            { attributes: { string: 'b', num: 1 } },
        ];
        const expected = [
            { attributes: { string: 'b', num: 1 } },
            { attributes: { string: 'c', num: 2 } },
            { attributes: { string: 'a', num: 3 } },
        ];
        const sorted = sort(request, unsorted, {});
        assert.deepEqual(sorted, expected);
    });

    test('it can reverse sort', assert => {
        const request = fakeRequest({ sort: '-num' });
        const unsorted = [
            { attributes: { string: 'a', num: 3 } },
            { attributes: { string: 'c', num: 1 } },
            { attributes: { string: 'b', num: 2 } },
        ];
        const expected = [
            { attributes: { string: 'a', num: 3 } },
            { attributes: { string: 'b', num: 2 } },
            { attributes: { string: 'c', num: 1 } },
        ];
        const sorted = sort(request, unsorted, {});
        assert.deepEqual(sorted, expected);
    });

    test('it can use a default sort key', assert => {
        const request = fakeRequest({ });
        const options: ProcessOptions = { defaultSortKey: 'num' };
        const unsorted = [
            { attributes: { string: 'a', num: 3 } },
            { attributes: { string: 'c', num: 2 } },
            { attributes: { string: 'b', num: 1 } },
        ];
        const expected = [
            { attributes: { string: 'b', num: 1 } },
            { attributes: { string: 'c', num: 2 } },
            { attributes: { string: 'a', num: 3 } },
        ];
        const sorted = sort(request, unsorted, options);
        assert.deepEqual(sorted, expected);
    });

    test('it can sort by id', assert => {
        const request = fakeRequest({ sort: 'id' });
        const unsorted = [
            { id: 2, attributes: { string: 'a', num: 3 } },
            { id: 1, attributes: { string: 'c', num: 2 } },
            { id: 3, attributes: { string: 'b', num: 1 } },
        ];
        const expected = [
            { id: 1, attributes: { string: 'c', num: 2 } },
            { id: 2, attributes: { string: 'a', num: 3 } },
            { id: 3, attributes: { string: 'b', num: 1 } },
        ];
        const sorted = sort(request, unsorted, {});
        assert.deepEqual(sorted, expected);
    });

    test('it can reverse sort by id', assert => {
        const request = fakeRequest({ sort: '-id' });
        const unsorted = [
            { id: 2, attributes: { string: 'a', num: 3 } },
            { id: 1, attributes: { string: 'c', num: 2 } },
            { id: 3, attributes: { string: 'b', num: 1 } },
        ];
        const expected = [
            { id: 3, attributes: { string: 'b', num: 1 } },
            { id: 2, attributes: { string: 'a', num: 3 } },
            { id: 1, attributes: { string: 'c', num: 2 } },
        ];
        const sorted = sort(request, unsorted, {});
        assert.deepEqual(sorted, expected);
    });
});
