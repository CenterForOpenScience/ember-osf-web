import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const routerStub = Service.extend({
    currentRouteName: 'test',
});

module('Integration | Component | osf-navbar', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:router', routerStub);
    });

    test('it renders', async function(assert) {
        this.set('loginAction', () => { /* stub */ });
        await render(hbs`{{osf-navbar loginAction=loginAction}}`);
        assert.dom('.service-name').includesText('OSF');
        assert.dom('.current-service').hasText('HOME');
    });
});
