import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import faker from 'faker';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

class FakeUser {
    id: string = faker.random.uuid();
    fullName: string = `${faker.name.firstName()} ${faker.name.lastName()}`;
}

module('Integration | Component | quickfile-nav', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        this.set('user', new FakeUser());
        this.owner.register('service:router', OsfLinkRouterStub);

        await render(hbs`{{quickfile-nav user=user}}`);

        assert.ok((this.element.textContent as string).trim());
    });
});
