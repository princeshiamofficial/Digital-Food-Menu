"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { 
  Menu, 
  Bell, 
  Settings, 
  Save, 
  Check, 
  QrCode, 
  FileText, 
  Wifi, 
  Smartphone,
  Info,
  X,
  ExternalLink
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<"general" | "taxes" | "qr" | "hardware">("general");
  const [showToast, setShowToast] = useState(false);
  const [origin, setOrigin] = useState("http://localhost:3000");
  const [previewQr, setPreviewQr] = useState<{ name: string; location: string; url: string } | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // General States
  const [restaurantName, setRestaurantName] = useState("Burger Craft Lab");
  const [phone, setPhone] = useState("+880 1712-345678");
  const [operatingHours, setOperatingHours] = useState("11:00 AM - 11:00 PM");
  const [currency, setCurrency] = useState("USD ($)");

  // Taxes States
  const [vat, setVat] = useState(5);
  const [serviceFee, setServiceFee] = useState(10);
  const [autoPrintKitchen, setAutoPrintKitchen] = useState(true);

  // Hardware states
  const [selectedPrinter, setSelectedPrinter] = useState("LAN Printer (KITCHEN_K1)");
  const [isPrinterConnected, setIsPrinterConnected] = useState(true);

  const handleLogout = () => {
    router.push("/login");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Mock Table List for QR codes
  const tables = [
    { name: "Table 01", location: "Window Side", status: "Active" },
    { name: "Table 02", location: "Window Side", status: "Active" },
    { name: "Table 03", location: "Main Hall", status: "Active" },
    { name: "Table 04", location: "Main Hall", status: "Active" },
    { name: "Table 05", location: "Main Hall", status: "Active" },
    { name: "Table 06", location: "VIP Lounge", status: "Active" },
    { name: "Table 07", location: "VIP Lounge", status: "Active" },
    { name: "Table 08", location: "VIP Lounge", status: "Active" }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen shrink-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ordersCount={0}
          handleLogout={handleLogout}
          isCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Sidebar overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative animate-in slide-in-from-left duration-200">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              ordersCount={0}
              handleLogout={handleLogout}
              isMobile={true}
              isCollapsed={false}
              onCloseMobile={() => setIsMobileOpen(false)}
            />
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="flex-1 h-full cursor-default focus:outline-none"
            aria-label="Close menu"
          />
        </div>
      )}

      {/* Main Panel */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-650 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-[17px] font-semibold tracking-wide text-slate-800 flex items-center gap-2">
              <Settings className="w-[18px] h-[18px] text-[#ff7a00]" />
              <span>Restaurant Settings</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-550 hover:text-slate-855 transition-colors relative">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff7a00] ring-2 ring-white" />
              </button>
            </div>
            <div className="h-8 w-[1px] bg-slate-205" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff7a00] to-amber-500 flex items-center justify-center font-bold text-xs text-white">
                CH
              </div>
              <span className="hidden md:inline text-xs font-semibold text-slate-600">Color Hut Admin</span>
            </div>
          </div>
        </header>

        {/* Floating Toast Notification */}
        {showToast && (
          <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-500/35 bg-emerald-955/90 text-emerald-300 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">Settings saved successfully!</span>
          </div>
        )}

        {/* Content Body */}
        <main className="p-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
          
          {/* Settings Section Tabs (Left) */}
          <div className="w-full lg:w-64 shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-2.5 lg:pb-0 scrollbar-none">
            {[
              { id: "general", label: "General Config" },
              { id: "taxes", label: "Taxes & Service Fees" },
              { id: "qr", label: "Table QR Codes" },
              { id: "hardware", label: "Hardware & Printers" }
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setSettingsSection(sec.id as any)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap lg:whitespace-normal ${
                  settingsSection === sec.id
                    ? "bg-[#ff7a00] text-white shadow-sm"
                    : "text-slate-550 hover:text-slate-850 bg-white border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Form Content Pane (Right) */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            
            {/* General Config form */}
            {settingsSection === "general" && (
              <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-xl">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">General Information</h3>
                  <p className="text-[11px] text-slate-500">Configure basic details about your food outlet.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Restaurant Name</label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Contact Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Operating Hours</label>
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">System Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-bold"
                  >
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="BDT (৳)">BDT (৳) - Bangladeshi Taka</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="self-start flex items-center gap-1.5 py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md mt-4"
                >
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </form>
            )}

            {/* Taxes and Fees Form */}
            {settingsSection === "taxes" && (
              <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-xl">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Taxes & Service Charges</h3>
                  <p className="text-[11px] text-slate-500">Configure regulatory VAT/GST and cashier receipts.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Value Added Tax (VAT) / GST (%)</label>
                  <input
                    type="number"
                    value={vat}
                    onChange={(e) => setVat(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-[#ff7a00] font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Default Service Charge (%)</label>
                  <input
                    type="number"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-[#ff7a00] font-bold"
                  />
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-4 border border-slate-205 rounded-xl mt-2 select-none">
                  <input
                    type="checkbox"
                    id="auto-print"
                    checked={autoPrintKitchen}
                    onChange={() => setAutoPrintKitchen(!autoPrintKitchen)}
                    className="w-5 h-5 accent-emerald-500 rounded border-slate-300 bg-white"
                  />
                  <div className="flex flex-col">
                    <label htmlFor="auto-print" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Auto-Print Kitchen tickets
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">Send order receipts directly to kitchen printer when checkout is finalized.</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="self-start flex items-center gap-1.5 py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md mt-4"
                >
                  <Save className="w-4 h-4" /> Save Configuration
                </button>
              </form>
            )}

            {/* Table QR Codes Form */}
            {settingsSection === "qr" && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Table QR Codes</h3>
                  <p className="text-[11px] text-slate-500">Download table specific QR codes directing guests to table routing systems.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {tables.map((table, i) => {
                    const tableUrl = `${origin}/burgercraftlab?table=${table.name.replace("Table ", "")}`;
                    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(tableUrl)}`;
                    const highResQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(tableUrl)}`;
                    
                    return (
                      <div 
                        key={i} 
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-300 group"
                      >
                        <div 
                          onClick={() => setPreviewQr({ name: table.name, location: table.location, url: tableUrl })}
                          className="p-1 rounded-lg bg-white text-slate-900 shrink-0 border border-slate-200 shadow-sm w-[54px] h-[54px] flex items-center justify-center overflow-hidden cursor-zoom-in hover:border-[#ff7a00] hover:shadow-[0_0_8px_rgba(255,122,0,0.15)] transition-all duration-300"
                          title="Click to preview QR code"
                        >
                          <img 
                            src={qrImageUrl} 
                            alt={`${table.name} QR Code`}
                            className="w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800 truncate">{table.name}</span>
                            <button
                              onClick={() => setPreviewQr({ name: table.name, location: table.location, url: tableUrl })}
                              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors hidden group-hover:inline-block cursor-pointer"
                              title="Preview larger"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[10px] text-[#ff7a00] font-bold">{table.location}</span>
                          <a
                            href={highResQrUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 mt-1.5 text-[9px] font-black uppercase text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3" /> Download Card
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hardware settings form */}
            {settingsSection === "hardware" && (
              <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-xl">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Printers & Hardware Integration</h3>
                  <p className="text-[11px] text-slate-500">Configure connection status of POS receipt and kitchen printers.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Connected Printer</label>
                  <select
                    value={selectedPrinter}
                    onChange={(e) => setSelectedPrinter(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-bold"
                  >
                    <option value="LAN Printer (KITCHEN_K1)">LAN Printer (KITCHEN_K1) - IP: 192.168.1.180</option>
                    <option value="USB Printer (RECEIPT_P1)">USB Printer (RECEIPT_P1) - Local COM3</option>
                    <option value="Bluetooth Printer (BT_P2)">Bluetooth Printer (BT_P2) - Connected</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Wifi className={`w-5 h-5 ${isPrinterConnected ? "text-emerald-600 animate-pulse" : "text-rose-600"}`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">Connection Status</span>
                      <span className="text-[9px] text-slate-500 font-medium">Printer status is currently: {isPrinterConnected ? "ONLINE" : "OFFLINE"}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrinterConnected(false);
                      setTimeout(() => {
                        setIsPrinterConnected(true);
                        alert("Ping response: SUCCESS. Printer is responsive!");
                      }, 1200);
                    }}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold tracking-wider text-slate-600 rounded-lg uppercase transition-all"
                  >
                    Test connection
                  </button>
                </div>

                <button
                  type="submit"
                  className="self-start flex items-center gap-1.5 py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md mt-4"
                >
                  <Save className="w-4 h-4" /> Save Connection
                </button>
              </form>
            )}

          </div>

        </main>
      </div>

      {/* QR Code Preview Modal */}
      {previewQr && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl p-6 max-w-sm w-full flex flex-col gap-5 shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-slate-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex flex-col text-left">
                <h3 className="text-sm font-bold text-slate-900">{previewQr.name}</h3>
                <span className="text-[10px] text-[#ff7a00] font-bold">{previewQr.location}</span>
              </div>
              <button
                onClick={() => setPreviewQr(null)}
                className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Card Body */}
            <div className="flex flex-col items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center shadow-inner relative group">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(previewQr.url)}`}
                  alt={`${previewQr.name} QR Code`}
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scan to Open Menu</span>
                <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[280px] font-mono select-all" title="Click to select all">{previewQr.url}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewQr(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-all text-center cursor-pointer"
              >
                Close
              </button>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(previewQr.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Download QR
              </a>
            </div>
          </div>
          {/* Click backdrop to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setPreviewQr(null)} />
        </div>
      )}

    </div>
  );
}
