import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import RouterService from '@ember/routing/router-service';
import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { requiredAction } from 'ember-osf-web/decorators/component';
import Token from 'ember-osf-web/models/token';

@tagName('') // No div
export default class TokenCard extends Component {
    @service i18n!: I18n;
    @service router!: RouterService;
    @service toast!: Toast;

    // Required arguments
    token!: Token;
    @requiredAction onDelete!: () => unknown;

    @action
    async delete() {
        // Not a task -- if this removes the component, still want to run the callback
        this.token.deleteRecord();
        await this.token.save();
        this.toast.success(this.i18n.t('settings.tokens.deleted'));
        this.onDelete();
    }
}
