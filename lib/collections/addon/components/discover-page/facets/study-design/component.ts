import Collection from 'ember-osf-web/models/collection';
import SearchFacetChecklist from '../checklist/component';

class StudyDesign extends SearchFacetChecklist {
    get modelAttribute(): keyof Collection {
        return 'studyDesignChoices';
    }
    get filterProperty() {
        return 'studyDesign';
    }
}

export default StudyDesign;
