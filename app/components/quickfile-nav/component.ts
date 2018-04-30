import { attribute, classNames, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import User from 'ember-osf-web/models/user';

@classNames('row')
@tagName('nav')
export default class QuickfileNav extends Component {
    @attribute role = 'navigation';

    user?: User;
}
