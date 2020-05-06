import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import { DescriptionManager } from 'osf-components/components/editable-field/description-manager/component';

import styles from './styles';
import template from './template';

const heightLimit: number = 200; // height limit should be (.hide {max-height} - 1)

@tagName('')
@layout(template, styles)
export default class NodeDescription extends Component {
    manager!: DescriptionManager;
    shouldTruncate: boolean = false;
    truncateDescription: boolean = true;

    setTruncate(element: Element) {
        const height = element.clientHeight;
        if (height && height > (heightLimit - 1)) {
            this.set('shouldTruncate', true);
            this.set('truncateDescription', true);
        } else {
            this.set('shouldTruncate', false);
        }
    }

    @action
    toggleFullDescription() {
        this.set('truncateDescription', !this.truncateDescription);
    }
}
