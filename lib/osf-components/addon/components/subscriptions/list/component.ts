import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';
import SubscriptionsManager from 'osf-components/components/subscriptions/manager/component';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class SubscriptionsListComponent extends Component {
    // required param
    manager!: SubscriptionsManager;
}
