import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import UserEmail from 'ember-osf-web/models/user-email';
import CurrentUserService from 'ember-osf-web/services/current-user';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class UnregisteredContributorComponent extends Component {
    @service currentUser!: CurrentUserService;
    @bool('currentUser.currentUserId') isLoggedIn?: boolean;
    @tracked shouldOpenClaimDialog: boolean = false;

    @tracked currentUserEmail?: string;

    @task({ withTestWaiter: true })
    loadEmailsTask = task(function *(this: UnregisteredContributorComponent) {
        const emails: UserEmail[] = yield this.currentUser.user!.queryHasMany('emails', {
            filter: {
                primary: true,
            },
        });
        this.currentUserEmail = emails[0].emailAddress;
    });

    // @task({ withTestWaiter: true })
    // claimContributor = task(function *(this: UnregisteredContributorComponent) {
    //     //TODO: What should this do?
    //     return '';
    // });

    didReceiveAttrs() {
        if (this.isLoggedIn) {
            this.loadEmailsTask.perform();
        }
    }

    @action
    claimUser() {
        return null;
    }

    @action
    showDialog() {
        this.shouldOpenClaimDialog = true;
    }

    @action
    closeDialog() {
        this.shouldOpenClaimDialog = false;
    }
}
