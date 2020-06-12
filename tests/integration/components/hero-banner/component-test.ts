import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'ember-get-config';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

const { featureFlagNames: { ABTesting } } = config;

module('Integration | Component | Hero banner', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    test('it renders', async function(assert) {
        // Setup router
        const router = this.owner.lookup('router:main');
        router.setupRouter();

        await render(hbs`<Home::-Components::HeroBanner />`);
        assert.dom('[data-test-hero-heading]')
            .containsText(t('osf-components.hero-banner.headingA').toString());
        assert.dom('[data-test-hero-subheading]')
            .containsText(t('osf-components.hero-banner.subheading').toString());

        assert.dom('[data-test-add-research]').exists();
        assert.dom('[data-test-discover]').exists();

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it renders version B', async function(assert) {
        const features = this.owner.lookup('service:features');
        // Setup router
        const router = this.owner.lookup('router:main');
        router.setupRouter();

        // Set feature flag to show version B
        features.enable(ABTesting.homePageHeroTextVersionB);

        await render(hbs`<Home::-Components::HeroBanner />`);

        assert.dom('[data-test-hero-heading]')
            .containsText(t('osf-components.hero-banner.headingB').toString());

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });
});
