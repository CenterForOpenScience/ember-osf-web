import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { task } from 'ember-concurrency';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | routes | institutions | dashboard | -components | panel', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders without institution', async assert => {
        await render(hbs`<Institutions::Dashboard::-Components::Panel @title='Test' />`);

        assert.dom('[data-test-panel-title]')
            .exists({ count: 1 }, '1 title');
        assert.dom('[data-test-panel-title]')
            .hasText('Test');
        assert.dom('[data-test-panel-body]')
            .exists({ count: 1 }, '1 body');
        assert.dom('[data-test-panel-body]')
            .hasText('');
        assert.dom('[data-test-loading-indicator]')
            .exists({ count: 1 }, '1 loading indicator');
    });

    test('it renders with institution', async function(assert) {
        server.create('institution', { id: 'testinstitution' }, 'withStatSummary');

        this.set('modelTask', task(function *(this: TestContext, institutionId: string) {
            return yield this.get('store').findRecord('institution', institutionId);
        }));

        const model = {
            taskInstance: this.get('modelTask').perform('testinstitution'),
        };

        this.set('model', model);
        await render(hbs`
            <Institutions::Dashboard::-Components::Panel @title='Test' @institution={{this.model.taskInstance.value}}>
                Hello, World!
            </Institutions::Dashboard::-Components::Panel>
        `);

        assert.dom('[data-test-panel-title]')
            .exists({ count: 1 }, '1 title');
        assert.dom('[data-test-panel-title]')
            .hasText('Test');
        assert.dom('[data-test-panel-body]')
            .exists({ count: 1 }, '1 body');
        assert.dom('[data-test-panel-body]')
            .hasText('Hello, World!');
        assert.dom('[data-test-loading-indicator]')
            .doesNotExist();
    });
});
