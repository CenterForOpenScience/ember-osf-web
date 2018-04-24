import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import chunkArray from 'ember-osf-web/utils/chunk-array';
import defaultTo from 'ember-osf-web/utils/default-to';

// TODO generalize this as carousel-somehting and add it to ember-osf, to be used by both providers
// and institutions lot of this logic is copied over from
// ember-osf-preprints/app/components/provider-carousel (h/t @pattisdr)
export default class InstitutionCarousel extends Component {
    @service store;
    @service analytics;

    itemsPerSlide: number = defaultTo(this.itemsPerSlide, 5);
    institutions = defaultTo(this.institutions, A([]));

    @computed('institutions.length', 'itemsPerSlide')
    get showControls() {
        return this.institutions.length > this.itemsPerSlide;
    }

    @computed('institutions.[]', 'itemsPerSlide')
    get slides() {
        const institutions = this.institutions.slice();
        const cos = this.store.peekRecord('institution', 'cos');

        if (cos) {
            institutions.removeObject(cos);
            institutions.unshiftObject(cos);
        }

        return A(chunkArray(institutions, this.itemsPerSlide));
    }

    @computed('institutions.length', 'itemsPerSlide')
    get columnOffset() {
        const numInstitutions = this.institutions.length;
        return numInstitutions < this.itemsPerSlide ? this.itemsPerSlide - numInstitutions : 1;
    }
}
