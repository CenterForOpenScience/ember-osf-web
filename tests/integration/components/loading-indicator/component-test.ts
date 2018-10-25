import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | loading-indicator', hooks => {
    setupRenderingTest(hooks);

    test('light', async function(assert) {
        await render(hbs`{{loading-indicator}}`);
        assert.dom(this.element).hasText('');
        assert.dom(this.element.querySelector('div.ball-scale')).hasClass('ball-light');
    });

    test('dark', async function(assert) {
        await render(hbs`{{loading-indicator dark=true}}`);
        assert.dom(this.element).hasText('');
        assert.dom(this.element.querySelector('div.ball-scale')).hasClass('ball-dark');
    });

    test('inline light', async function(assert) {
        await render(hbs`{{loading-indicator inline=true}}`);
        assert.dom(this.element).hasText('');
        assert.dom(this.element.querySelector('div.ball-pulse')).hasClass('ball-light');
    });

    test('inline dark', async function(assert) {
        await render(hbs`{{loading-indicator dark=true inline=true}}`);
        assert.dom(this.element).hasText('');
        assert.dom(this.element.querySelector('div.ball-pulse')).hasClass('ball-dark');
    });
});
