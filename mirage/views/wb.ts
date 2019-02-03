import { HandlerContext, Schema } from 'ember-cli-mirage';

export function moveFile(this: HandlerContext, schema: Schema) {
    const fileId = this.request.params.id;
    const nodeId = JSON.parse(this.request.requestBody).resource;
    const file = schema.files.find(fileId);
    file.update({
        userId: null,
        nodeId,
    });
    return file;
}

export function renameFile(this: HandlerContext, schema: Schema) {
    const fileId = this.request.params.id;
    const name = JSON.parse(this.request.requestBody).rename;
    const file = schema.files.find(fileId);
    file.update({
        name,
    });
    return file;
}

export function deleteFile(this: HandlerContext, schema: Schema) {
    const fileId = this.request.params.id;
    const file = schema.files.find(fileId);
    file.destroy();
    return null;
}

export function fileVersions(this: HandlerContext) {
    return {
        data: [
            {
                attributes: {
                    modified_utc: '2019-01-03T17:37:12+00:00',
                    modified: '2019-01-03T17:37:12.374146+00:00',
                    version: '2',
                    versionIdentifier: 'version',
                    extra: {
                        user: {
                            name: 'Brian J. Geiger',
                            url: '/pv37f/',
                        },
                        downloads: 3,
                        hashes: {
                            sha256: 'ed86f96e24194cf38a82af6df56da7af6be2d29ddfd99411d6fe9ae993c4d368',
                            md5: 'b43e7833065b0d49ef44d91593cda502',
                        },
                    },
                },
                type: 'file_versions',
                id: '2',
            },
            {
                attributes: {
                    modified_utc: '2018-12-30T15:42:50+00:00',
                    modified: '2018-12-30T15:42:50.685315+00:00',
                    version: '1',
                    versionIdentifier: 'version',
                    extra: {
                        user: {
                            name: 'Brian J. Geiger',
                            url: '/pv37f/',
                        },
                        downloads: 0,
                        hashes: {
                            sha256: '5c6dffcc0ae48dfbe38addab2bd42a950d658681de74aead20e2a6101bdeee6f',
                            md5: 'f9544dbb3d1aa3de96a278ad4fb48c91',
                        },
                    },
                },
                type: 'file_versions',
                id: '1',
            },
        ],
    };
}
