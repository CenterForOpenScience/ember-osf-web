import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | preprints | branded-footer', hooks => {
    setupRenderingTest(hooks);

    test('it inserts the footerLink when present', async function(assert) {
        // Given no list is provided
        // When the component is rendered
        await render(hbs`
            <Preprints::-components::BrandedFooter
                @footerLinks='these are the footer links'
            >
            </Preprints::-components::BrandedFooter>
        `);

        // Then the footer links are verified
        assert.dom('[data-test-footer-links]').hasText('these are the footer links', 'The footer links are present');
    });

    test('it does not insert the footerLink when undefined', async function(assert) {
        // Given no list is provided
        // When the component is rendered
        await render(hbs`<Preprints::-components::BrandedFooter/>`);

        // Then the footer links are verified
        assert.dom('[data-test-footer-links]').doesNotExist('The footer links are not present');
    });

    test('it does no insert the footerLink when it an empty string', async function(assert) {
        // Given no list is provided
        // When the component is rendered
        await render(hbs`
            <Preprints::-components::BrandedFooter
                @footerLinks=''
            >
            </Preprints::-components::BrandedFooter>
        `);

        // Then the footer links are verified
        assert.dom('[data-test-footer-links]').doesNotExist('The footer links are not present');
    });
});
