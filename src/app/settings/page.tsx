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
  ExternalLink,
  Plus,
  Edit2,
  Trash2
} from "lucide-react";
import { RESTAURANTS } from "../data/restaurants";
export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<"general" | "taxes" | "qr" | "hardware" | "branches" | "staff">("general");
  const [showToast, setShowToast] = useState(false);
  const [origin, setOrigin] = useState("http://localhost:3000");
  const [previewQr, setPreviewQr] = useState<{ name: string; location: string; url: string } | null>(null);

  // Dynamic user roles and branch states
  const [userRole, setUserRole] = useState("admin");
  const [userDisplayName, setUserDisplayName] = useState("Color Hut Admin");
  const [userAssignedBranchId, setUserAssignedBranchId] = useState("");

  // Branch management local states
  const [branches, setBranches] = useState<any[]>([]);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [branchModalMode, setBranchModalMode] = useState<"add" | "edit">("add");
  const [editingBranchId, setEditingBranchId] = useState("");
  const [branchFormName, setBranchFormName] = useState("");
  const [branchFormLocation, setBranchFormLocation] = useState("");
  const [branchFormPhone, setBranchFormPhone] = useState("");
  const [branchFormHours, setBranchFormHours] = useState("");

  // Staff management local states
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffModalMode, setStaffModalMode] = useState<"add" | "edit">("add");
  const [editingStaffEmail, setEditingStaffEmail] = useState("");
  const [staffFormName, setStaffFormName] = useState("");
  const [staffFormEmail, setStaffFormEmail] = useState("");
  const [staffFormPassword, setStaffFormPassword] = useState("password123");
  const [staffFormRole, setStaffFormRole] = useState("Branch Manager");
  const [staffFormBranchId, setStaffFormBranchId] = useState("dhanmondi");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn !== "true") {
        router.replace("/login");
        return;
      }
      
      const role = localStorage.getItem("userRole") || "admin";
      if (role !== "admin") {
        router.replace("/dashboard");
        return;
      }
      
      const name = localStorage.getItem("userDisplayName") || "Color Hut Admin";
      const branchId = localStorage.getItem("userAssignedBranchId") || "";
      
      setUserRole(role);
      setUserDisplayName(name);
      setUserAssignedBranchId(branchId);

      // Load branches
      const restaurant = RESTAURANTS.find(r => r.id === 1);
      const defaults = restaurant?.branches || [];
      const storedBranchesStr = localStorage.getItem("restaurant_branches");
      if (storedBranchesStr) {
        try {
          setBranches([...defaults, ...JSON.parse(storedBranchesStr)]);
        } catch (e) {
          setBranches(defaults);
        }
      } else {
        setBranches(defaults);
      }

      // Load staff list
      const defaultStaff = [
        { name: "Dhanmondi Manager", email: "dhanmondi@example.com", password: "password123", role: "Branch Manager", assignedBranchId: "dhanmondi" },
        { name: "Gulshan Manager", email: "gulshan@example.com", password: "password123", role: "Branch Manager", assignedBranchId: "gulshan" },
        { name: "Uttara Manager", email: "uttara@example.com", password: "password123", role: "Branch Manager", assignedBranchId: "uttara" }
      ];
      const storedStaffStr = localStorage.getItem("restaurant_staff");
      if (storedStaffStr) {
        try {
          setStaffList(JSON.parse(storedStaffStr));
        } catch (e) {
          setStaffList(defaultStaff);
        }
      } else {
        setStaffList(defaultStaff);
        localStorage.setItem("restaurant_staff", JSON.stringify(defaultStaff));
      }
      // Listen to URL search param "section" and set active section
      const searchParams = new URLSearchParams(window.location.search);
      const sectionParam = searchParams.get("section");
      if (sectionParam === "branches" || sectionParam === "staff" || sectionParam === "general" || sectionParam === "taxes" || sectionParam === "qr" || sectionParam === "hardware") {
        setSettingsSection(sectionParam as any);
      }
    }
  }, [router]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const currentOrigin = window.location.origin;
      requestAnimationFrame(() => {
        setOrigin(currentOrigin);
      });
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

  // Table QR Code State Management - Branch Scoped
  const [selectedBranchId, setSelectedBranchId] = useState("dhanmondi");

  const getCurrentBranchTables = () => {
    const currentBranch = branches.find(b => b.id === selectedBranchId);
    return currentBranch?.tables || [];
  };

  const saveBranchesToStorage = (updatedBranches: any[]) => {
    setBranches(updatedBranches);
    const defaults = RESTAURANTS.find(r => r.id === 1)?.branches || [];
    const customs = updatedBranches.filter(b => !defaults.some(d => d.id === b.id) || b.isCustom);
    localStorage.setItem("restaurant_branches", JSON.stringify(customs));
  };

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrModalMode, setQrModalMode] = useState<"add" | "edit">("add");
  const [editingTableIndex, setEditingTableIndex] = useState<number | null>(null);
  const [qrTableName, setQrTableName] = useState("");
  const [qrTableLocation, setQrTableLocation] = useState("Main Hall");

  const handleOpenAddModal = () => {
    const curTables = getCurrentBranchTables();
    setQrModalMode("add");
    setQrTableName(`Table ${String(curTables.length + 1).padStart(2, "0")}`);
    setQrTableLocation("Main Hall");
    setIsQrModalOpen(true);
  };

  const handleOpenEditModal = (table: any, index: number) => {
    setQrModalMode("edit");
    setEditingTableIndex(index);
    setQrTableName(table.name);
    setQrTableLocation(table.location);
    setIsQrModalOpen(true);
  };

  const handleSaveQrTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrTableName.trim()) return;

    const updatedBranches = branches.map(b => {
      if (b.id === selectedBranchId) {
        const updatedTables = [...b.tables];
        if (qrModalMode === "add") {
          updatedTables.push({ name: qrTableName, location: qrTableLocation, status: "Active" });
        } else if (qrModalMode === "edit" && editingTableIndex !== null) {
          updatedTables[editingTableIndex] = { name: qrTableName, location: qrTableLocation, status: "Active" };
        }
        return { ...b, tables: updatedTables };
      }
      return b;
    });
    saveBranchesToStorage(updatedBranches);
    setIsQrModalOpen(false);
  };

  const handleDeleteTable = (index: number) => {
    if (confirm("Are you sure you want to delete this table QR code?")) {
      const updatedBranches = branches.map(b => {
        if (b.id === selectedBranchId) {
          return {
            ...b,
            tables: b.tables.filter((_: any, idx: number) => idx !== index)
          };
        }
        return b;
      });
      saveBranchesToStorage(updatedBranches);
    }
  };

  // Branch CRUD Logic
  const handleOpenAddBranchModal = () => {
    setBranchModalMode("add");
    setBranchFormName("");
    setBranchFormLocation("");
    setBranchFormPhone("");
    setBranchFormHours("11:00 AM - 11:00 PM");
    setIsBranchModalOpen(true);
  };

  const handleOpenEditBranchModal = (branch: any) => {
    setBranchModalMode("edit");
    setEditingBranchId(branch.id);
    setBranchFormName(branch.name);
    setBranchFormLocation(branch.location);
    setBranchFormPhone(branch.phone);
    setBranchFormHours(branch.operatingHours);
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchFormName.trim()) return;

    let updatedBranches;
    if (branchModalMode === "add") {
      const newId = branchFormName.toLowerCase().replace(/\s+/g, "-");
      if (branches.some(b => b.id === newId)) {
        alert("A branch with this name already exists.");
        return;
      }
      const newBranch = {
        id: newId,
        name: branchFormName,
        location: branchFormLocation,
        phone: branchFormPhone,
        operatingHours: branchFormHours,
        tables: [
          { name: "Table 01", location: "Main Hall", status: "Active" },
          { name: "Table 02", location: "Main Hall", status: "Active" }
        ],
        isCustom: true
      };
      updatedBranches = [...branches, newBranch];
    } else {
      updatedBranches = branches.map(b => {
        if (b.id === editingBranchId) {
          return {
            ...b,
            name: branchFormName,
            location: branchFormLocation,
            phone: branchFormPhone,
            operatingHours: branchFormHours
          };
        }
        return b;
      });
    }

    saveBranchesToStorage(updatedBranches);
    setIsBranchModalOpen(false);
  };

  const handleDeleteBranch = (branchId: string) => {
    if (confirm("Are you sure you want to delete this branch? All table QR codes for this branch will be lost.")) {
      const updatedBranches = branches.filter(b => b.id !== branchId);
      saveBranchesToStorage(updatedBranches);
      if (selectedBranchId === branchId) {
        setSelectedBranchId(updatedBranches[0]?.id || "");
      }
    }
  };

  // Staff CRUD Logic
  const handleOpenAddStaffModal = () => {
    setStaffModalMode("add");
    setStaffFormName("");
    setStaffFormEmail("");
    setStaffFormPassword("password123");
    setStaffFormRole("Branch Manager");
    setStaffFormBranchId(branches[0]?.id || "dhanmondi");
    setIsStaffModalOpen(true);
  };

  const handleOpenEditStaffModal = (staff: any) => {
    setStaffModalMode("edit");
    setEditingStaffEmail(staff.email);
    setStaffFormName(staff.name);
    setStaffFormEmail(staff.email);
    setStaffFormPassword(staff.password);
    setStaffFormRole(staff.role);
    setStaffFormBranchId(staff.assignedBranchId || (branches[0]?.id || "dhanmondi"));
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffFormName.trim() || !staffFormEmail.trim()) return;

    let updatedStaff;
    if (staffModalMode === "add") {
      if (staffList.some(s => s.email.toLowerCase() === staffFormEmail.toLowerCase())) {
        alert("A staff member with this email already exists.");
        return;
      }
      const newStaff = {
        name: staffFormName,
        email: staffFormEmail,
        password: staffFormPassword,
        role: staffFormRole,
        assignedBranchId: staffFormRole === "Branch Manager" ? staffFormBranchId : ""
      };
      updatedStaff = [...staffList, newStaff];
    } else {
      updatedStaff = staffList.map(s => {
        if (s.email.toLowerCase() === editingStaffEmail.toLowerCase()) {
          return {
            ...s,
            name: staffFormName,
            password: staffFormPassword,
            role: staffFormRole,
            assignedBranchId: staffFormRole === "Branch Manager" ? staffFormBranchId : ""
          };
        }
        return s;
      });
    }

    setStaffList(updatedStaff);
    localStorage.setItem("restaurant_staff", JSON.stringify(updatedStaff));
    setIsStaffModalOpen(false);
  };

  const handleDeleteStaff = (email: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      const updatedStaff = staffList.filter(s => s.email.toLowerCase() !== email.toLowerCase());
      setStaffList(updatedStaff);
      localStorage.setItem("restaurant_staff", JSON.stringify(updatedStaff));
    }
  };

  const downloadQrWithTableNo = (tableName: string, qrUrl: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fill background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 600, 600);

      // Draw QR Code
      ctx.drawImage(img, 20, 20, 560, 560);

      // Center Badge dimensions
      const badgeSize = 140;
      const badgeX = (600 - badgeSize) / 2;
      const badgeY = (600 - badgeSize) / 2;

      // Draw white badge background
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      const r = 28; // border radius for rounded corners
      // Start at top-left (sharp)
      ctx.moveTo(badgeX, badgeY);
      // Top line to top-right start-of-curve
      ctx.lineTo(badgeX + badgeSize - r, badgeY);
      // Top-right curve
      ctx.quadraticCurveTo(badgeX + badgeSize, badgeY, badgeX + badgeSize, badgeY + r);
      // Right line to bottom-right (sharp)
      ctx.lineTo(badgeX + badgeSize, badgeY + badgeSize);
      // Bottom line to bottom-left start-of-curve
      ctx.lineTo(badgeX + r, badgeY + badgeSize);
      // Bottom-left curve
      ctx.quadraticCurveTo(badgeX, badgeY + badgeSize, badgeX, badgeY + badgeSize - r);
      // Close path to top-left (sharp)
      ctx.closePath();
      ctx.fill();

      // Extract table number (e.g. "Table 01" -> "01")
      const digits = tableName.replace("Table ", "");

      // Draw table number inside badge
      ctx.fillStyle = "#1e293b"; // Slate-800 color
      ctx.font = "bold 60px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(digits, 600 / 2, 600 / 2);

      // Download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${tableName.replace(" ", "_")}_QR.png`;
      link.click();
    };
    img.src = qrUrl;
  };

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
              <span className="hidden md:inline text-xs font-semibold text-slate-600">{userDisplayName}</span>
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
              { id: "hardware", label: "Hardware & Printers" },
              ...(userRole === "admin" ? [
                { id: "staff", label: "Staff & Roles" }
              ] : [])
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setSettingsSection(sec.id as any)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap lg:whitespace-normal ${
                  settingsSection === sec.id
                    ? "bg-[#ff7a00] text-white shadow-sm"
                    : "text-slate-555 hover:text-slate-855 bg-white border border-slate-200 hover:bg-slate-100"
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

            {/* Staff & Roles Management panel */}
            {settingsSection === "staff" && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Staff & Roles</h3>
                    <p className="text-[11px] text-slate-500">Configure dashboard manager access and assign branches.</p>
                  </div>
                  <button
                    onClick={handleOpenAddStaffModal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#ff7a00] hover:bg-[#e06b00] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Staff
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-sans">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-bold tracking-wider uppercase text-slate-500">
                        <th className="pb-3 pl-2">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Assigned Branch</th>
                        <th className="pb-3 text-right pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {staffList.map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 pl-2 font-bold text-slate-800">{s.name}</td>
                          <td className="py-3 text-slate-600 font-medium">{s.email}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.role === "Admin" ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            }`}>
                              {s.role}
                            </span>
                          </td>
                          <td className="py-3 text-slate-650 font-bold">
                            {s.assignedBranchId 
                              ? (branches.find(b => b.id === s.assignedBranchId)?.name || s.assignedBranchId)
                              : "All Branches"
                            }
                          </td>
                          <td className="py-3 text-right pr-2">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleOpenEditStaffModal(s)}
                                className="p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-550 hover:text-[#ff7a00]"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(s.email)}
                                className="p-1 rounded bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-500 hover:text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md relative flex items-center justify-center select-none">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(previewQr.url)}`}
                  alt={`${previewQr.name} QR Code`}
                  className="w-48 h-48 object-contain"
                />
                {/* Center Table No Badge */}
                <div className="absolute w-12 h-12 rounded-tr-2xl rounded-bl-2xl rounded-tl-none rounded-br-none bg-white flex items-center justify-center text-slate-800 font-black text-sm select-none pointer-events-none">
                  {previewQr.name.replace("Table ", "")}
                </div>
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
              <button
                onClick={() => downloadQrWithTableNo(previewQr.name, `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(previewQr.url)}`)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Download QR
              </button>
            </div>
          </div>
          {/* Click backdrop to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setPreviewQr(null)} />
        </div>
      )}

      {/* Table QR Add/Edit Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                {qrModalMode === "add" ? "Add New Table QR" : "Edit Table QR"}
              </h3>
              <button 
                onClick={() => setIsQrModalOpen(false)}
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQrTable} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Table Name</label>
                <input 
                  type="text" 
                  value={qrTableName}
                  onChange={(e) => setQrTableName(e.target.value)}
                  placeholder="e.g. Table 09"
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-bold bg-slate-50"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Location</label>
                <select
                  value={qrTableLocation}
                  onChange={(e) => setQrTableLocation(e.target.value)}
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-bold bg-slate-50 font-sans"
                >
                  <option value="Main Hall">Main Hall</option>
                  <option value="Window Side">Window Side</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Terrace">Terrace</option>
                </select>
              </div>

              <div className="flex gap-2.5 justify-end mt-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff7a00] hover:bg-[#e06b00] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Add/Edit Modal */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                {branchModalMode === "add" ? "Add New Branch" : "Edit Branch Details"}
              </h3>
              <button 
                onClick={() => setIsBranchModalOpen(false)}
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="flex flex-col gap-4 font-sans text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Branch Name</label>
                <input 
                  type="text" 
                  value={branchFormName}
                  onChange={(e) => setBranchFormName(e.target.value)}
                  placeholder="e.g. Banani Branch"
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-bold bg-slate-50"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Location Address</label>
                <input 
                  type="text" 
                  value={branchFormLocation}
                  onChange={(e) => setBranchFormLocation(e.target.value)}
                  placeholder="e.g. Road 11, Banani, Dhaka"
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-medium bg-slate-50"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Contact Phone</label>
                <input 
                  type="text" 
                  value={branchFormPhone}
                  onChange={(e) => setBranchFormPhone(e.target.value)}
                  placeholder="e.g. +880 1712-999999"
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-medium bg-slate-50"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Operating Hours</label>
                <input 
                  type="text" 
                  value={branchFormHours}
                  onChange={(e) => setBranchFormHours(e.target.value)}
                  placeholder="e.g. 11:00 AM - 11:00 PM"
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-medium bg-slate-50"
                  required
                />
              </div>

              <div className="flex gap-2.5 justify-end mt-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff7a00] hover:bg-[#e06b00] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Add/Edit Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                {staffModalMode === "add" ? "Add New Staff Manager" : "Edit Staff Manager Settings"}
              </h3>
              <button 
                onClick={() => setIsStaffModalOpen(false)}
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="flex flex-col gap-4 font-sans text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Staff Name</label>
                <input 
                  type="text" 
                  value={staffFormName}
                  onChange={(e) => setStaffFormName(e.target.value)}
                  placeholder="e.g. Asif Rahman"
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-bold bg-slate-50"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Email Address (Login ID)</label>
                <input 
                  type="email" 
                  value={staffFormEmail}
                  onChange={(e) => setStaffFormEmail(e.target.value)}
                  placeholder="e.g. asif@example.com"
                  disabled={staffModalMode === "edit"}
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-medium bg-slate-50 disabled:bg-slate-100 disabled:text-slate-450"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Password</label>
                <input 
                  type="text" 
                  value={staffFormPassword}
                  onChange={(e) => setStaffFormPassword(e.target.value)}
                  placeholder="password123"
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-800 font-medium bg-slate-50"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Role</label>
                <select
                  value={staffFormRole}
                  onChange={(e) => setStaffFormRole(e.target.value)}
                  className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-850 font-bold bg-slate-50"
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Branch Manager">Branch Manager (Restricted Access)</option>
                </select>
              </div>

              {staffFormRole === "Branch Manager" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Assigned Branch Outlets</label>
                  <select
                    value={staffFormBranchId}
                    onChange={(e) => setStaffFormBranchId(e.target.value)}
                    className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#ff7a00] text-slate-855 font-bold bg-slate-50"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2.5 justify-end mt-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff7a00] hover:bg-[#e06b00] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
