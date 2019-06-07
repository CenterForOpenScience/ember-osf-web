import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'ember-get-config';
import { t } from 'ember-i18n/test-support';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const { featureFlagNames: { ABTesting } } = config;

module('Integration | Component | Hero banner', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async function(assert) {
        // Setup router
        const router = this.owner.lookup('router:main');
        router.setupRouter();

        await render(hbs`<NewHome::-Components::HeroBanner />`);
        assert.dom('[data-test-add-research-heading]').doesNotExist();
        assert.dom('[data-test-add-research-subheading]').doesNotExist();
        assert.dom('[data-test-hero-heading]')
            .containsText(t('osf-components.hero-banner.heading').toString());
        assert.dom('[data-test-hero-subheading]')
            .containsText(t('osf-components.hero-banner.subheading').toString());

        assert.notOk(document.querySelector('[data-test-hero-container]')!.className.includes('versionB'));

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
        features.enable(ABTesting.homePageVersionB);

        await render(hbs`<NewHome::-Components::HeroBanner />`);

        assert.dom('[data-test-add-research-heading]').exists();
        assert.dom('[data-test-add-research-subheading]').exists();
        assert.ok(document.querySelector('[data-test-hero-container]')!.className.includes('versionB'));

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });
});
