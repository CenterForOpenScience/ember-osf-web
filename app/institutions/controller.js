import $ from 'jquery';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
    store: service(),
    sort: 'asc',
    page: 1,
    textValue: '',
    institutions: computed('model', 'sort', 'page', 'textValue', function() {
        const filtered = this.get('textValue.length') ? this.get('model').filter(i => i.get('name').toLowerCase().indexOf(this.get('textValue').toLowerCase()) !== -1) : this.get('model');
        const sorted = filtered.sortBy('name');
        if (this.get('sort') === 'des') { sorted.reverse(); }
        return sorted.slice(0, 10 * this.get('page'));
    }),
    hasMore: computed('institutions', 'model', 'textValue', function() {
        if (this.get('textValue.length')) {
            return this.get('institutions.length') !== this.get('model').filter(i => i.get('name').toLowerCase().indexOf(this.get('textValue').toLowerCase()) !== -1).length;
        }
        return this.get('institutions.length') !== this.get('model.length');
    }),
    actions: {
        next() {
            this.incrementProperty('page');
        },
        sort(sortOrder) {
            $('.sorting').removeClass('active');
            $(`.name${sortOrder}`).addClass('active');
            this.set('sort', sortOrder);
        },
        goTo(id) {
            window.location = id;
        },
    },
});
