import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | node-card', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders', async function(assert) {
        this.owner.register('service:router', OsfLinkRouterStub);
        this.set('contributors', []);
        const node = server.create('node', {}, 'withContributors');
        const project = await this.store.findRecord('node', node.id, { include: 'bibliographic_contributors' });

        this.set('node', project);
        this.set('contributors', project.bibliographicContributors);
        this.set('delete', () => []);

        await render(hbs`{{node-card contributors=this.contributors node=this.node delete=this.delete}}`);

        assert.ok((this.element.textContent as string).trim());
    });
});
