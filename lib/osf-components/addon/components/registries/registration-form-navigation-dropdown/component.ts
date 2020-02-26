import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { underscore } from '@ember/string';

import { layout } from 'ember-osf-web/decorators/component';
import { DraftMetadataProperties } from 'ember-osf-web/models/draft-registration';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class RegistrationFormNavigationDropdown extends Component {
    // Required parameters
    schemaBlocks!: SchemaBlock[];

    // Private properties
    metadataFields: string[] = Object.values(DraftMetadataProperties)
        .filter(prop => prop !== DraftMetadataProperties.NodeLicenseProperty)
        .map(underscore);

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

    didReceiveAttrs() {
        assert('Registries::RegistrationFormNavigationDropdown requires @schemablocks!', Boolean(this.schemaBlocks));
    }
}
