import {
    getNextPageParam,
    getPageIndex,
    getPageParam,
    getPrevPageParam,
} from 'ember-osf-web/utils/page-param';

import { module, test } from 'qunit';

module('Unit | Utility | page-param', () => {
    test('getPageIndex works', function(assert) {
        [
            ['', undefined],
            ['-', undefined],
            ['1', 0],
            ['1-', 0],
            ['10', 9],
            ['page-two', undefined],
            ['page', undefined],
            ['2-page-two', 1],
            ['10-page-ten', 9],
        ].forEach(([pageParam, pageIndex]: [string, number]) => {
            assert.equal(getPageIndex(pageParam), pageIndex);
        });
    });

    test('getPageParam works', function(assert) {
        [
            [1, 'sample-analysis', '2-sample-analysis'],
            [2, '', '3'],
            [0, 'study-information', '1-study-information'],
        ].forEach(([pageIndex, pageHeading, pageParam]: [number, string, string]) => {
            assert.equal(getPageParam(pageIndex, pageHeading), pageParam);
        });
    });

    test('getNextPageParam works', function(assert) {
        [
            [1, 'sample-analysis', '3-sample-analysis'],
            [0, 'study-information', '2-study-information'],
        ].forEach(([pageIndex, pageHeading, pageParam]: [number, string, string]) => {
            assert.equal(getNextPageParam(pageIndex, pageHeading), pageParam);
        });
    });

    test('getPrevPageParam works', function(assert) {
        [
            [0, 'study-information', undefined],
            [2, 'sample-analysis', '2-sample-analysis'],
            [3, 'data', '3-data'],
        ].forEach(([pageIndex, pageHeading, pageParam]: [number, string, string|undefined]) => {
            assert.equal(getPrevPageParam(pageIndex, pageHeading), pageParam);
        });
    });
});
