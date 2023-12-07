import Collection from 'ember-osf-web/models/collection';
import SearchFacetChecklist from '../checklist/component';

class DataType extends SearchFacetChecklist {
    get modelAttribute(): keyof Collection {
        return 'dataTypeChoices';
    }
    get filterProperty() {
        return 'dataType';
    }
}

export default DataType;
