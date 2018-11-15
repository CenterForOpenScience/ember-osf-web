import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import Institution from 'ember-osf-web/models/institution';
import Analytics from 'ember-osf-web/services/analytics';
import chunkArray from 'ember-osf-web/utils/chunk-array';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

// TODO generalize this as carousel-somehting and add it to ember-osf, to be used by both providers
// and institutions lot of this logic is copied over from
// ember-osf-preprints/app/components/provider-carousel (h/t @pattisdr)
@layout(template, styles)
@localClassNames('InstitutionCarousel')
export default class InstitutionCarousel extends Component {
    @service store!: DS.Store;
    @service analytics!: Analytics;

    itemsPerSlide: number = defaultTo(this.itemsPerSlide, 5);
    institutions: Institution[] = defaultTo(this.institutions, A([]));

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
