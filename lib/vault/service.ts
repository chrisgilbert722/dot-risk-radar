import { requireFeature } from '@/lib/flags';

/**
 * Service for Compliance Vault (Phase 8.1)
 * Feature-gated by FEATURE_COMPLIANCE_VAULT
 */

export class VaultService {
    constructor() {
        // Ensure flag is valid at instantiation or method call
    }

    async createFolder(userId: string, name: string) {
        requireFeature('FEATURE_COMPLIANCE_VAULT');
        console.log(`[Vault] Creating folder '${name}' for user ${userId}`);
        // DB logic stub
        return { id: 'stub-folder-id', name };
    }

    async uploadDocument(userId: string, folderId: string, file: File) {
        requireFeature('FEATURE_COMPLIANCE_VAULT');
        console.log(`[Vault] Uploading ${file.name} to folder ${folderId}`);
        // Storage logic stub
        return { id: 'stub-doc-id', status: 'uploaded' };
    }

    async listDocuments(folderId: string) {
        requireFeature('FEATURE_COMPLIANCE_VAULT');
        return [];
    }
}
