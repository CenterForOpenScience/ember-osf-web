interface FileReference {
    id: string;
    name: string;
}
type ResponseValue = string | string[] | FileReference[] | null;

export type PageResponse = Record<string, ResponseValue>;
