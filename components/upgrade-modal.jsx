"use client";

import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PricingTable } from "@clerk/nextjs";

export default function UpgradeModal({ isOpen, onClose, trigger = "limit" }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-950 border-gray-800 text-white p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <DialogTitle className="text-2xl text-white">Upgrade to Pro</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 mt-1">
            {trigger === "header" && "Create Unlimited Events with Pro! "}
            {trigger === "limit" && "You've reached your free event limit. "}
            {trigger === "color" && "Custom theme colors are a Pro feature. "}
            Unlock unlimited events and premium features!
          </DialogDescription>
        </DialogHeader>

        {/* Pricing Table - dark forced via appearance */}
        <div className="rounded-xl overflow-hidden">
          <PricingTable
            appearance={{
              baseTheme: undefined,
              variables: {
                colorBackground: "#111827",
                colorText: "#f9fafb",
                colorTextSecondary: "#9ca3af",
                colorPrimary: "#a855f7",
                colorNeutral: "#374151",
                borderRadius: "0.75rem",
              },
              elements: {
                pricingTable: {
                  background: "transparent",
                },
                planCard: {
                  background: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "0.75rem",
                },
                planCardTitle: {
                  color: "#f9fafb",
                  fontWeight: "700",
                },
                planCardPrice: {
                  color: "#f9fafb",
                },
                planCardFeatureText: {
                  color: "#d1d5db",
                },
                planCardBadge: {
                  background: "#374151",
                  color: "#f9fafb",
                },
                button: {
                  background: "#ffffff",
                  color: "#000000",
                  borderRadius: "0.5rem",
                  "&:hover": { background: "#e5e7eb" },
                },
              },
              layout: {
                shimmer: false,
              },
            }}
            checkoutProps={{
              appearance: {
                elements: {
                  drawerRoot: { zIndex: 2000 },
                },
              },
            }}
          />
        </div>

        {/* Footer */}
        <div className="mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}