import faker from 'faker';

export default class FakeNode {
    id = faker.random.uuid();
    title = faker.lorem.sentence();
    public = false;
    isRegistration = false;
    wikiEnabled = false;
    currentUserIsContributor = false;
    userHasWritePermission = false;
    userHasReadPermission = false;
    parentId: string | null = null;
    rootId = this.id;
    links = {
        html: 'http://localhost:4200/fak3d',
    };

    belongsTo(relationship: string) {
        if (relationship === 'parent') {
            return { id: () => this.parentId };
        }
        if (relationship === 'root') {
            return { id: () => this.parentId };
        }
        throw new Error('Unknown relationship passed to FakeNode helper\'s belongsTo().');
    }
}
