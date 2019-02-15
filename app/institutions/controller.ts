import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';

import Institution from 'ember-osf-web/models/institution';
import Analytics from 'ember-osf-web/services/analytics';

export default class Institutions extends Controller {
    @service store!: DS.Store;
    @service analytics!: Analytics;

    sortOrder: 'title' | '-title' = 'title';
    page = 1;
    textValue: string = '';

    trackFilter = task(function *(this: Institutions) {
        yield timeout(1000);
        this.analytics.track('list', 'filter', 'Institutions - Search');
    }).restartable();

    @computed('model', 'textValue')
    get filtered(): Institution[] {
        if (!this.textValue.length) {
            return this.model;
        }
        return this.model.filter((institution: Institution) =>
            institution.name.toLowerCase().indexOf(this.textValue.toLowerCase()) !== -1);
    }

    @computed('filtered', 'sortOrder', 'page', 'textValue')
    get institutions(): Institution[] {
        const sorted = this.filtered.sortBy('name');
        if (this.sortOrder === '-title') { sorted.reverse(); }
        return sorted.slice(0, 10 * this.page);
    }

    @computed('institutions', 'filtered', 'textValue')
    get hasMore(): boolean {
        if (!this.institutions) {
            return false;
        }
        return this.institutions.length !== this.filtered.length;
    }

    @action
    next() {
        this.incrementProperty('page');
    }

    @action
    sort(this: Institutions, sortOrder: 'title' | '-title') {
        this.set('sortOrder', sortOrder);
    }
}

declare module '@ember/controller' {
    interface Registry {
        'institutions': Institutions;
    }
}
