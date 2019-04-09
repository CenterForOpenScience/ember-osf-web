import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | discover-research', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders version A', async function(assert) {
        // Setup router
        const router = this.owner.lookup('router:main');
        router.setupRouter();

        await render(hbs`<AddYourResearch/>`);
        assert.dom('[data-test-get-started-button]').exists();
        assert.dom('[data-test-get-started-button]').hasText('Get started');
    });

    test('it renders version B', async function(assert) {
        // Setup router
        const router = this.owner.lookup('router:main');
        router.setupRouter();

        this.set('version', 'versionB');
        await render(hbs`<AddYourResearch @version={{this.version}} />`);
        assert.dom('[data-test-add-research-heading]').exists();
        assert.dom('[data-test-add-research-heading]').hasText('Add your research');
        assert.dom('[data-test-add-research-subheading]').exists();
        assert.dom('[data-test-add-research-subheading]')
            .hasText('Labs and teams across the globe use OSF to open their projects up to the scientific community.');
    });
});
