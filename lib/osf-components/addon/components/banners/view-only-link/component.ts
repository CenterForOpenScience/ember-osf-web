import { action } from '@ember-decorators/object';
import { bool } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import RouterService from '@ember/routing/router-service';

import { layout } from 'ember-osf-web/decorators/component';
import CurrentUser from 'ember-osf-web/services/current-user';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class BannersViewOnlyLink extends Component {
    @service currentUser!: CurrentUser;
    @service router!: RouterService;

    @bool('currentUser.viewOnlyToken') shouldDisplay!: boolean;

    @action
    stopViewOnly() {
        this.router.transitionTo('home', { queryParams: { view_only: '' } });
    }
}
