import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { click } from 'ember-osf-web/tests/helpers';

import { nodeValidation } from './validation';

module('Integration | Component | form-controls', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders 991', async function(assert) {
        const model = {
            title: '',
            description: '',
        };
        const changeset = new Changeset(model, lookupValidator(nodeValidation), nodeValidation);
        this.set('changeset', changeset);

        await render(hbs`
            <form data-test-form>
                <FormControls as |form| >
                    <form.text @label='title' @valuePath='title' />
                    <form.text @label='description' @valuePath='description' />
                </FormControls>
            </form>
        `);
        assert.dom('[data-test-form]').exists();
        assert.dom('.form-group > input').exists({ count: 2 });
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it validates 991', async function(assert) {
        const model = {
            title: '',
            description: '',
        };
        const changeset = new Changeset(model, lookupValidator(nodeValidation), nodeValidation);
        this.set('changeset', changeset);

        function submit() {
            // @ts-ignore 'changeset-validations aren't set up correctly for this to typecheck'
            changeset.validate();
        }
        this.set('submit', submit);
        this.set('titleValue', '');
        this.set('descriptionValue', '');

        await render(hbs`
            <form data-test-form {{action this.submit on='submit'}}>
                <FormControls @changeset={{this.changeset}} as |form| >
                    <form.text @label='title' @valuePath='title' @value={{this.titleValue}} />
                    <form.text @label='description' @valuePath='description' @value={{this.descriptionValue}} />
                </FormControls>
                <OsfButton
                    data-test-submit-button
                    data-analytics-name='submit'
                    @buttonType='submit'
                >
                    Submit
                </OsfButton>
            </form>
        `);
        assert.dom('[data-test-form]').exists();
        await click('[data-analytics-name="submit"]');
        // Check that input has a validation message
        assert.dom('.form-group > .help-block').exists({ count: 2 });

        // Change the value to fit validation standards (does exist)
        this.set('titleValue', 'test title');
        this.set('descriptionValue', 'test description');

        // Check that the input no longer has a validation message
        assert.dom('.form-group > .help-block').doesNotExist();
    });
});
