import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Integration | Component | branded-header', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        // this.store = this.owner.lookup('service:store');
    });

    test('default display', async function(assert) {
        // Given the input variablies are set
        this.set('onSearch', sinon.fake());
        this.set('searchPlaceholder', 'preprints.header.search_placeholder');

        // When the component is rendered
        await render(hbs`<BrandedHeader
                @translationParent='preprints'
                @onSearch={{this.onSearch}}
                @showHelp=true
                @searchPlaceholder={{this.searchPlaceholder}}
                as |branded-header|
            ></BrandedHeader>
        `);

        // Then the header container is verified
        const headerContainer = this.element.querySelector('[data-test-header-container]');
        assert.dom(headerContainer).exists();

        // Then the header container is verified
        assert.dom(this.element.querySelector('[data-test-brand-logo]')).hasAttribute('aria-label', 'OSF Preprints');

        // eslint-disable-next-line max-len
        assert.dom(this.element.querySelector('[data-test-perform-search-button]')).hasAttribute('aria-label', 'Perform search');
        assert.dom(this.element.querySelector('[data-test-perform-search-button]')).hasAttribute('type', 'button');

        // eslint-disable-next-line max-len
        assert.dom(this.element.querySelector('[data-test-search-icon]')).hasAttribute('data-icon', 'search');

        // eslint-disable-next-line max-len
        assert.dom(this.element.querySelector('[data-test-search-box]')).hasAttribute('placeholder', 'preprints.header.search_placeholder');

        // eslint-disable-next-line max-len
        assert.dom(this.element.querySelector('[data-test-search-help-button]')).hasAttribute('aria-label', 'Search help');
        assert.dom(this.element.querySelector('[data-test-search-help-button]')).hasAttribute('type', 'button');
    });
});
