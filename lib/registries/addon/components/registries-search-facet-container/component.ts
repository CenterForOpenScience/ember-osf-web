import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
@classNames('panel', 'panel-default')
@localClassNames('SearchFacet')
export default class SearchFacetContainer extends Component {
    title!: string;
}
