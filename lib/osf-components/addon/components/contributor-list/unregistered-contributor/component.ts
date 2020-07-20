import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat } from 'ember-changeset-validations/validators';
import { task } from 'ember-concurrency-decorators';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import UserModel from 'ember-osf-web/models/user';
import UserEmail from 'ember-osf-web/models/user-email';
import CurrentUserService from 'ember-osf-web/services/current-user';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import styles from './styles';
import template from './template';

interface EmailValidation {
    userEmail: string;
}

const emailValidations: ValidationObject<EmailValidation> = {
    userEmail: [
        validateFormat({
            allowBlank: false,
            type: 'email',
            translationArgs: { description: 'Email address' },
        }),
    ],
};

@layout(template, styles)
@tagName('')
export default class UnregisteredContributorComponent extends Component {
    @service currentUser!: CurrentUserService;
    @service toast!: Toast;
    @service intl!: Intl;
    @bool('currentUser.currentUserId') isLoggedIn?: boolean;
    @computed('isLoggedIn', 'emailChangeset.isInValid')
    get isClaimButtonDisabled(): boolean {
        return Boolean(!this.isLoggedIn && this.emailChangeset.isInvalid);
    }

    @tracked shouldOpenClaimDialog: boolean = false;
    @tracked currentUserEmail?: string;

    emailObj = { userEmail: '' };
    emailChangeset = buildChangeset(this.emailObj, emailValidations);
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
        try {
            const user: UserModel = yield this.contributor.users;
            if (user) {
                if (this.isLoggedIn) {
                    yield user.claimUnregisteredUser(this.nodeId);
                } else {
                    this.emailChangeset.validate();
                    if (this.emailChangeset.isValid) {
                        yield user.claimUnregisteredUser(this.nodeId, this.emailChangeset.get('userEmail'));
                    }
                }
            }
            this.closeDialog();
        } catch (e) {
            const errorMessage = this.intl.t('contributor_list.unregistered_contributor.toast_error_title');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
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
        this.emailChangeset.rollback();
        this.shouldOpenClaimDialog = false;
    }
}
