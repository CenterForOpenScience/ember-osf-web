import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import { get } from '@ember/object';
import chunkArray from 'ember-osf-web/utils/chunk-array';

// TODO generalize this as carousel-somehting and add it to ember-osf, to be used by both providers
// and institutions lot of this logic is copied over from
// ember-osf-preprints/app/components/provider-carousel (h/t @pattisdr)
export default class InstitutionCarousel extends Component {
    @service store;
    @service analytics;

    itemsPerSlide: number = this.itemsPerSlide || 5;
    institutions = this.institutions || A([]);

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
        const numInstitutions = get(this, 'institutions').length;
        const itemsPerSlide = get(this, 'itemsPerSlide');
        return numInstitutions <= itemsPerSlide ? itemsPerSlide - numInstitutions : 1;
    }
}
