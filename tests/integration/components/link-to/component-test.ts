import Service from '@ember/service';
import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const routerStub = Service.extend({
    transitionTo: () => null,
    generateURL: () => 'url!',
});

module('Integration | Component | link-to', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
        // The default link-to uses a super-secret private router service, not the public one
        this.owner.register('service:-routing', routerStub);
    });

    test('includes aria-label', async function(assert) {
        const linkText = 'This is a link!';
        const ariaLabel = 'This is an aria label!';
        await render(hbs`{{#link-to 'foo' ariaLabel='This is an aria label!'}}This is a link!{{/link-to}}`);

        assert.equal(this.element.textContent.trim(), linkText);
        assert.equal(this.element.firstChild.getAttribute('aria-label'), ariaLabel);
    });

    test('onClick fires', async function(assert) {
        assert.expect(1);
        this.set('actions', {
            clickAction: () => {
                assert.ok(true);
            },
        });

        await render(hbs`{{#link-to 'foo' onClick=(action 'clickAction')}}This is a link!{{/link-to}}`);

        await click(this.element.firstChild);
    });
});
