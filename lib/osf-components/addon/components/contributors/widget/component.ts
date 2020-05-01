import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import ContributorModel from 'ember-osf-web/models/contributor';

interface Args {
    thingWithContributors: {
        contributors: ContributorModel[],
    };
}

type WidgetMode = 'readonly' | 'edit' | 'add';

export class ContributorsWidget extends Component<Args> {
    @tracked widgetMode: WidgetMode = 'readonly';
}
