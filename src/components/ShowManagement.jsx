import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Calendar, Presentation, TrendingUp, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { cx } from '../data';
import TimeFilter from './TimeFilter';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* ── Mock data keyed by time range ── */
const SHOW_DATA_BY_PERIOD = {
  all: {
    activeShows: 12, totalShowings: 48, averageAttendance: '85%', revenueChange: '+12%',
    chart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [35, 42, 38, 48, 45, 52, 40, 55, 50, 47, 60, 58],
    }
  },
  '7d': {
    activeShows: 3, totalShowings: 5, averageAttendance: '92%', revenueChange: '+5%',
    chart: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      data: [2, 1, 0, 1, 2, 3, 2],
    }
  },
  '30d': {
    activeShows: 6, totalShowings: 14, averageAttendance: '88%', revenueChange: '+8%',
    chart: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      data: [8, 12, 10, 14],
    }
  },
  '90d': {
    activeShows: 9, totalShowings: 32, averageAttendance: '86%', revenueChange: '+10%',
    chart: {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3'],
      data: [35, 42, 38],
    }
  },
  '6m': {
    activeShows: 11, totalShowings: 42, averageAttendance: '84%', revenueChange: '+11%',
    chart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [35, 42, 38, 48, 45, 52],
    }
  },
  '1y': {
    activeShows: 12, totalShowings: 48, averageAttendance: '85%', revenueChange: '+12%',
    chart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [35, 42, 38, 48, 45, 52, 40, 55, 50, 47, 60, 58],
    }
  },
};

function MetricCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
      <div className={cx("p-4 rounded-2xl", colorClass)}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
      </div>
    </div>
  );
}

export default function ShowManagement() {
  const [period, setPeriod] = useState('all');

  const data = SHOW_DATA_BY_PERIOD[period];

  const chartData = useMemo(() => ({
    labels: data.chart.labels,
    datasets: [{
      label: 'Số suất diễn',
      data: data.chart.data,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#2563eb',
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  }), [data]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Time filter */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Tổng quan Show diễn</h2>
        <TimeFilter value={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Presentation} label="Show đang diễn" value={data.activeShows} colorClass="bg-blue-50 text-blue-600" />
        <MetricCard icon={Calendar} label="Tổng suất diễn" value={data.totalShowings} colorClass="bg-purple-50 text-purple-600" />
        <MetricCard icon={Users} label="Tỷ lệ lấp đầy" value={data.averageAttendance} colorClass="bg-emerald-50 text-emerald-600" />
        <MetricCard icon={TrendingUp} label="Tăng trưởng doanh thu" value={data.revenueChange} colorClass="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Thống kê suất diễn</h3>
              <p className="text-sm font-medium text-slate-500">
                {period === 'all' ? 'Toàn bộ thời gian' : `${period === '7d' ? '7 ngày' : period === '30d' ? '30 ngày' : period === '90d' ? '90 ngày' : period === '6m' ? '6 tháng' : '1 năm'} gần nhất`}
              </p>
            </div>
          </div>
          <div className="h-[300px]">
            <Line
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

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Sự kiện & Thông báo</h3>
          <div className="space-y-6">
            {[
              { title: 'Show "Ký ức sông Hàn" đạt 100% lấp đầy', time: '2 giờ trước', type: 'success' },
              { title: 'Bảo trì hệ thống âm thanh Phòng A', time: '5 giờ trước', type: 'warning' },
              { title: 'Mở bán vé show "Đà Nẵng by Night"', time: 'Yesterday', type: 'info' },
              { title: 'Yêu cầu booking phòng mới từ B2B Partner', time: 'Yesterday', type: 'info' },
            ].map((event, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className={cx(
                  "w-2 h-2 rounded-full mt-2",
                  event.type === 'success' ? 'bg-emerald-500' :
                  event.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                )} />
                <div>
                  <div className="text-sm font-bold text-slate-900">{event.title}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{event.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
