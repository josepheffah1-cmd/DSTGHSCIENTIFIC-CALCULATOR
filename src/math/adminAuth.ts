/**
 * DSTGH - Digital Solution Tech Ghana
 * Administration & Server Access Control Engine
 *
 * Security & Access Rules:
 * - Special passkey for Super Admin button is strictly verified.
 * - Passkey is hidden from the portal interface.
 * - Only the administrator has the authority to approve or delete servers before or after registration.
 */

export type ServerStatus = 'approved' | 'pending' | 'suspended';

export interface ServerNode {
  id: string;
  serverName: string;
  organization: string;
  contactPhone?: string;
  contactEmail?: string;
  status: ServerStatus;
  registeredAt: string;
  approvedAt?: string;
  lastPing?: string;
  notes?: string;
  accessCount?: number;
}

const STORAGE_SERVERS_KEY = 'dstgh_registered_servers_v1';
const STORAGE_CURRENT_SERVER_KEY = 'dstgh_active_server_session_v1';
const STORAGE_ADMIN_SESSION_KEY = 'dstgh_admin_session_v1';

// Secret Super Admin passkey requested by user (hidden from UI)
const SUPER_ADMIN_PASSKEY = '8756';

const DEFAULT_SERVERS: ServerNode[] = [
  {
    id: 'DSTGH-SRV-001',
    serverName: 'DSTGH Primary Accra Core Node',
    organization: 'Digital Solution Tech Ghana HQ',
    contactPhone: '0593657098',
    contactEmail: 'dstgh17@gmail.com',
    status: 'approved',
    registeredAt: '2026-01-10 09:30',
    approvedAt: '2026-01-10 09:30',
    lastPing: 'Live Online',
    notes: 'Central master portal node with full administrative access',
    accessCount: 4280,
  },
  {
    id: 'DSTGH-SRV-102',
    serverName: 'KNUST Engineering Lab Gateway',
    organization: 'Kwame Nkrumah Univ. of Science & Tech',
    contactPhone: '0593657098',
    contactEmail: 'engineering-lab@knust.edu.gh',
    status: 'approved',
    registeredAt: '2026-03-14 14:15',
    approvedAt: '2026-03-14 15:00',
    lastPing: 'Active',
    notes: 'Campus student calculation terminal network',
    accessCount: 1942,
  },
  {
    id: 'DSTGH-SRV-205',
    serverName: 'Kumasi Tech Hub Node',
    organization: 'Kumasi Regional STEM Center',
    contactPhone: '0244000111',
    contactEmail: 'stem@kumasihub.org',
    status: 'pending',
    registeredAt: '2026-10-18 11:20',
    lastPing: 'Awaiting Admin Verification',
    notes: 'New registration awaiting MOMO / Selar activation approval',
    accessCount: 0,
  },
];

export class AdminAuthManager {
  public static readonly ADMIN_CONTACTS = {
    organization: 'Digital Solution Tech Ghana (DSTGH)',
    whatsappUrl: 'https://wa.me/233593657098',
    whatsappPhone: '0593657098',
    internationalPhone: '+233 59 365 7098',
    email: 'dstgh17@gmail.com',
    momoNumber: '0593657098',
    momoAccountName: 'Joseph Effah',
    momoNetwork: 'MTN Mobile Money (Ghana)',
    selarPaymentUrl: 'https://selar.com/showlove/dstgh?currency=GHS',
  };

  /**
   * Validates the Super Admin passkey to unlock administrative login.
   * Special passkey is strictly checked.
   */
  public static verifySuperAdminPasskey(passkey: string): boolean {
    const trimmed = (passkey || '').trim();
    return trimmed === SUPER_ADMIN_PASSKEY;
  }

