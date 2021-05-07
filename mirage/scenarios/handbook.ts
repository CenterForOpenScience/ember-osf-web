import { ModelInstance, Server } from 'ember-cli-mirage';
import faker from 'faker';

import FileProvider from 'ember-osf-web/models/file-provider';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

export function handbookScenario(server: Server, currentUser: ModelInstance<User>) {
    // ValidatedModelForm
    server.create('node', {
        id: 'extng',
        title: 'Existing node!',
        description: 'Passing in `model=this.node` tells the form to make changes to this model instance directly.',
    });

    // EditableField
    const editable = server.create('registration', {
        id: 'editj',
        registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        currentUserPermissions: Object.values(Permission),
    }, 'withAffiliatedInstitutions');

    server.create('contributor', { users: currentUser, node: editable });

    // ContributorList
    for (const contributorCount of [1, 2, 3, 23]) {
        const node = server.create('node', { id: `clst${contributorCount}` });
        server.createList('contributor', contributorCount, { node });
    }

    // AncestryDisplay
    const parent = server.create('node', { id: 'ezcuj', title: faker.lorem.sentences(6) });
    const child = server.create('node', { parent, id: 'ezcuj1', title: faker.lorem.sentences(5) });
    const grandChild = server.create('node', { parent: child, root: parent, id: 'ezcuj2' });
    server.create('node', { parent: grandChild, root: parent, id: 'ezcuj3' });

    // Files Widget
    const fileWidgetNode = server.create('node',
        { id: 'ogst', currentUserPermissions: Object.values(Permission) }, 'withFiles');

    const folderA = server.create('file', { target: fileWidgetNode }, 'asFolder');

    const fileProviders = fileWidgetNode.files.models as Array<ModelInstance<FileProvider>>;
    const [osfstorage] = fileProviders;
    const providerFiles = osfstorage.rootFolder.files.models;

    osfstorage.rootFolder.update({
        files: [...providerFiles, folderA],
    });

    server.createList('file', 15, { target: fileWidgetNode, parentFolder: folderA });
    const folderB = server.create('file', { target: fileWidgetNode, parentFolder: folderA }, 'asFolder');

    server.createList('file', 2, { target: fileWidgetNode, parentFolder: folderB });
    const folderC = server.create('file', { target: fileWidgetNode, parentFolder: folderB }, 'asFolder');

    server.createList('file', 3, { target: fileWidgetNode, parentFolder: folderC });
    server.create('file', { target: fileWidgetNode, parentFolder: folderC }, 'asFolder');

    // SubjectWidgets
    server.createList('subject', 10, 'withChildren');
    const provider = server.schema.registrationProviders.find('osf');
    provider.update({
        subjects: server.schema.subjects.all().models,
    });
    server.create('registration', { id: 'subj' }, 'withSubjects');

    // SchemaBlock Renderer
    const schemaNode = server.create(
        'node',
        { id: 'dslt', currentUserPermissions: Object.values(Permission) },
        'withFiles',
    );

    const folder = server.create('file', { target: schemaNode }, 'asFolder');
    const providers = fileWidgetNode.files.models as Array<ModelInstance<FileProvider>>;
    const storage = providers[0];
    const providersFiles = storage.rootFolder.files.models;
    storage.update({
        files: [...providersFiles, folder],
    });
    server.createList('file', 15, { target: schemaNode, parentFolder: folder });
    server.createList('contributor', 23, { node: schemaNode });
}
