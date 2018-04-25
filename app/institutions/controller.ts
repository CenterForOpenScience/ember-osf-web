import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';

export default class Institutions extends Controller {
    @service store;
    sortOrder: 'title' | '-title' = 'title';
    page = 1;
    textValue: string = '';

    @computed('model', 'sortOrder', 'page', 'textValue')
    get institutions(this: Institutions) {
        const filtered = this.textValue.length ? this.model.filter(i => i.get('name').toLowerCase().indexOf(this.textValue.toLowerCase()) !== -1) : this.model;
        const sorted = filtered.sortBy('name');
        if (this.sortOrder === '-title') { sorted.reverse(); }
        return sorted.slice(0, 10 * this.page);
    }

    @computed('institutions', 'model', 'textValue')
    get hasMore(this: Institutions): boolean {
        if (!this.institutions) {
            return false;
        }
        if (this.textValue.length) {
            //use link
            return this.institutions.length !== this.model.filter(i => i.get('name').toLowerCase().indexOf(this.textValue.toLowerCase()) !== -1).length;
        }
        return this.institutions.length !== this.model.length;

    }

    @action
    next(this: Institutions) {
        this.incrementProperty('page');
    }

    @action
    sort(this: Institutions, sortOrder: 'title' | '-title') {
        this.set('sortOrder', sortOrder);
    };

    @action
    goTo(id: string) {
        window.location = id;
    }
}

declare module '@ember/controller' {
    interface Registry {
        'institutions': Institutions;
    }
}
