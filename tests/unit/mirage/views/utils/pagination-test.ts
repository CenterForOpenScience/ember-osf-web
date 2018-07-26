import {
    buildQueryParams,
    paginate,
} from 'ember-osf-web/mirage/views/private/utils';
import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

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
        const request = {
            url: 'https://api.osf.io/v2/foos/',
            queryParams: {
            },
        };
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
        };
        const paginated = paginate(request, data, {});
        const actualData = (paginated as any).data;
        assert.equal(actualData.length, 10);
        assert.deepEqual((paginated as any).meta, expectedMeta);
        assert.deepEqual((paginated as any).data, expectedData);
        assert.deepEqual((paginated as any).links, expectedLinks);
    });

    test('it can limit the page size', assert => {
        const pageSize = 5;
        const request = {
            url: 'https://api.osf.io/v2/foos/',
            queryParams: {
                'page[size]': pageSize,
            },
        };
        const data = makeData(1, 30);
        const expectedData = data.slice(0, pageSize);
        assert.equal(expectedData.length, pageSize);
        const expectedLinks = {
            self: `https://api.osf.io/v2/foos/?page[size]=${pageSize}`,
            first: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=1`,
            next: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=2`,
            prev: null,
            last: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=6`,
        };
        const expectedMeta = {
            total: 30,
            per_page: pageSize,
        };
        const paginated = paginate(request, data, {});
        const actualData = (paginated as any).data;
        assert.equal(actualData.length, pageSize);
        assert.deepEqual((paginated as any).meta, expectedMeta);
        assert.deepEqual((paginated as any).data, expectedData);
        assert.deepEqual((paginated as any).links, expectedLinks);
    });

    test('it can increase the page size', assert => {
        const pageSize = 15;
        const request = {
            url: 'https://api.osf.io/v2/foos/',
            queryParams: {
                'page[size]': pageSize,
            },
        };
        const data = makeData(1, 30);
        const expectedData = data.slice(0, pageSize);
        assert.equal(expectedData.length, pageSize);
        const expectedLinks = {
            self: `https://api.osf.io/v2/foos/?page[size]=${pageSize}`,
            first: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=1`,
            next: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=2`,
            prev: null,
            last: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=2`,
        };
        const expectedMeta = {
            total: 30,
            per_page: pageSize,
        };
        const paginated = paginate(request, data, {});
        const actualData = (paginated as any).data;
        assert.equal(actualData.length, pageSize);
        assert.deepEqual((paginated as any).meta, expectedMeta);
        assert.deepEqual((paginated as any).data, expectedData);
        assert.deepEqual((paginated as any).links, expectedLinks);
    });

    test('it can return another page', assert => {
        const pageSize = 5;
        const request = {
            url: 'https://api.osf.io/v2/foos/',
            queryParams: {
                'page[size]': pageSize,
                page: 4,
            },
        };
        const data = makeData(1, 30);
        const expectedData = data.slice(15, 15 + pageSize);
        assert.equal(expectedData.length, pageSize);
        const expectedLinks = {
            self: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=4`,
            first: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=1`,
            next: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=5`,
            prev: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=3`,
            last: `https://api.osf.io/v2/foos/?page[size]=${pageSize}&page=6`,
        };
        const expectedMeta = {
            total: 30,
            per_page: pageSize,
        };
        const paginated = paginate(request, data, {});
        const actualData = (paginated as any).data;
        assert.equal(actualData.length, pageSize);
        assert.deepEqual((paginated as any).meta, expectedMeta);
        assert.deepEqual((paginated as any).data, expectedData);
        assert.deepEqual((paginated as any).links, expectedLinks);
    });

    test('it can paginate only one page', assert => {
        const request = {
            url: 'https://api.osf.io/v2/foos/',
            queryParams: {
            },
        };
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
        };
        const paginated = paginate(request, data, {});
        const actualData = (paginated as any).data;
        assert.equal(actualData.length, 9);
        assert.deepEqual((paginated as any).meta, expectedMeta);
        assert.deepEqual((paginated as any).data, expectedData);
        assert.deepEqual((paginated as any).links, expectedLinks);
    });
});

module('Unit | Mirage | Views | Utils | Query Parameters', hooks => {
    setupTest(hooks);

    test('it can build a query parameter string', assert => {
        const expectedReturn = '?page=3&sort=-date_modified&filter[title]=one%20item';
        const queryParams = {
            page: '3',
            sort: '-date_modified',
            'filter[title]': 'one item',
        };
        const params = buildQueryParams(queryParams);
        assert.deepEqual(params, expectedReturn);
    });
});
