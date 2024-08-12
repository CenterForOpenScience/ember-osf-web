import { render, pauseTest } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { setupIntl } from 'ember-intl/test-support';
import { ModelInstance } from 'ember-cli-mirage';


module('Integration | Component | PreprintAffiliatedInstitutions', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(async function(this: ThisTestContext) {
        server.loadFixtures('preprint-providers');
        const osf = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProvider>;

        const preprintMock = server.create('preprint', { provider: osf }, 'withAffiliatedInstitutions');
        const preprintMockNoInstitutions = server.create('preprint', { provider: osf });

        const store = this.owner.lookup('service:store');
        const preprint: PreprintModel = await store.findRecord('preprint', preprintMock.id);
        const preprintNoInstitutions: PreprintModel = await store.findRecord('preprint', preprintMockNoInstitutions.id);
        this.preprintMock = preprint;
        this.preprintNoInstitutionsMock = preprintNoInstitutions;
    });

    test('no institutions', async function(this: ThisTestContext, assert) {
        await render(hbs`
            <Preprints::-Components::PreprintAffiliatedInstitutions
            @preprint={{this.preprintNoInstitutionsMock}}
            @atReview={{false}}
        />`);
        assert.dom('[data-test-preprint-institution-list]').doesNotExist();
    });

    test('many institutions', async function(this: ThisTestContext, assert) {
        await render(hbs`
            <Preprints::-Components::PreprintAffiliatedInstitutions
             @preprint={{this.preprintMock}}
        />`);
        assert.dom('[data-test-preprint-institution-list]').exists();
        assert.dom('[data-test-preprint-institution-list]').exists({ count: 4 });
    });

    test('no institutions reviews', async function(this: ThisTestContext, assert) {
        await render(hbs`
            <Preprints::-Components::PreprintAffiliatedInstitutions
            @preprint={{this.preprintNoInstitutionsMock}}
            @atReview={{true}}
        />`);
        assert.dom('[data-test-preprint-institution-list-reviews]').doesNotExist();
    });

    test('many institutions reviews', async function(this: ThisTestContext, assert) {
        await render(hbs`
            <Preprints::-Components::PreprintAffiliatedInstitutions
             @preprint={{this.preprintMock}}
             @atReview={{true}}
        />`);
        assert.dom('[data-test-preprint-institution-list-reviews]').exists();
        assert.dom('[data-test-preprint-institution-list-reviews]').exists({ count: 4 });
    });
});
