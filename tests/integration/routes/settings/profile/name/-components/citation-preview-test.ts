import { render } from '@ember/test-helpers';
import { Server } from 'ember-cli-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';
import hbs from 'htmlbars-inline-precompile';

type Context = TestContext & { server: Server };

interface TestResult {
    apa: string;
    mla: string;
}
module('Integration | routes | settings | profile | name | -components | citation-preview', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: Context) {
        this.server = startMirage();
    });

    hooks.afterEach(function(this: Context) {
        this.server.shutdown();
    });

    const citationAssertions = (context: any, assert: any, expected: TestResult) => {
        assert.dom('[data-test-citation-container]', context.element).exists();
        assert.dom('[data-test-apa-citation]', context.element).containsText(expected.apa);
        assert.dom('[data-test-mla-citation]', context.element).containsText(expected.mla);
    };

    test('Everything, two middle names, no period after suffix', async function(this: Context, assert) {
        assert.expect(3);
        const user = server.create('user', {
            givenName: 'Peggy',
            middleNames: 'Herbert Gavin',
            familyName: 'Doyle',
            suffix: 'DDS',
        });
        const expected: TestResult = {
            apa: 'Doyle, P. H. G., DDS.',
            mla: 'Doyle, Peggy H. G., DDS.',
        };
        this.set('user', user);
        await render(hbs`{{settings/profile/name/-components/citation-preview user=user}}`);
        citationAssertions(this, assert, expected);
    });

    test('Everything, two middle names, period after suffix', async function(this: Context, assert) {
        assert.expect(3);
        const user = server.create('user', {
            givenName: 'Peggy',
            middleNames: 'Herbert Gavin',
            familyName: 'Doyle',
            suffix: 'DDS.',
        });
        const expected: TestResult = {
            apa: 'Doyle, P. H. G., DDS.',
            mla: 'Doyle, Peggy H. G., DDS.',
        };
        this.set('user', user);
        await render(hbs`{{settings/profile/name/-components/citation-preview user=user}}`);
        citationAssertions(this, assert, expected);
    });

    test('Everything, one middle name, period after suffix', async function(this: Context, assert) {
        assert.expect(3);
        const user = server.create('user', {
            givenName: 'Peggy',
            middleNames: 'Herbert',
            familyName: 'Doyle',
            suffix: 'DDS',
        });
        const expected: TestResult = {
            apa: 'Doyle, P. H., DDS.',
            mla: 'Doyle, Peggy H., DDS.',
        };
        this.set('user', user);
        await render(hbs`{{settings/profile/name/-components/citation-preview user=user}}`);
        citationAssertions(this, assert, expected);
    });

    test('Everything but middle names, period after suffix', async function(this: Context, assert) {
        assert.expect(3);
        const user = server.create('user', {
            givenName: 'Peggy',
            middleNames: '',
            familyName: 'Doyle',
            suffix: 'DDS.',
        });
        const expected: TestResult = {
            apa: 'Doyle, P., DDS.',
            mla: 'Doyle, Peggy, DDS.',
        };
        this.set('user', user);
        await render(hbs`{{settings/profile/name/-components/citation-preview user=user}}`);
        citationAssertions(this, assert, expected);
    });

    test('Everything but middle names and suffix', async function(this: Context, assert) {
        assert.expect(3);
        const user = server.create('user', {
            givenName: 'Peggy',
            middleNames: '',
            familyName: 'Doyle',
            suffix: '',
        });
        const expected: TestResult = {
            apa: 'Doyle, P.',
            mla: 'Doyle, Peggy.',
        };
        this.set('user', user);
        await render(hbs`{{settings/profile/name/-components/citation-preview user=user}}`);
        citationAssertions(this, assert, expected);
    });

    test('Everything but suffix, two middle names', async function(this: Context, assert) {
        assert.expect(3);
        const user = server.create('user', {
            givenName: 'Peggy',
            middleNames: 'Herbert Gavin',
            familyName: 'Doyle',
            suffix: '',
        });
        const expected: TestResult = {
            apa: 'Doyle, P. H. G.',
            mla: 'Doyle, Peggy H. G.',
        };
        this.set('user', user);
        await render(hbs`{{settings/profile/name/-components/citation-preview user=user}}`);
        citationAssertions(this, assert, expected);
    });

    test('Everything but suffix, one middle name', async function(this: Context, assert) {
        assert.expect(3);
        const user = server.create('user', {
            givenName: 'Peggy',
            middleNames: 'Herbert',
            familyName: 'Doyle',
            suffix: '',
        });
        const expected: TestResult = {
            apa: 'Doyle, P. H.',
            mla: 'Doyle, Peggy H.',
        };
        this.set('user', user);
        await render(hbs`{{settings/profile/name/-components/citation-preview user=user}}`);
        citationAssertions(this, assert, expected);
    });

    test('Everything but suffix, two given names', async function(this: Context, assert) {
        assert.expect(3);
        const user = server.create('user', {
            givenName: 'Peggy Sue',
            middleNames: 'Herbert',
            familyName: 'Doyle',
            suffix: '',
        });
        const expected: TestResult = {
            apa: 'Doyle, P. S. H.',
            mla: 'Doyle, Peggy Sue H.',
        };
        this.set('user', user);
        await render(hbs`{{settings/profile/name/-components/citation-preview user=user}}`);
        citationAssertions(this, assert, expected);
    });

    test('Everything but suffix, two family and two given names', async function(this: Context, assert) {
        assert.expect(3);
        const user = server.create('user', {
            givenName: 'Peggy Sue',
            middleNames: 'Herbert',
            familyName: 'von Helsing',
            suffix: '',
        });
        const expected: TestResult = {
            apa: 'von Helsing, P. S. H.',
            mla: 'von Helsing, Peggy Sue H.',
        };
        this.set('user', user);
        await render(hbs`{{settings/profile/name/-components/citation-preview user=user}}`);
        citationAssertions(this, assert, expected);
    });

    test('Everything, suffix no period, hyphenated family and two given names', async function(this: Context, assert) {
        assert.expect(3);
        const user = server.create('user', {
            givenName: 'Peggy Sue',
            middleNames: 'Herbert',
            familyName: 'Doyle-vonHelsing',
            suffix: 'DDS',
        });
        const expected: TestResult = {
            apa: 'Doyle-vonHelsing, P. S. H., DDS.',
            mla: 'Doyle-vonHelsing, Peggy Sue H., DDS.',
        };
        this.set('user', user);
        await render(hbs`{{settings/profile/name/-components/citation-preview user=user}}`);
        citationAssertions(this, assert, expected);
    });
});