  /**
   * Retrieves all registered servers from persistent storage.
   */
  public static getServers(): ServerNode[] {
    try {
      const data = localStorage.getItem(STORAGE_SERVERS_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(DEFAULT_SERVERS));
        return DEFAULT_SERVERS;
      }
      return JSON.parse(data) as ServerNode[];
    } catch {
      return DEFAULT_SERVERS;
    }
  }

  /**
   * Saves updated server list to localStorage.
   */
  private static saveServers(servers: ServerNode[]): void {
    try {
      localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(servers));
    } catch (e) {
      console.error('Failed to save servers:', e);
    }
  }

  /**
   * Server registration request (status starts as 'pending').
   * Only the administrator can approve it.
   */
  public static registerServer(input: {
    serverName: string;
    organization: string;
    contactPhone?: string;
    contactEmail?: string;
    notes?: string;
  }): ServerNode {
    const servers = this.getServers();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `DSTGH-SRV-${randomSuffix}`;

    const newServer: ServerNode = {
      id: newId,
      serverName: input.serverName.trim(),
      organization: input.organization.trim(),
      contactPhone: input.contactPhone?.trim() || '',
      contactEmail: input.contactEmail?.trim() || '',
      status: 'pending', // Pending approval by administrator
      registeredAt: new Date().toLocaleString(),
      lastPing: 'Pending Admin Approval',
      notes: input.notes?.trim() || 'Awaiting administrator activation',
      accessCount: 0,
    };

    servers.unshift(newServer);
    this.saveServers(servers);
    return newServer;
  }

  /**
   * Administrator approves a server.
   */
  public static approveServer(id: string): boolean {
    const servers = this.getServers();
    const index = servers.findIndex((s) => s.id === id);
    if (index === -1) return false;

    servers[index] = {
      ...servers[index],
      status: 'approved',
      approvedAt: new Date().toLocaleString(),
      lastPing: 'Approved & Active',
    };

    this.saveServers(servers);
    return true;
  }

  /**
   * Administrator deletes a server (before or after registration).
   */
  public static deleteServer(id: string): boolean {
    const servers = this.getServers();
    const filtered = servers.filter((s) => s.id !== id);
    if (filtered.length === servers.length) return false;

    this.saveServers(filtered);

    // If active session was deleted, clear it
    const active = this.getActiveServer();
    if (active && active.id === id) {
      this.clearActiveServer();
    }
    return true;
  }

  /**
   * Administrator toggles suspension of a server.
   */
  public static toggleSuspendServer(id: string): ServerStatus | null {
    const servers = this.getServers();
    const index = servers.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const current = servers[index].status;
    const nextStatus: ServerStatus = current === 'approved' ? 'suspended' : 'approved';

    servers[index] = {
      ...servers[index],
      status: nextStatus,
      lastPing: nextStatus === 'approved' ? 'Active' : 'Suspended by Admin',
    };

    this.saveServers(servers);
    return nextStatus;
  }

  /**
   * Administrator directly provisions a pre-approved server.
   */
  public static addPreApprovedServer(serverData: {
    serverName: string;
    organization: string;
    contactPhone?: string;
    contactEmail?: string;
    customId?: string;
  }): ServerNode {
    const servers = this.getServers();
    const id = serverData.customId?.trim() || `DSTGH-SRV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newServer: ServerNode = {
      id,
      serverName: serverData.serverName.trim(),
      organization: serverData.organization.trim(),
      contactPhone: serverData.contactPhone?.trim() || '',
      contactEmail: serverData.contactEmail?.trim() || '',
      status: 'approved',
      registeredAt: new Date().toLocaleString(),
      approvedAt: new Date().toLocaleString(),
      lastPing: 'Admin Pre-approved',
      notes: 'Directly authorized by Super Admin',
      accessCount: 1,
    };

    servers.unshift(newServer);
    this.saveServers(servers);
    return newServer;
  }

  /**
   * Look up server by ID.
   */
  public static findServerById(id: string): ServerNode | null {
    const servers = this.getServers();
    const cleanId = (id || '').trim().toUpperCase();
    return servers.find((s) => s.id.toUpperCase() === cleanId) || null;
  }

  /**
   * Check if server is authorized and approved.
   */
  public static isServerApproved(id: string): boolean {
    const s = this.findServerById(id);
    return s !== null && s.status === 'approved';
  }

  /**
   * Server login / connect.
   */
  public static loginServer(id: string): { success: boolean; server?: ServerNode; message: string } {
    const s = this.findServerById(id);
    if (!s) {
      return { success: false, message: 'Server ID not found in portal registry. Please register first.' };
    }

    if (s.status === 'pending') {
      return {
        success: false,
        server: s,
        message: 'This server is currently pending approval by the administrator. Please complete payment or contact admin via WhatsApp (+233593657098) or email (dstgh17@gmail.com).',
      };
    }

    if (s.status === 'suspended') {
      return {
        success: false,
        server: s,
        message: 'This server has been suspended by the administrator. Contact Digital Solution Tech Ghana for reactivation.',
      };
    }

    // Approved! Increment access count
    const servers = this.getServers();
    const index = servers.findIndex((item) => item.id === s.id);
    if (index !== -1) {
      servers[index].accessCount = (servers[index].accessCount || 0) + 1;
      servers[index].lastPing = 'Active Now';
      this.saveServers(servers);
    }

    localStorage.setItem(STORAGE_CURRENT_SERVER_KEY, JSON.stringify(s));
    return { success: true, server: s, message: `Welcome! Connected to ${s.serverName}.` };
  }

  public static getActiveServer(): ServerNode | null {
    try {
      const data = localStorage.getItem(STORAGE_CURRENT_SERVER_KEY);
      return data ? (JSON.parse(data) as ServerNode) : null;
    } catch {
      return null;
    }
  }

  public static clearActiveServer(): void {
    localStorage.removeItem(STORAGE_CURRENT_SERVER_KEY);
  }

  public static setAdminSession(active: boolean): void {
    if (active) {
      sessionStorage.setItem(STORAGE_ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
    }
  }

  public static isAdminSessionActive(): boolean {
    return sessionStorage.getItem(STORAGE_ADMIN_SESSION_KEY) === 'true';
  }
}
