import Component from '@ember/component';
import { inject as service } from '@ember/service';

import Institution from 'ember-osf-web/models/institution';
import CurrentUser from 'ember-osf-web/services/current-user';

// @ts-ignore
// BEGIN-SNIPPET editable-field.institution-manager-interface.ts
interface InstitutionsManager {
    reloadList?: (page?: number) => void;
    addInstitution: (institution: Institution) => void;
    removeInstitution: (institution: Institution) => void;
    affiliatedList: Institution[];
}
// END-SNIPPET

export default class DemoEditableInstitutions extends Component {
    @service currentUser!: CurrentUser;
}
