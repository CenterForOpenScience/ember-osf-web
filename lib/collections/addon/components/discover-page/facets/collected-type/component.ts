import Collection from 'ember-osf-web/models/collection';
import SearchFacetChecklist from '../checklist/component';

class CollectedType extends SearchFacetChecklist {
    get modelAttribute(): keyof Collection { return 'collectedTypeChoices'; }
    get filterProperty() { return 'collectedType'; }
}

export default CollectedType;
