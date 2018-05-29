import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
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

        assert.found('div');
        assert.notFound('.valid-input');
        assert.notFound('.error');
        assert.notFound('.warning');
    });

    test('render valid', async assert => {
        // simulates that the success element renders on success
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            isValid=true
        }}`);

        assert.found('.valid-input');
        assert.notFound('.error');
        assert.notFound('.warning');
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

        assert.notFound('.valid-input');
        assert.found('.error');
        assert.notFound('.warning');
    });

    test('render to text by default', async assert => {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
        }}`);

        assert.found('input[type="text"]');
    });

    test('render to text when explicitly specified', async assert => {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            type='text'
        }}`);

        assert.found('input[type="text"]');
    });

    test('render to password when explicitly specified', async assert => {
        await render(hbs`{{validated-input
            valuePath='password'
            placeholder='Password'
            value=''
            type='password'
        }}`);

        assert.found('input[type="password"]');
    });

    test('render to textarea when explicitly speficied', async assert => {
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            type='textarea'
        }}`);

        assert.found('textarea');
    });

    test('render to date when explicitly speficied', async assert => {
        // TODO: Needs improvement as there are no obvious ways to distinguish a dateField from a text.
        await render(hbs`{{validated-input
            valuePath='fullName'
            placeholder='Full Name'
            value=''
            type='date'
        }}`);

        assert.found('input');
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

        assert.notFound('.valid-input');
        assert.notFound('.error');
        assert.found('.warning');
    });
});
