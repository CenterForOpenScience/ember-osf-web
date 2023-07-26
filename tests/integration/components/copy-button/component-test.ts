import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, skip, test } from 'qunit';
import sinon from 'sinon';

module('Integration | Component | copy-button', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`
<CopyButton @clipboardText='Clip me first' />
        `);

        assert.dom(this.element).hasText('');

        // Template block usage:
        await render(hbs`
{{!-- template-lint-disable no-bare-strings --}}

<CopyButton @clipboardText='Clip me, too'>
    Copy
</CopyButton>
        `);

        assert.dom(this.element).hasText('Copy');
    });

    skip('it copies', async function(assert) {
        // This test functions, but not across all browsers and requires permission
        // on some browsers. Leaving it in but skipped so people can unskip and
        // test if they ever need to update functionality on the component.

        await render(hbs`
{{!-- template-lint-disable no-bare-strings --}}

<CopyButton data-test-copy-button @clipboardText='Clip me'>Copy</CopyButton>
        `);
        navigator.clipboard.writeText('');
        let clipboardContents = await navigator.clipboard.readText();
        assert.equal(clipboardContents, '');
        await click('[data-test-copy-button]');
        clipboardContents = await navigator.clipboard.readText();
        assert.equal(clipboardContents, 'Clip me');
    });

    test('It calls functions', async function(assert) {
        assert.expect(2);

        const callback = sinon.stub(navigator.clipboard, 'writeText');
        callback.withArgs('Success');
        callback.withArgs('Error').throws();
        this.set('onSuccess', () => {
            assert.ok('Success function called');
        });
        this.set('onError', () => {
            assert.ok('Error function called');
        });

        await render(hbs`
{{!-- template-lint-disable no-bare-strings --}}

<CopyButton
    data-test-copy-button-one
    @success={{this.onSuccess}}
    @clipboardText='Success'
>
    Copy
</CopyButton>
<CopyButton
    data-test-copy-button-two
    @error={{this.onError}}
    @clipboardText='Error'
>
    Copy
</CopyButton>
        `);

        await click('[data-test-copy-button-one]');
        await click('[data-test-copy-button-two]').catch();
    });

    test('It disables', async function(assert) {
        assert.expect(1);

        await render(hbs`
<CopyButton
    data-test-copy-button
    @disabled=true
    @clipboardText='Do not clip'
/>
        `);

        assert.dom('[data-test-copy-button]').hasAttribute('disabled');
    });
});
