import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
// import { inject as service } from '@ember/service';
// import { tracked } from '@glimmer/tracking';
import { layout } from 'ember-osf-web/decorators/component';
import SubscriptionModel, { SubscriptionFrequency } from 'ember-osf-web/models/subscription';
import SubscriptionsManager from 'osf-components/components/subscriptions/manager/component';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class SubscriptionsListRowComponent extends Component {
    // required param
    manager!: SubscriptionsManager;
    subscription!: SubscriptionModel;

    // private properties
    frequencyOptions: SubscriptionFrequency[] = [
        SubscriptionFrequency.Daily,
        SubscriptionFrequency.Instant,
        SubscriptionFrequency.None,
    ];
}
