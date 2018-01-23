import { observer } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
    store: service(),
    newNode: null,
    more: false,
    institutionsSelected: A([]),
    _initialSelection: observer('user.institutions', function() {
        this.get('user.institutions').forEach(inst => inst.set('selected', true));
        this.set('institutionsSelected', this.get('user.institutions').slice());
    }),

    actions: {
        select(institution) {
            const i = this.get('institutionsSelected').indexOf(institution);
            if (i !== -1) {
                institution.set('selected', false);
                this.get('institutionsSelected').splice(i, 1);
            } else {
                institution.set('selected', true);
                this.get('institutionsSelected').push(institution);
            }
        },
        selectAll() {
            this.get('user.institutions').forEach(inst => inst.set('selected', true));
            this.set('institutionsSelected', this.get('user.institutions').slice());
        },
        removeAll() {
            this.get('user.institutions').forEach(inst => inst.set('selected', false));
            this.set('institutionsSelected', A([]));
        },
        toggleMore() {
            this.toggleProperty('more');
        },
        closeModal() {
            this.set('newNode', null);
            this.get('closeModal')();
        },
        reload() {
            this.set('newNode', null);
            this.get('closeModal')();
            this.get('reloadNodes')();
        },
    },

    findNodes: task(function* (term) {
        yield timeout(500);
        const user = yield this.get('user');
        const nodes = yield user.queryHasMany('nodes', { 'filter[title]': term });
        return nodes;
    }).restartable(),

    createNode: task(function* () {
        const data = {
            public: false,
            category: 'project',
            title: this.get('nodeTitle'),
            description: this.get('description'),
        };
        if (this.get('templateFrom')) {
            data.templateFrom = this.get('templateFrom.id');
        }
        const store = yield this.get('store');
        const node = yield store.createRecord('node', data).save();
        if (this.get('institutionsSelected.length')) {
            yield node.get('affiliatedInstitutions');
            this.get('institutionsSelected').forEach(inst => node.get('affiliatedInstitutions').pushObject(inst));
            yield node.save();
        }
        this.set('newNode', node);
    }),
});
