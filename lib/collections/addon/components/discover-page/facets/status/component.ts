import Collection from 'ember-osf-web/models/collection';
import Checklist from '../checklist/component';

export default class Status extends Checklist {
    attribute: keyof Collection = 'statusChoices';
}
