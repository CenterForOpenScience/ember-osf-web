import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import { DraftRegistrationManager } from 'osf-components/components/registries/draft-registration-manager/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class RegistrationFormNavigationDropdown extends Component {
    // Required parameters
    schemaBlocks!: SchemaBlock[];
    draftManager!: DraftRegistrationManager;

    @computed('schemaBlocks')
    get blocksWithAnchor() {
        return this.schemaBlocks.filter(({ blockType, displayText }) =>
            (
                blockType === 'page-heading' ||
                blockType === 'section-heading' ||
                blockType === 'subsection-heading' ||
                blockType === 'question-label'
            ) && displayText);
    }
}
