import { currentURL, fillIn, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | institutions', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting /institutions', async assert => {
        server.createList('institution', 20);

        await visit('/institutions');
        assert.equal(currentURL(), '/institutions');
        assert.dom('[data-test-visit-institution]').exists({ count: 10 });
        await percySnapshot(assert);

        assert.dom('[data-test-more-institutions]').exists();
        await click('[data-test-more-institutions]');
        assert.dom('[data-test-visit-institution]').exists({ count: 20 });
        assert.dom('[data-test-more-institutions]').doesNotExist();
    });

    test('few institutions means no pagination', async assert => {
        server.createList('institution', 8);

        await visit('/institutions');
        assert.dom('[data-test-visit-institution]').exists({ count: 8 });
        assert.dom('[data-test-more-institutions]').doesNotExist();
    });

    test('can filter by name', async assert => {
        server.create('institution', { name: 'aa' });
        server.create('institution', { name: 'az' });
        server.create('institution', { name: 'za' });
        server.create('institution', { name: 'zz' });

        await visit('/institutions');
        assert.dom('[data-test-visit-institution]').exists({ count: 4 });
        await fillIn('[data-test-institutions-filter]', 'a');
        assert.dom('[data-test-visit-institution]').exists({ count: 3 });
        assert.dom('[data-test-visit-institution="aa"]').exists();
        assert.dom('[data-test-visit-institution="zz"]').doesNotExist();
        await fillIn('[data-test-institutions-filter]', 'az');
        assert.dom('[data-test-visit-institution]').exists({ count: 1 });
        await fillIn('[data-test-institutions-filter]', 'aa');
        assert.dom('[data-test-visit-institution]').exists({ count: 1 });
        await fillIn('[data-test-institutions-filter]', 'zz');
        assert.dom('[data-test-visit-institution]').exists({ count: 1 });
        await fillIn('[data-test-institutions-filter]', 'z');
        assert.dom('[data-test-visit-institution]').exists({ count: 3 });
    });

    test('can sort by name', async assert => {
        server.create('institution', { name: 'aa' });
        server.create('institution', { name: 'az' });
        server.create('institution', { name: 'za' });
        server.create('institution', { name: 'zz' });

        await visit('/institutions');
        assert.dom('[data-test-visit-institution]').exists({ count: 4 }, 'initial state');
        assert.dom('div[data-test-institutions-list] a:first-of-type').exists('initial state');
        assert.dom('[data-test-institutions-list] a:first-of-type')
            .hasAttribute('data-test-visit-institution', 'aa');
        assert.dom('[data-test-ascending-sort="title"]').exists('initial state');
        assert.dom('[data-test-descending-sort="title"]').exists('initial state');
        await click('[data-test-descending-sort="title"]');
        assert.dom('[data-test-visit-institution]').exists({ count: 4 }, 'descending sort');
        assert.dom('[data-test-institutions-list] a:first-of-type')
            .hasAttribute('data-test-visit-institution', 'zz', 'descending sort');
        await click('[data-test-ascending-sort="title"]');
        assert.dom('[data-test-visit-institution]').exists({ count: 4 }, 'ascending sort');
        assert.dom('[data-test-institutions-list] a:first-of-type')
            .hasAttribute('data-test-visit-institution', 'aa', 'ascending sort');
    });
});
