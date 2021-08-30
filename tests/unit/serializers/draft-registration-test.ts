import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Serializer | draft-registration', hooks => {
    setupTest(hooks);

    test('it serializes records', function(assert) {
        const record = run(() => this.owner.lookup('service:store').createRecord('draft-registration'));
        const serializedRecord = record.serialize();
        assert.ok(serializedRecord);
    });

    test('it serializes registrationResponses', function(assert) {
        const store = this.owner.lookup('service:store');
        const attributes = {
            name: 'FakefileOne.txt',
            links: {
                html: 'fakeHtmlLink',
                download: 'fakeDownloadLink',
            },
            extra: {
                hashes: {
                    sha256: 'fakeSha256',
                },
            },
        };
        const fileOne = store.push({
            data: {
                id: '5dcdb5ea12990200098ba5c7',
                type: 'file',
                materializedPath: 'fakePath',
                attributes,
            },
        });
        const draft = store.createRecord('draft-registration', {
            registrationResponses: {
                '__responseKey_q3|uploader': [fileOne],
            },
        });
        const serialized = draft.serialize();
        assert.ok(serialized);

        const { registration_responses: registrationResponses } = serialized.data.attributes;
        assert.ok(registrationResponses);
        const [serializedFile] = registrationResponses['q3.uploader'];
        assert.ok(['file_hashes', 'file_id', 'file_name', 'file_urls']
            .every(key => Object.keys(serializedFile).includes(key)));
        assert.equal(attributes.name, serializedFile.file_name);
        assert.equal(fileOne.id, serializedFile.file_id);
        assert.equal(attributes.links.download, serializedFile.file_urls.download);
        assert.equal(attributes.links.html, serializedFile.file_urls.html);
        assert.equal(attributes.extra.hashes.sha256, serializedFile.file_hashes.sha256);
    });
    test('it normalizes registrationResponses', function(assert) {
        const store = this.owner.lookup('service:store');
        const draftSerializer = store.serializerFor('draft-registration');
        const fileRef = {
            file_hashes: { sha256: 'fakeSha256' },
            file_id: '5dcdb5ea12990200098ba5c7',
            file_name: 'FakefileOne.txt',
            file_urls: { html: 'fakeHtmlLink', download: 'fakeDownloadLink' },
        };
        const resourceHash = {
            data: {
                id: '5dcdb5ea12990200098shac7',
                type: 'draft-registrations',
                attributes: {
                    registration_responses: {
                        'q3.uploader': [fileRef],
                    },
                },
            },
        };
        const normalizedResponse = draftSerializer.normalizeResponse(
            store,
            store.modelFor('draft-registration'),
            resourceHash,
            '5dcdb5ea12990200098shac7',
            'findRecord',
        );
        const normalized = store.push(normalizedResponse);
        assert.ok(normalized);
        assert.ok('__responseKey_q3|uploader' in normalized.registrationResponses);

        const [normalizedFile] = normalized.registrationResponses['__responseKey_q3|uploader'];
        assert.ok(normalizedFile.itemName, fileRef.file_name);
        assert.ok(normalizedFile.id, fileRef.file_id);
        assert.ok(normalized.id, resourceHash.data.id);
    });
});
