import { FileReference } from 'ember-osf-web/packages/registration-schema';
import { validateFileReferenceList } from 'ember-osf-web/validators/validate-response-format';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Validator | validate-response-format', hooks => {
    setupTest(hooks);

    test('validates file response format', assert => {
        const validator = validateFileReferenceList();
        const fileOne: FileReference = {
            file_name: 'testFile.txt',
            file_id: 'abcde',
            file_urls: {
                html: 'fakehtml',
                download: 'fakedownload',
            },
            file_hashes: {
                sha256: '12345',
            },
        };
        const fileTwo: FileReference = {
            file_name: 'testFile2.txt',
            file_id: 'abcde2',
            file_urls: {
                html: 'fakehtml',
                download: 'fakedownload',
            },
            file_hashes: {
                sha256: '123456',
            },
        };
        const invalidFile: FileReference = {
            file_name: '',
            file_id: '',
            file_urls: {
                html: 'fakehtml',
                download: 'fakedownload',
            },
            file_hashes: {
                sha256: '12345',
            },
        };
        assert.strictEqual(validator('fakeResponseKey', [fileOne], [], {}, {}), true);
        assert.strictEqual(validator('fakeResponseKey', [fileOne, fileTwo], [], {}, {}), true);
        assert.equal(validator('fakeResponseKey', [invalidFile], [], {}, {}), 'Invalid files list',
            'returns error message for invalid file');
        assert.equal(validator('fakeResponseKey', [fileOne, invalidFile, fileTwo], null, {}, {}), 'Invalid files list',
            'returns error message for invalid file');
    });
});
