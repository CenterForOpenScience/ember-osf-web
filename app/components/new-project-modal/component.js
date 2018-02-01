import { computed } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
    store: service(),
    newNode: null,
    more: false,
    institutionsSelected: computed.oneWay('user.institutions'),

    actions: {
        select(institution) {
            this.set('institutionsSelected', this.get('institutionsSelected').slice());
            if (this.get('institutionsSelected').includes(institution)) {
                this.get('institutionsSelected').removeObject(institution);
            } else {
                this.get('institutionsSelected').pushObject(institution);
            }
        },
        selectAll() {
            this.set('institutionsSelected', this.get('user.institutions').slice());
        },
        removeAll() {
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
        pushEnter() {
            if (this.get('nodeTitle.length')) {
                this.get('createNode').perform();
            }
        },
    },

    findNodes: task(function* (term) {
        yield timeout(500);
        const user = yield this.get('user');
        const nodes = yield user.queryHasMany('nodes', { filter: { title: term } });
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
        const store = this.get('store');
        const node = yield store.createRecord('node', data).save();
        if (this.get('institutionsSelected.length')) {
            yield node.get('affiliatedInstitutions');
            this.get('institutionsSelected').forEach(inst => node.get('affiliatedInstitutions').pushObject(inst));
            yield node.save();
        }
        this.set('newNode', node);
    }).drop(),
});
