import {
  AlertTriangle,
  ChevronRight,
  MessageSquareText,
  ShieldCheck,
  Theater,
  ThumbsUp,
  Ticket
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  ACTOR_METRICS,
  ACTORS,
  COMPANION_OPTIONS,
  cx,
  DISCOVERY_OPTIONS,
  ISSUE_TAGS,
  POSITIVE_TAGS,
  RETURN_OPTIONS,
  scoreTone,
  SHOW_METRICS,
  SHOWS
} from '../data';

const SCORE_COLOR = {
  1: {
    active: 'bg-red-600 border-red-600 text-white',
    inactive: 'bg-white border-red-200 text-[#502525] hover:bg-red-100'
  },
  2: {
    active: 'bg-orange-500 border-orange-500 text-white',
    inactive: 'bg-white border-orange-200 text-[#502525] hover:bg-orange-100'
  },
  3: {
    active: 'bg-amber-500 border-amber-500 text-white',
    inactive: 'bg-white border-amber-200 text-[#502525] hover:bg-amber-100'
  },
  4: {
    active: 'bg-lime-500 border-lime-500 text-white',
    inactive: 'bg-white border-lime-200 text-[#502525] hover:bg-lime-100'
  },
  5: {
    active: 'bg-emerald-600 border-emerald-600 text-white',
    inactive: 'bg-white border-emerald-200 text-[#502525] hover:bg-emerald-100'
  }
};

function MetricCard({ icon: Icon, label, hint, value, onChange }) {
  return (
    <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-200">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[15px] font-semibold text-slate-900">{label}</div>
            <div className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{hint}</div>
          </div>
        </div>
        <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 lg:block">
          {scoreTone[value]}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const isActive = value === n;
          const color = SCORE_COLOR[n];

          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={cx(
                'group rounded-2xl border px-3 py-1 text-center transition',
                isActive ? color.active : color.inactive
              )}
            >
              <div className="text-base font-semibold">{n}</div>
              <div
                className={cx(
                  'text-[14px] text-[#502525]',
                )}
              >
                {scoreTone[n]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChoiceChip({ active, label, onClick, tone = 'default' }) {
  const activeClass =
    tone === 'warning'
      ? 'border-amber-300 bg-amber-50 text-amber-800'
      : 'border-slate-900 bg-slate-900 text-white';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'rounded-full border px-4 py-2.5 text-sm font-medium transition',
        active ? activeClass : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
      )}
    >
      {label}
    </button>
  );
}

