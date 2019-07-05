import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { action } from '@ember-decorators/object';
import { layout } from 'ember-osf-web/decorators/component';
import { DescriptionManager } from 'osf-components/components/editable-field/description-manager/component';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class NodeDescription extends Component {
    manager!: DescriptionManager;
    shouldTruncate: boolean = false;
    truncateDescription: boolean = true;

    setTruncate(element: Element, args: any[]) { // args: [description, this]
        const node = args[1];
        const { height, width } = element.getBoundingClientRect();
        if (height && width && height > 49) { // height limit should be (.hide {max-height} - 1)
            node.set('shouldTruncate', true);
            node.set('truncateDescription', true);
        } else {
            node.set('shouldTruncate', false);
        }
    }

    @action
    toggleFullDescription() {
        this.set('truncateDescription', !this.truncateDescription);
    }
}
