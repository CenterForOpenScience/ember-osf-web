import Controller from '@ember/controller';
import EmberObject from '@ember/object';

export default class TagsWidgetController extends Controller {
    taggable = EmberObject.create({
        tags: ['Tag 1', 'Tag 2', 'Tag 3'],
        save: () => null,
    });
}
