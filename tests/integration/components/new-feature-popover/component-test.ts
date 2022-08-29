import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { TestContext } from 'ember-test-helpers';

import Cookies from 'ember-cookies/services/cookies';
import click from '@ember/test-helpers/dom/click';
import Service from '@ember/service';


interface NewFeaturePopoverContext extends TestContext {
    featureCookie: string;
    bodyText: string;
    headingText: string;
    cookie: Cookies;
}

module('Integration | Component | new-feature-popover', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: NewFeaturePopoverContext) {
        this.featureCookie = 'dummyCookie';
        const dummyCookieName = this.featureCookie;
        this.bodyText = 'The show must go on';
        this.headingText = 'Heroine';
        this.owner.register('service:cookies',
            class CookiesStub extends Service {
                dummyCookieExists = false;
                exists() {
                    return this.dummyCookieExists;
                }
                write(value: string) {
                    if (value === dummyCookieName) {
                        this.dummyCookieExists = true;
                    }
                }
            });
        this.cookie = this.owner.lookup('service:cookies');
    });

    test(
        'popover shows when the cookie does not exist, no not-again',
        async function(this: NewFeaturePopoverContext, assert) {
            assert.false(this.cookie.exists(this.featureCookie));
            await render(hbs`
                <div id='divIdForTesting' >
                </div>
                <NewFeaturePopover
                    @triggerElement={{concat '#' 'divIdForTesting'}}
                    @featureCookie={{this.featureCookie}}
                >
                    <:header>
                        {{this.headingText}}
                    </:header>
                    <:body>
                        {{this.bodyText}}
                    </:body>
                </NewFeaturePopover>
            `);
            assert.false(this.cookie.exists(this.featureCookie), 'cookie does not exist');
            assert.dom('[data-test-popover-header]').exists('popover header exists');
            assert.dom('[data-test-popover-header]').hasText(this.headingText, 'heading text is correct');
            assert.dom('[data-test-popover-body]').exists('popover body exists');
            assert.dom('[data-test-popover-body]').hasText(this.bodyText, 'body text is correct');
            assert.dom('[data-test-not-again-checkbox]').exists('checkbox exists');
            assert.dom('[data-test-not-again-checkbox]').hasText(
                t('osf-components.new-feature-popover.doNotShowAgain'), 'checkbox test is correct',
            );
            assert.dom('[data-test-got-it-button]').exists('got it button exists');
            assert.dom('[data-test-got-it-button]').hasText(
                t('osf-components.new-feature-popover.acknowledge'), 'got it button text is correct',
            );
            await click('[data-test-got-it-button]');
            assert.false(
                this.cookie.exists(this.featureCookie), 'acknowledge without checking not again should not set cookie',
            );
        },
    );

    test(
        'popover shows when the cookie does not exist, check not-again',
        async function(this: NewFeaturePopoverContext, assert) {
            await render(hbs`
                <div id='divIdForTesting' >
                </div>
                <NewFeaturePopover
                    @triggerElement={{concat '#' 'divIdForTesting'}}
                    @featureCookie={{this.featureCookie}}
                >
                    <:header>
                        {{this.headingText}}
                    </:header>
                    <:body>
                        {{this.bodyText}}
                    </:body>
                </NewFeaturePopover>
            `);

            assert.false(this.cookie.exists(this.featureCookie));
            assert.dom('[data-test-popover-header]').exists('popover header exists');
            assert.dom('[data-test-popover-header]').hasText(this.headingText, 'heading text is correct');
            assert.dom('[data-test-popover-body]').exists('popover body exists');
            assert.dom('[data-test-popover-body]').hasText(this.bodyText, 'body text is correct');
            assert.dom('[data-test-not-again-checkbox]').exists('checkbox exists');
            assert.dom('[data-test-not-again-checkbox]').hasText(
                t('osf-components.new-feature-popover.doNotShowAgain'), 'checkbox test is correct',
            );
            assert.dom('[data-test-got-it-button]').exists('got it button exists');
            assert.dom('[data-test-got-it-button]').hasText(
                t('osf-components.new-feature-popover.acknowledge'), 'got it button text is correct',
            );
            await click('[data-test-not-again-checkbox]');
            await click('[data-test-got-it-button]');
            assert.ok(
                this.cookie.exists(this.featureCookie), 'acknowledge with checking not again should set cookie',
            );
        },
    );

    test('popover does not show when cookie exists', async function(this: NewFeaturePopoverContext, assert) {
        this.cookie.write(this.featureCookie, 1);
        await render(hbs`
            <div id='divIdForTesting' >
            </div>
            <NewFeaturePopover
                @triggerElement={{concat '#' 'divIdForTesting'}}
                @featureCookie={{this.featureCookie}}
            >
                <:header>
                    {{this.headingText}}
                </:header>
                <:body>
                    {{this.bodyText}}
                </:body>
            </NewFeaturePopover>
        `);
        assert.ok(this.cookie.exists(this.featureCookie));
        assert.dom('[data-test-popover-header]').doesNotExist('popover does not show');
    });
});
