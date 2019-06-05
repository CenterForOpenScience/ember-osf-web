import Component from '@ember/component';

import { attribute } from '@ember-decorators/component';
import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

interface TagsManager {
    tags: string[];
    removeTag: (index: number) => void;
    addTag: (tag: string) => void;
    clickTag: (tag: string) => void;
    readOnly: boolean;
}

@layout(template, styles)
export default class RegistriesTagsWidget extends Component.extend({ styles }) {
    // Required
    manager!: TagsManager;
    registration!: Registration;

    // Optional
    readOnly?: boolean = defaultTo(this.readOnly, false);

    // Private
    @attribute('data-analytics-scope')
    analyticsScope: string = defaultTo(this.analyticsScope, 'Tags');
}
