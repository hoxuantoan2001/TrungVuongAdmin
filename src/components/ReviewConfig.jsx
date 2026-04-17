import {
  AlignLeft,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Copy,
  Edit3,
  Eye,
  GripVertical,
  List,
  ListChecks,
  Pause,
  Play,
  Plus,
  Save,
  Search,
  Square,
  Star,
  Trash2,
  X
} from 'lucide-react';
import { useState } from 'react';
import { SHOWS, cx } from '../data';

/* ═══════════════════════════════════════
   Initial Data
   ═══════════════════════════════════════ */

const QUESTION_GROUPS = [
  { id: 'g1', name: 'Nội dung & Kịch bản', color: '#2563eb' },
  { id: 'g2', name: 'Âm thanh', color: '#7c3aed' },
  { id: 'g3', name: 'Ánh sáng & Sân khấu', color: '#f59e0b' },
  { id: 'g4', name: 'Trải nghiệm chung', color: '#10b981' },
  { id: 'g5', name: 'Phục vụ & Cơ sở', color: '#f43f5e' },
  { id: 'g6', name: 'Diễn viên / Nghệ sĩ', color: '#06b6d4' },
];

const INITIAL_TEMPLATES = [
  {
    id: 't1',
    name: 'Khảo sát tiêu chuẩn – Show diễn',
    description: 'Bộ câu hỏi đánh giá tổng quan sau mỗi suất diễn',
    isDefault: true,
    questions: [
      { id: 'q1', type: 'score', label: 'Nội dung show có hấp dẫn không?', groupId: 'g1', scale: 5, required: true },
      { id: 'q2', type: 'score', label: 'Chất lượng âm thanh, lời thoại?', groupId: 'g2', scale: 5, required: true },
      { id: 'q3', type: 'score', label: 'Ánh sáng & dàn dựng sân khấu?', groupId: 'g3', scale: 5, required: true },
      { id: 'q4', type: 'score', label: 'Nhịp độ chương trình?', groupId: 'g1', scale: 5, required: true },
      { id: 'q5', type: 'score', label: 'Mức độ hài lòng tổng thể?', groupId: 'g4', scale: 5, required: true },
      { id: 'q6', type: 'score', label: 'Check-in & vé?', groupId: 'g5', scale: 5, required: false },
      { id: 'q7', type: 'score', label: 'Chỗ ngồi & cơ sở vật chất?', groupId: 'g5', scale: 5, required: false },
      { id: 'q8', type: 'choice', label: 'Bạn biết đến nhà hát qua đâu?', groupId: 'g4', choiceType: 'single', options: ['Facebook', 'TikTok', 'Bạn bè', 'Tour', 'Website', 'Trực tiếp'], required: false },
      { id: 'q9', type: 'choice', label: 'Điểm nổi bật của show?', groupId: 'g4', choiceType: 'multiple', options: ['Diễn xuất', 'Nội dung', 'Âm thanh', 'Ánh sáng', 'Sân khấu', 'Trang phục', 'Cảm xúc'], required: false },
      { id: 'q10', type: 'text', label: 'Bạn thích điều gì nhất?', groupId: 'g4', required: false },
      { id: 'q11', type: 'text', label: 'Góp ý cải thiện?', groupId: 'g4', required: false },
      { id: 'q12', type: 'score', label: 'Bạn sẵn sàng giới thiệu cho người khác? (NPS)', groupId: 'g4', scale: 10, required: true },
    ]
  },
  {
    id: 't2',
    name: 'Đánh giá nghệ sĩ',
    description: 'Đánh giá chi tiết diễn viên / nghệ sĩ',
    isDefault: false,
    questions: [
      { id: 'qa1', type: 'score', label: 'Biểu cảm & thần thái?', groupId: 'g6', scale: 5, required: true },
      { id: 'qa2', type: 'score', label: 'Mức độ nhập vai?', groupId: 'g6', scale: 5, required: true },
      { id: 'qa3', type: 'score', label: 'Lời thoại & đài từ?', groupId: 'g6', scale: 5, required: true },
      { id: 'qa4', type: 'score', label: 'Kết nối với khán giả?', groupId: 'g6', scale: 5, required: true },
      { id: 'qa5', type: 'score', label: 'Tạo hình & trang phục?', groupId: 'g6', scale: 5, required: false },
      { id: 'qa6', type: 'text', label: 'Nhận xét thêm về diễn viên?', groupId: 'g6', required: false },
    ]
  }
];

