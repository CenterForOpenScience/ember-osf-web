
import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'ember-get-config';
import Media from 'ember-responsive';

import Theme from 'ember-osf-web/services/theme';
import pathJoin from 'ember-osf-web/utils/path-join';

export default class PreprintDiscoverController extends Controller {
    @service store!: Store;
    @service theme!: Theme;
    @service media!: Media;

    @tracked q?: string = '';
    @tracked sort?: string =  '-relevance';

    queryParams = ['q', 'page', 'sort'];

    get showSidePanelToggle() {
        return this.media.isMobile || this.media.isTablet;
    }

    get defaultQueryOptions() {
        return {
            resourceType: 'osf:Preprints',
            // TODO: get this from the API?
            publisher: pathJoin(config.OSF.url, 'preprints', this.theme.id),
        };
    }

    @action
    onSearch(queryOptions: Record<string, string>) {
        this.q = queryOptions.q;
        this.sort = queryOptions.sort;
    }
}
