import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { task } from 'ember-concurrency';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | routes | institutions | dashboard | -components | projects-panel', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders', async function(assert) {
        server.create('institution', { id: 'testinstitution' }, 'withStatSummary');

        this.set('modelTask', task(function *(this: TestContext, institutionId: string) {
            return yield this.get('store').findRecord('institution', institutionId);
        }));

        const model = {
            taskInstance: this.get('modelTask').perform('testinstitution'),
        };

        this.set('model', model);
        await render(hbs`<Institutions::Dashboard::-Components::ProjectsPanel
            @institution='{{this.model.taskInstance.value}}' />`);

        assert.dom('[data-test-chart]')
            .exists({ count: 1 }, '1 chart');
    });
});
