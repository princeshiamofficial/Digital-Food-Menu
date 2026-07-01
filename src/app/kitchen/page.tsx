"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { RESTAURANTS } from "../data/restaurants";
import { 
  Menu, 
  Bell, 
  Clock, 
  Check, 
  ChevronRight, 
  ChefHat, 
  AlertTriangle,
  RotateCcw,
  CalendarDays,
  ReceiptText,
  ClipboardCheck,
  CheckCircle2,
  BadgeCheck,
  UserCheck,
  X
} from "lucide-react";

interface KitchenOrder {
  id: string;
  table: string;
  items: Array<{ name: string; quantity: number; notes?: string; checked?: boolean }>;
  elapsedMinutes: number;
  priority: "high" | "medium" | "low";
  status: "new" | "preparing" | "qa" | "ready" | "delivered";
  branchId?: string;
}

// Inline SVG Stopwatch Icon Component
const StopwatchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="14" r="8" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="10" y1="2" x2="14" y2="2" />
    <path d="M12 14l2-2" />
  </svg>
);

function formatDurationPrecise(totalSeconds: number): string {
  if (totalSeconds <= 0) return "Due";

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
  } else if (hours > 0) {
    parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
  } else if (minutes > 0) {
    parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
  } else if (seconds > 0) {
    return "<1s";
  }

  return parts.length > 0 ? parts.join(' ') : "Due";
}

interface ProgressInfo {
  showProgressBar: boolean;
  percentage: number;
  displayText: string;
  isOverdue: boolean;
  progressColorClass: string;
  stageTargetDate: string;
}

const formatSlaMinutes = (minutes: number): string => {
  return `${minutes} Min SLA`;
};

const calculateProgressInfo = (
  order: KitchenOrder,
  now: Date
): ProgressInfo => {
  const createdAt = new Date(now.getTime() - order.elapsedMinutes * 60 * 1000);
  let totalSlaMinutes = 15;
  let slaStageName = ` (${formatSlaMinutes(15)})`;
  const showProgressBar = true;

  if (order.status === 'new') {
    totalSlaMinutes = 15;
    slaStageName = ` (${formatSlaMinutes(15)})`;
  } else if (order.status === 'preparing') {
    totalSlaMinutes = 25;
    slaStageName = ` (${formatSlaMinutes(25)})`;
  } else if (order.status === 'qa') {
    totalSlaMinutes = 5;
    slaStageName = ` (${formatSlaMinutes(5)})`;
  } else if (order.status === 'ready') {
    totalSlaMinutes = 10;
    slaStageName = ` (${formatSlaMinutes(10)})`;
  } else if (order.status === 'delivered') {
    totalSlaMinutes = 15;
    slaStageName = ` (${formatSlaMinutes(15)})`;
  }

  const effectiveTargetDate = new Date(createdAt.getTime() + totalSlaMinutes * 60 * 1000);
  const targetDateStr = effectiveTargetDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  let percentage: number;
  let displayText: string;
  let isOverdue = false;
  let progressColorClass = 'progress-indicator-gradient';

  if (now.getTime() > effectiveTargetDate.getTime()) {
    isOverdue = true;
    const diffSeconds = Math.floor((now.getTime() - effectiveTargetDate.getTime()) / 1000);
    const diffMins = Math.floor(diffSeconds / 60);
    const diffSecs = diffSeconds % 60;
    displayText = diffMins > 0 
      ? `Overdue by ${diffMins}m ${diffSecs}s`
      : `Overdue by ${diffSecs}s`;
    progressColorClass = 'bg-destructive';
    percentage = 100;
  } else {
    const secondsRemaining = Math.max(0, Math.floor((effectiveTargetDate.getTime() - now.getTime()) / 1000));
    displayText = `${formatDurationPrecise(secondsRemaining)} remaining`;
    
    const totalDurationSeconds = totalSlaMinutes * 60;
    const elapsedDurationSeconds = order.elapsedMinutes * 60;
    percentage = totalDurationSeconds > 0 
      ? Math.max(0, Math.min(100, (elapsedDurationSeconds / totalDurationSeconds) * 100)) 
      : 100;
  }

  if (slaStageName) {
    displayText += slaStageName;
  }

  return {
    showProgressBar,
    percentage: Math.round(percentage),
    displayText,
    isOverdue,
    progressColorClass,
    stageTargetDate: targetDateStr,
  };
};

