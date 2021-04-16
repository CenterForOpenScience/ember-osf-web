import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { bool } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat } from 'ember-changeset-validations/validators';
import { BufferedChangeset } from 'ember-changeset/types';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
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

    @tracked shouldOpenClaimDialog: boolean = false;
    @tracked currentUserEmail?: string;

    emailObj?: EmailValidation = undefined;
    emailChangeset?: BufferedChangeset = undefined;
    contributor!: Contributor;
    nodeId!: string;

    @bool('currentUser.currentUserId') isLoggedIn?: boolean;

    @task
    @waitFor
    async loadEmailsTask() {
        const emails = await this.currentUser.user!.queryHasMany('emails', {
            filter: {
                primary: true,
            },
        });
        this.currentUserEmail = emails[0].emailAddress;
    }

    @task
    @waitFor
    async claimContributor() {
        try {
            const user = await this.contributor.users;
            if (user) {
                if (this.isLoggedIn) {
                    await user.claimUnregisteredUser(this.nodeId);
                    this.closeDialog();
                } else {
                    this.emailChangeset!.validate();
                    if (this.emailChangeset!.isValid) {
                        await user.claimUnregisteredUser(this.nodeId, this.emailChangeset!.get('userEmail'));
                        this.closeDialog();
                    }
                }
            }
        } catch (e) {
            const errorMessage = this.intl.t('contributor_list.unregistered_contributor.toast_error_title');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    }

    didReceiveAttrs() {
        if (this.isLoggedIn) {
            taskFor(this.loadEmailsTask).perform();
        } else {
            this.emailObj = { userEmail: '' };
            this.emailChangeset = buildChangeset(this.emailObj, emailValidations);
        }
    }

    @action
    showDialog() {
        this.shouldOpenClaimDialog = true;
    }

    @action
    onKeyPress(event: KeyboardEvent) {
        if ([13, 32].includes(event.keyCode)) {
            event.preventDefault();
            this.showDialog();
        }
    }

    @action
    closeDialog() {
        if (!this.isLoggedIn) {
            this.emailChangeset!.rollback();
        }
        this.shouldOpenClaimDialog = false;
    }
}
