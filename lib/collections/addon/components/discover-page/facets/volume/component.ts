import Collection from 'ember-osf-web/models/collection';
import SearchFacetChecklist from '../checklist/component';

class Volume extends SearchFacetChecklist {
    get modelAttribute(): keyof Collection { return 'volumeChoices'; }
    get filterProperty() { return 'volume'; }
}

export default Volume;
