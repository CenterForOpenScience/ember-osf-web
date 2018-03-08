import Component from '@ember/component';
import { inject as service } from '@ember/service';

/**
 * Component to allow easily transitioning to any GUID without leaving the
 * Ember app. Intended for dev use, testing routes which are not yet
 * configured to use Ember in the OSF backend.
 *
 * Displays an icon link/button that pops up a modal form.
 * @class zoom-to-guid
 */
export default class ZoomToGuid extends Component.extend({
    tagName: 'span',

    actions: {
        zoom(this: ZoomToGuid): void {
            this.get('router').transitionTo('resolve-guid', this.get('guid'));
            this.set('showModal', false);
        },
    },
}) {
    router = service('router');

    guid: string = '';
    showModal: boolean = false;
}
