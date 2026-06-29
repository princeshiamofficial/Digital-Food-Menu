"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Menu, 
  X, 
  Bell, 
  ArrowUpRight, 
  Plus, 
  UtensilsCrossed 
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    router.push("/login");
  };

  // Mock Dashboard Stats Data
  const stats = [
    { label: "Total Revenue", value: "$4,850.50", change: "+14.2%", isPositive: true, icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Orders", value: "18", change: "+6 new", isPositive: true, icon: ShoppingBag, color: "text-amber-600 bg-amber-50" },
    { label: "Table Occupancy", value: "12 / 16", change: "75%", isPositive: true, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Average Bill", value: "$38.20", change: "-2.4%", isPositive: false, icon: TrendingUp, color: "text-rose-600 bg-rose-50" },
  ];

  // Mock Chart Data (Days and heights in %)
  const weeklyRevenue = [
    { day: "Mon", amount: "$520", height: "45%" },
    { day: "Tue", amount: "$680", height: "60%" },
    { day: "Wed", amount: "$840", height: "75%" },
    { day: "Thu", amount: "$710", height: "65%" },
    { day: "Fri", amount: "$1,120", height: "95%" },
    { day: "Sat", amount: "$1,250", height: "100%" },
    { day: "Sun", amount: "$980", height: "85%" },
  ];

  // Mock Recent Orders
  const recentOrders = [
    { id: "ORD-8821", table: "04", items: "2x Classic Burger, 1x Truffle Fries", total: "$27.00", status: "Preparing", time: "5 min ago" },
    { id: "ORD-8820", table: "12", items: "1x Truffle Mushroom Pizza, 1x Mint Lemonade", total: "$21.50", status: "Pending", time: "8 min ago" },
    { id: "ORD-8819", table: "08", items: "1x Dragon Roll, 1x Sichuan Wontons", total: "$33.50", status: "Served", time: "15 min ago" },
    { id: "ORD-8818", table: "02", items: "3x Carbonara Pasta, 3x Soft Drinks", total: "$62.00", status: "Paid", time: "22 min ago" },
  ];

  // Mock Popular Items
  const popularItems = [
    { name: "Smoked BBQ Bacon Burger", orders: 142, revenue: "$1,775", rating: 4.9 },
    { name: "Truffle Mushroom Pizza", orders: 118, revenue: "$2,124", rating: 4.8 },
    { name: "Dragon Sushi Roll Platter", orders: 96, revenue: "$2,160", rating: 5.0 },
    { name: "Truffle Parmesan Fries", orders: 84, revenue: "$420", rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 font-sans overflow-hidden">
      
      {/* Desktop Sidebar (Left side, sticky) */}
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

      {/* Mobile Drawer Sidebar overlay */}
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

      {/* Main Dashboard Panel */}
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
            <h1 className="text-[17px] font-semibold tracking-wide text-slate-800">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-850 transition-colors relative">
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

        {/* Content Body */}
        <main className="p-6 max-w-[1400px] w-full mx-auto flex-1 flex flex-col gap-6">
          
          {/* Section: Welcome */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-white via-white to-slate-50/50 border border-slate-200 rounded-[16px] p-5 shadow-sm">
            <div>
              <h2 className="text-[19px] font-bold text-slate-900 tracking-wide">Welcome Back, Color Hut!</h2>
              <p className="text-xs text-slate-500 mt-1">Here is a summary of your restaurant performance today.</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase px-4 py-2.5 bg-[#ff7a00] hover:bg-[#e06c00] text-white rounded-[12px] shadow-[0_4px_12px_rgba(255,122,0,0.2)] transition-all shrink-0 self-start sm:self-auto hover:translate-y-[-1px]">
              <Plus className="w-4 h-4" /> New Order
            </button>
          </div>

          {/* Section: Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={i} 
                  className="bg-white border border-slate-200 rounded-[16px] p-5 flex items-center justify-between shadow-sm transition-all duration-200 hover:border-slate-300 hover:translate-y-[-2px]"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">{stat.label}</span>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">{stat.value}</span>
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${stat.isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                      {stat.change} <span className="text-slate-400 font-normal">vs yesterday</span>
                    </span>
                  </div>
                  <div className={`p-3.5 rounded-[14px] ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section: Chart & Popular Items */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Chart Block */}
            <div className="bg-white border border-slate-200 rounded-[18px] p-5 shadow-sm flex flex-col gap-4 xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-wide">Weekly Revenue Trend</h3>
                  <p className="text-[11px] text-slate-500">Track earnings growth across the week</p>
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-medium text-slate-655">
                  This Week
                </div>
              </div>
              
              {/* Custom SVG/HTML Bar Chart */}
              <div className="h-[210px] w-full flex items-end gap-3 px-2 pt-6 pb-2 select-none">
                {weeklyRevenue.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute translate-y-[-140%] bg-slate-850 text-white font-semibold text-[10px] py-1 px-2 rounded shadow-md pointer-events-none z-10">
                      {item.amount}
                    </div>
                    {/* Bar */}
                    <div 
                      style={{ height: item.height }}
                      className="w-full rounded-[8px] bg-gradient-to-t from-[#ff7a00]/70 to-[#ff7a00] group-hover:from-amber-500 group-hover:to-[#ff7a00] transition-all duration-300 relative shadow-[0_2px_8px_rgba(255,122,0,0.15)] overflow-hidden"
                    >
                      {/* Highlight sweep */}
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </div>
                    {/* Label */}
                    <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Items Block */}
            <div className="bg-white border border-slate-200 rounded-[18px] p-5 shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-wide">Popular Choices</h3>
                <p className="text-[11px] text-slate-500">Most requested dishes today</p>
              </div>

              <div className="flex flex-col gap-3.5">
                {popularItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex flex-col gap-1 max-w-[70%]">
                      <span className="text-xs font-semibold text-slate-800 truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span>{item.orders} orders</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[#ff7a00] font-medium">★ {item.rating}</span>
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-slate-900">{item.revenue}</span>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase flex items-center">
                        Active <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section: Recent Live Orders */}
          <div className="bg-white border border-slate-200 rounded-[18px] p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                  <span>Recent Activity Log</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">Live order state notifications from tablet scans</p>
              </div>
              <button 
                onClick={() => router.push("/orders")}
                className="text-[10px] font-bold text-[#ff7a00] hover:text-slate-800 uppercase tracking-wider transition-colors"
              >
                View All Orders
              </button>
            </div>

            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold tracking-wider uppercase text-slate-500">
                    <th className="pb-3 pl-2">Order ID</th>
                    <th className="pb-3">Table</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3 text-right">Price</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right pr-2">Elapsed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {recentOrders.map((ord, idx) => {
                    let statusColor = "text-slate-500 bg-slate-100 border-slate-200/50";
                    if (ord.status === "Preparing") statusColor = "text-amber-600 bg-amber-50 border-amber-200/50";
                    if (ord.status === "Pending") statusColor = "text-[#ff7a00] bg-orange-550/10 border-orange-200/50";
                    if (ord.status === "Served") statusColor = "text-blue-600 bg-blue-50 border-blue-200/50";
                    if (ord.status === "Paid") statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200/50";

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3.5 pl-2 font-semibold text-slate-700 group-hover:text-slate-900">{ord.id}</td>
                        <td className="py-3.5 font-bold text-[#ff7a00]">Table {ord.table}</td>
                        <td className="py-3.5 text-slate-600 max-w-[200px] truncate">{ord.items}</td>
                        <td className="py-3.5 text-right font-bold text-slate-900">{ord.total}</td>
                        <td className="py-3.5 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right pr-2 text-slate-550">{ord.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}
