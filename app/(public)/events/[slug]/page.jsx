/* eslint-disable react-hooks/purity */
"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Ticket,
  ExternalLink,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import RegisterModal from "./_components/register-modal";

function darkenColor(color, amount) {
  const colorWithoutHash = color.replace("#", "");
  const num = parseInt(colorWithoutHash, 16);
  const r = Math.max(0, (num >> 16) - amount * 255);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount * 255);
  const b = Math.max(0, (num & 0x0000ff) - amount * 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { data: event, isLoading } = useConvexQuery(api.events.getEventBySlug, {
    slug: params.slug,
  });

  const { data: registration } = useConvexQuery(
    api.registrations.checkRegistration,
    event?._id ? { eventId: event._id } : "skip"
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description.slice(0, 100) + "...",
          url,
        });
      } catch (error) {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleRegister = () => {
    if (!user) {
      toast.error("Please sign in to register");
      return;
    }
    setShowRegisterModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!event) notFound();

  const isEventFull = event.registrationCount >= event.capacity;
  const isEventPast = event.endDate < Date.now();
  const isOrganizer = user?.id === event.organizerId;

  const cardBg = event.themeColor ? darkenColor(event.themeColor, 0.04) : "#1e3a8a";

  return (
    <div
      style={{ backgroundColor: event.themeColor || "#1e3a8a" }}
      className="min-h-screen py-8 -mt-6 md:-mt-16 lg:-mx-5 text-white"
    >
      <div className="max-w-7xl mx-auto px-8">
        {/* Event Title & Info */}
        <div className="mb-8">
          {/* ✅ dark-friendly category badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
            <span>{getCategoryIcon(event.category)}</span>
            <span>{getCategoryLabel(event.category)}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/70">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{format(event.startDate, "EEEE, MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {format(event.startDate, "h:mm a")} -{" "}
                {format(event.endDate, "h:mm a")}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {event.coverImage && (
          <div className="relative h-[400px] rounded-2xl overflow-hidden mb-6">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Description */}
            <Card className="pt-0 border-white/10" style={{ backgroundColor: cardBg }}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">About This Event</h2>
                <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="pt-0 border-white/10" style={{ backgroundColor: cardBg }}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-purple-300" />
                  Location
                </h2>
                <div className="space-y-3">
                  <p className="font-medium text-white">
                    {event.city}, {event.state || event.country}
                  </p>
                  {event.address && (
                    <p className="text-sm text-white/70">{event.address}</p>
                  )}
                  {event.venue && (
                    <Button
                      variant="outline"
                      asChild
                      className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                    >
                      <a href={event.venue} target="_blank" rel="noopener noreferrer">
                        View on Map
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organizer */}
            <Card className="pt-0 border-white/10" style={{ backgroundColor: cardBg }}>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Organizer</h2>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-white/20 text-white">
                      {event.organizerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{event.organizerName}</p>
                    <p className="text-sm text-white/60">Event Organizer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="overflow-hidden py-0 border-white/10" style={{ backgroundColor: cardBg }}>
              <CardContent className="p-6 space-y-4">
                {/* Price */}
                <div>
                  <p className="text-sm text-white/60 mb-1">Price</p>
                  <p className="text-3xl font-bold text-white">
                    {event.ticketType === "free" ? "Free" : `₹${event.ticketPrice}`}
                  </p>
                  {event.ticketType === "paid" && (
                    <p className="text-xs text-white/60 mt-1">Pay at event offline</p>
                  )}
                </div>

                <Separator className="bg-white/20" />

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/60">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Attendees</span>
                    </div>
                    <p className="font-semibold text-white">
                      {event.registrationCount} / {event.capacity}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Date</span>
                    </div>
                    <p className="font-semibold text-sm text-white">
                      {format(event.startDate, "MMM dd")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/60">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Time</span>
                    </div>
                    <p className="font-semibold text-sm text-white">
                      {format(event.startDate, "h:mm a")}
                    </p>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                {/* Registration Button */}
                {registration ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">You&apos;re registered!</span>
                    </div>
                    <Button
                      className="w-full gap-2 bg-white text-black hover:bg-gray-100"
                      onClick={() => router.push("/my-tickets")}
                    >
                      <Ticket className="w-4 h-4" />
                      View Ticket
                    </Button>
                  </div>
                ) : isEventPast ? (
                  <Button className="w-full" disabled>Event Ended</Button>
                ) : isEventFull ? (
                  <Button className="w-full" disabled>Event Full</Button>
                ) : isOrganizer ? (
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-100"
                    onClick={() => router.push(`/events/${event.slug}/manage`)}
                  >
                    Manage Event
                  </Button>
                ) : (
                  <Button
                    className="w-full gap-2 bg-white text-black hover:bg-gray-100"
                    onClick={handleRegister}
                  >
                    <Ticket className="w-4 h-4" />
                    Register for Event
                  </Button>
                )}

                {/* Share Button */}
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  Share Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showRegisterModal && (
        <RegisterModal
          event={event}
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}