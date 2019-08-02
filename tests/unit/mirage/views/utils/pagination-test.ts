import { Request } from 'ember-cli-mirage';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import {
    buildQueryParams,
    paginate,
} from 'ember-osf-web/mirage/views/utils/-private';

function fakeRequest(url: string, { page, pageSize }: { page?: number, pageSize?: number } = {}): Request {
    const queryParams: { [key: string]: string } = {};
    if (typeof page !== 'undefined') {
        queryParams.page = page.toString();
    }
    if (typeof pageSize !== 'undefined') {
        queryParams['page[size]'] = pageSize.toString();
    }

    return {
        requestBody: '',
        url,
        params: {},
        queryParams,
        method: '',
    };
}

module('Unit | Mirage | Views | Utils | Pagination', hooks => {
    setupTest(hooks);

    const makeData = (start: number, end: number): any[] => {
        const data = [];
        for (let i = start; i <= end; i++) {
            data.push({
                type: 'item',
                id: i,
                attributes: { foo: `bar-${i}`, bar: `baz-${i}` },
            });
        }
        return data;
    };

    test('it can paginate', assert => {
        const request = fakeRequest('https://api.osf.io/v2/foos/', { });
        const data = makeData(1, 30);
        const expectedData = data.slice(0, 10);
        assert.equal(expectedData.length, 10);
        const expectedLinks = {
            self: 'https://api.osf.io/v2/foos/',
            first: 'https://api.osf.io/v2/foos/?page=1',
            next: 'https://api.osf.io/v2/foos/?page=2',
            prev: null,
            last: 'https://api.osf.io/v2/foos/?page=3',
        };
        const expectedMeta = {
            total: 30,
            per_page: 10,
            version: '',
        };
        const paginated = paginate(request, data, {});
        const actualData = paginated.data;
        assert.equal(actualData.length, 10);
        assert.deepEqual(paginated.meta, expectedMeta);
        assert.deepEqual(paginated.data, expectedData);
        assert.deepEqual(paginated.links, expectedLinks);
    });

    test('it can limit the page size', assert => {
        const pageSize = 5;
        const request = fakeRequest('https://api.osf.io/v2/foos/', { pageSize });
        const data = makeData(1, 30);
        const expectedData = data.slice(0, pageSize);
        assert.equal(expectedData.length, pageSize);
        const expectedLinks = {
            self: `https://api.osf.io/v2/foos/?page[size]=${pageSize}`,
            first: `https://api.osf.io/v2/foos/?page=1&page[size]=${pageSize}`,
            next: `https://api.osf.io/v2/foos/?page=2&page[size]=${pageSize}`,
            prev: null,
            last: `https://api.osf.io/v2/foos/?page=6&page[size]=${pageSize}`,
        };
        const expectedMeta = {
            total: 30,
            per_page: pageSize,
            version: '',
        };
        const paginated = paginate(request, data, {});
        const actualData = paginated.data;
        assert.equal(actualData.length, pageSize);
        assert.deepEqual(paginated.meta, expectedMeta);
        assert.deepEqual(paginated.data, expectedData);
        assert.deepEqual(paginated.links, expectedLinks);
    });

    test('it can increase the page size', assert => {
        const pageSize = 15;
        const request = fakeRequest('https://api.osf.io/v2/foos/', { pageSize });
        const data = makeData(1, 30);
        const expectedData = data.slice(0, pageSize);
        assert.equal(expectedData.length, pageSize);
        const expectedLinks = {
            self: `https://api.osf.io/v2/foos/?page[size]=${pageSize}`,
            first: `https://api.osf.io/v2/foos/?page=1&page[size]=${pageSize}`,
            next: `https://api.osf.io/v2/foos/?page=2&page[size]=${pageSize}`,
            prev: null,
            last: `https://api.osf.io/v2/foos/?page=2&page[size]=${pageSize}`,
        };
        const expectedMeta = {
            total: 30,
            per_page: pageSize,
            version: '',
        };
        const paginated = paginate(request, data, {});
        const actualData = paginated.data;
        assert.equal(actualData.length, pageSize);
        assert.deepEqual(paginated.meta, expectedMeta);
        assert.deepEqual(paginated.data, expectedData);
        assert.deepEqual(paginated.links, expectedLinks);
    });

    test('it can return another page', assert => {
        const pageSize = 5;
        const request = fakeRequest('https://api.osf.io/v2/foos/', { pageSize, page: 4 });
        const data = makeData(1, 30);
        const expectedData = data.slice(15, 15 + pageSize);
        assert.equal(expectedData.length, pageSize);
        const expectedLinks = {
            self: `https://api.osf.io/v2/foos/?page=4&page[size]=${pageSize}`,
            first: `https://api.osf.io/v2/foos/?page=1&page[size]=${pageSize}`,
            next: `https://api.osf.io/v2/foos/?page=5&page[size]=${pageSize}`,
            prev: `https://api.osf.io/v2/foos/?page=3&page[size]=${pageSize}`,
            last: `https://api.osf.io/v2/foos/?page=6&page[size]=${pageSize}`,
        };
        const expectedMeta = {
            total: 30,
            per_page: pageSize,
            version: '',
        };
        const paginated = paginate(request, data, {});
        const actualData = paginated.data;
        assert.equal(actualData.length, pageSize);
        assert.deepEqual(paginated.meta, expectedMeta);
        assert.deepEqual(paginated.data, expectedData);
        assert.deepEqual(paginated.links, expectedLinks);
    });

    test('it can paginate only one page', assert => {
        const request = fakeRequest('https://api.osf.io/v2/foos/');
        const data = makeData(1, 9);
        const expectedData = data.slice(0, 9);
        assert.equal(expectedData.length, 9);
        const expectedLinks = {
            self: 'https://api.osf.io/v2/foos/',
            first: 'https://api.osf.io/v2/foos/?page=1',
            next: null,
            prev: null,
            last: 'https://api.osf.io/v2/foos/?page=1',
        };
        const expectedMeta = {
            total: 9,
            per_page: 10,
            version: '',
        };
        const paginated = paginate(request, data, {});
        const actualData = paginated.data;
        assert.equal(actualData.length, 9);
        assert.deepEqual(paginated.meta, expectedMeta);
        assert.deepEqual(paginated.data, expectedData);
        assert.deepEqual(paginated.links, expectedLinks);
    });
});

module('Unit | Mirage | Views | Utils | Query Parameters', hooks => {
    setupTest(hooks);

    test('it can build a query parameter string', assert => {
        const expectedReturn = '?filter[title]=one%20item&page=3&sort=-date_modified';
        const queryParams = {
            page: '3',
            sort: '-date_modified',
            'filter[title]': 'one item',
        };
        const params = buildQueryParams(queryParams);
        assert.deepEqual(params, expectedReturn);
    });
});