export default function KitchenPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("kitchen");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Track which column is being dragged over
  const [dragOverColumn, setDragOverColumn] = useState<KitchenOrder["status"] | null>(null);

  // Pop-up modal details state
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);
  const [modalState, setModalState] = useState<"closed" | "open" | "closing">("closed");

  // Dynamic user roles and branch states
  const [userRole, setUserRole] = useState("admin");
  const [userDisplayName, setUserDisplayName] = useState("Color Hut Admin");
  const [userAssignedBranchId, setUserAssignedBranchId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("dhanmondi");
  const [allBranches, setAllBranches] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn !== "true") {
        router.replace("/login");
        return;
      }
      
      const role = localStorage.getItem("userRole") || "admin";
      const name = localStorage.getItem("userDisplayName") || "Color Hut Admin";
      const branchId = localStorage.getItem("userAssignedBranchId") || "";
      
      setUserRole(role);
      setUserDisplayName(name);
      setUserAssignedBranchId(branchId);
      
      if (role === "manager" && branchId) {
        setSelectedBranchId(branchId);
      } else {
        setSelectedBranchId("dhanmondi");
      }
    }
  }, [router]);

  // Load branches
  useEffect(() => {
    const restaurant = RESTAURANTS.find(r => r.id === 1);
    const defaults = restaurant?.branches || [];
    try {
      const storedBranchesStr = localStorage.getItem("restaurant_branches");
      if (storedBranchesStr) {
        const customs = JSON.parse(storedBranchesStr);
        setAllBranches([...defaults, ...customs]);
      } else {
        setAllBranches(defaults);
      }
    } catch (e) {
      setAllBranches(defaults);
    }
  }, []);

  const openModal = (order: KitchenOrder) => {
    setSelectedOrder(order);
    setModalState("open");
  };

  const closeModal = () => {
    setModalState("closing");
    setTimeout(() => {
      setModalState("closed");
      setSelectedOrder(null);
    }, 150);
  };

  const toggleItemChecked = (orderId: string, itemIndex: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newItems = [...o.items];
        newItems[itemIndex] = { ...newItems[itemIndex], checked: !newItems[itemIndex].checked };
        const updatedOrder = { ...o, items: newItems };
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        return updatedOrder;
      }
      return o;
    }));
  };

  const handleLogout = () => {
    router.push("/login");
  };

  // Mock Kitchen Orders State with 5 stages (assigned to branchIds)
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: "ORD-8821",
      table: "04",
      items: [
        { name: "Classic Cheese Burger", quantity: 2, notes: "Well done patties", checked: false },
        { name: "Truffle Parmesan Fries", quantity: 1, checked: false }
      ],
      elapsedMinutes: 4,
      priority: "medium",
      status: "new",
      branchId: "dhanmondi"
    },
    {
      id: "ORD-8820",
      table: "12",
      items: [
        { name: "Truffle Mushroom Pizza", quantity: 1, notes: "Extra truffle oil", checked: false },
        { name: "Fresh Mint Lemonade", quantity: 1, checked: false }
      ],
      elapsedMinutes: 7,
      priority: "high",
      status: "new",
      branchId: "gulshan"
    },
    {
      id: "ORD-8819",
      table: "08",
      items: [
        { name: "Dragon Sushi Roll Platter", quantity: 1, checked: true },
        { name: "Spicy Sichuan Chilli Wontons", quantity: 1, checked: true }
      ],
      elapsedMinutes: 14,
      priority: "medium",
      status: "preparing",
      branchId: "uttara"
    },
    {
      id: "ORD-8818",
      table: "10",
      items: [
        { name: "Truffle Mushroom Pizza", quantity: 1, checked: true }
      ],
      elapsedMinutes: 3,
      priority: "high",
      status: "qa",
      branchId: "gulshan"
    },
    {
      id: "ORD-8816",
      table: "15",
      items: [
        { name: "Classic Cheese Burger", quantity: 1, checked: true },
        { name: "Truffle Parmesan Fries", quantity: 1, checked: true }
      ],
      elapsedMinutes: 8,
      priority: "low",
      status: "ready",
      branchId: "dhanmondi"
    },
    {
      id: "ORD-8815",
      table: "03",
      items: [
        { name: "Truffle Mushroom Pizza", quantity: 1, checked: true },
        { name: "Fresh Mint Lemonade", quantity: 2, checked: true }
      ],
      elapsedMinutes: 12,
      priority: "medium",
      status: "delivered",
      branchId: "uttara"
    }
  ]);

  // Load custom live orders from localStorage
  useEffect(() => {
    try {
      const storedOrdersStr = localStorage.getItem("live_orders");
      if (storedOrdersStr) {
        const liveOrders = JSON.parse(storedOrdersStr);
        setOrders(prev => {
          const filteredLive = liveOrders
            .filter((l: any) => !prev.some(p => p.id === l.id))
            .map((l: any) => ({
              id: l.id,
              table: l.table,
              items: l.items.map((i: any) => ({ name: i.name, quantity: i.quantity, checked: false })),
              elapsedMinutes: 1,
              priority: "medium" as const,
              status: l.status as any,
              branchId: l.branchId
            }));
          return [...filteredLive, ...prev];
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Derived filtered orders list
  const filteredOrders = orders.filter(o => o.branchId === selectedBranchId);

  // Simulate timer incrementing every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev => prev.map(o => ({ ...o, elapsedMinutes: o.elapsedMinutes + 1 })));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const moveOrder = (orderId: string, nextStatus: KitchenOrder["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
  };

  const completeOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData("text/plain", orderId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, status: KitchenOrder["status"]) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: KitchenOrder["status"]) => {
    e.preventDefault();
    setDragOverColumn(null);
    const orderId = e.dataTransfer.getData("text/plain");
    if (orderId) {
      moveOrder(orderId, targetStatus);
    }
  };

  // Helper to count active order categories
  const newOrders = filteredOrders.filter(o => o.status === "new");
  const preparingOrders = filteredOrders.filter(o => o.status === "preparing");
  const qaOrders = filteredOrders.filter(o => o.status === "qa");
  const readyOrders = filteredOrders.filter(o => o.status === "ready");
  const deliveredOrders = filteredOrders.filter(o => o.status === "delivered");

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

      {/* Main KDS Panel */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-655 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-[17px] font-semibold tracking-wide text-slate-800 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-[#ff7a00]" />
              <span>Kitchen Display System (KDS)</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Branch Switcher (Admin-only interactive) */}
            {userRole === "admin" && (
              <div className="relative">
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  disabled={userRole !== "admin"}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-250 bg-white cursor-pointer text-slate-800 hover:bg-slate-50"
                >
                  {allBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

        {/* Kanban Board Area (Responsive Horizontal Scroll) */}
        <main className="flex-1 p-6 overflow-x-auto flex gap-5 bg-[#f4f6fa] h-full items-stretch">
          
          {/* Column 1: Incoming Orders */}
          <div 
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, "new")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "new")}
            className={`flex-1 min-w-[280px] max-w-[340px] flex flex-col border rounded-xl overflow-hidden h-full shadow-sm animate-fade-in transition-all duration-200 ${
              dragOverColumn === "new" 
                ? "bg-[#e0f2fe] border-[#38bdf8] scale-[1.01] ring-2 ring-[#0082c9]/20" 
                : "bg-[#f1f5f9] border-slate-200/80"
            }`}
          >
            <div className="bg-[#0082c9] px-4 py-3.5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4.5 h-4.5 text-white/90 shrink-0" />
                <h2 className="text-[13px] font-bold tracking-wide">Incoming Orders</h2>
              </div>
              <span className="w-5.5 h-5.5 rounded-full bg-black/15 flex items-center justify-center font-bold text-[11px] text-white">
                {newOrders.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 scrollbar-none">
              {newOrders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <span className="text-slate-400 text-xs">No pending orders</span>
                </div>
              ) : (
                newOrders.map(order => {
                  const progressInfo = calculateProgressInfo(order, new Date());
                  
                  const progressStyle = progressInfo.progressColorClass === 'progress-indicator-gradient'
                    ? { 
                        transform: `translateX(-${100 - progressInfo.percentage}%)`,
                        backgroundImage: 'linear-gradient(to right, rgb(220, 38, 38), rgb(255, 166, 0), rgb(255, 255, 0), rgb(128, 224, 31), rgb(28, 202, 144))'
                      }
                    : { 
                        width: `${progressInfo.percentage}%`,
                        backgroundColor: progressInfo.progressColorClass === 'bg-destructive' ? '#ef4444' : '#ffa600'
                      };

                  return (
                    <div 
                      key={order.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, order.id)}
                      onClick={() => moveOrder(order.id, "preparing")}
                      className="bg-white border border-slate-205 hover:border-slate-350 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 relative group cursor-grab active:cursor-grabbing hover:scale-[0.99] active:scale-[0.97]"
                      title="Drag card to move or click to progress"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[13px] font-bold text-slate-800 tracking-tight">{order.id}</span>
                          <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5" title={`Table ${order.table} • ${order.items.length} items`}>
                            Table {order.table} &bull; {order.items.length} items
                          </p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openModal(order); }} 
                          className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors shrink-0" 
                          title="View Details"
                        >
                          <ReceiptText className="w-[18px] h-[18px]" />
                        </button>
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-1.5 bg-[#fee2e2] border border-[#fecaca] text-[#ef4444] rounded-full px-2.5 py-0.5 text-[10px] font-bold leading-none">
                          <Clock className="w-3.5 h-3.5" />
                          Target: {progressInfo.stageTargetDate}
                        </span>
                      </div>

                      {progressInfo.showProgressBar && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold my-0.5">
                          <StopwatchIcon className="w-3.5 h-3.5 text-[#f97316] shrink-0" />
                          <span className="truncate" title={progressInfo.displayText}>{progressInfo.displayText}</span>
                        </div>
                      )}

                      {progressInfo.showProgressBar && (
                        <div className="relative w-full h-1.5 rounded-full bg-slate-100 shadow-inner overflow-hidden">
                          <div 
                            className="h-full w-full rounded-full transition-transform duration-500"
                            style={progressStyle}
                          />
                        </div>
                      )}

                      {/* Cute Mascot Avatar Footer Row */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                        <svg viewBox="0 0 100 100" className="w-7 h-7 rounded-full border border-slate-100 shadow-sm shrink-0 bg-[#e2f8ec]">
                          <circle cx="50" cy="50" r="42" fill="#a7f3d0" />
                          <circle cx="34" cy="54" r="5" fill="#fecaca" opacity="0.8" />
                          <circle cx="66" cy="54" r="5" fill="#fecaca" opacity="0.8" />
                          <circle cx="40" cy="46" r="4.5" fill="#047857" />
                          <circle cx="60" cy="46" r="4.5" fill="#047857" />
                          <path d="M46 54 Q 50 58 54 54" fill="none" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-400">Chef Staff</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: Cooking & Prep */}
          <div 
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, "preparing")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "preparing")}
            className={`flex-1 min-w-[280px] max-w-[340px] flex flex-col border rounded-xl overflow-hidden h-full shadow-sm animate-fade-in transition-all duration-200 ${
              dragOverColumn === "preparing" 
                ? "bg-[#f3e8ff] border-[#c084fc] scale-[1.01] ring-2 ring-[#7c3aed]/20" 
                : "bg-[#f1f5f9] border-slate-200/80"
            }`}
          >
            <div className="bg-[#7c3aed] px-4 py-3.5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4.5 h-4.5 text-white/90 shrink-0" />
                <h2 className="text-[13px] font-bold tracking-wide">Cooking & Prep</h2>
              </div>
              <span className="w-5.5 h-5.5 rounded-full bg-black/15 flex items-center justify-center font-bold text-[11px] text-white">
                {preparingOrders.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 scrollbar-none">
              {preparingOrders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <span className="text-slate-400 text-xs">No active preparations</span>
                </div>
              ) : (
                preparingOrders.map(order => {
                  const progressInfo = calculateProgressInfo(order, new Date());

                  const progressStyle = progressInfo.progressColorClass === 'progress-indicator-gradient'
                    ? { 
                        transform: `translateX(-${100 - progressInfo.percentage}%)`,
                        backgroundImage: 'linear-gradient(to right, rgb(220, 38, 38), rgb(255, 166, 0), rgb(255, 255, 0), rgb(128, 224, 31), rgb(28, 202, 144))'
                      }
                    : { 
                        width: `${progressInfo.percentage}%`,
                        backgroundColor: progressInfo.progressColorClass === 'bg-destructive' ? '#ef4444' : '#ffa600'
                      };

                  return (
                    <div 
                      key={order.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, order.id)}
                      onClick={() => moveOrder(order.id, "qa")}
                      className="bg-white border border-slate-205 hover:border-slate-350 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 relative group cursor-grab active:cursor-grabbing hover:scale-[0.99] active:scale-[0.97]"
                      title="Drag card to move or click to progress"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[13px] font-bold text-slate-800 tracking-tight">{order.id}</span>
                          <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5" title={`Table ${order.table} • ${order.items.length} items`}>
                            Table {order.table} &bull; {order.items.length} items
                          </p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openModal(order); }} 
                          className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors shrink-0" 
                          title="View Details"
                        >
                          <ReceiptText className="w-[18px] h-[18px]" />
                        </button>
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-1.5 bg-[#dbeafe] border border-[#bfdbfe] text-[#2563eb] rounded-full px-2.5 py-0.5 text-[10px] font-bold leading-none">
                          <Clock className="w-3.5 h-3.5" />
                          Target: {progressInfo.stageTargetDate}
                        </span>
                      </div>

                      {progressInfo.showProgressBar && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold my-0.5">
                          <StopwatchIcon className="w-3.5 h-3.5 text-[#f97316] shrink-0" />
                          <span className="truncate" title={progressInfo.displayText}>{progressInfo.displayText}</span>
                        </div>
                      )}

                      {progressInfo.showProgressBar && (
                        <div className="relative w-full h-1.5 rounded-full bg-slate-100 shadow-inner overflow-hidden">
                          <div 
                            className="h-full w-full rounded-full transition-transform duration-500"
                            style={progressStyle}
                          />
                        </div>
                      )}

                      {/* Cute Mascot Avatar Footer Row */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                        <svg viewBox="0 0 100 100" className="w-7 h-7 rounded-full border border-slate-100 shadow-sm shrink-0 bg-[#e2f8ec]">
                          <circle cx="50" cy="50" r="42" fill="#a7f3d0" />
                          <circle cx="34" cy="54" r="5" fill="#fecaca" opacity="0.8" />
                          <circle cx="66" cy="54" r="5" fill="#fecaca" opacity="0.8" />
                          <circle cx="40" cy="46" r="4.5" fill="#047857" />
                          <circle cx="60" cy="46" r="4.5" fill="#047857" />
                          <path d="M46 54 Q 50 58 54 54" fill="none" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-400">Chef Staff</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 3: QC & Plating */}
          <div 
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, "qa")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "qa")}
            className={`flex-1 min-w-[280px] max-w-[340px] flex flex-col border rounded-xl overflow-hidden h-full shadow-sm animate-fade-in transition-all duration-200 ${
              dragOverColumn === "qa" 
                ? "bg-[#ffedd5] border-[#fdbb2d] scale-[1.01] ring-2 ring-[#f97316]/20" 
                : "bg-[#f1f5f9] border-slate-200/80"
            }`}
          >
            <div className="bg-[#f97316] px-4 py-3.5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4.5 h-4.5 text-white/90 shrink-0" />
                <h2 className="text-[13px] font-bold tracking-wide">QC & Plating</h2>
              </div>
              <span className="w-5.5 h-5.5 rounded-full bg-black/15 flex items-center justify-center font-bold text-[11px] text-white">
                {qaOrders.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 scrollbar-none">
              {qaOrders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <span className="text-slate-400 text-xs">No orders pending approval</span>
                </div>
              ) : (
                qaOrders.map(order => {
                  const progressInfo = calculateProgressInfo(order, new Date());

                  const progressStyle = progressInfo.progressColorClass === 'progress-indicator-gradient'
                    ? { 
                        transform: `translateX(-${100 - progressInfo.percentage}%)`,
                        backgroundImage: 'linear-gradient(to right, rgb(220, 38, 38), rgb(255, 166, 0), rgb(255, 255, 0), rgb(128, 224, 31), rgb(28, 202, 144))'
                      }
                    : { 
                        width: `${progressInfo.percentage}%`,
                        backgroundColor: progressInfo.progressColorClass === 'bg-destructive' ? '#ef4444' : '#ffa600'
                      };

                  return (
                    <div 
                      key={order.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, order.id)}
                      onClick={() => moveOrder(order.id, "ready")}
                      className="bg-white border border-slate-205 hover:border-slate-350 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 relative group cursor-grab active:cursor-grabbing hover:scale-[0.99] active:scale-[0.97]"
                      title="Drag card to move or click to progress"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[13px] font-bold text-slate-800 tracking-tight">{order.id}</span>
                          <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5" title={`Table ${order.table} • ${order.items.length} items`}>
                            Table {order.table} &bull; {order.items.length} items
                          </p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openModal(order); }} 
                          className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors shrink-0" 
                          title="View Details"
                        >
                          <ReceiptText className="w-[18px] h-[18px]" />
                        </button>
                      </div>

                      {/* SLA Badge */}
                      <div>
                        <span className="inline-flex items-center gap-1.5 bg-[#fef3c7] border border-[#fde68a] text-[#d97706] rounded-full px-2.5 py-0.5 text-[10px] font-bold leading-none">
                          <Clock className="w-3.5 h-3.5" />
                          Target: {progressInfo.stageTargetDate}
                        </span>
                      </div>

                      {/* Time Remaining Tracker */}
                      {progressInfo.showProgressBar && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold my-0.5">
                          <StopwatchIcon className="w-3.5 h-3.5 text-[#f97316] shrink-0" />
                          <span className="truncate" title={progressInfo.displayText}>{progressInfo.displayText}</span>
                        </div>
                      )}

                      {/* SLA Progress Bar */}
                      {progressInfo.showProgressBar && (
                        <div className="relative w-full h-1.5 rounded-full bg-slate-100 shadow-inner overflow-hidden">
                          <div 
                            className="h-full w-full rounded-full transition-transform duration-500"
                            style={progressStyle}
                          />
                        </div>
                      )}

                      {/* Cute Mascot Avatar Footer Row */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                        <svg viewBox="0 0 100 100" className="w-7 h-7 rounded-full border border-slate-100 shadow-sm shrink-0 bg-[#e2f8ec]">
                          <circle cx="50" cy="50" r="42" fill="#a7f3d0" />
                          <circle cx="34" cy="54" r="5" fill="#fecaca" opacity="0.8" />
                          <circle cx="66" cy="54" r="5" fill="#fecaca" opacity="0.8" />
                          <circle cx="40" cy="46" r="4.5" fill="#047857" />
                          <circle cx="60" cy="46" r="4.5" fill="#047857" />
                          <path d="M46 54 Q 50 58 54 54" fill="none" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-400">QC Staff</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 4: Ready for Service */}
          <div 
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, "ready")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "ready")}
            className={`flex-1 min-w-[280px] max-w-[340px] flex flex-col border rounded-xl overflow-hidden h-full shadow-sm animate-fade-in transition-all duration-200 ${
              dragOverColumn === "ready" 
                ? "bg-[#d1fae5] border-[#34d399] scale-[1.01] ring-2 ring-[#059669]/20" 
                : "bg-[#f1f5f9] border-slate-200/80"
            }`}
          >
            <div className="bg-[#059669] px-4 py-3.5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-white/90 shrink-0" />
                <h2 className="text-[13px] font-bold tracking-wide">Ready for Service</h2>
              </div>
              <span className="w-5.5 h-5.5 rounded-full bg-black/15 flex items-center justify-center font-bold text-[11px] text-white">
                {readyOrders.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 scrollbar-none">
              {readyOrders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <span className="text-slate-400 text-xs">No orders waiting pickup</span>
                </div>
              ) : (
                readyOrders.map(order => {
                  const progressInfo = calculateProgressInfo(order, new Date());
                  
                  const progressStyle = progressInfo.progressColorClass === 'progress-indicator-gradient'
                    ? { 
                        transform: `translateX(-${100 - progressInfo.percentage}%)`,
                        backgroundImage: 'linear-gradient(to right, rgb(220, 38, 38), rgb(255, 166, 0), rgb(255, 255, 0), rgb(128, 224, 31), rgb(28, 202, 144))'
                      }
                    : { 
                        width: `${progressInfo.percentage}%`,
                        backgroundColor: progressInfo.progressColorClass === 'bg-destructive' ? '#ef4444' : '#ffa600'
                      };

                  return (
                    <div 
                      key={order.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, order.id)}
                      onClick={() => moveOrder(order.id, "delivered")}
                      className="bg-white border border-emerald-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 relative group cursor-grab active:cursor-grabbing hover:scale-[0.99] active:scale-[0.97]"
                      title="Drag card to move or click to progress"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[13px] font-bold text-slate-800 tracking-tight">{order.id}</span>
                          <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5" title={`Table ${order.table} • ${order.items.length} items`}>
                            Table {order.table} &bull; {order.items.length} items
                          </p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openModal(order); }} 
                          className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors shrink-0" 
                          title="View Details"
                        >
                          <ReceiptText className="w-[18px] h-[18px]" />
                        </button>
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-full px-2.5 py-0.5 text-[10px] font-bold leading-none">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Target: {progressInfo.stageTargetDate}
                        </span>
                      </div>

                      {progressInfo.showProgressBar && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold my-0.5">
                          <StopwatchIcon className="w-3.5 h-3.5 text-[#f97316] shrink-0" />
                          <span className="truncate" title={progressInfo.displayText}>{progressInfo.displayText}</span>
                        </div>
                      )}

                      {progressInfo.showProgressBar && (
                        <div className="relative w-full h-1.5 rounded-full bg-slate-100 shadow-inner overflow-hidden">
                          <div 
                            className="h-full w-full rounded-full transition-transform duration-500"
                            style={progressStyle}
                          />
                        </div>
                      )}

                      {/* Cute Mascot Avatar Footer Row */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                        <svg viewBox="0 0 100 100" className="w-7 h-7 rounded-full border border-slate-100 shadow-sm shrink-0 bg-[#e2f8ec]">
                          <circle cx="50" cy="50" r="42" fill="#a7f3d0" />
                          <circle cx="34" cy="54" r="5" fill="#fecaca" opacity="0.8" />
                          <circle cx="66" cy="54" r="5" fill="#fecaca" opacity="0.8" />
                          <circle cx="40" cy="46" r="4.5" fill="#047857" />
                          <circle cx="60" cy="46" r="4.5" fill="#047857" />
                          <path d="M46 54 Q 50 58 54 54" fill="none" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-400">Chef Staff</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 5: Served / Delivered */}
          <div 
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, "delivered")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "delivered")}
            className={`flex-1 min-w-[280px] max-w-[340px] flex flex-col border rounded-xl overflow-hidden h-full shadow-sm animate-fade-in transition-all duration-200 ${
              dragOverColumn === "delivered" 
                ? "bg-[#ccfbf1] border-[#2dd4bf] scale-[1.01] ring-2 ring-[#0f766e]/20" 
                : "bg-[#f1f5f9] border-slate-200/80"
            }`}
          >
            <div className="bg-[#0f766e] px-4 py-3.5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4.5 h-4.5 text-white/90 shrink-0" />
                <h2 className="text-[13px] font-bold tracking-wide">Served / Delivered</h2>
              </div>
              <span className="w-5.5 h-5.5 rounded-full bg-black/15 flex items-center justify-center font-bold text-[11px] text-white">
                {deliveredOrders.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 scrollbar-none">
              {deliveredOrders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <span className="text-slate-400 text-xs">No served orders</span>
                </div>
              ) : (
                deliveredOrders.map(order => {
                  const progressInfo = calculateProgressInfo(order, new Date());
                  
                  const progressStyle = progressInfo.progressColorClass === 'progress-indicator-gradient'
                    ? { 
                        transform: `translateX(-${100 - progressInfo.percentage}%)`,
                        backgroundImage: 'linear-gradient(to right, rgb(220, 38, 38), rgb(255, 166, 0), rgb(255, 255, 0), rgb(128, 224, 31), rgb(28, 202, 144))'
                      }
                    : { 
                        width: `${progressInfo.percentage}%`,
                        backgroundColor: progressInfo.progressColorClass === 'bg-destructive' ? '#ef4444' : '#ffa600'
                      };

                  return (
                    <div 
                      key={order.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, order.id)}
                      onClick={() => completeOrder(order.id)}
                      className="bg-white border border-[#0f766e]/30 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 relative group cursor-grab active:cursor-grabbing hover:scale-[0.99] active:scale-[0.97]"
                      title="Drag card to move or click to archive"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[13px] font-bold text-slate-800 tracking-tight">{order.id}</span>
                          <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5" title={`Table ${order.table} • ${order.items.length} items`}>
                            Table {order.table} &bull; {order.items.length} items
                          </p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openModal(order); }} 
                          className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors shrink-0" 
                          title="View Details"
                        >
                          <ReceiptText className="w-[18px] h-[18px]" />
                        </button>
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-full px-2.5 py-0.5 text-[10px] font-bold leading-none">
                          <Clock className="w-3.5 h-3.5" />
                          Target: {progressInfo.stageTargetDate}
                        </span>
                      </div>

                      {progressInfo.showProgressBar && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold my-0.5">
                          <StopwatchIcon className="w-3.5 h-3.5 text-[#f97316] shrink-0" />
                          <span className="truncate" title={progressInfo.displayText}>{progressInfo.displayText}</span>
                        </div>
                      )}

                      {progressInfo.showProgressBar && (
                        <div className="relative w-full h-1.5 rounded-full bg-slate-100 shadow-inner overflow-hidden">
                          <div 
                            className="h-full w-full rounded-full transition-transform duration-500"
                            style={progressStyle}
                          />
                        </div>
                      )}

                      {/* Cute Mascot Avatar Footer Row */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                        <svg viewBox="0 0 100 100" className="w-7 h-7 rounded-full border border-slate-100 shadow-sm shrink-0 bg-[#e2f8ec]">
                          <circle cx="50" cy="50" r="42" fill="#a7f3d0" />
                          <circle cx="34" cy="54" r="5" fill="#fecaca" opacity="0.8" />
                          <circle cx="66" cy="54" r="5" fill="#fecaca" opacity="0.8" />
                          <circle cx="40" cy="46" r="4.5" fill="#047857" />
                          <circle cx="60" cy="46" r="4.5" fill="#047857" />
                          <path d="M46 54 Q 50 58 54 54" fill="none" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-400">Runner</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </main>
      </div>

      {/* Modal Popup for Order Details */}
      {modalState !== "closed" && selectedOrder && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-200 ${
            modalState === "open" ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeModal}
        >
          <div 
            className={`t-modal bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full flex flex-col gap-4 text-left shadow-2xl ${
              modalState === "open" ? "is-open" : "is-closing"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">Order Details</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                    {selectedOrder.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Table {selectedOrder.table} &bull; {selectedOrder.items.length} items
                </p>
              </div>
              <button 
                type="button"
                onClick={closeModal}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges Info */}
            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
              {/* Priority */}
              <span className={`px-2.5 py-1 rounded-full border ${
                selectedOrder.priority === "high" 
                  ? "bg-red-50 text-red-600 border-red-200" 
                  : selectedOrder.priority === "medium"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-slate-50 text-slate-600 border-slate-200"
              }`}>
                {selectedOrder.priority} Priority
              </span>

              {/* Status */}
              <span className={`px-2.5 py-1 rounded-full border ${
                selectedOrder.status === "new"
                  ? "bg-sky-50 text-sky-600 border-sky-200"
                  : selectedOrder.status === "preparing"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : selectedOrder.status === "qa"
                      ? "bg-amber-50 text-amber-600 border-amber-200"
                      : selectedOrder.status === "ready"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-teal-50 text-teal-600 border-teal-200"
              }`}>
                Stage: {selectedOrder.status}
              </span>
            </div>

            {/* SLA Progress */}
            {(() => {
              const progressInfo = calculateProgressInfo(selectedOrder, new Date());
              return (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Target: {progressInfo.stageTargetDate}
                    </span>
                    <span className={progressInfo.isOverdue ? "text-red-500 font-extrabold" : "text-[#ff7a00]"}>
                      {progressInfo.displayText}
                    </span>
                  </div>
                  
                  {progressInfo.showProgressBar && (
                    <div className="relative w-full h-2 rounded-full bg-slate-200 shadow-inner overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          progressInfo.progressColorClass === "bg-destructive" ? "bg-red-500" : "bg-[#ff7a00]"
                        }`}
                        style={{ width: `${progressInfo.percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Items Checklist */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Ordered Items Checklist
                </label>
                <span className="text-[10px] text-slate-400 italic">
                  Tap items to toggle preparation check
                </span>
              </div>
              
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {selectedOrder.items.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => toggleItemChecked(selectedOrder.id, idx)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      item.checked 
                        ? "bg-slate-50 border-slate-200 text-slate-400" 
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-sm"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                        item.checked 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : "border-slate-300 hover:border-slate-400 bg-white"
                      }`}
                    >
                      {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-tight ${item.checked ? "line-through text-slate-400" : ""}`}>
                        {item.name} <span className="text-[#ff7a00] font-black">x{item.quantity}</span>
                      </p>
                      {item.notes && (
                        <p className={`text-[10px] italic mt-1 ${item.checked ? "text-slate-400" : "text-slate-500"}`}>
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-slate-100 pt-4 mt-1">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Back to Board
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const statusTransitions: Record<KitchenOrder["status"], KitchenOrder["status"] | "archive"> = {
                    new: "preparing",
                    preparing: "qa",
                    qa: "ready",
                    ready: "delivered",
                    delivered: "archive"
                  };
                  const next = statusTransitions[selectedOrder.status];
                  if (next === "archive") {
                    completeOrder(selectedOrder.id);
                  } else {
                    moveOrder(selectedOrder.id, next);
                  }
                  closeModal();
                }}
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all shadow-md hover:shadow-lg active:scale-95 ${
                  selectedOrder.status === "new"
                    ? "bg-[#0082c9] hover:bg-[#0082c9]/90"
                    : selectedOrder.status === "preparing"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : selectedOrder.status === "qa"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : selectedOrder.status === "ready"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {selectedOrder.status === "new" && "Start Preparing"}
                {selectedOrder.status === "preparing" && "Send to QA"}
                {selectedOrder.status === "qa" && "Ready for Delivery"}
                {selectedOrder.status === "ready" && "Complete & Deliver"}
                {selectedOrder.status === "delivered" && "Archive Order"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
