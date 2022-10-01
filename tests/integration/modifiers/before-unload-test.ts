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

    test('it adds/removes event listener on render/hide ', async function(this: ModifierTestContext, assert) {
        this.listener = sinon.fake();
        this.set('showDiv', true);
        await render(hbs`
        {{#if this.showDiv}}
            <div {{before-unload this.listener}}></div>
        {{/if}}`);

        sinon.assert.notCalled(this.listener);
        window.dispatchEvent(new Event('beforeunload'));
        sinon.assert.calledOnce(this.listener);
        assert.ok(true, 'beforeunload listener called when element is visible');
        this.set('showDiv', false);
        window.dispatchEvent(new Event('beforeunload'));
        sinon.assert.calledOnce(this.listener);
        assert.ok(true, 'beforeunload listener removed when element is removed');
    });

    test('it removes event listener when another added', async function(this: ModifierTestContext, assert) {
        const firstListener = sinon.fake();
        const otherListener = sinon.fake();
        this.listener = firstListener;
        await render(hbs`<div {{before-unload this.listener}}></div>`);

        window.dispatchEvent(new Event('beforeunload'));
        sinon.assert.calledOnce(firstListener);
        sinon.assert.notCalled(otherListener);
        this.set('listener', otherListener);
        window.dispatchEvent(new Event('beforeunload'));
        sinon.assert.calledOnce(firstListener);
        sinon.assert.calledOnce(otherListener);
        assert.ok(true, 'beforeunload listener updates');
    });
});
