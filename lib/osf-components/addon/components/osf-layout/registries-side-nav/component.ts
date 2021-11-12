import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { and, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import Toast from 'ember-toastr/services/toast';
import SchemaResponseModel, { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import Intl from 'ember-intl/services/intl';
import RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import NodeModel from 'ember-osf-web/models/node';
import RegistrationModel from 'ember-osf-web/models/registration';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

// interface Args {
//     registration: RegistrationModel;
//     selectedRevisionId: string;
// }

@tagName('')
@layout(template, styles)
export default class RegistriesSideNav extends Component { // <Args> {
    @service media!: Media;
    @service toast!: Toast;
    @service intl!: Intl;
    @service router!: RouterService;

    @tracked selectedSchema!: SchemaResponseModel;
    @tracked registration!: RegistrationModel;
    @tracked node!: NodeModel;

    toDelete: SchemaResponseModel | null = null;
    deleteEdit = false;

    reloadList?: (page?: number) => void; // bound by paginated-list

    // Optional params
    onLinkClicked?: () => void;
    // latestSchemaResponseId = this.selectedSchema.id;

    // Private properties
    shouldCollapse = false;

    @or('media.{isDesktop,isJumbo}')
    isCollapseAllowed!: boolean;

    @and('isCollapseAllowed', 'shouldCollapse')
    isCollapsed!: boolean;

    @action
    toggle() {
        this.toggleProperty('shouldCollapse');
    }

    @action
    delete() {
        this.set('deleteEdit', false);
        const edit = this.toDelete;
        if (!edit) {
            return;
        }
        this.set('toDelete', null);
        // edit.deleteRecord();
        edit.destroyRecord();
        this.router.transitionTo(
            'registries.overview.index',
            this.selectedSchema.get('id'),
            { queryParams: { state: RevisionReviewStates.RevisionInProgress } },
        // this.latestSchemaResponseId);
        );
        this.registration.reload();

    }
}
