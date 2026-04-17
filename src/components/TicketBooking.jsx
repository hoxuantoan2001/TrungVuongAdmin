import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from 'chart.js';
import { CreditCard, Tag, Ticket, TrendingDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { cx } from '../data';
import TimeFilter from './TimeFilter';

ChartJS.register(ArcElement, Tooltip, Legend);

/* ── Mock data keyed by time range ── */
const TICKET_DATA_BY_PERIOD = {
  all: {
    totalTickets: 2450, soldTickets: 1890, availableTickets: 560, bookingRate: '77%',
    byType: [150, 450, 800, 490],
    history: [
      { name: 'Nguyễn Văn A', type: 'VIP', qty: 2, status: 'Completed' },
      { name: 'Trần Thị B', type: 'Standard', qty: 4, status: 'Pending' },
      { name: 'Lê Văn C', type: 'VVIP', qty: 1, status: 'Completed' },
      { name: 'Phạm Minh D', type: 'Economic', qty: 3, status: 'Cancelled' },
      { name: 'Hoàng Anh E', type: 'VIP', qty: 2, status: 'Completed' },
    ]
  },
  '7d': {
    totalTickets: 350, soldTickets: 280, availableTickets: 70, bookingRate: '80%',
    byType: [20, 80, 120, 60],
    history: [
      { name: 'Nguyễn Văn A', type: 'VIP', qty: 2, status: 'Completed' },
      { name: 'Trần Thị B', type: 'Standard', qty: 4, status: 'Pending' },
    ]
  },
  '30d': {
    totalTickets: 980, soldTickets: 760, availableTickets: 220, bookingRate: '78%',
    byType: [55, 180, 320, 205],
    history: [
      { name: 'Nguyễn Văn A', type: 'VIP', qty: 2, status: 'Completed' },
      { name: 'Trần Thị B', type: 'Standard', qty: 4, status: 'Pending' },
      { name: 'Lê Văn C', type: 'VVIP', qty: 1, status: 'Completed' },
    ]
  },
  '90d': {
    totalTickets: 1600, soldTickets: 1200, availableTickets: 400, bookingRate: '75%',
    byType: [95, 300, 520, 285],
    history: [
      { name: 'Nguyễn Văn A', type: 'VIP', qty: 2, status: 'Completed' },
      { name: 'Trần Thị B', type: 'Standard', qty: 4, status: 'Pending' },
      { name: 'Lê Văn C', type: 'VVIP', qty: 1, status: 'Completed' },
      { name: 'Phạm Minh D', type: 'Economic', qty: 3, status: 'Cancelled' },
    ]
  },
  '6m': {
    totalTickets: 2100, soldTickets: 1650, availableTickets: 450, bookingRate: '79%',
    byType: [130, 400, 700, 420],
    history: [
      { name: 'Nguyễn Văn A', type: 'VIP', qty: 2, status: 'Completed' },
      { name: 'Trần Thị B', type: 'Standard', qty: 4, status: 'Pending' },
      { name: 'Lê Văn C', type: 'VVIP', qty: 1, status: 'Completed' },
      { name: 'Phạm Minh D', type: 'Economic', qty: 3, status: 'Cancelled' },
      { name: 'Hoàng Anh E', type: 'VIP', qty: 2, status: 'Completed' },
    ]
  },
  '1y': {
    totalTickets: 2450, soldTickets: 1890, availableTickets: 560, bookingRate: '77%',
    byType: [150, 450, 800, 490],
    history: [
      { name: 'Nguyễn Văn A', type: 'VIP', qty: 2, status: 'Completed' },
      { name: 'Trần Thị B', type: 'Standard', qty: 4, status: 'Pending' },
      { name: 'Lê Văn C', type: 'VVIP', qty: 1, status: 'Completed' },
      { name: 'Phạm Minh D', type: 'Economic', qty: 3, status: 'Cancelled' },
      { name: 'Hoàng Anh E', type: 'VIP', qty: 2, status: 'Completed' },
    ]
  },
};

function TicketMetric({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={cx("p-3 rounded-xl", colorClass)}>
          <Icon size={20} />
        </div>
        <div>
          <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function TicketBooking() {
  const [period, setPeriod] = useState('all');

  const data = TICKET_DATA_BY_PERIOD[period];

  const doughnutData = useMemo(() => ({
    labels: ['VVIP', 'VIP', 'Standard', 'Economic'],
    datasets: [{
      label: 'Số vé bán ra',
      data: data.byType,
      backgroundColor: ['#7c3aed', '#2563eb', '#10b981', '#f59e0b'],
    }]
  }), [data]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Time filter */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Tổng quan Đặt vé</h2>
        <TimeFilter value={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TicketMetric icon={Ticket} label="Tổng vé niêm yết" value={data.totalTickets} colorClass="bg-blue-50 text-blue-600" />
        <TicketMetric icon={CreditCard} label="Vé đã bán" value={data.soldTickets} colorClass="bg-emerald-50 text-emerald-600" />
        <TicketMetric icon={TrendingDown} label="Vé còn lại" value={data.availableTickets} colorClass="bg-rose-50 text-rose-600" />
        <TicketMetric icon={Tag} label="Tỷ lệ lấp đầy" value={data.bookingRate} colorClass="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8 text-center">Cơ cấu hạng vé</h3>
          <div className="relative aspect-square">
            <Doughnut
              data={doughnutData}
              options={{
                cutout: '70%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 20, font: { weight: 'bold' } }
                  }
                }
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-900">{data.bookingRate}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đã bán</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Lịch sử đặt vé gần đây</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-black text-slate-400 uppercase text-[11px] tracking-widest">Khách hàng</th>
                  <th className="pb-4 font-black text-slate-400 uppercase text-[11px] tracking-widest">Loại vé</th>
                  <th className="pb-4 font-black text-slate-400 uppercase text-[11px] tracking-widest">Số lượng</th>
                  <th className="pb-4 font-black text-slate-400 uppercase text-[11px] tracking-widest">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.history.map((row, i) => (
                  <tr key={i}>
                    <td className="py-4 font-bold text-slate-700">{row.name}</td>
                    <td className="py-4">
                      <span className={cx(
                        "text-[11px] font-black px-2 py-1 rounded-lg uppercase",
                        row.type === 'VVIP' ? 'bg-purple-100 text-purple-700' :
                        row.type === 'VIP' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      )}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-4 font-black text-slate-700">{row.qty}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className={cx(
                          "w-2 h-2 rounded-full",
                          row.status === 'Completed' ? 'bg-emerald-500' :
                          row.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                        )} />
                        <span className="text-sm font-bold text-slate-600">{row.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
