import Collection from 'ember-osf-web/models/collection';
import SearchFacetChecklist from '../checklist/component';

class GradeLevels extends SearchFacetChecklist {
    get modelAttribute(): keyof Collection {
        return 'gradeLevelsChoices';
    }
    get filterProperty() {
        return 'gradeLevels';
    }
}

export default GradeLevels;
