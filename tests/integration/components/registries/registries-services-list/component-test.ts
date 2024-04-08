import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { percySnapshot } from 'ember-percy';

import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { EnginesIntlTestContext } from 'ember-engines/test-support';

module('Integration | Component | registries | registries-services-list', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    test('the registries services list page structure', async function(this: EnginesIntlTestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`, { owner: this.engine });

        // Then the header text is validated
        assert.dom('[data-test-registries-list-header]').hasText('Registry Services', 'The header text is correct.');

        // And the paragraph text is validated
        assert.dom('[data-test-registries-list-paragraph]')
            .hasText(
                'Leading registry service providers use this open source infrastructure to support their communities.',
                'The header paragraph is correct.',
            );

        assert.dom('[data-test-registries-list-row-one] > div').exists({count: 4});

        assert.dom('[data-test-registries-list-row-two] > div').exists({count: 5});

        assert.dom('[data-test-registries-list-contact-link]')
            .hasAttribute('href',
                'mailto:contact@osf.io',
                'The mail to href is correct.');

        assert.dom('[data-test-registries-list-contact-link]')
            .hasText('Contact us',
                'The contact link text is correct.');


        await percySnapshot(assert);
    });


    test('the registries services list DARPA ASIST', async function(this: EnginesIntlTestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`, { owner: this.engine });

        // Given I find the node
        const node = document.querySelector('[data-test-asist-registry]');

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
        const imageNode = document.querySelector('[data-test-asist-registry-logo]');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'DARPA ASIST Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list Character Lab Registry', async function(this: EnginesIntlTestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`, { owner: this.engine });

        // Given I find the node
        const node = document.querySelector('[data-test-characterlab-registry]');

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
        const imageNode = document.querySelector('[data-test-characterlab-registry-logo]');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'Character Lab Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list Stiftelsen Dam Registry', async function(this: EnginesIntlTestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`, { owner: this.engine });

        // Given I find the node
        const node = document.querySelector('[data-test-dam-registry]');

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
        const imageNode = document.querySelector('[data-test-dam-registry-logo]');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'Stiftelsen Dam Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list EGAP Registry', async function(this: EnginesIntlTestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`, { owner: this.engine });

        // Given I find the node
        const node = document.querySelector('[data-test-egap-registry]');

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
        const imageNode = document.querySelector('[data-test-egap-registry-logo]');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'egap Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list Metascience Registry', async function(this: EnginesIntlTestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`, { owner: this.engine });

        // Given I find the node
        const node = document.querySelector('[data-test-metascience-registry]');

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
        const imageNode = document.querySelector('[data-test-metascience-registry-logo]');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'Metascience Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list Real World Evidence Registry',
        async function(
            this: EnginesIntlTestContext,
            assert,
        ) {
            // Given the component is rendered
            await render(hbs`<RegistriesServicesList />`, { owner: this.engine });

            // Given I find the node
            const node = document.querySelector('[data-test-rwe-registry]');

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
            const imageNode = document.querySelector('[data-test-rwe-registry-logo]');

            // And I validate the image alt tag
            assert.dom(imageNode)
                .hasAttribute('alt',
                    'Real World Evidence Registrylogo',
                    'The image alt tag is correct.');
        });

    test('the registries services list YOUth Study Registry', async function(this: EnginesIntlTestContext, assert) {
        // Given the component is rendered
        await render(hbs`<RegistriesServicesList />`, { owner: this.engine });

        // Given I find the node
        const node = document.querySelector('[data-test-youth-registry]');

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
        const imageNode = document.querySelector('[data-test-youth-registry-logo]');

        // And I validate the image alt tag
        assert.dom(imageNode)
            .hasAttribute('alt',
                'YOUth Study Registrylogo',
                'The image alt tag is correct.');
    });

    test('the registries services list TWCF Consciousness Registry',
        async function(
            this: EnginesIntlTestContext,
            assert,
        ) {
            // Given the component is rendered
            await render(hbs`<RegistriesServicesList />`, { owner: this.engine });

            // Given I find the node
            const node = document.querySelector('[data-test-twcf-consciousness-registry]');

            // Then I validate the link
            assert.dom(node)
                .hasAttribute('href',
                    'https://osf.io/registries/twcfconscious',
                    'The a href link is correct.');

            // And I validate the link aria-label
            assert.dom(node)
                .hasAttribute('aria-label',
                    'TWCF Consciousness Registry',
                    'The a aria-label is correct.');

            // And I validate the data analytics name
            assert.dom(node)
                .hasAttribute('data-analytics-name',
                    'TWCF Consciousness - Registry',
                    'The data-analytics-name attribute is correct.');

            // Given I find the image node
            const imageNode = document.querySelector('[data-test-twcf-consciousness-registry-logo]');

            // And I validate the image alt tag
            assert.dom(imageNode)
                .hasAttribute('alt',
                    'TWCF Consciousness Registrylogo',
                    'The image alt tag is correct.');
        });

    test('the registries services list GSF Consciousness Registry',
        async function(
            this: EnginesIntlTestContext,
            assert,
        ) {
            // Given the component is rendered
            await render(hbs`<RegistriesServicesList />`, { owner: this.engine });

            // Given I find the node
            const node = document.querySelector('[data-test-gsf-registry]');

            // Then I validate the link
            assert.dom(node)
                .hasAttribute('href',
                    'https://osf.io/registries/gfs',
                    'The a href link is correct.');

            // And I validate the link aria-label
            assert.dom(node)
                .hasAttribute('aria-label',
                    'Global Flourshing Study Registry',
                    'The a aria-label is correct.');

            // And I validate the data analytics name
            assert.dom(node)
                .hasAttribute('data-analytics-name',
                    'GFS - Registry',
                    'The data-analytics-name attribute is correct.');

            // Given I find the image node
            const imageNode = document.querySelector('[data-test-gfs-registry-logo]');

            // And I validate the image alt tag
            assert.dom(imageNode)
                .hasAttribute('alt',
                    'Global Flourishing Study Registrylogo',
                    'The image alt tag is correct.');
        });
});
