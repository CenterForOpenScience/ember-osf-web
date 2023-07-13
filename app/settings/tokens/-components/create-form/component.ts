import Component from '@glimmer/component';
import { alias } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import { BufferedChangeset } from 'ember-changeset/types';
import { task } from 'ember-concurrency';

import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';


export default class CreateFormComponent extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service router!: RouterService;
    @service toast!: Toast;
    @service store!: Store;

    allScopes = this.store.findAll('scope');

    token!: Token;
    changeset!: BufferedChangeset;
    validation: ValidationObject<Token> = {
        name: [
            validatePresence({
                type: 'empty',
                presence: true,
            }),
        ],
        scopes: [
            validatePresence({
                type: 'blank',
                presence: true,
            }),
        ],
    };
    @alias('onSave.isRunning') disabled!: boolean;

    constructor(owner: unknown, args: object) {
        super(owner, args);
        this.token = this.store.createRecord('token');
        this.changeset = buildChangeset(this.token, this.validation);
    }

    @task
    async onSave() {
        try {
            this.changeset.validate();
            if (this.changeset.isValid) {
                await this.changeset.save();
                this.toast.success(this.intl.t('settings.tokens.created'));
                this.router.transitionTo('settings.tokens.edit', this.token.get('id'));
            }
        } catch {
            this.toast.error(this.intl.t('settings.tokens.create-error'));
        }
    }
}
