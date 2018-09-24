export default function isHybridGuid(id: string): boolean {
    return /^[a-z0-9]{5}-[a-z0-9]{5}$/.test(id);
}
