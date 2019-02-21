import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | password-strength-bar', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        this.set('password', 'testPassword');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        assert.dom('[data-test-password-bar]').exists('Password-bar renders');
    });
});
