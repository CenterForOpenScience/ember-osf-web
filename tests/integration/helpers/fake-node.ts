import defaultTo from 'ember-osf-web/utils/default-to';
import faker from 'faker';

export default class FakeNode {
    id: string = faker.random.uuid();
    title: string = faker.lorem.sentence();
    public: boolean = false;
    isRegistration: boolean = false;
    wikiEnabled: boolean = false;
    currentUserIsContributor: boolean = false;
    userHasWritePermission: boolean = false;
    userHasReadPermission: boolean = false;
    parentId: string | null = null;
    rootId: string = defaultTo(this.rootId, this.id);
    links = {
        html: 'http://localhost:4200/fak3d',
    };

    belongsTo(relationship: string) {
        if (relationship === 'parent') {
            return { id: () => this.parentId };
        } else if (relationship === 'root') {
            return { id: () => this.parentId };
        }
        throw new Error('Unknown relationship passed to FakeNode helper\'s belongsTo().');
    }
}
