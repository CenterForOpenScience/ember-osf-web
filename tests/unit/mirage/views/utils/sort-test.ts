import { Request } from 'ember-cli-mirage';
import { setupTest } from 'ember-qunit';
import moment from 'moment-timezone';
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

    test('it can sort strings', function(assert) {
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

    test('it can reverse sort strings', function(assert) {
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

    test('it can sort numbers', function(assert) {
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

    test('it can sort dates', function(assert) {
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

    test('it can sort', function(assert) {
        const request = fakeRequest({ sort: 'str' });
        const unsorted = [
            { attributes: { str: 'a', num: 3 } },
            { attributes: { str: 'c', num: 2 } },
            { attributes: { str: 'b', num: 1 } },
        ];
        const expected = [
            { attributes: { str: 'a', num: 3 } },
            { attributes: { str: 'b', num: 1 } },
            { attributes: { str: 'c', num: 2 } },
        ];
        const sorted = sort(request, unsorted, {});
        assert.deepEqual(sorted, expected);
    });

    test('it can use a different key', function(assert) {
        const request = fakeRequest({ sort: 'num' });
        const unsorted = [
            { attributes: { str: 'a', num: 3 } },
            { attributes: { str: 'c', num: 2 } },
            { attributes: { str: 'b', num: 1 } },
        ];
        const expected = [
            { attributes: { str: 'b', num: 1 } },
            { attributes: { str: 'c', num: 2 } },
            { attributes: { str: 'a', num: 3 } },
        ];
        const sorted = sort(request, unsorted, {});
        assert.deepEqual(sorted, expected);
    });

    test('it can reverse sort', function(assert) {
        const request = fakeRequest({ sort: '-num' });
        const unsorted = [
            { attributes: { str: 'a', num: 3 } },
            { attributes: { str: 'c', num: 1 } },
            { attributes: { str: 'b', num: 2 } },
        ];
        const expected = [
            { attributes: { str: 'a', num: 3 } },
            { attributes: { str: 'b', num: 2 } },
            { attributes: { str: 'c', num: 1 } },
        ];
        const sorted = sort(request, unsorted, {});
        assert.deepEqual(sorted, expected);
    });

    test('it can use a default sort key', function(assert) {
        const request = fakeRequest({ });
        const options: ProcessOptions = { defaultSortKey: 'num' };
        const unsorted = [
            { attributes: { str: 'a', num: 3 } },
            { attributes: { str: 'c', num: 2 } },
            { attributes: { str: 'b', num: 1 } },
        ];
        const expected = [
            { attributes: { str: 'b', num: 1 } },
            { attributes: { str: 'c', num: 2 } },
            { attributes: { str: 'a', num: 3 } },
        ];
        const sorted = sort(request, unsorted, options);
        assert.deepEqual(sorted, expected);
    });

    test('it can sort by id', function(assert) {
        const request = fakeRequest({ sort: 'id' });
        const unsorted = [
            { id: 2, attributes: { str: 'a', num: 3 } },
            { id: 1, attributes: { str: 'c', num: 2 } },
            { id: 3, attributes: { str: 'b', num: 1 } },
        ];
        const expected = [
            { id: 1, attributes: { str: 'c', num: 2 } },
            { id: 2, attributes: { str: 'a', num: 3 } },
            { id: 3, attributes: { str: 'b', num: 1 } },
        ];
        const sorted = sort(request, unsorted, {});
        assert.deepEqual(sorted, expected);
    });

    test('it can reverse sort by id', function(assert) {
        const request = fakeRequest({ sort: '-id' });
        const unsorted = [
            { id: 2, attributes: { str: 'a', num: 3 } },
            { id: 1, attributes: { str: 'c', num: 2 } },
            { id: 3, attributes: { str: 'b', num: 1 } },
        ];
        const expected = [
            { id: 3, attributes: { str: 'b', num: 1 } },
            { id: 2, attributes: { str: 'a', num: 3 } },
            { id: 1, attributes: { str: 'c', num: 2 } },
        ];
        const sorted = sort(request, unsorted, {});
        assert.deepEqual(sorted, expected);
    });
});
