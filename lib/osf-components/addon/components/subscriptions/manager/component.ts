import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import { layout } from 'ember-osf-web/decorators/component';
import SubscriptionModel, { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import template from './template';

@tagName('')
@layout(template)
export default class SubscriptionsManager extends Component {
    @service store!: DS.Store;

    // optional arguments
    subscriptionIds?: string[];

    // tracked properties
    @tracked subscriptions: SubscriptionModel[] | null = null;

    @task({ withTestWaiter: true, restartable: true, on: 'didReceiveAttrs' })
    fetchSubscriptions = task(function *(this: SubscriptionsManager) {
        if (this.subscriptionIds) {
            this.subscriptions = yield this.store.query('subscription', {
                'filter[id]': this.subscriptionIds.join(','),
            });
        }
        this.subscriptions = yield this.store.findAll('subscription');
    });

    @task({ withTestWaiter: true, restartable: true })
    updateSubscriptionFrequency = task(function *(
        this: SubscriptionsManager,
        subscription: SubscriptionModel,
        frequency: SubscriptionFrequency,
    ) {
        // eslint-disable-next-line no-param-reassign
        subscription.frequency = frequency;
        yield subscription.save();
    });
}
