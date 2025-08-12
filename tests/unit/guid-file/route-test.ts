import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TestContext } from 'ember-test-helpers';
import sinon from 'sinon';

import { Permission } from 'ember-osf-web/models/osf-model';
import GuidFileRoute from 'ember-osf-web/guid-file/route';
import { ConnectedStorageOperationNames } from 'ember-osf-web/models/addon-operation-invocation';

interface RouteTestContext extends TestContext {
    route: GuidFileRoute;
    sandbox: sinon.SinonSandbox;
}

module('Unit | Route | guid-file', function(hooks) {
    setupTest(hooks);
    setupMirage(hooks);

    // Helper functions
    function createFileWithMetadata(
        target: any,
        provider: string,
        name = `${provider}-file.txt`,
        metadataOverrides: any = {},
    ) {
        const file = server.create('file', {
            target,
            provider,
            name,
        });

        server.create('custom-file-metadata-record', {
            id: file.id,
            ...metadataOverrides,
        });

        return file;
    }

    function createNodeWithPermissions(permissions: Permission[] = [Permission.Read], traits: string[] = []) {
        return server.create('node', {
            currentUserPermissions: permissions,
        }, ...traits);
    }

    function setupFeatures(context: RouteTestContext, features: Record<string, boolean> = {}) {
        const featuresService = context.owner.lookup('service:features');
        featuresService.setup(features);
    }

    hooks.beforeEach(function(this: RouteTestContext) {
        this.sandbox = sinon.createSandbox();
        this.route = this.owner.lookup('route:guid-file');
        server.create('user', 'loggedIn');

        const features = this.owner.lookup('service:features');
        features.setup({});
    });

    hooks.afterEach(function(this: RouteTestContext) {
        this.sandbox.restore();
    });

    test('it exists', function(this: RouteTestContext, assert) {
        assert.ok(this.route, 'Route exists');
    });

    test('loads OSF storage file', async function(this: RouteTestContext, assert) {
        const node = createNodeWithPermissions([Permission.Read], ['withContributors', 'withAffiliatedInstitutions']);
        const file = createFileWithMetadata(node, 'osfstorage', 'test-file.txt', {
            title: 'Test Metadata Title',
            description: 'Test description',
        });

        const model = await this.route.model({ guid: file.id });

        assert.ok(model, 'Model loaded successfully');
        assert.equal(model?.constructor.name, 'OsfStorageFile', 'Correct OSF storage file type created');
        assert.equal(model?.fileModel.id, file.id, 'File model matches expected ID');
        assert.equal(this.route.metadata.id, file.id, 'Metadata loaded correctly');
    });

    test('loads external storage files for all providers', async function(this: RouteTestContext, assert) {
        const providers = [
            { provider: 'bitbucket', expectedClass: 'BitbucketFile' },
            { provider: 'box', expectedClass: 'BoxFile' },
            { provider: 'dataverse', expectedClass: 'DataverseFile' },
            { provider: 'dropbox', expectedClass: 'DropboxFile' },
            { provider: 'figshare', expectedClass: 'FigshareFile' },
            { provider: 'github', expectedClass: 'GithubFile' },
            { provider: 'gitlab', expectedClass: 'GitlabFile' },
            { provider: 'googledrive', expectedClass: 'GoogleDriveFile' },
            { provider: 'onedrive', expectedClass: 'OneDriveFile' },
            { provider: 'owncloud', expectedClass: 'OwnCloudFile' },
            { provider: 's3', expectedClass: 'S3File' },
        ];

        for (const { provider, expectedClass } of providers) {
            const node = createNodeWithPermissions();
            const file = createFileWithMetadata(node, provider);

            const model = await this.route.model({ guid: file.id });

            assert.ok(model, `${provider} file loaded successfully`);
            assert.equal(model?.constructor.name, expectedClass, `Correct ${provider} file type created`);
            assert.equal(model?.fileModel.id, file.id, `${provider} file model ID matches`);
        }
    });

    test('loads service file when gravy_waffle feature is enabled', async function(this: RouteTestContext, assert) {
        setupFeatures(this, { gravy_waffle: true });

        const node = createNodeWithPermissions([Permission.Admin]);
        const file = createFileWithMetadata(node, 'azureblobstorage', 'service-file.txt');
        const resourceReference = server.create('resource-reference', { id: node.id });

        const azureblobstorage = server.create('external-storage-service', {
            id: 'azureblobstorage',
            displayName: 'Azure Blob Storage',
            supportedFeatures: [],
        });
        server.create('configured-storage-addon', {
            id: 'azureblobstorage',
            displayName: 'Azure Blob Storage',
            rootFolder: '/woot/',
            externalServiceName: 'azureblobstorage',
            externalStorageService: azureblobstorage,
            authorizedResource: resourceReference,
            connectedOperationNames: [
                ConnectedStorageOperationNames.HasRevisions,
            ],
        });

        const model = await this.route.model({ guid: file.id });

        assert.ok(model, 'Model loaded successfully with gravy_waffle');
        assert.equal(model?.constructor?.name, 'ServiceFile', 'ServiceFile created when configured addon exists');
        assert.equal(model?.fileModel?.id, file.id, 'ServiceFile has correct file model');
    });

    test('redirects to registration page when target is registration', async function(this: RouteTestContext, assert) {
        const registration = server.create('registration', {
            withdrawn: true,
            currentUserPermissions: [Permission.Read],
        });

        const file = createFileWithMetadata(registration, 'osfstorage', 'registration-file.txt');

        const transitionToStub = this.sandbox.stub(this.route, 'transitionTo');

        await this.route.model({ guid: file.id });

        assert.ok(
            (transitionToStub as any).calledWith('guid-registration', registration.id),
            'Redirects to registration page for withdrawn registration',
        );
    });

    test('redirects to not-found for unknown provider', async function(this: RouteTestContext, assert) {
        const node = createNodeWithPermissions();
        const file = createFileWithMetadata(node, 'unknown-provider', 'unknown-file.txt');

        const transitionToStub = this.sandbox.stub(this.route, 'transitionTo');

        await this.route.model({ guid: file.id });

        assert.ok(
            (transitionToStub as any).calledWith('not-found', file.id),
            'Redirects to not-found for unknown provider',
        );
    });

    test('handles gravy_waffle feature disabled correctly', async function(this: RouteTestContext, assert) {
        setupFeatures(this, { gravy_waffle: false });

        const node = createNodeWithPermissions();
        const file = createFileWithMetadata(node, 'github', 'feature-disabled-file.txt');

        const model = await this.route.model({ guid: file.id });

        assert.ok(model, 'Model loaded successfully');
        assert.equal(model?.constructor?.name, 'GithubFile', 'Uses provider-specific file when gravy_waffle disabled');
    });
});
