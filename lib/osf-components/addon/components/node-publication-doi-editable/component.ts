import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { DOIPlaceholder, DOIUrlPrefix } from 'ember-osf-web/utils/doi';
import { PublicationDoiManager } from 'osf-components/components/editable-field/publication-doi-manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class NodePublicationDoiEditable extends Component {
    // Private
    manager!: PublicationDoiManager;

    doiPlaceholder = DOIPlaceholder;

    doiUrlPrefix = DOIUrlPrefix;
}
