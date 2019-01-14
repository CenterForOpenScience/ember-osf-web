import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | node-card', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        this.owner.register('service:router', OsfLinkRouterStub);
        this.set('contributors', []);
        this.set('node', { queryHasMany: () => [], get: () => 'it\'s a date' });
        this.set('delete', () => []);
        await render(hbs`{{node-card contributors=contributors node=node delete=delete}}`);

        assert.ok((this.element.textContent as string).trim());
    });
});
