import Store from '@ember-data/store';
import { A } from '@ember/array';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import Institution from 'ember-osf-web/models/institution';
import Analytics from 'ember-osf-web/services/analytics';
import chunkArray from 'ember-osf-web/utils/chunk-array';

import styles from './styles';
import template from './template';

// TODO generalize this as carousel-somehting and add it to ember-osf, to be used by both providers
// and institutions lot of this logic is copied over from
// ember-osf-preprints/app/components/provider-carousel (h/t @pattisdr)
@layout(template, styles)
@localClassNames('InstitutionCarousel')
export default class InstitutionCarousel extends Component {
    @service store!: Store;
    @service analytics!: Analytics;

    itemsPerSlide: number = 5;
    institutions: Institution[] = A([]);

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
