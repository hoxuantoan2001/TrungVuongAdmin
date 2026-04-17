import { Clock, DollarSign, Edit3, Lightbulb, Monitor, Music, Plus, Save, Trash2, Users, Wifi, X, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cx } from '../data';

/* ── Initial room types ── */
const INITIAL_ROOMS = [
  { id: 1, name: 'Phòng A – Đại sảnh', capacity: 500, basePricePerHour: 5000000, description: 'Sân khấu chính, phù hợp show lớn & sự kiện', active: true },
  { id: 2, name: 'Phòng B – Trung tâm', capacity: 200, basePricePerHour: 3000000, description: 'Sân khấu trung, phù hợp hội thảo & workshop', active: true },
  { id: 3, name: 'Phòng C – Hội trường', capacity: 120, basePricePerHour: 2000000, description: 'Hội trường đa năng, âm thanh tốt', active: true },
  { id: 4, name: 'Phòng D – Mini Theater', capacity: 60, basePricePerHour: 1200000, description: 'Phòng nhỏ, phù hợp diễn thử, casting', active: true },
  { id: 5, name: 'Phòng E – Tập luyện', capacity: 30, basePricePerHour: 600000, description: 'Phòng tập luyện cho nghệ sĩ', active: true },
];

/* ── Options that affect booking price ── */
const INITIAL_OPTIONS = [
  { id: 1, name: 'Hệ thống âm thanh chuyên nghiệp', icon: 'Music', pricePerHour: 500000, description: 'Dàn loa line-array, mixer digital, micro không dây', category: 'Thiết bị', active: true },
  { id: 2, name: 'Hệ thống ánh sáng sân khấu', icon: 'Zap', pricePerHour: 400000, description: 'Đèn moving head, beam, LED wash, spotlight', category: 'Thiết bị', active: true },
  { id: 3, name: 'Màn hình LED / Projector', icon: 'Monitor', pricePerHour: 350000, description: 'Màn hình LED P2.5 hoặc máy chiếu 10,000 lumens', category: 'Thiết bị', active: true },
  { id: 4, name: 'Wifi tốc độ cao', icon: 'Wifi', pricePerHour: 100000, description: 'Đường truyền riêng 100Mbps cho sự kiện', category: 'Dịch vụ', active: true },
  { id: 5, name: 'Nhân viên kỹ thuật', icon: 'Users', pricePerHour: 300000, description: '2 kỹ thuật viên âm thanh + ánh sáng', category: 'Nhân sự', active: true },
  { id: 6, name: 'Kéo dài ngoài giờ (sau 22h)', icon: 'Clock', pricePerHour: 800000, description: 'Phụ thu cho mỗi giờ sau 22:00', category: 'Phụ thu', active: false },
  { id: 7, name: 'Setup sân khấu đặc biệt', icon: 'Lightbulb', pricePerHour: 1000000, description: 'Thiết kế sân khấu riêng theo yêu cầu', category: 'Dịch vụ', active: true },
];

const TIME_MODIFIERS = [
  { id: 1, name: 'Cuối tuần (T7, CN)', modifier: 1.3, active: true },
  { id: 2, name: 'Ngày lễ / Tết', modifier: 1.8, active: true },
  { id: 3, name: 'Đặt dài hạn (≥ 4 giờ)', modifier: 0.9, active: true },
  { id: 4, name: 'Đặt định kỳ (hàng tuần)', modifier: 0.85, active: true },
  { id: 5, name: 'B2B Partner ưu đãi', modifier: 0.75, active: false },
];

const ICON_MAP = { Music, Zap, Monitor, Wifi, Users, Clock, Lightbulb };

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

