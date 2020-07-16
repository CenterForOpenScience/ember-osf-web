import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { layout } from 'ember-osf-web/decorators/component';
import CurrentUserService from 'ember-osf-web/services/current-user';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class UnregisteredContributorComponent extends Component {
    @service currentUser!: CurrentUserService;
    @bool('currentUser.currentUserId') isLoggedIn: boolean = false;
    @tracked shouldOpenClaimDialog: boolean = false;

    @action
    claimUser() {
        return null;
    }

    @action
    showDialog() {
        this.shouldOpenClaimDialog = true;
    }
}
