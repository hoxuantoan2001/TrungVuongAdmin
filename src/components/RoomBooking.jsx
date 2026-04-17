import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { Box, CheckSquare, Clock, Layout } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { cx } from '../data';
import TimeFilter from './TimeFilter';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* ── Mock data keyed by time range ── */
const ROOM_DATA_BY_PERIOD = {
  all: {
    totalRooms: 5, bookedHours: 320, occupancyRate: '68%', pendingBookings: 8,
    chart: {
      labels: ['Phòng A', 'Phòng B', 'Phòng C', 'Phòng D', 'Phòng E'],
      data: [85, 72, 90, 45, 28],
    }
  },
  '7d': {
    totalRooms: 5, bookedHours: 42, occupancyRate: '60%', pendingBookings: 2,
    chart: {
      labels: ['Phòng A', 'Phòng B', 'Phòng C', 'Phòng D', 'Phòng E'],
      data: [12, 8, 14, 5, 3],
    }
  },
  '30d': {
    totalRooms: 5, bookedHours: 128, occupancyRate: '65%', pendingBookings: 4,
    chart: {
      labels: ['Phòng A', 'Phòng B', 'Phòng C', 'Phòng D', 'Phòng E'],
      data: [35, 28, 38, 16, 11],
    }
  },
  '90d': {
    totalRooms: 5, bookedHours: 240, occupancyRate: '67%', pendingBookings: 6,
    chart: {
      labels: ['Phòng A', 'Phòng B', 'Phòng C', 'Phòng D', 'Phòng E'],
      data: [65, 55, 72, 30, 18],
    }
  },
  '6m': {
    totalRooms: 5, bookedHours: 300, occupancyRate: '68%', pendingBookings: 7,
    chart: {
      labels: ['Phòng A', 'Phòng B', 'Phòng C', 'Phòng D', 'Phòng E'],
      data: [80, 68, 85, 40, 27],
    }
  },
  '1y': {
    totalRooms: 5, bookedHours: 320, occupancyRate: '68%', pendingBookings: 8,
    chart: {
      labels: ['Phòng A', 'Phòng B', 'Phòng C', 'Phòng D', 'Phòng E'],
      data: [85, 72, 90, 45, 28],
    }
  },
};

function RoomMetric({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
      <div className={cx("w-12 h-12 rounded-2xl flex items-center justify-center", colorClass)}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-tight">{label}</div>
        <div className="text-3xl font-black text-slate-900 tracking-tight mt-1">{value}</div>
      </div>
    </div>
  );
}

export default function RoomBooking() {
  const [period, setPeriod] = useState('all');

  const data = ROOM_DATA_BY_PERIOD[period];

  const chartData = useMemo(() => ({
    labels: data.chart.labels,
    datasets: [{
      label: 'Giờ sử dụng',
      data: data.chart.data,
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(244, 63, 94, 0.8)',
      ],
      borderRadius: 8,
    }]
  }), [data]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Time filter */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Tổng quan Booking phòng</h2>
        <TimeFilter value={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RoomMetric icon={Layout} label="Tổng số phòng" value={data.totalRooms} colorClass="bg-blue-50 text-blue-600" />
        <RoomMetric icon={Clock} label="Giờ đặt phòng" value={data.bookedHours} colorClass="bg-indigo-50 text-indigo-600" />
        <RoomMetric icon={Box} label="Công suất sử dụng" value={data.occupancyRate} colorClass="bg-emerald-50 text-emerald-600" />
        <RoomMetric icon={CheckSquare} label="Yêu cầu chờ" value={data.pendingBookings} colorClass="bg-rose-50 text-rose-600" />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Thống kê sử dụng phòng</h3>
            <p className="text-sm font-medium text-slate-500">Số giờ sử dụng theo từng phòng</p>
          </div>
        </div>
        <div className="h-[400px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 }
              },
              scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                x: { grid: { display: false } }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
