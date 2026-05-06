import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import BookingModal, { type BookingMode, type BookingPrefill } from "./BookingModal";

const Layout = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill | undefined>(undefined);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  /**
   * openBooking — opens the booking modal. Optionally pre-fills the service
   * field and forces a mode (consultation / migration) so a click on a clinic
   * or migration card lands the visitor on the right form, with that service
   * already selected.
   */
  const openBooking = (service?: string, mode?: BookingMode) => {
    setPrefill(service || mode ? { service, mode } : undefined);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onBookClick={() => openBooking()} />
      <main className="flex-1">
        <Outlet context={{ openBooking }} />
      </main>
      <Footer />
      <WhatsAppButton />
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        prefill={prefill}
      />
    </div>
  );
};

export default Layout;