const TARGET_TYPES = [
  { key: 'audience', label: 'Khán giả đã xem show' },
  { key: 'guest', label: 'Khách mời' },
  { key: 'internal', label: 'Nội bộ (nhân viên)' },
];

const STATUS_CONFIG = {
  active: { label: 'Đang hoạt động', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  paused: { label: 'Tạm dừng', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  ended: { label: 'Kết thúc', bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
  draft: { label: 'Bản nháp', bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400' },
};

const INITIAL_SESSIONS = [
  { id: 'ss1', name: 'Khảo sát – Ký ức sông Hàn (15/04)', showId: 's1', templateId: 't1', status: 'active', targets: ['audience'], startDate: '2026-04-15', endDate: '2026-04-20', responses: 24 },
  { id: 'ss2', name: 'Khảo sát – Đà Nẵng by Night (14/04)', showId: 's2', templateId: 't1', status: 'ended', targets: ['audience', 'guest'], startDate: '2026-04-14', endDate: '2026-04-16', responses: 18 },
];

/* ═══════════════════════════════════════
   Question Type Icons
   ═══════════════════════════════════════ */
const QTYPE_CONFIG = {
  score: { icon: Star, label: 'Chấm điểm', color: 'text-amber-500 bg-amber-50' },
  choice: { icon: ListChecks, label: 'Lựa chọn', color: 'text-blue-500 bg-blue-50' },
  text: { icon: AlignLeft, label: 'Nhận xét mở', color: 'text-emerald-500 bg-emerald-50' },
};

/* ═══════════════════════════════════════
   Subcomponents
   ═══════════════════════════════════════ */

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-black uppercase px-2.5 py-1 rounded-lg", cfg.bg, cfg.text)}>
      <span className={cx("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function QuestionCard({ question, groups, onEdit, onDelete }) {
  const group = groups.find(g => g.id === question.groupId);
  const qtCfg = QTYPE_CONFIG[question.type];
  const QtIcon = qtCfg.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-start gap-4 hover:shadow-sm transition-all group">
      <div className="mt-1 text-slate-200 cursor-grab">
        <GripVertical size={16} />
      </div>
      <div className={cx("p-2 rounded-xl shrink-0 mt-0.5", qtCfg.color)}>
        <QtIcon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {group && (
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border" style={{ color: group.color, borderColor: group.color + '30', backgroundColor: group.color + '10' }}>
              {group.name}
            </span>
          )}
          <span className="text-[9px] font-black text-slate-400 uppercase">{qtCfg.label}</span>
          {question.required && <span className="text-[9px] font-black text-rose-500 uppercase">Bắt buộc</span>}
        </div>
        <div className="text-sm font-bold text-slate-900">{question.label}</div>
        {question.type === 'score' && (
          <div className="flex gap-1 mt-2">
            {Array.from({ length: question.scale }).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">{i + 1}</div>
            ))}
          </div>
        )}
        {question.type === 'choice' && question.options && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {question.options.map((opt, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                {question.choiceType === 'single' ? <CircleDot size={10} /> : <Square size={10} />}
                {opt}
              </span>
            ))}
          </div>
        )}
        {question.type === 'text' && (
          <div className="mt-2 h-8 w-full max-w-xs bg-slate-50 rounded-lg border border-slate-100 border-dashed" />
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
        <button onClick={() => onEdit(question)} className="p-1.5 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition"><Edit3 size={14} /></button>
        <button onClick={() => onDelete(question.id)} className="p-1.5 rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Add / Edit Question Modal
   ═══════════════════════════════════════ */
function QuestionEditor({ question, groups, onSave, onCancel }) {
  const [form, setForm] = useState(question || {
    type: 'score', label: '', groupId: groups[0]?.id || '', scale: 5, choiceType: 'single', options: [''], required: false
  });

  const addOption = () => setForm(p => ({ ...p, options: [...(p.options || []), ''] }));
  const updateOption = (idx, val) => setForm(p => ({ ...p, options: p.options.map((o, i) => i === idx ? val : o) }));
  const removeOption = (idx) => setForm(p => ({ ...p, options: p.options.filter((_, i) => i !== idx) }));

  return (
    <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-xl p-6 animate-in slide-in-from-top-2 duration-300">
      <h3 className="text-lg font-black text-slate-900 mb-5">{question ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Loại câu hỏi</label>
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="score">⭐ Chấm điểm</option>
            <option value="choice">📋 Lựa chọn</option>
            <option value="text">✍️ Nhận xét mở</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Nhóm chủ đề</label>
          <select value={form.groupId} onChange={e => setForm(p => ({ ...p, groupId: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        {form.type === 'score' && (
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Thang điểm</label>
            <select value={form.scale} onChange={e => setForm(p => ({ ...p, scale: Number(e.target.value) }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value={5}>1 – 5</option>
              <option value={10}>1 – 10</option>
            </select>
          </div>
        )}
        {form.type === 'choice' && (
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Kiểu chọn</label>
            <select value={form.choiceType} onChange={e => setForm(p => ({ ...p, choiceType: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="single">Single choice</option>
              <option value="multiple">Multiple choice</option>
            </select>
          </div>
        )}
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.required} onChange={e => setForm(p => ({ ...p, required: e.target.checked }))}
              className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm font-bold text-slate-700">Bắt buộc</span>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Nội dung câu hỏi</label>
        <input type="text" value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="VD: Chất lượng âm thanh như thế nào?" />
      </div>

      {form.type === 'choice' && (
        <div className="mb-4">
          <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Các lựa chọn</label>
          <div className="space-y-2">
            {(form.options || []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-slate-300">{form.choiceType === 'single' ? <CircleDot size={16} /> : <CheckSquare size={16} />}</span>
                <input type="text" value={opt} onChange={e => updateOption(idx, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Lựa chọn ${idx + 1}`} />
                <button onClick={() => removeOption(idx)} className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 transition"><X size={14} /></button>
              </div>
            ))}
            <button onClick={addOption} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={14} /> Thêm lựa chọn</button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => onSave({ ...form, id: form.id || `q_${Date.now()}` })} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"><Save size={14} /> Lưu</button>
        <button onClick={onCancel} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition"><X size={14} /> Huỷ</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Session Editor Modal
   ═══════════════════════════════════════ */
function SessionEditor({ session, templates, onSave, onCancel }) {
  const [form, setForm] = useState(session || {
    name: '', showId: SHOWS[0]?.id || '', templateId: templates[0]?.id || '', status: 'draft',
    targets: ['audience'], startDate: '', endDate: '',
  });

  const toggleTarget = (key) => {
    setForm(p => ({
      ...p,
      targets: p.targets.includes(key) ? p.targets.filter(t => t !== key) : [...p.targets, key]
    }));
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-xl p-6 animate-in slide-in-from-top-2 duration-300">
      <h3 className="text-lg font-black text-slate-900 mb-5">{session ? 'Sửa đợt khảo sát' : 'Tạo đợt khảo sát mới'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Tên đợt khảo sát</label>
          <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="VD: Khảo sát sau show Ký ức sông Hàn" />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Gắn với Show / Suất diễn</label>
          <select value={form.showId} onChange={e => setForm(p => ({ ...p, showId: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
            {SHOWS.map(s => <option key={s.id} value={s.id}>{s.name} – {s.time}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Mẫu khảo sát</label>
          <select value={form.templateId} onChange={e => setForm(p => ({ ...p, templateId: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Trạng thái</label>
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="draft">Bản nháp</option>
            <option value="active">Đang hoạt động</option>
            <option value="paused">Tạm dừng</option>
            <option value="ended">Kết thúc</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Ngày bắt đầu</label>
          <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Ngày kết thúc</label>
          <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="mb-5">
        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Đối tượng được khảo sát</label>
        <div className="flex flex-wrap gap-2">
          {TARGET_TYPES.map(t => (
            <button key={t.key} onClick={() => toggleTarget(t.key)}
              className={cx("px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                form.targets.includes(t.key)
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300')}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onSave({ ...form, id: form.id || `ss_${Date.now()}`, responses: form.responses || 0 })}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"><Save size={14} /> Lưu</button>
        <button onClick={onCancel} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition"><X size={14} /> Huỷ</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */
export default function ReviewConfig() {
  const [activeTab, setActiveTab] = useState('sessions');
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [groups] = useState(QUESTION_GROUPS);

  // Sessions state
  const [showSessionEditor, setShowSessionEditor] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Templates state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(groups.map(g => g.id));
  const [editingTemplateInfo, setEditingTemplateInfo] = useState(null);
  const [templateInfoForm, setTemplateInfoForm] = useState({});

  /* ── Session handlers ── */
  const saveSession = (data) => {
    if (editingSession) {
      setSessions(prev => prev.map(s => s.id === data.id ? data : s));
    } else {
      setSessions(prev => [...prev, data]);
    }
    setShowSessionEditor(false);
    setEditingSession(null);
  };

  const toggleSessionStatus = (id, newStatus) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const deleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  /* ── Template / Question handlers ── */
  const saveQuestion = (q) => {
    if (!selectedTemplate) return;
    setTemplates(prev => prev.map(t => {
      if (t.id !== selectedTemplate) return t;
      const exists = t.questions.find(x => x.id === q.id);
      return {
        ...t,
        questions: exists
          ? t.questions.map(x => x.id === q.id ? q : x)
          : [...t.questions, q]
      };
    }));
    setShowQuestionEditor(false);
    setEditingQuestion(null);
  };

  const deleteQuestion = (qId) => {
    setTemplates(prev => prev.map(t =>
      t.id === selectedTemplate ? { ...t, questions: t.questions.filter(q => q.id !== qId) } : t
    ));
  };

  const duplicateTemplate = (tpl) => {
    setTemplates(prev => [...prev, {
      ...tpl,
      id: `t_${Date.now()}`,
      name: `${tpl.name} (Bản sao)`,
      isDefault: false,
      questions: tpl.questions.map(q => ({ ...q, id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` }))
    }]);
  };

  const startEditTemplateInfo = (tpl) => {
    setEditingTemplateInfo(tpl.id);
    setTemplateInfoForm({ name: tpl.name, description: tpl.description });
  };

  const saveTemplateInfo = () => {
    setTemplates(prev => prev.map(t =>
      t.id === editingTemplateInfo ? { ...t, name: templateInfoForm.name, description: templateInfoForm.description } : t
    ));
    setEditingTemplateInfo(null);
  };

  const toggleGroup = (gId) => {
    setExpandedGroups(prev => prev.includes(gId) ? prev.filter(x => x !== gId) : [...prev, gId]);
  };

  /* ── Filtered sessions ── */
  const filteredSessions = sessions.filter(s => {
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const show = SHOWS.find(sh => sh.id === s.showId);
      return s.name.toLowerCase().includes(q) || (show && show.name.toLowerCase().includes(q));
    }
    return true;
  });

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const tabItems = [
    { key: 'sessions', label: 'Đợt khảo sát', icon: List },
    { key: 'templates', label: 'Mẫu khảo sát', icon: ListChecks },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cấu hình Đánh giá & Khảo sát</h2>
        <p className="text-sm font-medium text-slate-500">Quản lý đợt khảo sát, mẫu câu hỏi và nhóm chủ đề</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
        {tabItems.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedTemplate(null); }}
              className={cx("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.key ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800')}>
              <TabIcon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════ TAB: Sessions ══════════════════ */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  placeholder="Tìm kiếm đợt khảo sát..." />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="paused">Tạm dừng</option>
                <option value="ended">Kết thúc</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
            <button onClick={() => { setEditingSession(null); setShowSessionEditor(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all">
              <Plus size={16} /> Tạo đợt khảo sát
            </button>
          </div>

          {showSessionEditor && (
            <SessionEditor
              session={editingSession}
              templates={templates}
              onSave={saveSession}
              onCancel={() => { setShowSessionEditor(false); setEditingSession(null); }}
            />
          )}

          {/* Session list */}
          <div className="space-y-4">
            {filteredSessions.map(session => {
              const show = SHOWS.find(s => s.id === session.showId);
              const tpl = templates.find(t => t.id === session.templateId);
              return (
                <div key={session.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h4 className="text-base font-black text-slate-900">{session.name}</h4>
                        <StatusBadge status={session.status} />
                      </div>
                      <div className="flex items-center gap-4 text-[12px] font-bold text-slate-400 flex-wrap">
                        {show && <span>📍 {show.name}</span>}
                        {tpl && <span>📋 {tpl.name}</span>}
                        <span>📅 {session.startDate} → {session.endDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {session.status === 'active' && (
                        <button onClick={() => toggleSessionStatus(session.id, 'paused')} className="p-2 rounded-xl text-amber-500 hover:bg-amber-50 transition" title="Tạm dừng"><Pause size={16} /></button>
                      )}
                      {session.status === 'paused' && (
                        <button onClick={() => toggleSessionStatus(session.id, 'active')} className="p-2 rounded-xl text-emerald-500 hover:bg-emerald-50 transition" title="Kích hoạt"><Play size={16} /></button>
                      )}
                      {(session.status === 'active' || session.status === 'paused') && (
                        <button onClick={() => toggleSessionStatus(session.id, 'ended')} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition" title="Kết thúc"><Square size={16} /></button>
                      )}
                      <button onClick={() => { setEditingSession(session); setShowSessionEditor(true); }} className="p-2 rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"><Edit3 size={16} /></button>
                      <button onClick={() => deleteSession(session.id)} className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Đối tượng:</span>
                      {session.targets.map(t => {
                        const tgt = TARGET_TYPES.find(x => x.key === t);
                        return tgt ? <span key={t} className="text-[11px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">{tgt.label}</span> : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Phản hồi:</span>
                      <span className="text-sm font-black text-blue-600">{session.responses}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredSessions.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-bold">Không tìm thấy đợt khảo sát nào</div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════ TAB: Templates ══════════════════ */}
      {activeTab === 'templates' && !selectedTemplate && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {templates.map(tpl => (
              <div key={tpl.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  {editingTemplateInfo === tpl.id ? (
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Tên mẫu</label>
                        <input type="text" value={templateInfoForm.name} onChange={e => setTemplateInfoForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Mô tả</label>
                        <input type="text" value={templateInfoForm.description} onChange={e => setTemplateInfoForm(p => ({ ...p, description: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveTemplateInfo} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"><Save size={14} /> Lưu</button>
                        <button onClick={() => setEditingTemplateInfo(null)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition"><X size={14} /> Huỷ</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-black text-slate-900">{tpl.name}</h4>
                        {tpl.isDefault && <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-lg uppercase">Mặc định</span>}
                        <button onClick={() => startEditTemplateInfo(tpl)} className="p-1 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition opacity-0 group-hover:opacity-100"><Edit3 size={14} /></button>
                      </div>
                      <p className="text-sm text-slate-500">{tpl.description}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6 mb-5 text-[12px] font-bold text-slate-400">
                  <span>📝 {tpl.questions.length} câu hỏi</span>
                  <span>⭐ {tpl.questions.filter(q => q.type === 'score').length} chấm điểm</span>
                  <span>📋 {tpl.questions.filter(q => q.type === 'choice').length} lựa chọn</span>
                  <span>✍️ {tpl.questions.filter(q => q.type === 'text').length} nhận xét</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedTemplate(tpl.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition-all">
                    <Eye size={16} /> Xem & Chỉnh sửa
                  </button>
                  <button onClick={() => duplicateTemplate(tpl)}
                    className="p-3 rounded-2xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition">
                    <Copy size={16} />
                  </button>
                  {!tpl.isDefault && (
                    <button onClick={() => setTemplates(prev => prev.filter(t => t.id !== tpl.id))}
                      className="p-3 rounded-2xl border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════ Template Detail ══════════════════ */}
      {activeTab === 'templates' && selectedTemplate && currentTemplate && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button onClick={() => setSelectedTemplate(null)} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition shrink-0"><X size={18} /></button>
              {editingTemplateInfo === currentTemplate.id ? (
                <div className="flex-1 flex items-center gap-3 flex-wrap">
                  <input type="text" value={templateInfoForm.name} onChange={e => setTemplateInfoForm(p => ({ ...p, name: e.target.value }))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-lg font-black focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1" />
                  <input type="text" value={templateInfoForm.description} onChange={e => setTemplateInfoForm(p => ({ ...p, description: e.target.value }))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1" placeholder="Mô tả..." />
                  <button onClick={saveTemplateInfo} className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shrink-0"><Save size={16} /></button>
                  <button onClick={() => setEditingTemplateInfo(null)} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition shrink-0"><X size={16} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2 min-w-0">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{currentTemplate.name}</h3>
                    <p className="text-sm text-slate-500">{currentTemplate.description} · {currentTemplate.questions.length} câu hỏi</p>
                  </div>
                  <button onClick={() => startEditTemplateInfo(currentTemplate)} className="p-1.5 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition shrink-0"><Edit3 size={16} /></button>
                </div>
              )}
            </div>
            <button onClick={() => { setEditingQuestion(null); setShowQuestionEditor(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all">
              <Plus size={16} /> Thêm câu hỏi
            </button>
          </div>

          {showQuestionEditor && !editingQuestion && (
            <QuestionEditor
              question={null}
              groups={groups}
              onSave={saveQuestion}
              onCancel={() => { setShowQuestionEditor(false); setEditingQuestion(null); }}
            />
          )}

          {/* Questions grouped by topic */}
          {groups.map(group => {
            const groupQuestions = currentTemplate.questions.filter(q => q.groupId === group.id);
            if (groupQuestions.length === 0) return null;
            const expanded = expandedGroups.includes(group.id);

            return (
              <div key={group.id} className="rounded-3xl border border-slate-100 overflow-hidden">
                <button onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                    <span className="text-sm font-black text-slate-900">{group.name}</span>
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">{groupQuestions.length} câu</span>
                  </div>
                  {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </button>
                {expanded && (
                  <div className="p-4 pt-0 space-y-3 bg-slate-50/50">
                    {groupQuestions.map(q => (
                      editingQuestion && editingQuestion.id === q.id ? (
                        <QuestionEditor key={q.id} question={editingQuestion} groups={groups}
                          onSave={saveQuestion}
                          onCancel={() => { setShowQuestionEditor(false); setEditingQuestion(null); }} />
                      ) : (
                        <QuestionCard key={q.id} question={q} groups={groups}
                          onEdit={(q) => { setEditingQuestion(q); setShowQuestionEditor(true); }}
                          onDelete={deleteQuestion} />
                      )
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
