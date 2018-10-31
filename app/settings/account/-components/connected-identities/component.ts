import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Identity from 'ember-osf-web/models/identity';
import CurrentUser from 'ember-osf-web/services/current-user';
import Toast from 'ember-toastr/services/toast';

export default class ConnectedIdentities extends Component.extend({
    deleteIdentity: task(function *(this: ConnectedIdentities, identity: Identity) {
        const errorMessage: string = this.i18n.t('settings.account.connectedIdentities.deleteFail');
        const successMessage: string = this.i18n.t('settings.account.connectedIdentities.deleteSuccess');

        if (!identity) {
            return undefined;
        }

        try {
            yield identity.destroyRecord();
        } catch (e) {
            return this.toast.error(errorMessage);
        }
        this.reloadIdentityList();
        return this.toast.success(successMessage);
    }),
}) {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service i18n!: I18N;
    @service toast!: Toast;

    identity!: Identity;
    modelProperties = { user: this.currentUser.user };

    reloadIdentityList!: (page?: number) => void; // bound by paginated-list

    @action
    removeIdentity(this: ConnectedIdentities, identity: Identity) {
        this.get('deleteIdentity').perform(identity);
    }
}
