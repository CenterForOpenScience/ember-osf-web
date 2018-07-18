import Component from '@ember/component';
import requiredAction from 'ember-osf-web/decorators/required-action';
import { FacetContexts } from '../component';
import styles from './styles';
import layout from './template';

export default class FacetedSearch extends Component {
    layout = layout;
    styles = styles;

    facetContexts: FacetContexts = this.facetContexts;

    @requiredAction filterChanged!: () => void;
}
