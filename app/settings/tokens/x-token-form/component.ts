import { or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Toast from 'ember-toastr/services/toast';

import requiredAction from 'ember-osf-web/decorators/required-action';
import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';

export default class TokenForm extends Component.extend({
    saveTokenTask: task(function *(this: TokenForm) {
        const token = this.token!;
        if (this.analyticsScope) {
            this.analytics.click('button', `${this.analyticsScope} - Save token`);
        }

        const { validations } = yield token.validate();
        this.set('messagesShown', true);

        if (validations.get('isValid')) {
            try {
                yield token.save();
                this.set('tokenSaved', true);
                this.onSave(token);
            } catch (e) {
                this.toast.error(e);
                throw e;
            }
        }
    }),
}) {
    // Required arguments
    @requiredAction onSave!: (token: Token) => void;

    // Optional arguments
    token!: Token; // If not provided, new token created in constructor
    disabled: boolean = defaultTo(this.disabled, false);
    analyticsScope?: string;

    // Private properties
    @service currentUser!: CurrentUser;
    @service router!: any;
    @service store!: DS.Store;
    @service analytics!: Analytics;
    @service toast!: Toast;

    messagesShown: boolean = false;
    tokenSaved: boolean = false;

    allScopes = this.store.findAll('scope');

    @or('disabled', 'saveTokenTask.isRunning')
    inputsDisabled!: boolean;

    constructor(...args: any[]) {
        super(...args);

        if (!this.token) {
            this.token = this.store.createRecord('token');
        }
    }

    willDestroy() {
        if (!this.tokenSaved) {
            this.token.unloadRecord();
        }
    }
}
