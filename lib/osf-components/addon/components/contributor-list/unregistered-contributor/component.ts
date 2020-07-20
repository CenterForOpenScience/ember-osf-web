import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import UserModel from 'ember-osf-web/models/user';
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
    @tracked loggedOutClaimEmail?: string;
    contributor!: Contributor;
    nodeId!: string;

    @task({ withTestWaiter: true })
    loadEmailsTask = task(function *(this: UnregisteredContributorComponent) {
        const emails: UserEmail[] = yield this.currentUser.user!.queryHasMany('emails', {
            filter: {
                primary: true,
            },
        });
        this.currentUserEmail = emails[0].emailAddress;
    });

    @task({ withTestWaiter: true })
    claimContributor = task(function *(this: UnregisteredContributorComponent) {
        const user: UserModel = yield this.contributor.users;
        if (user) {
            if (this.isLoggedIn) {
                yield user.claimUnregisteredUser(this.nodeId);
            } else {
                yield user.claimUnregisteredUser(this.nodeId, this.loggedOutClaimEmail);
            }
        }
    });

    didReceiveAttrs() {
        if (this.isLoggedIn) {
            this.loadEmailsTask.perform();
        }
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
