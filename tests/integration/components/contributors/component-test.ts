import { click, render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | contributors', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.owner.register('service:router', OsfLinkRouterStub);
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        server.loadFixtures('registration-providers');
        server.loadFixtures('licenses');
    });

    test('it renders', async function(assert) {
        // Translations
        const headingName = t('osf-components.contributors.name');
        const headingPermission = t('osf-components.contributors.permission');
        const headingCitation = t('osf-components.contributors.citation');

        const registration = server.create('draft-registration', {}, 'withContributors');
        const registrationModel = await this.store.findRecord('draft-registration', registration.id);
        this.set('node', registrationModel);

        await render(hbs`<Contributors::Widget @node={{this.node}} />`);

        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
        assert.dom('[data-test-heading-name]').hasText(headingName);
        assert.dom('[data-test-heading-permission]').hasText(headingPermission);
        assert.dom('[data-test-heading-citation]').hasText(headingCitation);
    });

    test('read-only user card renders 991', async function(assert) {
        const registration = server.create('draft-registration', {}, 'withContributors');
        const registrationModel = await this.store.findRecord('draft-registration', registration.id);
        this.set('node', registrationModel);

        const { contributors } = registrationModel;

        await render(hbs`<Contributors::Widget @node={{this.node}} />`);

        contributors.forEach(async contributor => {
            assert.dom('[data-test-contributor-card]').exists();
            assert.dom('[data-test-contributor-card-main]').exists();
            assert.dom('[data-test-contributor-gravatar]').exists();
            assert.dom('[data-test-contributor-link]').hasText(contributor.fullName);
            assert.dom('[data-test-contributor-permission]').hasText(contributor.permission);
            assert.dom('[data-test-contributor-citation]').hasText(contributor.bibliographic.toString());

            await click('[data-test-expand-user-card]');

            contributor.users.get('employment').forEach(employer => {
                assert.dom('[data-test-contributor-card-expanded]').exists();
                assert.dom(`[data-test-employer-info="${employer.institution}"]`)
                    .hasText(`${employer.institution}, ${employer.title}`);
            });
        });
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });
});