/* ── Price Simulator ── */
function PriceSimulator({ rooms, options, modifiers }) {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.id);
  const [hours, setHours] = useState(3);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedModifier, setSelectedModifier] = useState(null);

  const room = rooms.find(r => r.id === selectedRoom);
  const activeOptions = options.filter(o => o.active);

  const breakdown = useMemo(() => {
    if (!room) return { roomCost: 0, optionsCost: 0, modifier: 1, total: 0 };
    const roomCost = room.basePricePerHour * hours;
    const optionsCost = selectedOptions.reduce((sum, optId) => {
      const opt = options.find(o => o.id === optId);
      return sum + (opt ? opt.pricePerHour * hours : 0);
    }, 0);
    const mod = selectedModifier ? modifiers.find(m => m.id === selectedModifier) : null;
    const multiplier = mod ? mod.modifier : 1;
    const subtotal = roomCost + optionsCost;
    return { roomCost, optionsCost, modifier: multiplier, total: Math.round(subtotal * multiplier) };
  }, [room, hours, selectedOptions, selectedModifier, options, modifiers]);

  const toggleOption = (id) => {
    setSelectedOptions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-40px] left-[20%] w-[150px] h-[150px] bg-purple-500/15 rounded-full blur-3xl" />

      <div className="relative z-10">
        <h3 className="text-xl font-black mb-1">💡 Mô phỏng giá Booking</h3>
        <p className="text-sm text-slate-400 mb-6">Tính nhanh chi phí booking dựa trên cấu hình hiện tại</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Chọn phòng</label>
            <select
              value={selectedRoom}
              onChange={e => setSelectedRoom(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
            >
              {rooms.filter(r => r.active).map(r => (
                <option key={r.id} value={r.id} className="text-slate-900">{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Số giờ</label>
            <input
              type="number"
              min={1}
              max={24}
              value={hours}
              onChange={e => setHours(Math.max(1, Number(e.target.value)))}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Chính sách giá</label>
            <select
              value={selectedModifier || ''}
              onChange={e => setSelectedModifier(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
            >
              <option value="" className="text-slate-900">Không áp dụng</option>
              {modifiers.filter(m => m.active).map(m => (
                <option key={m.id} value={m.id} className="text-slate-900">{m.name} (×{m.modifier})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Options selection */}
        <div className="mb-6">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Dịch vụ thêm</label>
          <div className="flex flex-wrap gap-2">
            {activeOptions.map(opt => {
              const selected = selectedOptions.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  className={cx(
                    "px-3 py-2 rounded-xl text-[12px] font-bold transition-all border",
                    selected
                      ? 'bg-blue-500/30 border-blue-400/50 text-blue-200'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  )}
                >
                  {opt.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5 backdrop-blur-sm">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Phòng ({hours}h × {room ? formatVND(room.basePricePerHour) : '—'})</span>
              <span className="font-bold">{formatVND(breakdown.roomCost)}</span>
            </div>
            {selectedOptions.map(optId => {
              const opt = options.find(o => o.id === optId);
              return opt ? (
                <div key={optId} className="flex justify-between text-sm">
                  <span className="text-slate-400">{opt.name} ({hours}h)</span>
                  <span className="font-bold">{formatVND(opt.pricePerHour * hours)}</span>
                </div>
              ) : null;
            })}
            {breakdown.modifier !== 1 && (
              <div className="flex justify-between text-sm text-amber-300">
                <span>Hệ số điều chỉnh</span>
                <span className="font-bold">×{breakdown.modifier}</span>
              </div>
            )}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between items-end">
            <span className="text-sm font-bold text-slate-300">Tổng cộng</span>
            <span className="text-3xl font-black bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">{formatVND(breakdown.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function BookingPriceConfig() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [options, setOptions] = useState(INITIAL_OPTIONS);
  const [modifiers, setModifiers] = useState(TIME_MODIFIERS);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({});
  const [editingOption, setEditingOption] = useState(null);
  const [optionForm, setOptionForm] = useState({});
  const [showAddOption, setShowAddOption] = useState(false);
  const [newOption, setNewOption] = useState({ name: '', pricePerHour: '', description: '', category: 'Thiết bị', icon: 'Zap' });
  const [activeTab, setActiveTab] = useState('rooms');

  const startEditRoom = (room) => {
    setEditingRoom(room.id);
    setRoomForm({ ...room });
  };

  const saveRoom = () => {
    setRooms(prev => prev.map(r => r.id === editingRoom ? { ...roomForm, basePricePerHour: Number(roomForm.basePricePerHour) } : r));
    setEditingRoom(null);
  };

  const toggleRoom = (id) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const toggleOption = (id) => {
    setOptions(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };

  const deleteOption = (id) => {
    setOptions(prev => prev.filter(o => o.id !== id));
  };

  const startEditOption = (opt) => {
    setEditingOption(opt.id);
    setOptionForm({ ...opt });
  };

  const saveOption = () => {
    setOptions(prev => prev.map(o => o.id === editingOption ? { ...optionForm, pricePerHour: Number(optionForm.pricePerHour) } : o));
    setEditingOption(null);
  };

  const addOption = () => {
    if (!newOption.name || !newOption.pricePerHour) return;
    setOptions(prev => [...prev, { ...newOption, id: Date.now(), pricePerHour: Number(newOption.pricePerHour), active: true }]);
    setNewOption({ name: '', pricePerHour: '', description: '', category: 'Thiết bị', icon: 'Zap' });
    setShowAddOption(false);
  };

  const toggleModifier = (id) => {
    setModifiers(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const tabItems = [
    { key: 'rooms', label: 'Cấu hình phòng' },
    { key: 'options', label: 'Dịch vụ & Phụ thu' },
    { key: 'modifiers', label: 'Chính sách giá' },
  ];

  const categories = [...new Set(options.map(o => o.category))];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cấu hình giá Booking phòng</h2>
        <p className="text-sm font-medium text-slate-500">Quản lý phòng, dịch vụ bổ sung và chính sách giá</p>
      </div>

      {/* Price Simulator */}
      <PriceSimulator rooms={rooms} options={options} modifiers={modifiers} />

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
        {tabItems.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cx(
              "px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.key ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Rooms ── */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all">
              {editingRoom === room.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Tên phòng</label>
                      <input type="text" value={roomForm.name} onChange={e => setRoomForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Sức chứa</label>
                      <input type="number" value={roomForm.capacity} onChange={e => setRoomForm(p => ({ ...p, capacity: Number(e.target.value) }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Giá / giờ (VND)</label>
                      <input type="number" value={roomForm.basePricePerHour} onChange={e => setRoomForm(p => ({ ...p, basePricePerHour: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Mô tả</label>
                    <input type="text" value={roomForm.description} onChange={e => setRoomForm(p => ({ ...p, description: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveRoom} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"><Save size={14} /> Lưu</button>
                    <button onClick={() => setEditingRoom(null)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition"><X size={14} /> Huỷ</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <button onClick={() => toggleRoom(room.id)} className={cx("w-12 h-7 rounded-full transition-all duration-300 relative shrink-0", room.active ? 'bg-blue-600' : 'bg-slate-200')}>
                      <div className={cx("w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-300", room.active ? 'left-6' : 'left-1')} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-900">{room.name}</span>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg uppercase">{room.capacity} chỗ</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{room.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-lg font-black text-blue-600">{formatVND(room.basePricePerHour)}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase">/ giờ</div>
                    </div>
                    <button onClick={() => startEditRoom(room)} className="p-2 rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition">
                      <Edit3 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: Options ── */}
      {activeTab === 'options' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => setShowAddOption(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all">
              <Plus size={16} /> Thêm dịch vụ
            </button>
          </div>

          {showAddOption && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 animate-in slide-in-from-top-2 duration-300">
              <h3 className="text-lg font-black text-slate-900 mb-4">Thêm dịch vụ / phụ thu</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Tên dịch vụ</label>
                  <input type="text" value={newOption.name} onChange={e => setNewOption(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: Quay phim chuyên nghiệp" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Giá / giờ (VND)</label>
                  <input type="number" value={newOption.pricePerHour} onChange={e => setNewOption(p => ({ ...p, pricePerHour: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="500000" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Danh mục</label>
                  <select value={newOption.category} onChange={e => setNewOption(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Thiết bị">Thiết bị</option>
                    <option value="Dịch vụ">Dịch vụ</option>
                    <option value="Nhân sự">Nhân sự</option>
                    <option value="Phụ thu">Phụ thu</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Mô tả</label>
                  <input type="text" value={newOption.description} onChange={e => setNewOption(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mô tả ngắn..." />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={addOption} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition"><Save size={16} /> Lưu</button>
                <button onClick={() => setShowAddOption(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition"><X size={16} /> Huỷ</button>
              </div>
            </div>
          )}

          {categories.map(cat => (
            <div key={cat}>
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">{cat}</h4>
              <div className="space-y-3">
                {options.filter(o => o.category === cat).map(opt => {
                  const IconComp = ICON_MAP[opt.icon] || Zap;
                  const isEditing = editingOption === opt.id;

                  if (isEditing) {
                    return (
                      <div key={opt.id} className="bg-white rounded-2xl border-2 border-blue-200 shadow-md p-5 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Tên dịch vụ</label>
                            <input type="text" value={optionForm.name} onChange={e => setOptionForm(p => ({ ...p, name: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Giá / giờ (VND)</label>
                            <input type="number" value={optionForm.pricePerHour} onChange={e => setOptionForm(p => ({ ...p, pricePerHour: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Danh mục</label>
                            <select value={optionForm.category} onChange={e => setOptionForm(p => ({ ...p, category: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="Thiết bị">Thiết bị</option>
                              <option value="Dịch vụ">Dịch vụ</option>
                              <option value="Nhân sự">Nhân sự</option>
                              <option value="Phụ thu">Phụ thu</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Mô tả</label>
                            <input type="text" value={optionForm.description} onChange={e => setOptionForm(p => ({ ...p, description: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={saveOption} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"><Save size={14} /> Lưu</button>
                          <button onClick={() => setEditingOption(null)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition"><X size={14} /> Huỷ</button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={opt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <button onClick={() => toggleOption(opt.id)} className={cx("w-12 h-7 rounded-full transition-all duration-300 relative shrink-0", opt.active ? 'bg-blue-600' : 'bg-slate-200')}>
                          <div className={cx("w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-300", opt.active ? 'left-6' : 'left-1')} />
                        </button>
                        <div className={cx("p-2.5 rounded-xl shrink-0", opt.active ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-300')}>
                          <IconComp size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{opt.name}</div>
                          <div className="text-[12px] text-slate-500">{opt.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right hidden sm:block">
                          <div className="text-base font-black text-blue-600">{formatVND(opt.pricePerHour)}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase">/ giờ</div>
                        </div>
                        <button onClick={() => startEditOption(opt)} className="p-2 rounded-xl text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => deleteOption(opt.id)} className="p-2 rounded-xl text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: Modifiers ── */}
      {activeTab === 'modifiers' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600">
              <DollarSign size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Chính sách điều chỉnh giá</h3>
              <p className="text-sm font-medium text-slate-500">Hệ số nhân áp dụng lên tổng giá booking</p>
            </div>
          </div>
          <div className="space-y-3">
            {modifiers.map(m => (
              <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100/50 hover:bg-white hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleModifier(m.id)} className={cx("w-12 h-7 rounded-full transition-all duration-300 relative", m.active ? 'bg-blue-600' : 'bg-slate-200')}>
                    <div className={cx("w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-300", m.active ? 'left-6' : 'left-1')} />
                  </button>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{m.name}</div>
                    <div className="text-[11px] font-bold text-slate-400">
                      Hệ số: ×{m.modifier} ({m.modifier < 1 ? `Giảm ${Math.round((1 - m.modifier) * 100)}%` : `Tăng ${Math.round((m.modifier - 1) * 100)}%`})
                    </div>
                  </div>
                </div>
                <span className={cx("text-[11px] font-black px-3 py-1 rounded-lg uppercase", m.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>
                  {m.active ? 'Đang áp dụng' : 'Tắt'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
