import Ember from 'ember';
import Component from '@ember/component';

export default Component.extend({
    store: Ember.inject.service(),
    institutionsSelected: Ember.A([]),
    done: false,
    more: false,
    _initialSelection: Ember.observer('user.institutions', function() {
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
            this.set('institutionsSelected', Ember.A([]));
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
