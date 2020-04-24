import Collection from 'ember-osf-web/models/collection';
import SearchFacetChecklist from '../checklist/component';

class Issue extends SearchFacetChecklist {
    get modelAttribute(): keyof Collection { return 'issueChoices'; }

    get filterProperty() { return 'issue'; }
}

export default Issue;
