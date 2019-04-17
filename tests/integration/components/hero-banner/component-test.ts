import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | Hero banner', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async function(assert) {
        // Setup router
        const router = this.owner.lookup('router:main');
        router.setupRouter();

        await render(hbs`<HeroBanner />`);
        assert.dom('[data-test-hero-heading]').hasText('The place to share your research');
        assert.dom('[data-test-hero-subheading]')
            .hasText('OSF is a free, open platform to support your research and enable collaboration.');
        assert.dom('[data-test-add-research-A]').exists();
        assert.dom('[data-test-discover-A]').exists();
        assert.dom('[data-test-add-research-B]').doesNotExist();
        assert.dom('[data-test-discover-B]').doesNotExist();

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it renders version B', async function(assert) {
        const features = this.owner.lookup('service:features');
        // Setup router
        const router = this.owner.lookup('router:main');
        router.setupRouter();

        // Set feature flag to show version B
        features.enable('homePageVersionB');

        await render(hbs`<HeroBanner />`);

        assert.dom('[data-test-add-research-B]').exists();
        assert.dom('[data-test-discover-B]').exists();
        assert.dom('[data-test-add-research-A]').doesNotExist();
        assert.dom('[data-test-discover-A]').doesNotExist();

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });
});
