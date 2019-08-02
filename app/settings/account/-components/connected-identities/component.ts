import { tagName } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import ExternalIdentity from 'ember-osf-web/models/external-identity';

const { support: { supportEmail } } = config;

@tagName('')
export default class ConnectedIdentities extends Component.extend({
    removeIdentityTask: task(function *(this: ConnectedIdentities, identity: ExternalIdentity) {
        if (!identity) {
            return undefined;
        }

        try {
            yield identity.destroyRecord();
        } catch (e) {
            this.toast.error(this.i18n.t('settings.account.connected_identities.remove_fail', { supportEmail }));
            return false;
        }
        this.reloadIdentitiesList();
        this.toast.success(this.i18n.t('settings.account.connected_identities.remove_success'));
        return true;
    }),
}) {
    // Private properties
    @service i18n!: I18N;
    @service toast!: Toast;
    reloadIdentitiesList!: (page?: number) => void; // bound by paginated-list

    removeIdentity(identity: ExternalIdentity) {
        this.removeIdentityTask.perform(identity);
    }
}
