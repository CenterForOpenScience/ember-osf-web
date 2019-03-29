import { render, settled } from '@ember/test-helpers';
import { Server } from 'ember-cli-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';

type Context = TestContext & { server: Server };

module('Integration | Component | password-strength-bar', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: Context) {
        this.server = startMirage();
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

        assert.dom('[data-test-password-bar]').exists('Password-bar renders');

        settled().then(() => {
            assert.dom('[data-test-password-color-bar]').hasClass('progress-bar-danger');
        });
    });

    test('weak password', async function(assert) {
        this.set('password', '');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        this.set('password', 'abcs');

        assert.dom('[data-test-password-bar]').exists('Password-bar renders');

        settled().then(() => {
            assert.dom('[data-test-password-color-bar]').hasClass('progress-bar-danger');
        });
    });

    test('so-so password', async function(assert) {
        this.set('password', '');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        this.set('password', 'abcstest');

        assert.dom('[data-test-password-bar]').exists('Password-bar renders');

        settled().then(() => {
            assert.dom('[data-test-password-color-bar]').hasClass('progress-bar-warning');
        });
    });

    test('good password', async function(assert) {
        this.set('password', '');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        this.set('password', 'testpassword12310');

        settled().then(() => {
            assert.dom('[data-test-password-color-bar]').hasClass('progress-bar-success');
        });
    });

    test('great password', async function(assert) {
        this.set('password', '');

        await render(hbs`<PasswordStrengthBar @password={{this.password}}/>`);

        this.set('password', 'testpassword12310abc');

        settled().then(() => {
            assert.dom('[data-test-password-color-bar]').hasClass('progress-bar-success');
        });
    });
});
