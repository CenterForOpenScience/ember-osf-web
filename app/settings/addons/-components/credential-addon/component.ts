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
    profileUrl: validator('presence', true),
    username: validator('presence', true),
    password: validator('presence', true),
});

export default class CredentialAddon extends Component.extend(Validations, {
    profileUrl: null,
    username: null,
    password: null,
}) {
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;

    addNewAccountAction = bindEmberStore(addNewUserAccount, this.store);

    addon!: Addon;
    modalOpen!: boolean;
    addonLoading!: boolean;

    @action
    openModal() {
        this.setProperties({
            modalOpen: true,
            addonLoading: false,
            username: '',
            password: '',
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
