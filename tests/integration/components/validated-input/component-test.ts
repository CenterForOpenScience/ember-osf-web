import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, skip, test } from 'qunit';

module('Integration | Component | validated-input', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
        }}`);

        assert.dom('div').exists();
        assert.dom('.valid-input').doesNotExist();
        assert.dom('.error').doesNotExist();
        assert.dom('.warning').doesNotExist();
    });

    test('render valid', async assert => {
        // simulates that the success element renders on success
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            isValid=true
        }}`);

        assert.dom('.valid-input').exists();
        assert.dom('.error').doesNotExist();
        assert.dom('.warning').doesNotExist();
    });

    test('render error message', async assert => {
        // checks that the error message renders
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            didValidate=true
            isInvalid=true
        }}`);

        assert.dom('.valid-input').doesNotExist();
        assert.dom('.error').exists();
        assert.dom('.warning').doesNotExist();
    });

    test('render to text by default', async assert => {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
        }}`);

        assert.dom('input[type="text"]').exists();
    });

    test('render to text when explicitly specified', async assert => {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            type='text'
        }}`);

        assert.dom('input[type="text"]').exists();
    });

    test('render to password when explicitly specified', async assert => {
        await render(hbs`{{validated-input
            valuePath='password'
            placeholder='Password'
            value=''
            type='password'
        }}`);

        assert.dom('input[type="password"]').exists();
    });

    test('render to textarea when explicitly speficied', async assert => {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            type='textarea'
        }}`);

        assert.dom('textarea').exists();
    });

    test('render to date when explicitly speficied', async assert => {
        // TODO: Needs improvement as there are no obvious ways to distinguish a dateField from a text.
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            type='date'
        }}`);

        assert.dom('input').exists();
    });

    // TODO: Test currently cannot find '.warning'
    skip('render warning message', async assert => {
        // checks that the warnng message renders
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            showWarningMessage=true
        }}`);

        assert.dom('.valid-input').doesNotExist();
        assert.dom('.error').doesNotExist();
        assert.dom('.warning').exists();
    });
});
