import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import Token from 'ember-osf-web/models/token';
import { BufferedChangeset } from 'ember-changeset/types';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

interface Args {
    token: Token;
}

export default class TokenForm extends Component {
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;
    @service store!: Store;

    @alias('onSave.isRunning') disabled!: boolean;
    allScopes = this.store.findAll('scope');

    // Optional arguments
    token!: Token; // If not provided, new token created by validated-model-form
    changeset!: BufferedChangeset;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.token = args.token;
        this.changeset = buildChangeset(this.token, null);
    }

    @task
    async onSave() {
        try {
            await this.changeset.save();
            this.toast.success(this.intl.t('settings.tokens.saved'));
            this.router.transitionTo('settings.tokens');
        } catch {
            this.toast.error(this.intl.t('settings.tokens.save-error'));
        }
    }

    @action
    async deleteToken() {
        try {
            await this.token!.destroyRecord();
            this.toast.success(this.intl.t('settings.tokens.deleted'));
            this.router.transitionTo('settings.tokens');
        } catch {
            this.toast.error(this.intl.t('settings.tokens.delete-error'));
        }
    }
}
