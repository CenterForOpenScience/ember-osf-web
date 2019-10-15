import Route from '@ember/routing/route';

import { DefaultPage } from 'ember-osf-web/utils/page-param';

export default class DraftIndexRoute extends Route {
    beforeModel() {
        const params: { id?: string } = this.paramsFor(this.routeName);
        return this.replaceWith('drafts.draft', params.id, DefaultPage);
    }
}
