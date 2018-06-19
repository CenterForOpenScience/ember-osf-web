import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import DS from 'ember-data';

import Metaschema from 'ember-osf-web/models/metaschema';

export default class GuidNodeRegistrations extends Controller {
    @service store!: DS.Store;

    page: number = 1;
    maxPage: number = 1;
    perPage: number = 10;

    draftPage: number = 1;
    draftMaxPage: number = 1;

    registrations = [];
    draftRegistrations = [];
    metaschemas = [];
    schemas = [];

    getRegistrationTypes = task(function *(this: GuidNodeRegistrations) {
        const metaschemas = yield this.store.query('metaschema', {version: '2.7'});
        this.set('metaschemas', metaschemas);
    });

    getDrafts = task(function *(this: GuidNodeRegistrations) {
        const page = this.draftPage;
        const model = this.model;
        const node = yield model.taskInstance;

        const draftRegistrations = yield node.queryHasMany('draftRegistrations', {
            page,
            embed: 'contributors',
            'page[size]': this.perPage},
        );
        this.setProperties({
            draftRegistrations,
            draftMaxPage: Math.ceil(draftRegistrations.meta.total / this.perPage),
        });
    }).restartable();

    getRegistrations = task(function *(this: GuidNodeRegistrations) {
        const page = this.page;
        const model = this.model;
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

    getSchemas = task(function *(this: GuidNodeRegistrations) {
        const schemas = yield this.store.findAll('metaschema');
        this.set('schemas', schemas.map((schema: Metaschema) => ({
            name: schema.get('name'),
            // @ts-ignore: schema is an ugly object, we just need to grab desctiption for now
            description: schema.get('schema.description'),
        })));
    });

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

    }

}

declare module '@ember/controller' {
    interface Registry {
        'guid-node/registrations': GuidNodeRegistrations;
    }
}
