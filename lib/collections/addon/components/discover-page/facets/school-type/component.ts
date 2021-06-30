import Collection from 'ember-osf-web/models/collection';
import SearchFacetChecklist from '../checklist/component';

class SchoolType extends SearchFacetChecklist {
    get modelAttribute(): keyof Collection {
        return 'schoolTypeChoices';
    }
    get filterProperty() {
        return 'schoolType';
    }
}

export default SchoolType;
