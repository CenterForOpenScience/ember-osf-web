import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { enqueueTask, restartableTask } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import SubscriptionModel, { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import template from './template';

type SubscriptionType = 'subscription' | 'registration-subscription' | 'collection-subscription';

@tagName('')
@layout(template)
export default class SubscriptionsManager extends Component {
    @service store!: Store;
    @service toast!: Toast;
    @service intl!: Intl;
    // optional arguments
    subscriptionIds?: string[];
    type: SubscriptionType = 'subscription';

    // tracked properties
    @tracked subscriptions: ArrayProxy<SubscriptionModel> | SubscriptionModel[] | null = null;

    @enqueueTask({ on: 'didReceiveAttrs' })
    @waitFor
    async fetchSubscriptions() {
        try {
            if (Array.isArray(this.subscriptionIds) && this.subscriptionIds.length) {
                this.subscriptions = await this.store.query(this.type, {
                    'filter[id]': this.subscriptionIds.join(','),
                });
            } else {
                this.subscriptions = await this.store.findAll(this.type);
            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    }

    @restartableTask
    @waitFor
    async updateSubscriptionFrequency(
        subscription: SubscriptionModel,
        newFrequency: SubscriptionFrequency,
    ) {
        // eslint-disable-next-line no-param-reassign
        subscription.frequency = newFrequency;
        try {
            await subscription.save();
            this.toast.success(this.intl.t('osf-components.subscriptions.success'));
        } catch (e) {
            const errorMessage = this.intl.t('osf-components.subscriptions.error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            subscription.rollbackAttributes();
        }
    }
}
