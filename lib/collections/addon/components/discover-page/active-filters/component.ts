import Component from '@ember/component';
import { FacetContexts } from '../component';
import styles from './styles';
import layout from './template';

export default class ActiveFilters extends Component {
    layout = layout;
    styles = styles;

    facetContexts: FacetContexts = this.facetContexts;
}
