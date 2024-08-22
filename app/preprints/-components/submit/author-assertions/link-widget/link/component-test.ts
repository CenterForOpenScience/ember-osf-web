import { click, fillIn, render} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest} from 'ember-qunit';
import { module, test } from 'qunit';
import { setupIntl } from 'ember-intl/test-support';


module('Integration | Preprint | Component | author-assertions | link-widget | link', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);
    const removeLinkInput: any = [];
    const onUpdateData: any = [];

    hooks.beforeEach(async function(this) {
        // Given the variables are reset
        removeLinkInput.length = 0;
        onUpdateData.length = 0;

        // When the testDataMock is instantiated
        const testDataMock = Object({
            link: 'https://www.validate-url.com',
            index: 1,
            placeholder: 'the place holder',
            removeLink(index: number): void {
                removeLinkInput.push(index);
            },
            onUpdate(value: string, index: number): void {
                onUpdateData.push(value, index);
            },
        });

        // Then the class variables are set
        this.set('testDataMock', testDataMock);
        this.set('disabled', false);
    });

    test('it renders the link with a remove button when enabled',
        async function(assert) {
            // Given the component is rendered
            await render(hbs`
<Preprints::-Components::Submit::AuthorAssertions::LinkWidget::Link
    @remove={{this.testDataMock.removeLink}}
    @update={{this.testDataMock.onUpdate}}
    @value={{this.testDataMock.link}}
    @index={{this.testDataMock.index}}
    @placeholder={{this.testDataMock.placeholder}}
    @disabled={{this.disabled}}
/> `);
            // Then the link value is verified
            assert.dom('[data-test-link-input="1"] input').hasValue('https://www.validate-url.com');

            // And the link placeholder is verified
            assert.dom('[data-test-link-input="1"] input').hasProperty('placeholder', 'the place holder');

            // And the link is not disabled
            assert.dom('[data-test-link-input="1"] input').hasProperty('disabled', false);

            // And the button exists
            assert.dom('[data-test-remove-link="1"]').exists();

            // And the component methods are verified
            assert.deepEqual(removeLinkInput, []);
            assert.deepEqual(onUpdateData, ['https://www.validate-url.com', 1]);
        });

    test('it renders the link disabled without a remove button when disabled',
        async function(assert) {
            this.set('disabled', true);
            // Given the component is rendered
            await render(hbs`
<Preprints::-Components::Submit::AuthorAssertions::LinkWidget::Link
    @remove={{this.testDataMock.removeLink}}
    @update={{this.testDataMock.onUpdate}}
    @value={{this.testDataMock.link}}
    @index={{this.testDataMock.index}}
    @placeholder={{this.testDataMock.placeholder}}
    @disabled={{this.disabled}}
/> `);
            // Then the link value is verified
            assert.dom('[data-test-link-input="1"] input').hasValue('https://www.validate-url.com');

            // And the link placeholder is verified
            assert.dom('[data-test-link-input="1"] input').hasProperty('placeholder', 'the place holder');

            // And the link is disabled
            assert.dom('[data-test-link-input="1"] input').hasProperty('disabled', true);

            // And the button does not exists
            assert.dom('[data-test-remove-link="1"]').doesNotExist();

            // And the component methods are verified
            assert.deepEqual(removeLinkInput, []);
            assert.deepEqual(onUpdateData, ['https://www.validate-url.com', 1]);
        });

    test('it should handle an onChange event',
        async function(assert) {
            // Given the component is rendered
            await render(hbs`
<Preprints::-Components::Submit::AuthorAssertions::LinkWidget::Link
    @remove={{this.testDataMock.removeLink}}
    @update={{this.testDataMock.onUpdate}}
    @value={{this.testDataMock.link}}
    @index={{this.testDataMock.index}}
    @placeholder={{this.testDataMock.placeholder}}
    @disabled={{this.disabled}}
/> `);
            const inputElement = '[data-test-link-input="1"] input';
            // Then the link value is verified
            assert.dom(inputElement).hasValue('https://www.validate-url.com');

            // When the input value is changed
            await fillIn(inputElement, 'https://new.valid-url.com');

            // Then the input is verified
            assert.dom(inputElement).hasValue('https://new.valid-url.com');

            // And the component methods are verified
            assert.deepEqual(removeLinkInput, []);
            assert.deepEqual(onUpdateData, [
                'https://www.validate-url.com', 1, 'https://new.valid-url.com', 1, 'https://new.valid-url.com', 1,
            ]);

        });

    test('it removes a link when the remove button is clicked',
        async function(assert) {
            // Given the component is rendered
            await render(hbs`
<Preprints::-Components::Submit::AuthorAssertions::LinkWidget::Link
    @remove={{this.testDataMock.removeLink}}
    @update={{this.testDataMock.onUpdate}}
    @value={{this.testDataMock.link}}
    @index={{this.testDataMock.index}}
    @placeholder={{this.testDataMock.placeholder}}
    @disabled={{this.disabled}}
/> `);
            // Then the link value is verified
            assert.dom('[data-test-link-input="1"] input').hasValue('https://www.validate-url.com');

            // When the button is clicked
            await click('[data-test-remove-link="1"]');

            // Then the component methods are verified
            assert.deepEqual(removeLinkInput, [1]);
            assert.deepEqual(onUpdateData, ['https://www.validate-url.com', 1]);
        });

    test('it displays an error message with an invalid url',
        async function(assert) {
            // Given the component is rendered
            await render(hbs`
<Preprints::-Components::Submit::AuthorAssertions::LinkWidget::Link
    @remove={{this.testDataMock.removeLink}}
    @update={{this.testDataMock.onUpdate}}
    @value={{this.testDataMock.link}}
    @index={{this.testDataMock.index}}
    @placeholder={{this.testDataMock.placeholder}}
    @disabled={{this.disabled}}
/> `);
            const inputElement = '[data-test-link-input="1"] input';
            // Then the link value is verified
            assert.dom(inputElement).hasValue('https://www.validate-url.com');

            // When the invalid value is input
            await fillIn(inputElement, '');

            // The valid the input is updated
            assert.dom(inputElement).hasValue('');

            // And the required text is visible
            assert.dom('[data-test-validation-errors="value"] p').hasText('This field must be a valid url.');
        });

});
