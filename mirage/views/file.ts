import { HandlerContext, ModelInstance, Response, Schema } from 'ember-cli-mirage';
import { MirageNode } from 'ember-osf-web/mirage/factories/node';
import DraftNode from 'ember-osf-web/models/draft-node';
import { FileItemKinds } from 'ember-osf-web/models/base-file-item';
import faker from 'faker';

import { guid } from '../factories/utils';
import { filter, process } from './utils';

export function uploadToFolder(this: HandlerContext, schema: Schema) {
    const uploadAttrs = this.request.requestBody;
    const { id: folderId } = this.request.params;
    const { name, kind } = this.request.queryParams;
    const folder = schema.files.find(folderId);

    const randomNum = faker.random.number();
    const fileGuid = guid('file');
    const id = fileGuid(randomNum);
    schema.guids.create({
        id,
        referentType: 'file',
    });

    const uploadedFile = schema.files.create({
        guid: id,
        id,
        path: id,
        target: folder.target,
        name,
        kind: kind as FileItemKinds,
        provider: 'osfstorage',
    });
    if (kind === FileItemKinds.File) {
        uploadedFile.dateModified = uploadAttrs.lastModified;
        uploadedFile.lastTouched = uploadAttrs.lastModifiedDate;
        uploadedFile.size = uploadAttrs.size;
    }

    folder.files.models.pushObject(uploadedFile);
    folder.save();

    return uploadedFile;
}

export function uploadToRoot(this: HandlerContext, schema: Schema) {
    const uploadAttrs = this.request.requestBody;
    const { parentID, fileProviderId } = this.request.params;
    const { name, kind } = this.request.queryParams;
    let node;
    if (this.request.url.includes('draft_nodes')) {
        node = schema.draftNodes.find(parentID);
    } else {
        node = schema.nodes.find(parentID);
        if (node.storage && node.storage.isOverStorageCap) {
            return new Response(507, {}, {
                errors: [{ status: '507', detail: 'Unable to upload file. Node has exceeded its storage limit' }],
            });
        }
    }
    const fileProvider = schema.fileProviders.findBy({ providerId: `${node.id}:${fileProviderId}` });
    const { rootFolder } = fileProvider;
    const randomNum = faker.random.number();
    const fileGuid = guid('file');
    const id = fileGuid(randomNum);

    schema.guids.create({
        id,
        referentType: 'file',
    });

    const uploadedFile = schema.files.create({
        guid: id,
        id,
        path: id,
        target: node,
        name,
        kind: kind as FileItemKinds,
        provider: 'osfstorage',
    });
    if (kind === FileItemKinds.File) {
        uploadedFile.dateModified = uploadAttrs.lastModified;
        uploadedFile.lastTouched = uploadAttrs.lastModifiedDate;
        uploadedFile.size = uploadAttrs.size;
    }

    rootFolder.files.models.pushObject(uploadedFile);
    rootFolder.save();

    return uploadedFile;
}

export function folderFilesList(this: HandlerContext, schema: Schema) {
    const { folderId } = this.request.params;
    const folder = schema.files.find(folderId);
    const files = folder.files.models;
    const filteredFiles = [];
    for (const file of files) {
        if (filter(file, this.request)){
            filteredFiles.push(file);
        }
    }
    return process(schema, this.request, this, filteredFiles.map(file => this.serialize(file).data));
}

export function nodeFilesListForProvider(this: HandlerContext, schema: Schema) {
    const { parentID, fileProviderId } = this.request.params;
    let node;
    if (this.request.url.includes('draft_nodes')) {
        node = schema.draftNodes.find(parentID);
    } else if (this.request.url.includes('registrations')) {
        node = schema.registrations.find(parentID);
    } else {
        node = schema.nodes.find(parentID);
    }
    const fileProvider = schema.fileProviders.findBy({ providerId: `${node.id}:${fileProviderId}` });
    const { rootFolder } = fileProvider;
    return process(schema, this.request, this, rootFolder.files.models.map(file => this.serialize(file).data));
}

export function nodeFileProviderList(this: HandlerContext, schema: Schema) {
    const { parentID } = this.request.params;
    let node: ModelInstance<DraftNode> | ModelInstance<MirageNode>;
    if (this.request.url.includes('draft_nodes')) {
        node = schema.draftNodes.find(parentID);
    } else if (this.request.url.includes('registrations')) {
        node = schema.registrations.find(parentID);
    } else {
        node = schema.nodes.find(parentID);
    }

    const fileProviders = schema.fileProviders.all().models;
    const nodeFileProviders = fileProviders.filter(fp => fp.targetId.id === node.id);

    return process(
        schema,
        this.request,
        this,
        nodeFileProviders
            .map(fp => this.serialize(fp).data), { defaultSortKey: 'last_modified' },
    );
}
