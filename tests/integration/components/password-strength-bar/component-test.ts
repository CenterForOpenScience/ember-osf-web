import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | password-strength-bar', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders', async function(assert) {
        this.set('password', 'testPassword');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        assert.dom('[data-test-password-bar]').exists('Password-bar renders');
    });

    test('very weak password', async function(assert) {
        this.set('password', '');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        this.set('password', 'abc');
        await settled();

        assert.dom('[data-test-password-bar]').exists('Password-bar renders');
        assert.dom('[data-test-password-color-bar]').hasClass('progress-bar-danger');
    });

    test('weak password', async function(assert) {
        this.set('password', '');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        this.set('password', 'abcs');
        await settled();

        assert.dom('[data-test-password-bar]').exists('Password-bar renders');
        assert.dom('[data-test-password-color-bar]').hasClass('progress-bar-danger');
    });

    test('so-so password', async function(assert) {
        this.set('password', '');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        this.set('password', 'abcstest');

        await settled();

        assert.dom('[data-test-password-bar]').exists('Password-bar renders');
        assert.dom('[data-test-password-color-bar]').hasClass('progress-bar-warning');
    });

    test('good password', async function(assert) {
        this.set('password', '');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        this.set('password', 'testpassword12310');
        await settled();

        assert.dom('[data-test-password-bar]').exists('Password-bar renders');
        assert.dom('[data-test-password-color-bar]').hasClass('progress-bar-success');
    });

    test('great password', async function(assert) {
        this.set('password', '');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        this.set('password', 'testpassword12310abc');
        await settled();

        assert.dom('[data-test-password-color-bar]').hasClass('progress-bar-success');
    });
});
