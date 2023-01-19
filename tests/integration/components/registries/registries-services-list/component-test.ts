import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-intl/test-support';

module('Integration | Component | registries | registries-services-list', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    test('the registries services list page structure', async function(this: TestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`);

        // Then the header text is validated
        assert.dom('[data-test-registries-list-header]').hasText('Registry Services', 'The header text is correct.');

        // And the paragraph text is validated
        assert.dom('[data-test-registries-list-paragraph]')
            .hasText(
                'Leading registry service providers use this open source infrastructure to support their communities.',
                'The header paragraph is correct.',
            );

        assert.dom('[data-test-registries-list-row-one] > div').exists({count: 4});

        assert.dom('[data-test-registries-list-row-two] > div').exists({count: 3});

        assert.dom('[data-test-registries-list-contact-link]')
            .hasAttribute('href',
                'mailto:contact@osf.io',
                'The mail to href is correct.');

        assert.dom('[data-test-registries-list-contact-link]')
            .hasText('Contact us',
                'The contact link text is correct.');
    });


    test('the registries services list asist', async function(this: TestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`);

        // And the first link is validated
        assert.dom('[data-test-registries-list-row-one] > div:nth-child(1) > a ')
            .hasAttribute('href',
                'https://osf.io/registries/darpaasist',
                'The header paragraph is correct.');
    });
});
