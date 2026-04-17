import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  LayoutGrid,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
  Activity
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import { ACTORS, REVIEW_ANALYTICS, SHOWS, cx } from '../data';
import TimeFilter from './TimeFilter';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* ═══════════════════════════════════════
   Reusable UI Components
   ═══════════════════════════════════════ */

function AnimatedCounter({ value, suffix = '' }) {
  return (
    <span className="tabular-nums">{value}{suffix}</span>
  );
}

function GlassCard({ children, className = '', gradient = false }) {
  return (
    <div className={cx(
      'rounded-3xl border border-white/20 shadow-xl backdrop-blur-xl transition-all duration-300',
      gradient
        ? 'bg-gradient-to-br from-white/90 to-white/70'
        : 'bg-white',
      className
    )}>
      {children}
    </div>
  );
}

function ScoreCircle({ value, label, color = '#2563eb', size = 120 }) {
  const percentage = (value / 5) * 100;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full blur-2xl opacity-30 transition group-hover:opacity-50 group-hover:scale-110" style={{ backgroundColor: color }} />
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 relative drop-shadow-lg">
          <circle cx="18" cy="18" r="15.9155" fill="white" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
          <defs>
            <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={`url(#grad-${label})`} strokeWidth="3.5" strokeDasharray={`${percentage}, 100`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
          <span className="text-[9px] font-black text-slate-400 uppercase">/5.0</span>
        </div>
      </div>
      {label && <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, trendLabel, colorClass = "text-blue-600 bg-blue-50", accentColor = '#2563eb' }) {
  return (
    <GlassCard className="p-6 group hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-[0.07] group-hover:opacity-[0.12] transition-opacity" style={{ backgroundColor: accentColor }} />
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className={cx("p-3 rounded-2xl shadow-sm", colorClass)}>
          <Icon size={22} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <ArrowUpRight size={12} />
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-black text-slate-900 leading-none tracking-tighter mb-1.5">
          <AnimatedCounter value={value} />
        </div>
        <div className="text-[13px] font-bold text-slate-500">{label}</div>
        {trendLabel && <div className="mt-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">{trendLabel}</div>}
      </div>
    </GlassCard>
  );
}

function NPSVisual({ nps, promoters, passives, detractors }) {
  const total = promoters + passives + detractors || 1;
  const doughnutData = {
    labels: ['Không hài lòng', 'Trung lập', 'Sẵn sàng giới thiệu'],
    datasets: [{
      data: [detractors, passives, promoters],
      backgroundColor: ['#f43f5e', '#f59e0b', '#10b981'],
      borderWidth: 0,
      spacing: 4,
      borderRadius: 6,
    }]
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 h-56 mb-6">
        <Doughnut
          data={doughnutData}
          options={{
            cutout: '78%',
            plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 } },
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-black text-blue-600 tracking-tighter">{nps}</div>
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">NPS Score</div>
        </div>
      </div>
      <div className="w-full grid grid-cols-3 gap-3">
        {[
          { val: detractors, label: 'Không hài lòng', color: 'text-rose-600', bg: 'bg-rose-50' },
          { val: passives, label: 'Trung lập', color: 'text-amber-600', bg: 'bg-amber-50' },
          { val: promoters, label: 'Giới thiệu', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((item, idx) => (
          <div key={idx} className={cx("text-center p-3 rounded-2xl", item.bg)}>
            <div className={cx("text-xl font-black", item.color)}>{item.val}</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImprovementPlan({ suggestions }) {
  const priorityConfig = {
    High: { gradient: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
    Medium: { gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    Low: { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {suggestions.map((item, idx) => {
        const cfg = priorityConfig[item.priority] || priorityConfig.Low;
        return (
          <GlassCard key={idx} className="p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl">
            <div className={cx("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", cfg.gradient)} />
            <div className="flex items-center gap-2 mb-4 mt-1">
              <span className={cx("text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border", cfg.bg, cfg.text, cfg.border)}>
                {item.priority === 'High' ? 'Cao' : item.priority === 'Medium' ? 'Trung bình' : 'Thấp'}
              </span>
            </div>
            <h4 className="text-[15px] font-black text-slate-900 mb-2 leading-tight">{item.title}</h4>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-4">{item.insight}</p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 flex items-start gap-2">
              <Lightbulb size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <span className="text-[12px] font-bold text-slate-700">{item.action}</span>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, badge }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
          <Icon size={22} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-[13px] font-medium text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {badge && (
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-md shadow-blue-200 uppercase tracking-wider">
          {badge}
        </span>
      )}
    </div>
  );
}

function ActorRanking({ actors }) {
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div className="space-y-3">
      {actors.map((actor, idx) => (
        <div key={actor.id} className="p-4 rounded-2xl flex items-center justify-between bg-slate-50/80 border border-slate-100/50 hover:bg-white hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className={cx(
              "w-10 h-10 rounded-2xl flex items-center justify-center text-[15px] font-black shadow-sm",
              idx < 3 ? "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"
            )}>
              {idx < 3 ? medals[idx] : idx + 1}
            </div>
            <div>
              <div className="text-[14px] font-black text-slate-900 leading-tight group-hover:text-blue-700 transition">{actor.name}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{actor.role}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-blue-600">{actor.average}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase">{actor.reviewCount} đánh giá</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const isPositive = review.showRatings.overall >= 4;
  return (
    <GlassCard className={cx("p-5 hover:-translate-y-1 hover:shadow-2xl border-l-4", isPositive ? 'border-l-emerald-400' : 'border-l-amber-400')}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-[11px] font-black text-white shadow-md">
            {review.showName[0]}
          </div>
          <div>
            <div className="text-[13px] font-black text-slate-900">{review.showName}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(review.submittedAt).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className={i < review.showRatings.overall ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {review.comments.like && (
          <div className="text-[13px] font-medium leading-relaxed text-slate-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/50">
            <span className="font-black text-emerald-600">✓</span> {review.comments.like}
          </div>
        )}
        {review.comments.improve && (
          <div className="text-[13px] font-medium leading-relaxed text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-100/50 italic">
            <span className="not-italic text-amber-500 font-black">!</span> {review.comments.improve}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   Statistics Helpers
   ═══════════════════════════════════════ */

function computeStats(reviews) {
  const total = reviews.length || 1;
  const avg = (arr) => Number((arr.reduce((sum, n) => sum + n, 0) / (arr.length || 1)).toFixed(1));

  const showOverallAvg = avg(reviews.map(r => r.showRatings.overall));
  const actorOverallAvg = avg(reviews.map(r => {
    const a = r.actorReview;
    return (a.emotion + a.roleFit + a.voice + a.connection + a.costume) / 5;
  }));

  const npsPromoters = reviews.filter(r => r.audienceInsight.recommendScore >= 9).length;
  const npsDetractors = reviews.filter(r => r.audienceInsight.recommendScore <= 6).length;
  const npsPassives = reviews.filter(r => r.audienceInsight.recommendScore >= 7 && r.audienceInsight.recommendScore <= 8).length;
  const nps = Math.round(((npsPromoters - npsDetractors) / total) * 100);

  const returnPositive = reviews.filter(r => ['Chắc chắn có', 'Có thể'].includes(r.audienceInsight.returnIntent)).length;

  const metricAverages = {
    content: avg(reviews.map(r => r.showRatings.content)),
    sound: avg(reviews.map(r => r.showRatings.sound)),
    lighting: avg(reviews.map(r => r.showRatings.lighting)),
    pacing: avg(reviews.map(r => r.showRatings.pacing)),
    ticketing: avg(reviews.map(r => r.showRatings.ticketing)),
    seating: avg(reviews.map(r => r.showRatings.seating)),
  };

  const actorRankings = ACTORS.map(actor => {
    const aReviews = reviews.filter(r => r.actorReview.actorId === actor.id);
    if (!aReviews.length) return { ...actor, reviewCount: 0, average: 0 };
    const scoreSum = aReviews.reduce((sum, r) => {
      const a = r.actorReview;
      return sum + (a.emotion + a.roleFit + a.voice + a.connection + a.costume) / 5;
    }, 0);
    return { ...actor, reviewCount: aReviews.length, average: Number((scoreSum / aReviews.length).toFixed(1)) };
  }).sort((a, b) => b.average - a.average);

  const issues = reviews.flatMap(r => r.audienceInsight.issues);
  const issueCounts = issues.reduce((acc, i) => { acc[i] = (acc[i] || 0) + 1; return acc; }, {});

  const suggestions = [
    {
      title: 'Tối ưu âm thanh vocal',
      priority: issueCounts['Âm thanh chưa rõ'] > 2 ? 'High' : 'Medium',
      insight: `${issueCounts['Âm thanh chưa rõ'] || 0} khán giả gặp vấn đề về việc nghe rõ lời thoại/hát trong các phân cảnh cao trào.`,
      action: 'Kiểm tra EQ micro và cân bằng lại âm nền (Background Music) so với vocal.'
    },
    {
      title: 'Cải thiện chỉ dẫn chỗ ngồi',
      priority: issueCounts['Chỗ ngồi khó tìm'] > 2 ? 'High' : 'Medium',
      insight: 'Tỷ lệ phản hồi về việc khó tìm vị trí ghế ngồi đang có dấu hiệu tăng ở các show đông khách.',
      action: 'Bổ sung nhân viên hướng dẫn tại các lối vào khán phòng và làm rõ nhãn số ghế.'
    },
    {
      title: 'Điều chỉnh ánh sáng sân khấu',
      priority: issueCounts['Ánh sáng chói'] > 1 ? 'High' : 'Low',
      insight: 'Một số khán giả tại khu vực gần sân khấu phản hồi bị chói mắt bởi đèn beam.',
      action: 'Điều chỉnh lại góc chiếu của đèn hiệu ứng tại các hàng ghế đầu.'
    }
  ];

  return {
    total, showOverallAvg, actorOverallAvg, nps, npsPromoters, npsPassives, npsDetractors,
    returnRate: Math.round((returnPositive / total) * 100), metricAverages, actorRankings, suggestions
  };
}

/* ═══════════════════════════════════════
   Dashboard Main View
   ═══════════════════════════════════════ */

export default function Dashboard() {
  const [detailShowId, setDetailShowId] = useState(null);
  const [period, setPeriod] = useState('all');

  const statsByShow = useMemo(() => {
    const map = {};
    SHOWS.forEach(s => {
      const filtered = REVIEW_ANALYTICS.filter(r => r.showId === s.id);
      map[s.id] = { stats: computeStats(filtered), reviews: filtered };
    });
    return map;
  }, []);

  const overallStats = useMemo(() => computeStats(REVIEW_ANALYTICS), []);
  const currentShow = detailShowId ? SHOWS.find(s => s.id === detailShowId) : null;
  const currentData = detailShowId ? statsByShow[detailShowId] : { stats: overallStats, reviews: REVIEW_ANALYTICS };

  /* ── Radar chart data ── */
  const radarData = useMemo(() => ({
    labels: ['Nội dung', 'Âm thanh', 'Ánh sáng', 'Nhịp độ', 'Vé & Check-in', 'Chỗ ngồi'],
    datasets: [{
      label: 'Điểm trung bình',
      data: [
        currentData.stats.metricAverages.content,
        currentData.stats.metricAverages.sound,
        currentData.stats.metricAverages.lighting,
        currentData.stats.metricAverages.pacing,
        currentData.stats.metricAverages.ticketing,
        currentData.stats.metricAverages.seating,
      ],
      backgroundColor: 'rgba(37, 99, 235, 0.15)',
      borderColor: '#2563eb',
      borderWidth: 2,
      pointBackgroundColor: '#2563eb',
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  }), [currentData]);

  /* ── Trend line chart (simulated) ── */
  const trendData = useMemo(() => ({
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Điểm show',
        data: [3.8, 4.0, 3.9, 4.1, 4.0, 4.2, 4.3, 4.1, 4.4, 4.2, 4.5, 4.3],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#2563eb',
      },
      {
        label: 'Điểm cast',
        data: [4.0, 4.2, 4.1, 4.3, 4.2, 4.4, 4.5, 4.3, 4.5, 4.4, 4.6, 4.5],
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.06)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#7c3aed',
      }
    ]
  }), []);

  /* ── Discovery source bar chart ── */
  const discoveryData = useMemo(() => {
    const sources = {};
    REVIEW_ANALYTICS.forEach(r => {
      sources[r.audienceInsight.discovery] = (sources[r.audienceInsight.discovery] || 0) + 1;
    });
    return {
      labels: Object.keys(sources),
      datasets: [{
        data: Object.values(sources),
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'],
        borderRadius: 8,
        barThickness: 32,
      }]
    };
  }, []);

  return (
    <div className="space-y-10 pb-20">

      {/* ── TIME FILTER ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trung tâm Điều hành</h2>
          <p className="text-sm font-medium text-slate-500">Tổng quan hiệu suất hoạt động nhà hát</p>
        </div>
        <TimeFilter value={period} onChange={setPeriod} />
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-12">
        {/* Animated background orbs */}
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-60px] left-[10%] w-[200px] h-[200px] bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-[50%] right-[30%] w-[150px] h-[150px] bg-purple-500/15 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 flex flex-col xl:flex-row items-center gap-10">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm">
              <Activity size={14} className="text-blue-400" />
              <span className="text-[11px] font-black text-blue-300 uppercase tracking-widest">Live Dashboard</span>
            </div>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tighter leading-[1.1]">
              Bức tranh tổng thể
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                chất lượng biểu diễn
              </span>
            </h1>
            <p className="text-base sm:text-lg font-medium text-slate-400 max-w-2xl leading-relaxed">
              Theo dõi nhanh chất lượng <span className="text-white font-bold">toàn show</span> và
              mức độ thể hiện của <span className="text-white font-bold">toàn bộ cast</span> dựa trên
              phản hồi thực tế từ khán giả.
            </p>

            {/* Mini stat pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { label: 'Reviews', value: currentData.stats.total, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
                { label: 'NPS', value: currentData.stats.nps, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                { label: 'Return', value: `${currentData.stats.returnRate}%`, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
              ].map((pill, i) => (
                <div key={i} className={cx("flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-sm text-sm font-bold", pill.color)}>
                  <span className="text-lg font-black">{pill.value}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{pill.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score circles */}
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ScoreCircle value={currentData.stats.showOverallAvg} label="" size={130} color="#3b82f6" />
              <div className="text-center">
                <div className="text-sm font-bold text-white">Điểm toàn show</div>
                <div className="text-xs text-slate-400">Chất lượng tổng thể</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ScoreCircle value={currentData.stats.actorOverallAvg} label="" size={130} color="#8b5cf6" />
              <div className="text-center">
                <div className="text-sm font-bold text-white">Điểm toàn cast</div>
                <div className="text-xs text-slate-400">Diễn xuất & nhập vai</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users} label="Tổng bài đánh giá" value={currentData.stats.total} trend="+8.5%" trendLabel="Vs tháng trước" accentColor="#2563eb" />
        <StatCard icon={TrendingUp} label="Chỉ số NPS trung bình" value={currentData.stats.nps} colorClass="text-indigo-600 bg-indigo-50" trendLabel="Mục tiêu: 80" trend="+2" accentColor="#6366f1" />
        <StatCard icon={CheckCircle2} label="Phản hồi tích cực" value={`${currentData.stats.returnRate}%`} colorClass="text-emerald-600 bg-emerald-50" trendLabel="Tỷ lệ quay lại" accentColor="#10b981" />
        <StatCard icon={Star} label="Điểm chất lượng" value={`${currentData.stats.showOverallAvg}/5`} colorClass="text-amber-500 bg-amber-50" trendLabel="Rất tốt" accentColor="#f59e0b" />
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Line */}
        <GlassCard className="p-8">
          <SectionHeader icon={TrendingUp} title="Xu hướng chất lượng" subtitle="12 tháng gần nhất" />
          <div className="h-[280px]">
            <Line
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                  legend: { position: 'top', align: 'end', labels: { usePointStyle: true, padding: 16, font: { weight: 'bold', size: 11 } } },
                  tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 }
                },
                scales: {
                  y: { min: 3, max: 5, grid: { color: '#f1f5f9' }, ticks: { font: { weight: 'bold' } } },
                  x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
                }
              }}
            />
          </div>
        </GlassCard>

        {/* Radar chart */}
        <GlassCard className="p-8">
          <SectionHeader icon={Sparkles} title="Radar chất lượng dịch vụ" subtitle="Phân tích đa chiều" />
          <div className="h-[280px] flex items-center justify-center">
            <Radar
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  r: {
                    min: 0,
                    max: 5,
                    ticks: { stepSize: 1, font: { weight: 'bold', size: 10 }, backdropColor: 'transparent' },
                    grid: { color: '#e2e8f0' },
                    angleLines: { color: '#e2e8f0' },
                    pointLabels: { font: { weight: 'bold', size: 11 }, color: '#475569' }
                  }
                }
              }}
            />
          </div>
        </GlassCard>
      </div>

      {/* ── IMPROVEMENT ANALYSIS ── */}
      <section>
        <SectionHeader icon={Zap} title="Phân tích & Đề xuất cải thiện" subtitle="Dựa trên phản hồi tiêu cực của khán giả" badge="AI Insights" />
        <ImprovementPlan suggestions={currentData.stats.suggestions} />
      </section>

      {/* Detail vs Show Grid */}
      {detailShowId && currentShow ? (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setDetailShowId(null)} className="btn-secondary px-6 py-3 flex items-center gap-2 text-[14px] shadow-sm rounded-2xl">
              <ArrowLeft size={18} /> Quay lại tổng quan
            </button>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chi tiết: {currentShow.name}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <GlassCard className="p-8">
                <SectionHeader icon={TrendingUp} title="Chỉ số NPS" />
                <NPSVisual nps={currentData.stats.nps} promoters={currentData.stats.npsPromoters} passives={currentData.stats.npsPassives} detractors={currentData.stats.npsDetractors} />
              </GlassCard>
              <GlassCard className="p-8">
                <SectionHeader icon={Users} title="Top Nghệ sĩ" />
                <ActorRanking actors={currentData.stats.actorRankings.slice(0, 5)} />
              </GlassCard>
            </div>
            <div className="lg:col-span-8 space-y-6">
              <GlassCard className="p-8">
                <SectionHeader icon={Sparkles} title="Radar chất lượng" badge="Dữ liệu thực" />
                <div className="h-[280px] flex items-center justify-center">
                  <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, font: { weight: 'bold', size: 10 }, backdropColor: 'transparent' }, grid: { color: '#e2e8f0' }, angleLines: { color: '#e2e8f0' }, pointLabels: { font: { weight: 'bold', size: 11 }, color: '#475569' } } } }} />
                </div>
              </GlassCard>
              <div className="space-y-6">
                <SectionHeader icon={MessageSquare} title="Feedback Khách hàng" badge="Mới" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentData.reviews.slice(0, 4).map(r => <ReviewCard key={r.id} review={r} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Show Grid */}
          <section>
            <SectionHeader icon={LayoutGrid} title="Theo dõi theo Show diễn" subtitle="Hiệu suất từng chương trình" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SHOWS.map(show => {
                const s = statsByShow[show.id].stats;
                return (
                  <GlassCard key={show.id} className="p-8 group hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition" />
                    <div className="absolute top-4 right-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 flex items-center justify-center text-lg font-black text-blue-600 shadow-sm">
                        {s.showOverallAvg}
                      </div>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition mb-1 pr-16">{show.name}</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{show.time}</p>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: 'Reviews', value: s.total, color: 'text-slate-900' },
                        { label: 'NPS', value: s.nps, color: 'text-blue-600' },
                        { label: 'Return', value: `${s.returnRate}%`, color: 'text-emerald-600' },
                      ].map((m, i) => (
                        <div key={i} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                          <p className={cx("text-2xl font-black", m.color)}>{m.value}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setDetailShowId(show.id)}
                      className="w-full py-4 rounded-2xl text-[14px] font-black flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all"
                    >
                      <Eye size={18} /> Truy cập dữ liệu chi tiết
                    </button>
                  </GlassCard>
                );
              })}
            </div>
          </section>

          {/* NPS + Actors + Discovery */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <GlassCard className="p-8">
                <SectionHeader title="Chỉ số NPS hệ thống" icon={TrendingUp} />
                <NPSVisual nps={overallStats.nps} promoters={overallStats.npsPromoters} passives={overallStats.npsPassives} detractors={overallStats.npsDetractors} />
              </GlassCard>
              <GlassCard className="p-8">
                <SectionHeader title="Nghệ sĩ tiêu biểu" icon={Users} />
                <ActorRanking actors={overallStats.actorRankings.slice(0, 5)} />
              </GlassCard>
            </div>
            <div className="lg:col-span-8 space-y-6">
              {/* Discovery Source */}
              <GlassCard className="p-8">
                <SectionHeader title="Nguồn tiếp cận khán giả" icon={Activity} subtitle="Khán giả biết đến nhà hát qua đâu?" />
                <div className="h-[220px]">
                  <Bar
                    data={discoveryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', padding: 12, cornerRadius: 8 } },
                      scales: {
                        x: { grid: { color: '#f1f5f9' }, ticks: { font: { weight: 'bold' } } },
                        y: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 12 } } }
                      }
                    }}
                  />
                </div>
              </GlassCard>

              <div className="space-y-6">
                <SectionHeader title="Dòng phản hồi gần đây" icon={MessageSquare} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REVIEW_ANALYTICS.slice(0, 4).map(r => <ReviewCard key={r.id} review={r} />)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
