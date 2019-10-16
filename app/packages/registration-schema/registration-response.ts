interface FileReference {
    id: string;
    name: string;
}
export type ResponseValue = string | string[] | FileReference[] | null;

export type RegistrationResponse = Record<string, ResponseValue>;
