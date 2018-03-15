import { A } from '@ember/array';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import chunkArray from 'ember-osf-web/utils/chunk-array';

// TODO generalize this as carousel-somehting and add it to ember-osf, to be used by both providers
// and institutions lot of this logic is copied over from
// ember-osf-preprints/app/components/provider-carousel (h/t @pattisdr)
export default class InstitutionCarousel extends Component.extend({
    store: service(),

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
    filteredInstitutions = computed('institutions.[]', function() {
        const cos = this.get('store').peekRecord('institution', 'cos');
        const insts = this.get('institutions').slice();
        insts.removeObject(cos);
        insts.unshiftObject(cos);
        return insts;
    });

    slides = computed('institutions', 'itemsPerSlide', function() {
        return A(chunkArray(this.get('filteredInstitutions').toArray(), this.get('itemsPerSlide')));
    });

    columnOffset = computed('institutions.[]', 'itemsPerSlide', function() {
        const numInstitutions = this.get('institutions.length');
        const itemsPerSlide = this.get('itemsPerSlide');
        return numInstitutions <= itemsPerSlide ? itemsPerSlide - numInstitutions - 1 : 1;
    });
}
