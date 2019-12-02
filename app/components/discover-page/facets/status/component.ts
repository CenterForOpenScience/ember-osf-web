import Collection from 'ember-osf-web/models/collection';
import SearchFacetChecklist from '../checklist/component';

class Status extends SearchFacetChecklist {
    get modelAttribute(): keyof Collection { return 'statusChoices'; }
    get filterProperty() { return 'status'; }
}

export default Status;
