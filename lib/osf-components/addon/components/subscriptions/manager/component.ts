import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { layout } from 'ember-osf-web/decorators/component';

import { tracked } from '@glimmer/tracking';
import DS from 'ember-data';
import SubscriptionModel from 'ember-osf-web/models/subscription';
import template from './template';

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
}
