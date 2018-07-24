import { or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import requiredAction from 'ember-osf-web/decorators/required-action';
import Token from 'ember-osf-web/models/token';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';

export default class TokenForm extends Component.extend({
    saveTokenTask: task(function *(this: TokenForm) {
        const token = this.token!;

        const { validations } = yield token.validate();
        this.set('messagesShown', true);

        if (validations.get('isValid')) {
            yield token.save();
            this.set('tokenSaved', true);
            this.onSave(token);
        }
    }),
}) {
    @service currentUser!: CurrentUser;
    @service router!: any;
    @service store!: DS.Store;

    // Required arguments
    @requiredAction onSave!: (token: Token) => void;

    // Optional arguments
    token!: Token; // If not provided, new token created in constructor
    disabled: boolean = defaultTo(this.disabled, false);

    // Private properties
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
            // TODO scopes :(
            this.token.rollbackAttributes();
        }
    }
}
