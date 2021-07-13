import Component from '@ember/component';
import { action } from '@ember/object';
import { bool } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

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
        this.router.transitionTo('home', { queryParams: { view_only: ''}});
    }
}
