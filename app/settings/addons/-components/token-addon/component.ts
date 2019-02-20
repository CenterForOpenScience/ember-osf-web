import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
// import ModelRegistry from 'ember-data/types/registries/model';
// import Account from 'ember-osf-web/models/account';
// import { ValidatedModelName } from 'ember-osf-web/models/osf-model';
import Addon from 'ember-osf-web/models/addon';
import DS from 'ember-data';
// import accountService from '../../services/accountService';

// const {Model} = DS;

export default class TokenAddon extends Component {
    addon!: Addon;
    account!: DS.Model;
    // profileUrl!: string;
    modalOpen = false;

    @service store!: DS.Store;

    constructor(...args: any[]) {
        super(...args);
        this.account = this.store.createRecord('account', {});
    }

    @action
    openModal() {
        this.set('modalOpen', true);
    }

    @action
    closeModal() {
        this.set('modalOpen', false);
    }

    @action
    onError() {
        console.log('There is an error?');
    }

    @action
    onSubmit(event: any) {
        console.log(event)
        // console.log(this.addon.id);
        // console.log('SAVED!');
        // console.log(account);
        // console.log(this.profileUrl);
    }
}
