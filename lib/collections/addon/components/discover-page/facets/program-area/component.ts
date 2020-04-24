import Collection from 'ember-osf-web/models/collection';
import SearchFacetChecklist from '../checklist/component';

class ProgramArea extends SearchFacetChecklist {
    get modelAttribute(): keyof Collection { return 'programAreaChoices'; }

    get filterProperty() { return 'programArea'; }
}

export default ProgramArea;
