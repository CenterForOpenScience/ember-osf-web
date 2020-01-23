import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import { formatDoiAsUrl } from 'ember-osf-web/utils/doi';
import { PublicationDoiManager } from 'osf-components/components/editable-field/publication-doi-manager/component';

import template from './template';

@tagName('')
@layout(template)
export default class NodePublicationDoi extends Component {
    manager!: PublicationDoiManager;

    @computed('manager.publicationDoi')
    get publicationDoiUrl() {
        return formatDoiAsUrl(this.manager.publicationDoi);
    }
}
