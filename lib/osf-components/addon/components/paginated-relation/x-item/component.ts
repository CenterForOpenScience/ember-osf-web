import Component from '@ember/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import styles from './styles';
import layout from './template';

@localClassNames('PaginatedRelationXItem')
export default class PaginatedRelationXItem extends Component {
    layout = layout;
    styles = styles;
}
