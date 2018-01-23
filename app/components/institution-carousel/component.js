import { computed } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

// TODO generalize this as carousel-somehting and add it to ember-osf, to be used by both providers and institutions
// lot of this logic is copied over from ember-osf-preprints/app/components/provider-carousel (h/t @pattisdr)
export default Component.extend({
    store: service(),
    itemsPerSlide: 5,
    institutions: A(),
    _institutions: computed('institutions', function() {
        const cos = this.get('store').peekRecord('institution', 'cos');
        const insts = this.get('institutions').slice();
        insts.removeObject(cos);
        insts.unshiftObject(cos);
        return insts;
    }),
    numSlides: computed('institutions', 'itemsPerSlide', function() {
        return Math.ceil(this.get('institutions.length') / this.get('itemsPerSlide'));
    }),
    slides: computed('numSlides', 'itemsPerSlide', function() {
        const numSlides = this.get('numSlides');
        const itemsPerSlide = this.get('itemsPerSlide');
        return new Array(numSlides).fill().map((_, i) => this.get('_institutions').slice(i * itemsPerSlide, (i * itemsPerSlide) + itemsPerSlide));
    }),
    columnOffset: computed('institutions', 'itemsPerSlide', function() {
        let offset = 'col-sm-offset-1';
        const numInstitutions = this.get('institutions.length');
        if (numInstitutions <= this.get('itemsPerSlide')) {
            switch (numInstitutions) {
            case 1:
                offset = 'col-sm-offset-5';
                break;
            case 2:
                offset = 'col-sm-offset-4';
                break;
            case 3:
                offset = 'col-sm-offset-3';
                break;
            case 4:
                offset = 'col-sm-offset-2';
                break;
            case 5:
                offset = 'col-sm-offset-1';
                break;
            default:
                offset = 'col-sm-offset-1';
            }
        }
        return offset;
    }),
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
});
