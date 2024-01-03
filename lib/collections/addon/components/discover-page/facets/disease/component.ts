import Collection from 'ember-osf-web/models/collection';
import SearchFacetChecklist from '../checklist/component';

class Disease extends SearchFacetChecklist {
    get modelAttribute(): keyof Collection {
        return 'diseaseChoices';
    }
    get filterProperty() {
        return 'disease';
    }
}

export default Disease;
