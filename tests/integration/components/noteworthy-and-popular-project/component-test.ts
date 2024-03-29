import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Integration | Component | noteworthy-and-popular-project', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders', async function(assert) {
        const node = server.create('node', {}, 'withContributors');
        const project = await this.store.findRecord('node', node.id, { include: 'bibliographic_contributors' });
        this.set('project', project);

        await render(hbs`<NoteworthyAndPopularProject @project={{this.project}} />`);
        assert.dom('[class*="NoteworthyProject"]').exists();
    });
});
