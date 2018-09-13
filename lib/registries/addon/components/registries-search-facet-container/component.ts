import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import layout from './template';

@classNames('panel', 'panel-default')
@localClassNames('SearchFacet')
export default class SearchFacetContainer extends Component {
    layout = layout;
    title!: string;
}
