import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

interface InstitutionsManager {
    reloadList?: (page?: number) => void;
    addInstitution: (institution: Institution) => void;
    removeInstitution: (institution: Institution) => void;
    affiliatedList: Institution[];
    shouldDisableButtons?: boolean;
}

@layout(template, styles)
export default class InstitutionSelectList extends Component {
    // Required
    node!: Node;
    manager!: InstitutionsManager;

    // optional properties
    usePlaceholders: boolean = defaultTo(this.usePlaceholders, false);
    reloadList!: (page?: number) => void;
}
