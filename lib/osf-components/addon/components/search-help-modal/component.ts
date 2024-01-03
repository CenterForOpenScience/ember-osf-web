import { getOwner } from '@ember/application';
import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

/**
 * Modal that provides examples and explanation of Lucene Search syntax
 *
 * ```handlebars
 * {{search-help-modal
 *      isOpen=isOpen
 * }}
 * ```
 */

interface InputArgs {
    isOpen: false;
    onClose: () => void;
}

export default class SearchHelpModal extends Component<InputArgs> {
    @service router!: RouterService;

    get currentPath(): string {
        return getOwner(this).lookup('controller:application').currentPath;
    }
}
