"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Settings,
  Store,
  CreditCard,
  Globe,
  Save,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  // Form states
  const [storeName, setStoreName] = useState("Next Ecommerce");
  const [storeEmail, setStoreEmail] = useState("support@nextecommerce.com");
  const [stockThreshold, setStockThreshold] = useState("5");
  const [enableStripe, setEnableStripe] = useState(true);
  const [enableCod, setEnableCod] = useState(true);
  const [currency, setCurrency] = useState("USD");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate database saving delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSaving(false);
    toast.success("Settings saved successfully", {
      description: "Store configurations have been updated on the database.",
      icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-4 md:px-10 py-8 max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            <Link href="/admin" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground uppercase flex items-center gap-3">
            Settings <Settings className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure store metadata, payment gateway toggles, and localization preferences.
          </p>
        </div>
      </motion.div>

      {/* Tabs Layout */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "general"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Store className="w-4 h-4" /> General Info
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "payments"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Payments
          </button>
          <button
            onClick={() => setActiveTab("localization")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "localization"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Globe className="w-4 h-4" /> Localization
          </button>
        </div>

        {/* Content Box */}
        <div className="md:col-span-3 bg-card border border-border/60 rounded-3xl p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === "general" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">
                  Store Information
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-secondary/50 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-hidden focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="w-full bg-secondary/50 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-hidden focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Low Stock Warning Threshold
                  </label>
                  <input
                    type="number"
                    value={stockThreshold}
                    onChange={(e) => setStockThreshold(e.target.value)}
                    className="w-full bg-secondary/50 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-hidden focus:border-primary"
                    min="1"
                    required
                  />
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">
                  Payment Providers
                </h3>

                {/* Stripe Card Payment */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/40">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-foreground">Stripe Card Processing</p>
                    <p className="text-xs text-muted-foreground">
                      Accept secure credit card checkouts globally.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableStripe(!enableStripe)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      enableStripe ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-sm ring-0 transition duration-200 ease-in-out ${
                        enableStripe ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Cash on Delivery */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/40">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-foreground">Cash on Delivery (COD)</p>
                    <p className="text-xs text-muted-foreground">
                      Allow customers to pay physical cash upon shipping arrival.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableCod(!enableCod)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      enableCod ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-sm ring-0 transition duration-200 ease-in-out ${
                        enableCod ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "localization" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">
                  Regional Settings
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Store Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-secondary/50 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-hidden focus:border-primary"
                  >
                    <option value="USD">USD - United States Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                    <option value="CAD">CAD - Canadian Dollar (C$)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-border/40 flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.main>
  );
}
