import { service } from '@ember-decorators/service';
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { Registry as Services } from '@ember/service';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

/**
 * Modal that provides examples and explanation of Lucene Search syntax
 *
 * ```handlebars
 * {{search-help-modal
 *      isOpen=isOpen
 * }}
 * ```
 */
export default class SearchHelpModal extends Component {
    layout = layout;
    styles = styles;

    @service router!: Services['router'];

    isOpen: boolean = defaultTo(this.isOpen, false);

    examples: Array<{ q: string, text: string }> = [
        {
            q: 'repro*',
            text: 'repro*',
        },
        {
            q: 'brian+AND+title%3Amany',
            text: 'brian AND title:many',
        },
        {
            q: 'tags%3A%28psychology%29',
            text: 'tags:(psychology)',
        },
    ];

    get currentPath(): string {
        return getOwner(this).lookup('controller:application').currentPath;
    }
}
