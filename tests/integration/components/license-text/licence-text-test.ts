import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-i18n/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Osf components | Integration | Component | License text', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders (no placeholders)', async function(assert) {
        const license = server.create('license', {
            name: 'EMU APL: Avian public license',
            requiredFields: [],
            text: 'I am an emu.',
        });
        const mirageNode = server.create('node', { license });

        const node = await this.store.findRecord('node', mirageNode.id);
        this.setProperties({ node });

        await render(hbs`<LicenseText @node={{this.node}} />`);

        assert.dom(this.element).hasText('I am an emu.');
    });

    test('it renders (with placeholders)', async function(assert) {
        const license = server.create('license', {
            name: 'EMU APL: Avian public license',
            requiredFields: ['copyrightHolders', 'year'],
            text: 'I am an emu. You are {{copyrightHolders}} from {{year}}.',
        });
        const mirageNode = server.create('node', {
            license,
            nodeLicense: {
                copyrightHolders: 'Bill and Ted',
                year: '1989',
            },
        });

        const node = await this.store.findRecord('node', mirageNode.id);
        this.setProperties({ node });

        await render(hbs`<LicenseText @node={{this.node}} />`);

        assert.dom(this.element).hasText('I am an emu. You are Bill and Ted from 1989.');
    });

    test('it renders (with anonymized placeholders)', async function(assert) {
        const license = server.create('license', {
            name: 'EMU APL: Avian public license',
            requiredFields: ['copyrightHolders', 'year'],
            text: 'I am an emu. You are {{copyrightHolders}} from {{year}}.',
        });
        const mirageNode = server.create('node', {
            license,
            nodeLicense: {
                copyrightHolders: 'Bill and Ted',
                year: '1989',
            },
        });

        const node = await this.store.findRecord('node', mirageNode.id);
        node.set('apiMeta', { anonymous: true });
        this.setProperties({ node });

        await render(hbs`<LicenseText @node={{this.node}} />`);

        const placeholder = t('app_components.license_text.anonymized_placeholder');
        assert.dom(this.element).hasText(`I am an emu. You are ${placeholder} from ${placeholder}.`);
    });
});
