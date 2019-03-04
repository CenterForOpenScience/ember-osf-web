import EmberObject from '@ember/object';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | file-list-item', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        this.owner.register('service:router', OsfLinkRouterStub);

        const itemName = 'file.txt';
        const guid = 'fak34';

        this.set('item', EmberObject.create({ itemName, guid }));

        await render(hbs`{{file-list-item item=item}}`);

        assert.ok((this.element.textContent as string).includes(itemName));
    });
});
