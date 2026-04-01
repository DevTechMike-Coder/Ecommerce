"use client"

import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  WalletCards, 
  ShieldCheck,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types for better safety
type PaymentMethod = "paymentOnDelivery" | "stripe" | "paypal";

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentOption[] = [
  {
    id: "paymentOnDelivery",
    name: "Cash on Delivery",
    description: "Pay on arrival.",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    id: "stripe",
    name: "Card (Mastercard/Verve)",
    description: "Secure card payments.",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Digital wallet.",
    icon: <WalletCards className="h-5 w-5" />,
  },
];

export default function Checkout() {
  const [selected, setSelected] = useState<PaymentMethod>("paymentOnDelivery");
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to handle the final submission based on selection
  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    switch (selected) {
      case "paymentOnDelivery":
        console.log("Processing COD: Creating order with PENDING status.");
        break;
      case "stripe":
        console.log("Processing Card: Initializing Stripe Elements for Mastercard/Verve/Visa.");
        break;
      case "paypal":
        console.log("Initiating PayPal flow.");
        break;
    }
    
    setIsProcessing(false);
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/30 min-h-screen">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-center md:text-left">Checkout</h1>
          <p className="text-sm text-muted-foreground text-center md:text-left">Complete your purchase securely.</p>
        </div>

        <div className="grid gap-6">
          {/* Step 1: Selection */}
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  1
                </div>
                <CardTitle className="text-md font-semibold leading-none tracking-tight">
                  Payment Method
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="px-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => {
                  const isSelected = selected === method.id;
                  
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelected(method.id)}
                      className="group relative"
                    >
                      <Card className={`relative cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-primary/20 ${
                        isSelected 
                          ? "border-primary bg-primary/2 ring-1 ring-primary/20 shadow-sm" 
                          : "border-border bg-card shadow-sm"
                      }`}>
                        <CardContent className="flex flex-col items-center text-center p-4 space-y-3">
                          <div className="absolute top-2 right-2 h-4 w-4">
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                >
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                            isSelected 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted text-muted-foreground group-hover:bg-accent"
                          }`}>
                            {method.icon}
                          </div>

                          <div className="space-y-1">
                            <h3 className={`text-sm font-semibold leading-none transition-colors ${
                              isSelected ? "text-primary" : "text-card-foreground"
                            }`}>
                              {method.name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground leading-tight">
                              {method.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Method Specific Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {selected === "paymentOnDelivery" && "Confirm Delivery Details"}
                    {selected === "stripe" && "Card Information"}
                    {selected === "paypal" && "PayPal Express Checkout"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground pb-6">
                  {selected === "paymentOnDelivery" && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                      <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                      <p className="text-xs leading-relaxed">
                        You will pay the total amount to the courier upon arrival. Please ensure you have the exact change or a mobile payment method ready.
                      </p>
                    </div>
                  )}
                  {selected === "stripe" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Supported Networks</span>
                        <div className="flex items-center gap-2 grayscale opacity-70">
                          {/* Inline SVG placeholders for Mastercard and Verve */}
                          <div className="flex gap-1 items-center bg-muted px-1.5 py-0.5 rounded text-[9px] font-bold">
                            MASTERCARD
                          </div>
                          <div className="flex gap-1 items-center bg-muted px-1.5 py-0.5 rounded text-[9px] font-bold">
                            VERVE
                          </div>
                          <div className="flex gap-1 items-center bg-muted px-1.5 py-0.5 rounded text-[9px] font-bold">
                            VISA
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid gap-2">
                          <div className="h-9 w-full bg-muted/50 rounded border border-border flex items-center px-3 text-xs">
                             Card number
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-9 bg-muted/50 rounded border border-border flex items-center px-3 text-xs">
                               MM / YY
                            </div>
                            <div className="h-9 bg-muted/50 rounded border border-border flex items-center px-3 text-xs">
                               CVC
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-center italic text-muted-foreground">
                          Securely processed by Stripe. Mastercard and Verve cards accepted.
                        </p>
                      </div>
                    </div>
                  )}
                  {selected === "paypal" && (
                    <div className="flex flex-col items-center justify-center py-4 space-y-2">
                      <WalletCards className="h-8 w-8 text-blue-600 opacity-50" />
                      <p className="text-xs text-center">
                        You will be redirected to PayPal to securely complete your purchase.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Place Order Action Card */}
          <Card className="border border-border shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center md:text-left">
                  <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">Secure Checkout</p>
                    <p className="text-[10px] text-muted-foreground max-w-[240px]">
                      Encrypted transaction. Details are never stored.
                    </p>
                  </div>
                </div>
                <button 
                  disabled={isProcessing}
                  onClick={handlePayment}
                  className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground text-sm font-bold rounded-md shadow-md shadow-primary/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isProcessing ? "Processing..." : "Complete Purchase"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}