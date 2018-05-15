import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import layout from './template';

/**
 * Component to allow easily transitioning to any GUID without leaving the
 * Ember app. Intended for dev use, testing routes which are not yet
 * configured to use Ember in the OSF backend.
 *
 * Displays an icon link/button that pops up a modal form.
 * @class zoom-to-guid
 */
@tagName('span')
export default class ZoomToGuid extends Component {
    layout = layout;

    @service router!: any;

    guid: string = '';
    showModal: boolean = false;

    @action
    zoom(this: ZoomToGuid): void {
        this.router.transitionTo('resolve-guid', this.guid);
        this.set('showModal', false);
    }
}
