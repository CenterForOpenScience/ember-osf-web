import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest} from 'ember-qunit';
import { module, test } from 'qunit';
import { setupIntl } from 'ember-intl/test-support';
import PreprintModel from 'ember-osf-web/models/preprint';
import { ModelInstance } from 'ember-cli-mirage';
import PreprintProvider from 'ember-osf-web/models/preprint-provider';


module('Integration | Preprint | Component | Institution Manager', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    test('it renders', async function(assert) {
        server.loadFixtures('preprint-providers');
        const osf = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProvider>;

        const preprintMock = server.create('preprint', { provider: osf }, 'withAffiliatedInstitutions');

        const store = this.owner.lookup('service:store');
        const preprint: PreprintModel = await store.findRecord('preprint', preprintMock.id);
        this.set('preprintMock', preprint);


        await render(hbs`
<Preprints::-Components::PreprintInstitutions::InstitutionManager
        @preprint={{this.preprintMock}} as |manager|>
    {{#each manager.affiliatedList as |affiliate index|}}
        <div data-test-institution={{index}}>
            {{affiliate.name}}
        </div>
    {{/each}}
</Preprints::-Components::PreprintInstitutions::InstitutionManager> `);

        assert.dom('[data-test-institution="0"]').hasText('Main OSF Test Institution');
    });
});
