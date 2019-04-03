import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | add-your-research', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async assert => {
        await render(hbs`<AddYourResearch />`);
        assert.dom('[data-test-get-started-button]').hasText('Get started');
    });
});
