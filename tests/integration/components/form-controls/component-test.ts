import { render } from '@ember/test-helpers';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { click } from 'ember-osf-web/tests/helpers';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

import { nodeValidation } from './validation';

module('Integration | Component | form-controls', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async function(assert) {
        const model = {
            title: '',
            description: '',
        };
        const changeset = buildChangeset(model, nodeValidation);
        this.set('changeset', changeset);

        await render(hbs`
            <form data-test-form>
                <FormControls @changeset={{this.changeset}} as |form| >
                    <form.text
                        data-test-title-input
                        @label='title'
                        @valuePath='title'
                    />
                    <form.text
                        data-test-description-input
                        @label='description'
                        @valuePath='description'
                    />
                </FormControls>
            </form>
        `);
        assert.dom('[data-test-form]').exists();
        assert.dom('[data-test-title-input] input').exists({ count: 1 });
        assert.dom('[data-test-description-input] input').exists({ count: 1 });
        await a11yAudit(this.element);
        assert.ok(true, 'No a11y errors on page');
    });

    test('it validates', async function(assert) {
        const model = {
            title: '',
            description: '',
        };
        const changeset = buildChangeset(model, nodeValidation);
        this.set('changeset', changeset);

        function submit() {
            // @ts-ignore 'changeset-validations aren't set up correctly for this to typecheck'
            changeset.validate();
        }
        this.set('submit', submit);
        this.set('titleValue', '');
        this.set('descriptionValue', '');

        await render(hbs`
            <form data-test-form {{on 'submit' this.submit}}>
                <FormControls @changeset={{this.changeset}} as |form| >
                    <form.text
                        data-test-title-input
                        @label='title'
                        @valuePath='title'
                        @value={{this.titleValue}}
                    />
                    <form.text
                        data-test-description-input
                        @label='description'
                        @valuePath='description'
                        @value={{this.descriptionValue}}
                    />
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
        assert.dom('[data-test-title-input] .help-block').exists({ count: 1 });
        assert.dom('[data-test-description-input] .help-block').exists({ count: 1 });

        // Change the value to fit validation standards (does exist)
        this.set('titleValue', 'test title');
        this.set('descriptionValue', 'test description');

        // Check that the input no longer has a validation message
        assert.dom('[data-test-title-input] .help-block').doesNotExist();
        assert.dom('[data-test-description-input] .help-block').doesNotExist();
    });
});