function ActorCard({ actor, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'rounded-[24px] border p-4 text-left transition',
        active
          ? 'border-slate-900 bg-slate-900 text-white shadow-[0_12px_40px_rgba(15,23,42,0.2)]'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cx('flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold', active ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700')}>
            {actor.name
              .split(' ')
              .slice(-2)
              .map((x) => x[0])
              .join('')}
          </div>
          <div>
            <div className={cx('text-sm font-semibold', active ? 'text-white' : 'text-slate-900')}>{actor.name}</div>
            <div className={cx('mt-1 text-sm', active ? 'text-slate-300' : 'text-slate-500')}>Vai: {actor.role}</div>
            <div className={cx('mt-2 text-xs uppercase tracking-[0.2em]', active ? 'text-slate-400' : 'text-slate-400')}>{actor.team}</div>
          </div>
        </div>
        <div className={cx('rounded-full px-3 py-1 text-xs font-semibold', active ? 'bg-white/10 text-white' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200')}>
          {actor.score}/5
        </div>
      </div>
    </button>
  );
}

function SectionHeading({ step, title, desc }) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-sm font-bold text-amber-700 ring-1 ring-amber-200">
        {step}
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-7 text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

export default function Review({ }) {
  const [ratings, setRatings] = useState({
    content: 4,
    sound: 3,
    lighting: 5,
    pacing: 4,
    overall: 4,
    emotion: 5,
    roleFit: 4,
    voice: 4,
    connection: 5,
    costume: 4,
    ticketing: 4,
    seating: 3,
    recommendation: 8
  });

  const [selectedActorId, setSelectedActorId] = useState('a1');
  const [positiveTags, setPositiveTags] = useState(['Diễn xuất', 'Cảm xúc']);
  const [issues, setIssues] = useState(['Âm thanh chưa rõ']);
  const [returnIntent, setReturnIntent] = useState('Chắc chắn có');
  const [discovery, setDiscovery] = useState('Facebook');
  const [companion, setCompanion] = useState('Đi cùng gia đình');
  const [consent, setConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [selectedShow, setSelectedShow] = useState(SHOWS[0]);

  const [form, setForm] = useState({
    like: 'Diễn viên giữ năng lượng tốt, câu chuyện dễ theo dõi và có điểm nhấn cảm xúc rõ ràng.',
    improve: 'Một vài đoạn âm thanh nền hơi lớn so với lời thoại, ảnh hưởng nhẹ đến trải nghiệm nghe.',
    actorLike: 'Biểu cảm chắc, lên đỉnh cảm xúc tốt, tạo được sự chú ý ở các đoạn cao trào.',
    actorImprove: 'Có thể tiết chế nhịp thoại ở một số đoạn để cảm xúc nhân vật đằm hơn.',
    serviceFeedback: 'Nhân viên hỗ trợ lịch sự, hướng dẫn chỗ ngồi rõ ràng.',
    otherNote: ''
  });

  const selectedActor = ACTORS.find((x) => x.id === selectedActorId) || ACTORS[0];

  const showAverage = useMemo(() => {
    const keys = ['content', 'sound', 'lighting', 'pacing', 'overall'];
    return (keys.reduce((sum, key) => sum + ratings[key], 0) / keys.length).toFixed(1);
  }, [ratings]);

  const actorAverage = useMemo(() => {
    const keys = ['emotion', 'roleFit', 'voice', 'connection', 'costume'];
    return (keys.reduce((sum, key) => sum + ratings[key], 0) / keys.length).toFixed(1);
  }, [ratings]);

  const progress = useMemo(() => {
    const required = [
      'content',
      'sound',
      'lighting',
      'pacing',
      'overall',
      'emotion',
      'roleFit',
      'voice',
      'connection',
      'costume'
    ];
    const completed = required.filter((key) => Boolean(ratings[key])).length;
    const bonus = [form.like, form.improve, form.actorLike, form.actorImprove, discovery, companion, returnIntent].filter(Boolean).length;
    return Math.min(100, Math.round(((completed + bonus) / (required.length + 7)) * 100));
  }, [ratings, form, discovery, companion, returnIntent]);

  const toggleTag = (tag, current, setter) => {
    setter(current.includes(tag) ? current.filter((x) => x !== tag) : [...current, tag]);
  };

  const handleSubmit = () => {
    const payload = {
      showId: selectedShow?.id || 'SHOW-TRV-2026-0415-001',
      eligible: true,
      consent,
      audienceInsight: {
        discovery,
        companion,
        returnIntent,
        recommendScore: ratings.recommendation,
        positiveTags,
        issues
      },
      showRatings: {
        content: ratings.content,
        sound: ratings.sound,
        lighting: ratings.lighting,
        pacing: ratings.pacing,
        overall: ratings.overall,
        ticketing: ratings.ticketing,
        seating: ratings.seating
      },
      actorReview: {
        actorId: selectedActorId,
        emotion: ratings.emotion,
        roleFit: ratings.roleFit,
        voice: ratings.voice,
        connection: ratings.connection,
        costume: ratings.costume
      },
      comments: form
    };

    console.log('SUBMIT DATA:', payload);
    setSubmitted(true);
  };

  return (
    <div>
      <div className="mb-6 rounded-[28px] border border-slate-200 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">

        <div className="flex gap-3 overflow-x-auto pb-1">
          {SHOWS.map((show) => {
            const active = selectedShow?.id === show.id;

            return (
              <button
                key={show.id}
                type="button"
                onClick={() => setSelectedShow(show)}
                className={cx(
                  'min-w-[280px] rounded-[24px] border p-4 text-left transition',
                  active
                    ? 'border-slate-900 bg-slate-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]'
                    : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300 hover:bg-white'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={cx('text-sm font-semibold flex items-center gap-4', active ? 'text-white' : 'text-slate-900')}>
                      {show.name}
                      <div
                        className={cx(
                          'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                          show.status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                        )}
                      >
                        {show.status === 'completed' ? 'Đã đánh giá' : 'Chưa đánh giá'}
                      </div>
                    </div>
                    <div className={cx('mt-1 text-xs', active ? 'text-slate-300' : 'text-slate-500')}>
                      {show.time}
                    </div>
                    <div className={cx('mt-1 text-xs', active ? 'text-slate-400' : 'text-slate-400')}>
                      {show.location}
                    </div>
                  </div>

                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 2xl:grid-cols-6">
        <div className="2xl:col-span-8 space-y-8">
          <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="grid grid-cols-1 xl:grid-cols-6">
              <div className="xl:col-span-8 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#334155_100%)] px-6 py-7 text-white xl:px-8 xl:py-8">
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">{selectedShow?.name}</h2>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-300"><Ticket className="h-4 w-4" /> Vé / check-in</div>
                    <div className="mt-2 text-lg font-semibold">Đủ điều kiện đánh giá</div>
                    <div className="mt-1 text-sm text-slate-300">Đã check-in và show đã kết thúc</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-300"><Theater className="h-4 w-4" /> Địa điểm</div>
                    <div className="mt-2 text-lg font-semibold">Nhà hát Trưng Vương</div>
                    <div className="mt-1 text-sm text-slate-300">{selectedShow?.time}</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-300"><ShieldCheck className="h-4 w-4" /> Quyền riêng tư</div>
                    <div className="mt-2 text-lg font-semibold">Ẩn danh khi phân tích</div>
                    <div className="mt-1 text-sm text-slate-300">Dữ liệu dùng cho cải tiến chất lượng</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] xl:p-8">
            <SectionHeading
              step="01"
              title="Đánh giá tổng thể buổi biểu diễn"
            />

            <div className="grid grid-cols-1 gap-4">
              {SHOW_METRICS.map((metric) => (
                <MetricCard
                  key={metric.key}
                  icon={metric.icon}
                  label={metric.label}
                  hint={metric.hint}
                  value={ratings[metric.key]}
                  onChange={(value) => setRatings((prev) => ({ ...prev, [metric.key]: value }))}
                />
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Điểm nổi bật của show</div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {POSITIVE_TAGS.map((tag) => (
                    <ChoiceChip
                      key={tag}
                      label={tag}
                      active={positiveTags.includes(tag)}
                      onClick={() => toggleTag(tag, positiveTags, setPositiveTags)}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Vấn đề trải nghiệm gặp phải</div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {ISSUE_TAGS.map((tag) => (
                    <ChoiceChip
                      key={tag}
                      label={tag}
                      tone="warning"
                      active={issues.includes(tag)}
                      onClick={() => toggleTag(tag, issues, setIssues)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Insight khách hàng</div>
                <div className="mt-4 space-y-5">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900">Bạn biết đến show này qua đâu?</div>
                    <div className="flex flex-wrap gap-2.5">
                      {DISCOVERY_OPTIONS.map((item) => (
                        <ChoiceChip key={item} label={item} active={discovery === item} onClick={() => setDiscovery(item)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900">Bạn tham dự cùng ai?</div>
                    <div className="flex flex-wrap gap-2.5">
                      {COMPANION_OPTIONS.map((item) => (
                        <ChoiceChip key={item} label={item} active={companion === item} onClick={() => setCompanion(item)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900">Bạn có sẵn sàng quay lại xem các show tương tự không?</div>
                    <div className="flex flex-wrap gap-2.5">
                      {RETURN_OPTIONS.map((item) => (
                        <ChoiceChip key={item} label={item} active={returnIntent === item} onClick={() => setReturnIntent(item)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Khả năng giới thiệu cho người khác</div>
                <div className="mt-3 text-sm leading-6 text-slate-500">Thang đo 0–10 giúp hệ thống tính NPS, cực hữu ích cho báo cáo quản trị và đánh giá thương hiệu nhà hát.</div>
                <div className="mt-5 grid grid-cols-6 gap-2 lg:grid-cols-11">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRatings((prev) => ({ ...prev, recommendation: i }))}
                      className={cx(
                        'rounded-2xl border px-3 py-3 text-sm font-semibold transition',
                        ratings.recommendation === i
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                      )}
                    >
                      {i}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-xs font-medium text-slate-400">
                  <span>0 = Không giới thiệu</span>
                  <span>10 = Rất sẵn sàng giới thiệu</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-900">Điều bạn hài lòng nhất</label>
                <textarea
                  value={form.like}
                  onChange={(e) => setForm((prev) => ({ ...prev, like: e.target.value }))}
                  className="h-32 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-slate-400"
                />
              </div>
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-900">Điều cần cải thiện nhiều nhất</label>
                <textarea
                  value={form.improve}
                  onChange={(e) => setForm((prev) => ({ ...prev, improve: e.target.value }))}
                  className="h-32 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-slate-400"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] xl:p-8">
            <SectionHeading
              step="02"
              title="Đánh giá diễn viên và vai diễn"
              desc="Phần này giải quyết yêu cầu đánh giá sâu theo từng diễn viên, từng vai diễn. Dữ liệu này giúp so sánh cast, phát hiện vai nổi bật và phân tích chất lượng biểu diễn ở mức cá nhân."
            />

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {ACTORS.map((actor) => (
                <ActorCard key={actor.id} actor={actor} active={selectedActorId === actor.id} onClick={() => setSelectedActorId(actor.id)} />
              ))}
            </div>

            <div className="mt-6 rounded-[28px] bg-[linear-gradient(180deg,#fafafa_0%,#f8fafc_100%)] p-5 ring-1 ring-slate-200 xl:p-6">
              <div className="mb-5 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center">
                <div>
                  <div className="text-xl font-semibold text-slate-900">Đánh giá chi tiết cho {selectedActor.name}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">Vai diễn: {selectedActor.role} — dữ liệu dùng để chấm chất lượng diễn xuất và sức hút nhân vật trong show.</div>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">Điểm hiện tại: {actorAverage}/5</div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {ACTOR_METRICS.map((metric) => (
                  <MetricCard
                    key={metric.key}
                    icon={metric.icon}
                    label={metric.label}
                    hint={metric.hint}
                    value={ratings[metric.key]}
                    onChange={(value) => setRatings((prev) => ({ ...prev, [metric.key]: value }))}
                  />
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-900">Điểm nổi bật của diễn viên / vai diễn</label>
                  <textarea
                    value={form.actorLike}
                    onChange={(e) => setForm((prev) => ({ ...prev, actorLike: e.target.value }))}
                    className="h-28 w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-900">Góp ý để cải thiện vai diễn</label>
                  <textarea
                    value={form.actorImprove}
                    onChange={(e) => setForm((prev) => ({ ...prev, actorImprove: e.target.value }))}
                    className="h-28 w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-slate-400"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] xl:p-8">
            <SectionHeading
              step="03"
              title="Trải nghiệm dịch vụ và vận hành"
              desc="Đây là phần thường bị bỏ quên nhưng lại rất quan trọng với bài toán thực tế: nhà hát không chỉ cần biết show hay hay dở, mà còn cần biết trải nghiệm vé, check-in, chỗ ngồi và hỗ trợ tại điểm diễn có tốt không."
            />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <MetricCard
                icon={Ticket}
                label="Quy trình vé / check-in"
                hint="Đặt vé, xác thực vé, vào cổng, hướng dẫn vào chỗ có thuận tiện không?"
                value={ratings.ticketing}
                onChange={(value) => setRatings((prev) => ({ ...prev, ticketing: value }))}
              />
              <MetricCard
                icon={ThumbsUp}
                label="Chỗ ngồi & sự thoải mái"
                hint="Tầm nhìn, khoảng cách, nhiệt độ, độ thoải mái tại khu vực xem có đáp ứng tốt không?"
                value={ratings.seating}
                onChange={(value) => setRatings((prev) => ({ ...prev, seating: value }))}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-900">Nhận xét về nhân viên / khâu hỗ trợ tại điểm diễn</label>
                <textarea
                  value={form.serviceFeedback}
                  onChange={(e) => setForm((prev) => ({ ...prev, serviceFeedback: e.target.value }))}
                  className="h-28 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-slate-400"
                />
              </div>
              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-900">Ý kiến khác</label>
                <textarea
                  value={form.otherNote}
                  onChange={(e) => setForm((prev) => ({ ...prev, otherNote: e.target.value }))}
                  placeholder="Ví dụ: cần bổ sung biển chỉ dẫn, cải thiện không gian đón khách, tối ưu thời gian mở cửa..."
                  className="h-28 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-slate-400"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="2xl:col-span-8 space-y-8">
          <section className="sticky top-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Live summary</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Tóm tắt đánh giá</div>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">Ready for demo</div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl bg-slate-100">
              <div className="h-2 bg-slate-200">
                <div className="h-full bg-[linear-gradient(90deg,#f59e0b_0%,#111827_100%)]" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-slate-500">Mức hoàn thiện form</span>
                <span className="font-semibold text-slate-900">{progress}%</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Điểm show</div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">{showAverage}</div>
                <div className="mt-1 text-sm text-slate-500">/ 5.0</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Điểm diễn viên</div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">{actorAverage}</div>
                <div className="mt-1 text-sm text-slate-500">/ 5.0</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Insight nổi bật</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">Khách hàng yêu thích: {positiveTags.join(', ') || 'Chưa chọn'}.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Vấn đề cần xử lý</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{issues.length ? issues.join(', ') : 'Chưa có vấn đề được ghi nhận.'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Khả năng quay lại</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{returnIntent} — NPS hiện tại: {ratings.recommendation}/10.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] bg-[#0f172a] p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.2)]">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Xác nhận & gửi</div>
              <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-300">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent" />
                Tôi đồng ý cho hệ thống sử dụng đánh giá này để phân tích, cải thiện chất lượng biểu diễn và trải nghiệm dịch vụ.
              </label>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button type="button" className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white">Lưu nháp</button>
                <button type="button" onClick={handleSubmit} className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm">Gửi đánh giá</button>
              </div>
              {submitted && (
                <div className="mt-4 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 ring-1 ring-emerald-500/20">
                  Đã gửi đánh giá thành công. Mở console để xem payload mẫu phục vụ dev/API.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
