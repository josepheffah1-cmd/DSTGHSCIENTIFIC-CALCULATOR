/**
 * DSTGH - Digital Solution Tech Ghana
 * Administration & Servers Management Portal (DSTGH-SC991)
 *
 * Requirements implemented:
 * - Administration/servers login and registration
 * - Payment links: Selar (https://selar.com/showlove/dstgh?currency=GHS)
 * - MTN MOMO: 0593657098, Account Name: Joseph Effah
 * - WhatsApp contact: https://wa.me/233593657098
 * - Email contact: dstgh17@gmail.com
 * - Only administrator has authority to approve or delete servers before or after registration
 * - Super Admin button sign-in locked with special passkey (passkey hidden from UI)
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Server,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Send,
  Phone,
  Mail,
  CreditCard,
  PlusCircle,
  Power,
  RefreshCw,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { AdminAuthManager, ServerNode, ServerStatus } from '../math/adminAuth';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'servers' | 'payment' | 'admin';
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'servers',
}) => {
  const [activeTab, setActiveTab] = useState<'servers' | 'payment' | 'admin'>(initialTab);
  const [servers, setServers] = useState<ServerNode[]>(() => AdminAuthManager.getServers());
  const [activeServer, setActiveServer] = useState<ServerNode | null>(() => AdminAuthManager.getActiveServer());

  // Super Admin Authentication
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => AdminAuthManager.isAdminSessionActive());
  const [adminPasskeyInput, setAdminPasskeyInput] = useState<string>('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);

  // Server Login state
  const [serverLoginId, setServerLoginId] = useState<string>('');
  const [serverLoginMessage, setServerLoginMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Server Registration state
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [newServerName, setNewServerName] = useState<string>('');
  const [newOrg, setNewOrg] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');
  const [justRegisteredServer, setJustRegisteredServer] = useState<ServerNode | null>(null);

  // Admin New Server Form
  const [adminNewName, setAdminNewName] = useState<string>('');
  const [adminNewOrg, setAdminNewOrg] = useState<string>('');
  const [adminNewPhone, setAdminNewPhone] = useState<string>('');
  const [adminNewEmail, setAdminNewEmail] = useState<string>('');
  const [showAddServerForm, setShowAddServerForm] = useState<boolean>(false);

  // Filter for servers list in admin view
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'suspended'>('all');

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setServers(AdminAuthManager.getServers());
      setActiveServer(AdminAuthManager.getActiveServer());
      setIsAdminLoggedIn(AdminAuthManager.isAdminSessionActive());
      setAdminError(null);
      setServerLoginMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const contacts = AdminAuthManager.ADMIN_CONTACTS;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Verify Super Admin Passkey
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    if (!adminPasskeyInput.trim()) {
      setAdminError('Please enter the administrator security passkey.');
      return;
    }

    const isValid = AdminAuthManager.verifySuperAdminPasskey(adminPasskeyInput);
    if (isValid) {
      setIsAdminLoggedIn(true);
      AdminAuthManager.setAdminSession(true);
      setAdminPasskeyInput('');
      setAdminSuccess('Super Admin access authenticated successfully.');
      setTimeout(() => setAdminSuccess(null), 3000);
    } else {
      setAdminError('Invalid administrator security passkey. Access denied.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    AdminAuthManager.setAdminSession(false);
    setAdminPasskeyInput('');
  };

  // Server Login Action
  const handleServerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setServerLoginMessage(null);
    if (!serverLoginId.trim()) {
      setServerLoginMessage({ type: 'error', text: 'Please enter a valid Server ID.' });
      return;
    }

    const res = AdminAuthManager.loginServer(serverLoginId);
    if (res.success && res.server) {
      setActiveServer(res.server);
      setServers(AdminAuthManager.getServers());
      setServerLoginMessage({ type: 'success', text: res.message });
    } else {
      setServerLoginMessage({
        type: res.server?.status === 'pending' ? 'warning' : 'error',
        text: res.message,
      });
    }
  };

  const handleDisconnectServer = () => {
    AdminAuthManager.clearActiveServer();
    setActiveServer(null);
    setServerLoginMessage({ type: 'success', text: 'Server disconnected from current session.' });
  };

  // Server Registration Action
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim() || !newOrg.trim()) {
      alert('Please provide Server Name and Organization / Institution.');
      return;
    }

    const created = AdminAuthManager.registerServer({
      serverName: newServerName,
      organization: newOrg,
      contactPhone: newPhone,
      contactEmail: newEmail,
      notes: newNotes,
    });

    setServers(AdminAuthManager.getServers());
    setJustRegisteredServer(created);
    setIsRegistering(false);
    setNewServerName('');
    setNewOrg('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
  };

  // Administrator Actions
  const handleApproveServer = (id: string) => {
    const ok = AdminAuthManager.approveServer(id);
    if (ok) {
      setServers(AdminAuthManager.getServers());
      if (activeServer && activeServer.id === id) {
        setActiveServer({ ...activeServer, status: 'approved' });
      }
    }
  };

  const handleDeleteServer = (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete server "${name}" (${id})? This action cannot be undone.`
    );
    if (confirmDelete) {
      AdminAuthManager.deleteServer(id);
      setServers(AdminAuthManager.getServers());
      if (activeServer && activeServer.id === id) {
        setActiveServer(null);
      }
    }
  };

  const handleToggleSuspend = (id: string) => {
    AdminAuthManager.toggleSuspendServer(id);
    setServers(AdminAuthManager.getServers());
    if (activeServer && activeServer.id === id) {
      setActiveServer(AdminAuthManager.getActiveServer());
    }
  };

  const handleAdminCreateServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewName.trim() || !adminNewOrg.trim()) {
      alert('Please fill in Server Name and Organization');
      return;
    }

    AdminAuthManager.addPreApprovedServer({
      serverName: adminNewName,
      organization: adminNewOrg,
      contactPhone: adminNewPhone,
      contactEmail: adminNewEmail,
    });

    setServers(AdminAuthManager.getServers());
    setShowAddServerForm(false);
    setAdminNewName('');
    setAdminNewOrg('');
    setAdminNewPhone('');
    setAdminNewEmail('');
    setAdminSuccess('New pre-approved server created successfully!');
    setTimeout(() => setAdminSuccess(null), 3000);
  };

  // Filtered servers for Admin table
  const filteredServers = servers.filter((s) => {
    const matchesFilter = statusFilter === 'all' || s.status === statusFilter;
    const matchesSearch =
      s.serverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = servers.filter((s) => s.status === 'pending').length;
  const approvedCount = servers.filter((s) => s.status === 'approved').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/50 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-inner border border-blue-400/40 font-black">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg tracking-wide">
                  DSTGH Administration & Servers Portal
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/40 text-blue-200 border border-blue-400/30">
                  Digital Solution Tech Ghana
                </span>
              </div>
              <p className="text-[11px] text-blue-200/90">
                Server Registration • Authorizations • MOMO & Selar Payments • Admin Controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('servers')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'servers'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Servers & Connect</span>
            {activeServer && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'payment'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payments & Contacts</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px]">
              MOMO & Selar
            </span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            id="super-admin-portal-tab-btn"
            className={`flex items-center gap-2 py-2.5 px-4 rounded-t-xl transition-all border-b-2 ml-auto ${
              activeTab === 'admin'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border-purple-600 shadow-xs'
                : 'text-purple-700 dark:text-purple-300 border-transparent hover:text-purple-900'
            }`}
          >
            {isAdminLoggedIn ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4" />}
            <span>Super Admin</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {/* TAB 1: SERVERS & CONNECT */}
          {activeTab === 'servers' && (
            <div className="flex flex-col gap-6">
              {/* Active Connection Banner */}
              {activeServer ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          Active Server Session:
                        </span>
                        <span className="font-mono text-xs font-black bg-emerald-200 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-900 dark:text-emerald-200">
                          {activeServer.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          APPROVED
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {activeServer.serverName}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {activeServer.organization} • {activeServer.lastPing}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDisconnectServer}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
                  >
                    <Power className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Server className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        Connect to an Authorized DSTGH Server Node
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Enter your assigned Server ID or submit a registration to access high-capacity cloud calculations.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Just Registered Announcement */}
              {justRegisteredServer && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    Registration Submitted: Pending Administrator Approval
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Your Server ID is <strong className="font-mono text-blue-600 dark:text-blue-400">{justRegisteredServer.id}</strong>.
                    As per security regulations, <strong>only the administrator has the authority to approve or delete servers</strong> before or after registration to access the app.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => setActiveTab('payment')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      View Payment & Verification Details
                    </button>
                    <a
                      href={contacts.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Notify Admin on WhatsApp (+233593657098)
                    </a>
                  </div>
                </div>
              )}

              {/* Server Login & Registration Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Panel A: Server Login */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      Login with Existing Server ID
                    </h3>
                  </div>

                  <form onSubmit={handleServerLogin} className="flex flex-col gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Server Key / ID (e.g. DSTGH-SRV-001):
                      </label>
                      <input
                        type="text"
                        value={serverLoginId}
                        onChange={(e) => setServerLoginId(e.target.value)}
                        placeholder="DSTGH-SRV-..."
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm uppercase font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Authenticate Server
                    </button>
                  </form>

                  {serverLoginMessage && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                        serverLoginMessage.type === 'success'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                          : serverLoginMessage.type === 'warning'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300'
                      }`}
                    >
                      {serverLoginMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      )}
                      <div>{serverLoginMessage.text}</div>
                    </div>
                  )}

                  {/* Sample Server Quick Access */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">
                      Quick Connect to Standard Hub:
                    </span>
                    <button
                      type="button"
                      onClick={() => setServerLoginId('DSTGH-SRV-001')}
                      className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold hover:underline"
                    >
                      DSTGH-SRV-001 (Primary Accra Core Node)
                    </button>
                  </div>
                </div>

                {/* Panel B: Server Registration */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        Register New Server Node
                      </h3>
                    </div>
                    {!isRegistering && (
                      <button
                        onClick={() => setIsRegistering(true)}
                        className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                      >
                        + Open Form
                      </button>
                    )}
                  </div>

                  {isRegistering ? (
                    <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                          Server / Node Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newServerName}
                          onChange={(e) => setNewServerName(e.target.value)}
                          placeholder="e.g. Kumasi Engineering Terminal"
                          className="w-full p-2 rounded-lg border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                          Organization / School / Lab *
                        </label>
                        <input
                          type="text"
                          required
                          value={newOrg}
                          onChange={(e) => setNewOrg(e.target.value)}
                          placeholder="e.g. Univ. of Ghana Math Dept"
                          className="w-full p-2 rounded-lg border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                            Phone / WhatsApp
                          </label>
                          <input
                            type="text"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            placeholder="0593657098"
                            className="w-full p-2 rounded-lg border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                            Contact Email
                          </label>
                          <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full p-2 rounded-lg border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                          />
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 italic">
                        * Note: All registrations require administrator review and approval before access is granted.
                      </p>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Submit Registration
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsRegistering(false)}
                          className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-2">
                      <p>
                        Institutions, schools, or engineering teams can deploy DSTGH calculator terminal servers across campuses and research groups.
                      </p>
                      <button
                        onClick={() => setIsRegistering(true)}
                        className="py-2.5 px-4 rounded-xl border border-dashed border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Start Server Registration Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENTS & CONTACTS */}
          {activeTab === 'payment' && (
            <div className="flex flex-col gap-6">
              {/* Payment Hero Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 tracking-wider">
                    Official Payment & Portal Access
                  </span>
                  <h3 className="font-extrabold text-lg mt-1">
                    Digital Solution Tech Ghana (DSTGH)
                  </h3>
                  <p className="text-xs text-blue-200">
                    Verify server registration, unlock premium computational features, and support engineering development.
                  </p>
                </div>

                <a
                  href={contacts.selarPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay with Selar Online (GHS)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method A: MTN Mobile Money (MOMO) */}
                <div className="p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                        MTN
                      </div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        MTN MOMO Payment (Ghana)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                      Instant MOMO
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 flex flex-col gap-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans font-bold">MOMO Number:</span>
                      <div className="flex items-center gap-2">
                        <strong className="text-base text-slate-900 dark:text-white font-black">
                          {contacts.momoNumber}
                        </strong>
                        <button
                          onClick={() => handleCopy(contacts.momoNumber, 'momo-num')}
                          title="Copy Mobile Number"
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600"
                        >
                          {copiedKey === 'momo-num' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-sans font-bold">Account Name:</span>
                      <div className="flex items-center gap-2">
                        <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                          {contacts.momoAccountName}
                        </strong>
                        <button
                          onClick={() => handleCopy(contacts.momoAccountName, 'momo-name')}
                          title="Copy Account Name"
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600"
                        >
                          {copiedKey === 'momo-name' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <p>• Dial <strong>*170#</strong> or use the MTN MoMo App.</p>
                    <p>• Transfer to: <strong>{contacts.momoNumber}</strong> (Confirm name: <strong>{contacts.momoAccountName}</strong>).</p>
                    <p>• Reference: Enter your <strong>Server ID</strong> or Name.</p>
                  </div>
                </div>

                {/* Method B: Selar Portal Payment */}
                <div className="p-5 rounded-2xl border-2 border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        S
                      </div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        Selar Payment Link
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200">
                      Card / MOMO / Bank
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Pay securely with Visa, Mastercard, Mobile Money, or Online Bank Transfer in Ghana Cedis (GHS).
                  </p>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/40 text-xs font-mono break-all text-blue-600 dark:text-blue-400 flex items-center justify-between">
                    <span>{contacts.selarPaymentUrl}</span>
                    <button
                      onClick={() => handleCopy(contacts.selarPaymentUrl, 'selar-link')}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                    >
                      {copiedKey === 'selar-link' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <a
                    href={contacts.selarPaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span>Proceed to Selar Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Contact Administration Directly */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-3">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  Contact Administration for Immediate Approval & Support
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={contacts.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-3 transition-colors shadow-xs"
                  >
                    <Send className="w-5 h-5" />
                    <div>
                      <div className="font-extrabold text-xs">WhatsApp Administration</div>
                      <div className="text-[11px] opacity-90">{contacts.internationalPhone}</div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${contacts.email}?subject=DSTGH%20Server%20Approval%20Request`}
                    className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-3 transition-colors shadow-xs"
                  >
                    <Mail className="w-5 h-5" />
                    <div>
                      <div className="font-extrabold text-xs">Email Administration</div>
                      <div className="text-[11px] opacity-90">{contacts.email}</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUPER ADMIN DASHBOARD */}
          {activeTab === 'admin' && (
            <div className="flex flex-col gap-6">
              {!isAdminLoggedIn ? (
                /* Super Admin Passkey Gatekeeper - Note: Passkey is strictly hidden from the UI as requested */
                <div className="max-w-md mx-auto w-full p-6 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 flex flex-col items-center text-center gap-4 my-4 shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">
                      Super Administrator Sign-In
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      This management portal is restricted. Only the administrator has the authority to approve or delete servers before or after registration.
                    </p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="w-full flex flex-col gap-3">
                    <div className="text-left">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Administrator Passkey
                      </label>
                      <input
                        type="password"
                        autoComplete="off"
                        value={adminPasskeyInput}
                        onChange={(e) => setAdminPasskeyInput(e.target.value)}
                        placeholder="••••"
                        className="w-full p-3 rounded-xl border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-900 text-center font-mono text-xl tracking-widest font-bold focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                      />
                    </div>

                    {adminError && (
                      <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-300">
                        {adminError}
                      </div>
                    )}

                    <button
                      type="submit"
                      id="unlock-super-admin-btn"
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Unlock className="w-4 h-4" />
                      Authenticate Super Admin
                    </button>
                  </form>
                </div>
              ) : (
                /* Authenticated Administrator Console */
                <div className="flex flex-col gap-5">
                  {/* Status Bar */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h3 className="font-extrabold text-base">
                          Super Administrator Authority Console
                        </h3>
                      </div>
                      <p className="text-xs text-purple-200">
                        Digital Solution Tech Ghana • Full Server Approval & Deletion Control
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAddServerForm((prev) => !prev)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Pre-Approve Server</span>
                      </button>
                      <button
                        onClick={handleAdminLogout}
                        className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-950 border border-purple-400/30 text-purple-200 font-bold text-xs"
                      >
                        Lock / Exit Admin
                      </button>
                    </div>
                  </div>

                  {adminSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {adminSuccess}
                    </div>
                  )}

                  {/* Add Pre-Approved Server Form */}
                  {showAddServerForm && (
                    <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-300 dark:border-purple-800 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-purple-900 dark:text-purple-300">
                          Provision Pre-Approved Authorized Server
                        </h4>
                        <button
                          onClick={() => setShowAddServerForm(false)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          ✕ Close
                        </button>
                      </div>

                      <form onSubmit={handleAdminCreateServer} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Server Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={adminNewName}
                            onChange={(e) => setAdminNewName(e.target.value)}
                            placeholder="Accra Math Hub Node"
                            className="w-full p-2 rounded-lg border text-xs bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Organization *
                          </label>
                          <input
                            type="text"
                            required
                            value={adminNewOrg}
                            onChange={(e) => setAdminNewOrg(e.target.value)}
                            placeholder="University / Organization"
                            className="w-full p-2 rounded-lg border text-xs bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={adminNewPhone}
                            onChange={(e) => setAdminNewPhone(e.target.value)}
                            placeholder="0593657098"
                            className="w-full p-2 rounded-lg border text-xs bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={adminNewEmail}
                            onChange={(e) => setAdminNewEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="w-full p-2 rounded-lg border text-xs bg-white dark:bg-slate-900"
                          />
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                          >
                            Generate & Authorize Server
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Servers KPI stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                      <span className="text-slate-500 font-bold block text-[10px]">Total Registered</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">{servers.length}</span>
                    </div>
                    <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20">
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold block text-[10px]">Approved Active</span>
                      <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">{approvedCount}</span>
                    </div>
                    <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
                      <span className="text-amber-700 dark:text-amber-300 font-bold block text-[10px]">Pending Approval</span>
                      <span className="text-lg font-black text-amber-700 dark:text-amber-400">{pendingCount}</span>
                    </div>
                    <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20">
                      <span className="text-rose-700 dark:text-rose-300 font-bold block text-[10px]">Suspended</span>
                      <span className="text-lg font-black text-rose-700 dark:text-rose-400">
                        {servers.filter((s) => s.status === 'suspended').length}
                      </span>
                    </div>
                  </div>

                  {/* Filters & Search */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
                    <div className="flex items-center gap-1">
                      {(['all', 'pending', 'approved', 'suspended'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                            statusFilter === st
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ID, name, org..."
                        className="p-1 px-2 rounded-lg border text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  {/* Server Management Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="p-3">Server ID</th>
                            <th className="p-3">Name & Org</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Registered / Last Ping</th>
                            <th className="p-3 text-right">Admin Authority Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {filteredServers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-4 text-center text-slate-500 font-medium">
                                No servers match current filter.
                              </td>
                            </tr>
                          ) : (
                            filteredServers.map((server) => (
                              <tr key={server.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                  {server.id}
                                </td>
                                <td className="p-3">
                                  <div className="font-bold text-slate-900 dark:text-white">
                                    {server.serverName}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    {server.organization}
                                    {server.contactPhone && ` • ${server.contactPhone}`}
                                  </div>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                      server.status === 'approved'
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                        : server.status === 'pending'
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                    }`}
                                  >
                                    {server.status}
                                  </span>
                                </td>
                                <td className="p-3 text-[11px] text-slate-500 whitespace-nowrap">
                                  <div>{server.registeredAt}</div>
                                  <div className="font-medium text-slate-400">{server.lastPing || 'Offline'}</div>
                                </td>
                                <td className="p-3 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {server.status === 'pending' && (
                                      <button
                                        onClick={() => handleApproveServer(server.id)}
                                        title="Approve Server Access"
                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                                      >
                                        Approve
                                      </button>
                                    )}

                                    {server.status !== 'pending' && (
                                      <button
                                        onClick={() => handleToggleSuspend(server.id)}
                                        title={server.status === 'approved' ? 'Suspend Server' : 'Reactivate Server'}
                                        className={`px-2 py-1 rounded-lg font-bold text-[11px] ${
                                          server.status === 'approved'
                                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                        }`}
                                      >
                                        {server.status === 'approved' ? 'Suspend' : 'Activate'}
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleDeleteServer(server.id, server.serverName)}
                                      title="Delete Server (Before or After Registration)"
                                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
