import Ember from 'ember';
import Component from '@ember/component';

export default Component.extend({
    store: Ember.inject.service(),
    done: false,
    more: false,
    actions: {
        toggleMore() {
            this.toggleProperty('more');
        },
        closeModal() {
            this.set('done', false);
            this.get('closeModal')();
        },
        createNode() {
            const data = {
                public: false,
                category: 'project',
                title: this.get('nodeTitle'),
                description: this.get('description'),
            };
            if (this.get('templateFrom')) {
                data.templateFrom = this.get('templateFrom');
            }
            this.get('store').createRecord('node', data).save().then((node) => {
                if (this.get('institutionsSelected')) {
                    node.set('affiliatedInstitutions', this.get('institutionsSelected')).then(() => {
                        this.set('done', node.get('id'));
                    });
                } else {
                    this.set('done', node.get('id'));
                }
            });
        },
    },
});
