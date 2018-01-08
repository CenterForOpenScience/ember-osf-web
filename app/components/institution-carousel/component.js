import Component from '@ember/component';
import Ember from 'ember';

// TODO generalize this as carousel-somehting and add it to ember-osf, to be used by both providers and institutions
// lot of this logic is copied over from ember-osf-preprints/app/components/provider-carousel (h/t @pattisdr)
export default Component.extend({
    institutions: Ember.A(),
    itemsPerSlide: 5,
    numSlides: Ember.computed('institutions', 'itemsPerSlide', function() {
        return Math.ceil(this.get('institutions.length') / this.get('itemsPerSlide'));
    }),
    slides: Ember.computed('numSlides', 'itemsPerSlide', function() {
        const numSlides = this.get('numSlides');
        const itemsPerSlide = this.get('itemsPerSlide');
        return new Array(numSlides).fill().map((_, i) => this.get('institutions').slice(i * itemsPerSlide, (i * itemsPerSlide) + itemsPerSlide));
    }),
    columnOffset: Ember.computed('institutions', 'itemsPerSlide', function() {
        let offset;
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
        Ember.$('.carousel').carousel();
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
