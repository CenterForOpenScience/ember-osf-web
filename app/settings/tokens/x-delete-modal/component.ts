import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import requiredAction from 'ember-osf-web/decorators/required-action';
import Token from 'ember-osf-web/models/token';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';

@tagName('span')
export default class TokenDeleteModal extends Component.extend({
    deleteTokenTask: task(function *(this: TokenDeleteModal) {
        // TODO analytics
        yield this.token.destroyRecord();
        this.tokenDeleted(this.token);
    }).drop(),
}) {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service router!: any;
    @service store!: DS.Store;

    // Required arguments
    token!: Token;
    @requiredAction tokenDeleted!: (token: Token) => void;

    // Optional arguments
    modalShown: boolean = defaultTo(this.modalShown, false);
    buttonDisabled: boolean = defaultTo(this.buttonDisabled, false);

    @action
    show(this: TokenDeleteModal) {
        // TODO analytics
        this.set('modalShown', true);
    }

    @action
    hide(this: TokenDeleteModal) {
        // TODO analytics
        this.set('modalShown', false);
    }
}
