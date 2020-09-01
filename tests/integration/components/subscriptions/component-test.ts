import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | subscriptions', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    test('it renders', async assert => {
        server.create('subscription', {
            id: 'test_subscription',
            eventName: 'test_subscription',
            frequency: SubscriptionFrequency.Instant,
        });

        await render(hbs`
            <Subscriptions::Manager as |manager|>
                <Subscriptions::List @manager={{manager}} />
            </Subscriptions::Manager>
        `);
        assert.dom('[data-test-subscription-list]').exists();
        assert.dom('[data-test-subscription-list-row="test_subscription"]').exists();
        assert.dom('[data-test-subscription-event-name').hasText('Test subscription');
        assert.dom('[data-test-power-select').hasText('Instant');
    });

    test('it updates frequency', async assert => {
        server.create('subscription', {
            id: 'test_subscription',
            eventName: 'test_subscription',
            frequency: SubscriptionFrequency.Instant,
        });

        await render(hbs`
            <Subscriptions::Manager as |manager|>
                <Subscriptions::List @manager={{manager}} />
            </Subscriptions::Manager>
        `);
        assert.dom('[data-test-power-select').hasText('Instant');
        await clickTrigger();
        await click('[data-test-subscription-option="daily"]');
        assert.dom('[data-test-power-select').hasText('Daily');
    });
});
