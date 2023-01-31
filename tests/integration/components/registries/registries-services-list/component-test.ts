import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { percySnapshot } from 'ember-percy';

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


        await percySnapshot(assert);
    });


    test('the registries services list DARPA ASIST', async function(this: TestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`);

        // Given I find the node
        const node = document.querySelector('[data-test-registries-list-row-one] > div:nth-child(1) > a ');

        // Then I validate the link
        assert.dom(node)
            .hasAttribute('href',
                'https://osf.io/registries/darpaasist',
                'The a href link is correct.');

        // And I validate the link aria-label
        assert.dom(node)
            .hasAttribute('aria-label',
                'DARPA ASIST Registry',
                'The a aria-label is correct.');

        // And I validate the data analytics name
        assert.dom(node)
            .hasAttribute('data-analytics-name',
                'asist - Registry',
                'The a aria-label is correct.');

        // Given I find the image node
        const imageNode = node?.querySelector('img');

        // Then I validate the image source
        assert.dom(imageNode)
            .hasAttribute('src',
                '/engines-dist/registries/assets/img/provider_logos/ASIST_logo.png',
                'The image src is correct.');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'DARPA ASIST Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list Character Lab Registry', async function(this: TestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`);

        // Given I find the node
        const node = document.querySelector('[data-test-registries-list-row-one] > div:nth-child(2) > a ');

        // Then I validate the link
        assert.dom(node)
            .hasAttribute('href',
                'https://osf.io/registries/characterlabregistry',
                'The a href link is correct.');

        // And I validate the link aria-label
        assert.dom(node)
            .hasAttribute('aria-label',
                'Character Lab Registry',
                'The a aria-label is correct.');

        // And I validate the data analytics name
        assert.dom(node)
            .hasAttribute('data-analytics-name',
                'characterlab - Registry',
                'The a aria-label is correct.');

        // Given I find the image node
        const imageNode = node?.querySelector('img');

        // Then I validate the image source
        assert.dom(imageNode)
            .hasAttribute('src',
                // eslint-disable-next-line max-len
                '/engines-dist/registries/assets/img/provider_logos/CharacterLab_logo-1794e99e73d6b8208ba3a8ba314a2e27.png',
                'The image src is correct.');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'Character Lab Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list Stiftelsen Dam Registry', async function(this: TestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`);

        // Given I find the node
        const node = document.querySelector('[data-test-registries-list-row-one] > div:nth-child(3) > a ');

        // Then I validate the link
        assert.dom(node)
            .hasAttribute('href',
                'https://osf.io/registries/dam',
                'The a href link is correct.');

        // And I validate the link aria-label
        assert.dom(node)
            .hasAttribute('aria-label',
                'Stiftelsen Dam Registry',
                'The a aria-label is correct.');

        // And I validate the data analytics name
        assert.dom(node)
            .hasAttribute('data-analytics-name',
                'dam - Registry',
                'The a aria-label is correct.');

        // Given I find the image node
        const imageNode = node?.querySelector('img');

        // Then I validate the image source
        assert.dom(imageNode)
            .hasAttribute('src',
                // eslint-disable-next-line max-len
                '/engines-dist/registries/assets/img/provider_logos/dam_logo-5c39e88b57d4bd5d154ae245e19eec36.png',
                'The image src is correct.');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'Stiftelsen Dam Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list EGAP Registry', async function(this: TestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`);

        // Given I find the node
        const node = document.querySelector('[data-test-registries-list-row-one] > div:nth-child(4) > a ');

        // Then I validate the link
        assert.dom(node)
            .hasAttribute('href',
                'https://osf.io/registries/egap',
                'The a href link is correct.');

        // And I validate the link aria-label
        assert.dom(node)
            .hasAttribute('aria-label',
                'egap Registry',
                'The a aria-label is correct.');

        // And I validate the data analytics name
        assert.dom(node)
            .hasAttribute('data-analytics-name',
                'egap - Registry',
                'The a aria-label is correct.');

        // Given I find the image node
        const imageNode = node?.querySelector('img');

        // Then I validate the image source
        assert.dom(imageNode)
            .hasAttribute('src',
                // eslint-disable-next-line max-len
                '/engines-dist/registries/assets/img/provider_logos/EGAP_white_logo-0c5f7c0c25f18e288b29108b2ea580de.png',
                'The image src is correct.');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'egap Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list Metascience Registry', async function(this: TestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`);

        // Given I find the node
        const node = document.querySelector('[data-test-registries-list-row-two] > div:nth-child(1) > a ');

        // Then I validate the link
        assert.dom(node)
            .hasAttribute('href',
                'https://osf.io/registries/metascience',
                'The a href link is correct.');

        // And I validate the link aria-label
        assert.dom(node)
            .hasAttribute('aria-label',
                'Metascience Registry',
                'The a aria-label is correct.');

        // And I validate the data analytics name
        assert.dom(node)
            .hasAttribute('data-analytics-name',
                'Metascience - Registry',
                'The a aria-label is correct.');

        // Given I find the image node
        const imageNode = node?.querySelector('img');

        // Then I validate the image source
        assert.dom(imageNode)
            .hasAttribute('src',
                // eslint-disable-next-line max-len
                '/engines-dist/registries/assets/img/provider_logos/Metascience_logo-07fa1aa6e8745f257d3d80a0120579a8.png',
                'The image src is correct.');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'Metascience Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list Real World Evidence Registry', async function(this: TestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`);

        // Given I find the node
        const node = document.querySelector('[data-test-registries-list-row-two] > div:nth-child(2) > a ');

        // Then I validate the link
        assert.dom(node)
            .hasAttribute('href',
                'https://osf.io/registries/rwe',
                'The a href link is correct.');

        // And I validate the link aria-label
        assert.dom(node)
            .hasAttribute('aria-label',
                'Real World Evidence Registry',
                'The a aria-label is correct.');

        // And I validate the data analytics name
        assert.dom(node)
            .hasAttribute('data-analytics-name',
                'RWE - Registry',
                'The a aria-label is correct.');

        // Given I find the image node
        const imageNode = node?.querySelector('img');

        // Then I validate the image source
        assert.dom(imageNode)
            .hasAttribute('src',
                // eslint-disable-next-line max-len
                '/engines-dist/registries/assets/img/provider_logos/RWE_logo-89ce7d56f5a5f89205b69c42000ff082.png',
                'The image src is correct.');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'Real World Evidence Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list YOUth Study Registry', async function(this: TestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`);

        // Given I find the node
        const node = document.querySelector('[data-test-registries-list-row-two] > div:nth-child(3) > a ');

        // Then I validate the link
        assert.dom(node)
            .hasAttribute('href',
                'https://osf.io/registries/youthstudy',
                'The a href link is correct.');

        // And I validate the link aria-label
        assert.dom(node)
            .hasAttribute('aria-label',
                'YOUth Study Registry',
                'The a aria-label is correct.');

        // And I validate the data analytics name
        assert.dom(node)
            .hasAttribute('data-analytics-name',
                'YOUth - Registry',
                'The a aria-label is correct.');

        // Given I find the image node
        const imageNode = node?.querySelector('img');

        // Then I validate the image source
        assert.dom(imageNode)
            .hasAttribute('src',
                // eslint-disable-next-line max-len
                '/engines-dist/registries/assets/img/provider_logos/YOUth_logo-09944ceafea91a557940f3148cbe32c5.png',
                'The image src is correct.');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'YOUth Study Registrylogo',
                'The image alt tag is correct.');
    });
});
