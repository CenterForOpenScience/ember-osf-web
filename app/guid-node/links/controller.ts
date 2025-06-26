import Controller from '@ember/controller';
import { Permission } from 'ember-osf-web/models/osf-model';

export default class GuidNodeLinksController extends Controller {
    get currentUserCanEdit() {
        return this.model.node.currentUserPermissions.includes(Permission.Write);
    }

    get shouldShowEmptyPage() {
        return this.model.configuredLinkAddons.every((item: { targetUrl: string | null }) => item.targetUrl === null);
    }
}
