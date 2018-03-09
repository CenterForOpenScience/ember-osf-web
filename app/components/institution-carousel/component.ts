import { A } from '@ember/array';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import chunkArray from 'ember-osf-web/utils/chunk-array';

// TODO generalize this as carousel-somehting and add it to ember-osf, to be used by both providers
// and institutions lot of this logic is copied over from
// ember-osf-preprints/app/components/provider-carousel (h/t @pattisdr)
export default class InstitutionCarousel extends Component.extend({
    store: service('store'),

    itemsPerSlide: 5,

    institutions: A(),

    didInsertElement() {
        this.$('.carousel').carousel();
    },

    actions: {
        prev() {
            this.decrementProperty('index');
        },
        next() {
            this.incrementProperty('index');
        },
    },
}) {
    slides = computed('institutions.[]', 'itemsPerSlide', function(this: InstitutionCarousel) {
        const institutions = this.get('institutions').slice();

        const cos = this.get('store').peekRecord('institution', 'cos');
        if (cos) {
            institutions.removeObject(cos);
            institutions.unshiftObject(cos);
        }

        return A(chunkArray(institutions, this.get('itemsPerSlide')));
    });

    columnOffset = computed('institutions.length', 'itemsPerSlide', function() {
        const numInstitutions = this.get('institutions.length');
        const itemsPerSlide = this.get('itemsPerSlide');
        return numInstitutions <= itemsPerSlide ? itemsPerSlide - numInstitutions - 1 : 1;
    });
}
