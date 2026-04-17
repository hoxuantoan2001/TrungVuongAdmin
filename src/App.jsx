import {
  Calendar,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Presentation,
  Settings,
  Ticket,
  X
} from 'lucide-react';
import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import BookingPriceConfig from './components/BookingPriceConfig';
import Dashboard from './components/Dashboard';
import Review from './components/Review';
import ReviewConfig from './components/ReviewConfig';
import RoomBooking from './components/RoomBooking';
import ShowManagement from './components/ShowManagement';
import TicketBooking from './components/TicketBooking';
import TicketPriceConfig from './components/TicketPriceConfig';
import { SHOWS, cx } from './data';

const NAV_SECTIONS = [
  {
    title: 'QUẢN LÝ',
    items: [
      { key: 'dashboard', label: 'Trang tổng quan', icon: LayoutDashboard, path: '/' },
      { key: 'shows', label: 'Quản lý show diễn', icon: Presentation, path: '/shows' },
      { key: 'tickets', label: 'Đặt vé', icon: Ticket, path: '/tickets' },
      { key: 'rooms', label: 'Booking phòng diễn', icon: Calendar, path: '/rooms' },
      { key: 'reviews', label: 'Khảo sát & đánh giá', icon: MessageSquareText, path: '/reviews' },
    ]
  },
  {
    title: 'CẤU HÌNH',
    items: [
      { key: 'ticket-config', label: 'Config giá vé', icon: DollarSign, path: '/config/tickets' },
      { key: 'booking-config', label: 'Config giá booking', icon: Settings, path: '/config/booking' },
      { key: 'review-config', label: 'Config đánh giá', icon: ClipboardList, path: '/config/reviews' },
    ]
  }
];

/* Flat list for route matching */
const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap(s => s.items);

function AppContent() {
  const location = useLocation();
  const [selectedShow, setSelectedShow] = useState(SHOWS[0]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = ALL_NAV_ITEMS.find(item => item.path === location.pathname) || ALL_NAV_ITEMS[0];

  /* Shared sidebar inner content – reused for desktop & mobile drawer */
  const sidebarContent = (
    <>
      <div className="px-6 py-8">
        <div className="rounded-xl bg-blue-600 p-4 text-white shadow-sm">
          <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
            PLATFORM
          </div>
          <div className="text-lg font-black leading-none tracking-tight">Admin Trung Vương</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map(({ key, label, path, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={key}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={cx(
                      'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-bold transition-all',
                      active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-300'} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-md">
            TV
          </div>
          <div>
            <div className="text-sm font-black text-slate-800">Admin TVT</div>
            <div className="text-[10px] font-medium text-slate-400">Hệ thống quản trị bộ phận</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">

        {/* ── Desktop Sidebar (xl+) ── */}
        <aside className="hidden w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white shadow-[1px_0_10px_rgba(0,0,0,0.02)] xl:flex">
          {sidebarContent}
        </aside>

        {/* ── Mobile Sidebar Drawer (< xl) ── */}
        <div
          className={cx(
            'fixed inset-0 z-50 xl:hidden transition-opacity duration-300',
            mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
          )}
        >
          {/* Overlay */}
          <div
            className={cx(
              'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
              mobileOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <aside
            className={cx(
              'absolute left-0 top-0 h-full w-[280px] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X size={20} />
            </button>

            {sidebarContent}
          </aside>
        </div>

        {/* ── Main Workspace ── */}
        <main className="h-screen min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
          {/* Header Bar */}
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-5 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Hamburger – visible below xl */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex xl:hidden items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Mở menu"
              >
                <Menu size={22} />
              </button>

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Hệ thống Nhà hát Trưng Vương
                </div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                  {activeItem.label}
                </h1>
              </div>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="mx-auto max-w-full p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/shows" element={<ShowManagement />} />
              <Route path="/tickets" element={<TicketBooking />} />
              <Route path="/rooms" element={<RoomBooking />} />
              <Route path="/reviews" element={<Review selectedShow={selectedShow} />} />
              <Route path="/config/tickets" element={<TicketPriceConfig />} />
              <Route path="/config/booking" element={<BookingPriceConfig />} />
              <Route path="/config/reviews" element={<ReviewConfig />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function TheaterEvaluationPrototype() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}