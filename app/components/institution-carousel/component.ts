import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import chunkArray from 'ember-osf-web/utils/chunk-array';

// TODO generalize this as carousel-somehting and add it to ember-osf, to be used by both providers
// and institutions lot of this logic is copied over from
// ember-osf-preprints/app/components/provider-carousel (h/t @pattisdr)
export default class InstitutionCarousel extends Component {
    @service store;

    itemsPerSlide: number = 5;
    institutions = A();

    @computed('institutions.[]', 'itemsPerSlide')
    get slides(this: InstitutionCarousel) {
        const institutions = this.get('institutions').slice();

        const cos = this.get('store').peekRecord('institution', 'cos');
        if (cos) {
            institutions.removeObject(cos);
            institutions.unshiftObject(cos);
        }

        return A(chunkArray(institutions, this.get('itemsPerSlide')));
    }

    @computed('institutions.length', 'itemsPerSlide')
    get columnOffset(this: InstitutionCarousel) {
        const numInstitutions = this.get('institutions.length');
        const itemsPerSlide = this.get('itemsPerSlide');
        return numInstitutions <= itemsPerSlide ? itemsPerSlide - numInstitutions - 1 : 1;
    }

    didInsertElement(this: InstitutionCarousel) {
        this.$('.carousel').carousel();
    }

    @action
    prev(this: InstitutionCarousel) {
        this.decrementProperty('index');
    }

    @action
    next(this: InstitutionCarousel) {
        this.incrementProperty('index');
    }
}
