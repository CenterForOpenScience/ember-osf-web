import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
import Addon from 'ember-osf-web/models/addon';
import CurrentUser from 'ember-osf-web/services/current-user';
import {
    addNewUserAccount,
    bindEmberStore,
} from 'ember-osf-web/settings/addons/services/addonService';

const Validations = buildValidations({
    accessKey: validator('presence', true),
    secretKey: validator('presence', true),
});

export default class KeyAddon extends Component.extend(Validations, {
    accessKey: null,
    secretKey: null,
}) {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;

    addNewAccountAction = bindEmberStore(addNewUserAccount, this.store);

    addon!: Addon;
    userAddon!: string;
    modalOpen!: boolean;
    addonLoading!: boolean;

    @action
    openModal() {
        this.setProperties({
            modalOpen: true,
            addonLoading: false,
            accessKey: '',
            secretKey: '',
        });
    }

    @action
    closeModal() {
        this.set('modalOpen', false);
    }

    @action
    async onSave() {
        const {
            currentUser,
            addon,
            addNewAccountAction,
        } = this;

        this.set('addonLoading', true);
        await addNewAccountAction(addon.id, currentUser.user);
        this.set('modalOpen', false);
    }
}
