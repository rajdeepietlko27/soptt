"use client";

import { Calendar, MapPin, Users, Trash2, X, QrCode, Eye } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EventCard({
  event,
  onClick,
  onDelete,
  variant = "grid", // "grid" or "list"
  action = null, // "event" | "ticket" | null
  className = "",
}) {
  // List variant (compact horizontal layout)
  if (variant === "list") {
    return (
      <Card
        className={`py-0 group cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50 bg-gray-950 border-gray-700 text-white ${className}`}
        onClick={onClick}
      >
        <CardContent className="p-3 flex gap-3">
          {/* Event Image */}
          <div className="w-20 h-20 rounded-lg shrink-0 overflow-hidden relative">
            {event.coverImage ? (
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center text-3xl"
                style={{ backgroundColor: event.themeColor }}
              >
                {getCategoryIcon(event.category)}
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 group-hover:text-purple-400 transition-colors line-clamp-2">
              {event.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-1">
              {format(event.startDate, "EEE, dd MMM, HH:mm")}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">
                {event.locationType === "online" ? "Online Event" : event.city}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{event.registrationCount} attending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant (default - original design)
  return (
    <Card
      className={`overflow-hidden group pt-0 bg-gray-900 border-gray-800 text-white rounded-2xl ${onClick ? "cursor-pointer hover:shadow-xl transition-all hover:border-purple-500/40" : ""} ${className}`}
      onClick={onClick}
    >
      {/* Image - taller to match target */}
      <div className="relative h-56 overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={500}
            height={224}
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ backgroundColor: event.themeColor }}
          >
            {getCategoryIcon(event.category)}
          </div>
        )}

        {/* Paid/Free badge - top right of image */}
        <div className="absolute top-2 right-2">
          <span className="bg-gray-800/80 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">
            {event.ticketType === "free" ? "Free" : "Paid"}
          </span>
        </div>
      </div>

      <CardContent className="px-4 py-3 space-y-2.5">
        {/* Category - small icon + label, no border */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="text-base leading-none">
            {getCategoryIcon(event.category)}
          </span>
          <span className="font-medium tracking-wide uppercase text-[11px]">
            {getCategoryLabel(event.category)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-purple-400 transition-colors">
          {event.title}
        </h3>

        {/* Meta info */}
        <div className="space-y-1.5 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{format(event.startDate, "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">
              {event.locationType === "online"
                ? "Online Event"
                : `${event.city}, ${event.state || event.country}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>
              {event.registrationCount} / {event.capacity} registered
            </span>
          </div>
        </div>

        {/* Action buttons */}
        {action && (
          <div className="flex gap-2 pt-1">
            {/* ✅ FIXED: added text-gray-200 and dark border so text is visible */}
            <Button
  variant="outline"
  size="sm"
  className="flex-1 gap-2 bg-gray-800 text-gray-100 border-gray-600 hover:bg-gray-700 hover:text-white"
  onClick={(e) => {
    e.stopPropagation();
    onClick?.(e);
  }}
>
              {action === "event" ? (
                <><Eye className="w-4 h-4" />View</>
              ) : (
                <><QrCode className="w-4 h-4" />Show Ticket</>
              )}
            </Button>

            {/* ✅ FIXED: dark-friendly red button */}
            {onDelete && (
              <Button
  variant="outline"
  size="sm"
  className="gap-2 bg-gray-800 border-gray-600 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
  onClick={(e) => {
    e.stopPropagation();
    onDelete(event._id);
  }}
>
                {action === "event" ? (
                  <Trash2 className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}