import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
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

    @computed('singleSubjectManager.subject')
    get isPlaceholder() {
        return typeof this.singleSubjectManager.subject === 'undefined';
    }

    ensureChildrenLoaded() {
        const {
            shouldShowChildren,
            singleSubjectManager: {
                children,
                isLoadingChildren,
            },
        } = this;

        if (shouldShowChildren && !children && !isLoadingChildren) {
            this.singleSubjectManager.loadChildren();
        }
    }

    @action
    toggleChildren() {
        this.toggleProperty('shouldShowChildren');
        this.ensureChildrenLoaded();
    }
}
