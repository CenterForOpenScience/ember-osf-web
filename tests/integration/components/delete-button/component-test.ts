import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | delete-button', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`
        <DeleteButton
            @buttonLabel='Button here!'
            @modalTitle='Head'
            @modalBody='Shoulders'
            @cancelButtonText='Knees'
            @confirmButtonText='Toes'
        />
        `);
        assert.dom('[data-test-delete-button]').hasText('Button here!');
        await click('[data-test-delete-button]');
        assert.dom('[data-test-delete-modal-header]').containsText('Head');
        assert.dom('[data-test-delete-modal-body]').hasText('Shoulders');
        assert.dom('[data-test-cancel-delete]').hasText('Knees');
        assert.dom('[data-test-confirm-delete]').hasText('Toes');
        await click('[data-test-confirm-delete]');
    });
});
