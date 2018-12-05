import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';

import { FacetContexts } from '../component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class FacetedSearch extends Component {
    facetContexts: FacetContexts = this.facetContexts;

    @requiredAction filterChanged!: () => void;
}
