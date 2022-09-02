import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { TestContext } from 'ember-test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

interface ModifierTestContext extends TestContext {
    listener: any;
}

module('Integration | Modifier | before-unload', hooks => {
    setupRenderingTest(hooks);

    test('it adds event listener', async function(this: ModifierTestContext, assert) {
        this.listener = sinon.fake();

        await render(hbs`<div {{before-unload this.listener}}></div>`);
        sinon.assert.notCalled(this.listener);
        window.dispatchEvent(new Event('beforeunload'));
        sinon.assert.calledOnce(this.listener);
        assert.ok(true, 'beforeunload listener called');
    });
});
