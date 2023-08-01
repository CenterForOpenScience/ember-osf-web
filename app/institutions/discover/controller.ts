import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import CurrentUser from 'ember-osf-web/services/current-user';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import pathJoin from 'ember-osf-web/utils/path-join';
import config from 'ember-get-config';

export default class InstitutionDiscoverController extends Controller {
    @service currentUser!: CurrentUser;

    @tracked q?: string = '';
    @tracked sort?: string =  '-relevance';
    @tracked resourceType?: string = 'All';

    queryParams = ['q', 'page', 'sort', 'resourceType'];

    get defaultQueryOptions() {
        return {
            publisher: pathJoin(config.OSF.url, 'institutions', this.model.id),
        };
    }

    @action
    onSearch(queryOptions: Record<string, string>) {
        this.q = queryOptions.q;
        this.sort = queryOptions.sort;
        this.resourceType = queryOptions.resourceType;
    }
}
