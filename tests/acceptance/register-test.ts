import { currentURL, visit } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | register (sign up page)', hooks => {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    test('visiting /register', async assert => {
        server.create('root', { currentUser: null });
        await visit('/register');

        assert.equal(currentURL(), '/register', "Still at '/register'.");

        assert.dom('[data-test-orcid-button]').exists();
        assert.dom('[data-test-institution-button]').exists();
        assert.dom('[data-test-sign-up-full-name]').exists();

        assert.dom('img[alt*="Missing translation"]').doesNotExist();
        await percySnapshot(assert);
    });

    test('visiting /register?next=foo', async assert => {
        server.create('root', { currentUser: null });
        await visit('/register?next=foo');

        assert.equal(currentURL(), '/register?next=foo', "Still at '/register?next=foo'.");

        assert.dom('[data-test-institution-button][href$="%3Fnext%3Dfoo"]')
            .exists('Institutions button link ends with encoded next.');
    });
});
