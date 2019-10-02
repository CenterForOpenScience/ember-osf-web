import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { not } from '@ember-decorators/object/computed';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { SingleSubjectManager } from 'osf-components/components/subjects/manager/single/component';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class RenderItem extends Component {
    // required
    singleSubjectManager!: SingleSubjectManager;

    // private
    shouldShowChildren: boolean = false;

    @not('singleSubjectManager.isLoaded')
    isPlaceholder!: boolean;

    @action
    toggleChildren() {
        this.toggleProperty('shouldShowChildren');

        if (this.shouldShowChildren) {
            this.singleSubjectManager.ensureChildrenLoaded();
        }
    }
}
