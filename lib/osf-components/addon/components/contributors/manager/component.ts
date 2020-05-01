import Component from '@glimmer/component';

import ContributorModel from 'ember-osf-web/models/contributor';

interface Args {
    contributors: ContributorModel[];
}

export class ContributorsManager extends Component<Args> {
}
