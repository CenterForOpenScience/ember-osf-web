import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, skip, test } from 'qunit';

module('Integration | Component | validated input', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
        }}`);

        assert.ok(this.$('div').length);
        assert.equal(this.$('.valid-input').length, 0);
        assert.equal(this.$('.error').length, 0);
        assert.equal(this.$('.warning').length, 0);
    });

    test('render valid', async function (assert) {
        // simulates that the success element renders on success
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            isValid=true
        }}`);

        assert.equal(this.$('.valid-input').length, 1);
        assert.equal(this.$('.error').length, 0);
        assert.equal(this.$('.warning').length, 0);
    });

    test('render error message', async function (assert) {
        // checks that the error message renders
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            didValidate=true
            isInvalid=true
        }}`);

        assert.equal(this.$('.valid-input').length, 0);
        assert.equal(this.$('.error').length, 1);
        assert.equal(this.$('.warning').length, 0);
    });

    test('render to text by default', async function (assert) {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
        }}`);

        assert.equal(this.$('input[type="text"]').length, 1);
    });

    test('render to text when explicitly specified', async function (assert) {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            type='text'
        }}`);

        assert.equal(this.$('input[type="text"]').length, 1);
    });

    test('render to password when explicitly specified', async function (assert) {
        await render(hbs`{{validated-input
            valuePath='password'
            placeholder='Password'
            value=''
            type='password'
        }}`);

        assert.equal(this.$('input[type="password"]').length, 1);
    });

    test('render to textarea when explicitly speficied', async function (assert) {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            type='textarea'
        }}`);

        assert.equal(this.$('textarea').length, 1);
    });

    test('render to date when explicitly speficied', async function (assert) {
        // TODO: Needs improvement as there are no obvious ways to distinguish a dateField from a text.
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            type='date'
        }}`);

        assert.equal(this.$('input').length, 1);
    });

    // TODO: Test currently cannot find '.warning'
    skip('render warning message', async function(assert) {
        // checks that the warnng message renders
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            showWarningMessage=true
        }}`);

        assert.equal(this.$('.valid-input').length, 0);
        assert.equal(this.$('.error').length, 0);
        assert.equal(this.$('.warning').length, 1);
    });
});
