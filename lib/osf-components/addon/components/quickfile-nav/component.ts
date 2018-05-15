import { attribute, classNames, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import User from 'ember-osf-web/models/user';
import styles from './styles';
import layout from './template';

@classNames('row')
@tagName('nav')
export default class QuickfileNav extends Component {
    layout = layout;
    styles = styles;

    @attribute role = 'navigation';

    user?: User;
}
