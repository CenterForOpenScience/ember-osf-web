import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t, TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import SchemaBlockModel from 'ember-osf-web/models/schema-block';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';

interface ThisTestContext extends TestContext {
    blocks?: SchemaBlockModel[];
    revision: SchemaResponseModel;
}

module('Integration | Component | revised-responses-list', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function(this: ThisTestContext) {
        this.store = this.owner.lookup('service:store');
        server.loadFixtures('schema-blocks');
        server.loadFixtures('registration-schemas');
        const registrationSchema = server.schema.registrationSchemas.find('testSchema');
        const registration = server.create('registration', { registrationSchema });
        const revisionModel = server.create('schema-response', {
            registration,
            registrationSchema,
        });
        const revision = await this.store.findRecord('schema-response', revisionModel.id);
        const schema = await revision.registrationSchema;
        this.revision = revision;
        this.blocks = await schema.loadAll('schemaBlocks');
    });

    test('no revised responses', async function(this: ThisTestContext, assert) {
        await render(hbs`
            <Registries::RevisedResponsesList
                @revision={{this.revision}} @schemaBlocks={{this.blocks}}
            />`);
        assert.dom('[data-test-revised-responses-list]').doesNotExist('Updated responses are not shown');
        assert.dom('[data-test-revised-responses-list-no-update]')
            .containsText(t('registries.revisedResponsesList.noResponses'), 'No responses updated message shown');
    });

    test('multiple revised responses', async function(this: ThisTestContext, assert) {
        this.revision.updatedResponseKeys = ['page-one_single-select', 'page-one_short-text'];
        await render(hbs`<Registries::RevisedResponsesList
            @revision={{this.revision}} @schemaBlocks={{this.blocks}}
        />`);
        assert.dom('[data-test-revised-responses-list-no-update]')
            .doesNotExist('No response updated message not shown');
        assert.dom('[data-test-revised-responses-list]')
            .exists({ count: 2 }, 'Responsese updated message shown appropriate number of times');
    });
});
