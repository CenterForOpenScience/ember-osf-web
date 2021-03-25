import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { InstitutionsManager } from 'osf-components/components/editable-field/institutions-manager/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class InstitutionSelectList extends Component {
    // Required
    manager!: InstitutionsManager;

    // optional properties
    usePlaceholders: boolean = false;
    reloadList!: (page?: number) => void;
}
