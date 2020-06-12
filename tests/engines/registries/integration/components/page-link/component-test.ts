/* eslint-disable max-classes-per-file */
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';

class RouterStub extends Service {
    urlFor() {
        return 'http://example.com';
    }

    isActive() {
        return false;
    }

    transitionTo() {
        // empty
    }
}

class CurrentUserStub extends Service {}

const headTagsStub = Service.extend({
    collectHeadTags: () => { /* noop */ },
});

module('Registries | Integration | Component | page-link', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:router', RouterStub);
        this.owner.register('service:osf-router', RouterStub);
        this.owner.register('service:current-user', CurrentUserStub);
        this.owner.register('service:head-tags', headTagsStub);
    });

    test('Renders an unvisited page link', async function(this: TestContext, assert) {
        const pageManager = {
            isVisited: false,
            pageIsValid: false,
            pageHeadingText: 'Unvisited',
        };

        this.setProperties({ pageManager });

        await render(hbs`
            <PageLink
                @link={{component 'osf-layout/registries-side-nav/x-link'}}
                @draftId='test'
                @pageManager={{this.pageManager}}
                @pageIndex={{100}}
                @currentPageIndex={{1}}
                as |pageLink|
            />
        `);

        assert.dom('[data-test-link="101-unvisited"]').exists('Unvisited PageLink Component renders');
        assert.dom('[data-test-label]').containsText(pageManager.pageHeadingText, 'has proper label');
        assert.dom('[data-test-icon].fa-circle').exists('icon uses proper symbol');
    });

    test('Renders a valid page link', async function(this: TestContext, assert) {
        const pageManager = {
            isVisited: true,
            pageIsValid: true,
            pageHeadingText: 'Valid',
        };

        this.setProperties({ pageManager });

        await render(hbs`
            <PageLink
                @link={{component 'osf-layout/registries-side-nav/x-link'}}
                @draftId='test'
                @pageManager={{this.pageManager}}
                @pageIndex={{0}}
                @currentPageIndex={{2}}
                as |pageLink|
            />
        `);

        assert.dom('[data-test-link="1-valid"]').exists('Valid PageLink Component renders');
        assert.dom('[data-test-label]').containsText(pageManager.pageHeadingText, 'has proper label');
        assert.dom('[data-test-icon].fa-check-circle-o').exists('icon uses proper symbol');
    });

    test('Renders an invalid page link', async function(this: TestContext, assert) {
        const pageManager = {
            isVisited: true,
            pageIsValid: false,
            pageHeadingText: 'Invalid',
        };

        this.setProperties({ pageManager });

        await render(hbs`
            <PageLink
                @link={{component 'osf-layout/registries-side-nav/x-link'}}
                @draftId='test'
                @pageManager={{this.pageManager}}
                @pageIndex={{1}}
                @currentPageIndex={{3}}
                as |pageLink|
            />
        `);

        assert.dom('[data-test-link="2-invalid"]').exists('Invalid PageLink Component renders');
        assert.dom('[data-test-label]').containsText(pageManager.pageHeadingText, 'has proper label');
        assert.dom('[data-test-icon].fa-exclamation-circle').exists('icon uses proper symbol');
    });

    test('Renders an active page link', async function(this: TestContext, assert) {
        const pageManager = {
            isVisited: true,
            pageIsValid: false,
            pageHeadingText: 'Active',
        };

        this.setProperties({ pageManager });

        await render(hbs`
            <PageLink
                @link={{component 'osf-layout/registries-side-nav/x-link'}}
                @draftId='test'
                @pageManager={{this.pageManager}}
                @pageIndex={{5}}
                @currentPageIndex={{5}}
                as |pageLink|
            />
        `);

        assert.dom('[data-test-link="6-active"]').exists('Active PageLink Component renders');
        assert.dom('[data-test-label]').containsText(pageManager.pageHeadingText, 'has proper label');
        assert.dom('[data-test-icon].fa-circle-o').exists('icon uses proper symbol');
    });

    test('Renders an inactive named page link', async assert => {
        await render(hbs`
            <PageLink
                @link={{component 'osf-layout/registries-side-nav/x-link'}}
                @draftId='test'
                @pageName='foo'
                @currentPageName='bar'
                @label='Foo'
                as |pageLink|
            />
        `);

        assert.dom('[data-test-link="foo"]').exists('PageLink Component renders');
        assert.dom('[data-test-label]').containsText('Foo', 'has proper label');
        assert.dom('[data-test-icon].fa-circle').exists('icon uses proper symbol');
    });

    test('Renders an active named page link', async assert => {
        await render(hbs`
            <PageLink
                @link={{component 'osf-layout/registries-side-nav/x-link'}}
                @draftId='test'
                @pageName='foo'
                @currentPageName='foo'
                @label='Foo'
                as |pageLink|
            />
        `);

        assert.dom('[data-test-link="foo"]').exists('PageLink Component renders');
        assert.dom('[data-test-label]').containsText('Foo', 'has proper label');
        assert.dom('[data-test-icon].fa-circle-o').exists('icon uses proper symbol');
    });
});
/* eslint-enable max-classes-per-file */
