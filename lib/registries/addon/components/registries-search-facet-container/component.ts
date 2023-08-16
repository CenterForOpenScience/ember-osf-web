import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
@localClassNames('SearchFacet')
export default class SearchFacetContainer extends Component {
    title!: string;
}
