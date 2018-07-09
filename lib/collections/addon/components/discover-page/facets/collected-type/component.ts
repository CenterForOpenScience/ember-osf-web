import Collection from 'ember-osf-web/models/collection';
import Checklist from '../checklist/component';

export default class CollectedType extends Checklist {
    attribute: keyof Collection = 'collectedTypeChoices';
}
