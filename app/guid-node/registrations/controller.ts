import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import RegistrationMetaschema from 'ember-osf-web/models/registration-metaschema';

export default class GuidNodeRegistrations extends Controller {
    @service store!: DS.Store;

    page: number = 1;
    maxPage: number = 1;
    perPage: number = 10;
    tabOpen: string = 'registrations';
    draftPage: number = 1;
    draftMaxPage: number = 1;
    selectedSchema!: RegistrationMetaschema;
    registrations = [];
    draftRegistrations = [];
    metaschemas = [];
    schemas = [];

    getRegistrationTypes = task(function *(this: GuidNodeRegistrations) {
        let metaschemas = yield this.store.findAll('registration-metaschema');
        metaschemas = metaschemas.toArray();
        metaschemas.sort((a: RegistrationMetaschema, b: RegistrationMetaschema) => {
            return a.name.length > b.name.length;
        });
        this.set('selectedSchema', metaschemas.firstObject);
        this.set('metaschemas', metaschemas);
    });

    getDrafts = task(function *(this: GuidNodeRegistrations) {
        const page = this.draftPage;
        const { model } = this;
        const node = yield model.taskInstance;

        const draftRegistrations = yield node.queryHasMany('draftRegistrations', {
            page,
            embed: 'contributors',
            'page[size]': this.perPage,
        });
        this.setProperties({
            draftRegistrations,
            draftMaxPage: Math.ceil(draftRegistrations.meta.total / this.perPage),
        });
    }).restartable();

    getRegistrations = task(function *(this: GuidNodeRegistrations) {
        const { page, model } = this;
        const node = yield model.taskInstance;

        const registrations = yield node.queryHasMany('registrations', {
            page,
            embed: 'contributors',
            'page[size]': this.perPage,
        });
        this.setProperties({
            registrations,
            maxPage: Math.ceil(registrations.meta.total / this.perPage),
        });
    }).restartable();

    @action
    next(this: GuidNodeRegistrations, draft: boolean) {
        this.incrementProperty(draft ? 'draftPage' : 'page');
        if (draft) {
            this.get('getDrafts').perform();
        } else {
            this.get('getRegistrations').perform();
        }
    }

    @action
    previous(this: GuidNodeRegistrations, draft: boolean) {
        this.decrementProperty(draft ? 'draftPage' : 'page');
        if (draft) {
            this.get('getDrafts').perform();
        } else {
            this.get('getRegistrations').perform();
        }
    }

    @action
    newRegistration() {
        return 'No-empty-block';
    }
}

declare module '@ember/controller' {
    interface Registry {
        'guid-node/registrations': GuidNodeRegistrations;
    }
}
