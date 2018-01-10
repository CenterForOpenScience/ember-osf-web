import { observer } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
    store: service(),
    done: false,
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
            this.set('done', false);
            this.get('closeModal')();
        },
        reload() {
            window.location.reload(true);
        },
        createNode() {
            const data = {
                public: false,
                category: 'project',
                title: this.get('nodeTitle'),
                description: this.get('description'),
            };
            if (this.get('templateFrom')) {
                data.templateFrom = this.get('templateFrom.id');
            }
            // TODO(hmoco): refactor using a task
            this.get('store').createRecord('node', data).save().then((node) => {
                if (this.get('institutionsSelected.length')) {
                    node.get('affiliatedInstitutions').then(() => {
                        this.get('institutionsSelected').forEach(inst => node.get('affiliatedInstitutions').pushObject(inst));
                        node.save().then(() => {
                            this.set('done', node.get('id'));
                        });
                    });
                } else {
                    this.set('done', node.get('id'));
                }
            });
        },
    },
});
