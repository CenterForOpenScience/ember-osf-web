import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';
import { DraftRegistrationManager } from 'osf-components/components/registries/draft-registration-manager/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class RegistrationFormNavigationDropdown extends Component {
    @service analytics!: Analytics;

    // Required parameters
    schemaBlocks!: SchemaBlock[];
    draftManager!: DraftRegistrationManager;

    @computed('schemaBlocks')
    get blocksWithAnchor() {
        return this.schemaBlocks.filter(block =>
            block.blockType === 'page-heading' ||
            block.blockType === 'section-heading' ||
            block.blockType === 'subsection-heading' ||
            block.blockType === 'question-label');
    }
}
