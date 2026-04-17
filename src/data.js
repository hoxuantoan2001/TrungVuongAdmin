import {
  Camera,
  Clock3,
  Mic2,
  Sparkles,
  Star,
  Theater,
  Users,
  Volume2,
  Waves
} from 'lucide-react';

export const SHOW_METRICS = [
  {
    key: 'content',
    label: 'Nội dung & sức cuốn hút',
    hint: 'Show có hấp dẫn, dễ theo dõi, đủ sức giữ khán giả đến cuối chương trình không?',
    icon: Sparkles
  },
  {
    key: 'sound',
    label: 'Âm thanh & lời thoại',
    hint: 'Âm thanh, micro, nhạc nền, độ rõ lời thoại có phù hợp với không gian biểu diễn không?',
    icon: Volume2
  },
  {
    key: 'lighting',
    label: 'Ánh sáng & dàn dựng sân khấu',
    hint: 'Phần nhìn có tạo cảm xúc, hỗ trợ tiết mục và tăng chất lượng trải nghiệm không?',
    icon: Waves
  },
  {
    key: 'pacing',
    label: 'Nhịp độ chương trình',
    hint: 'Tiết tấu có hợp lý, không quá dài, không bị rời rạc hoặc hụt cảm xúc không?',
    icon: Clock3
  },
  {
    key: 'overall',
    label: 'Mức độ hài lòng tổng thể',
    hint: 'Đánh giá chung của khán giả với toàn bộ buổi biểu diễn.',
    icon: Star
  }
];

export const ACTOR_METRICS = [
  {
    key: 'emotion',
    label: 'Biểu cảm & thần thái',
    hint: 'Diễn viên có thể hiện cảm xúc tự nhiên, thuyết phục và giàu chiều sâu không?',
    icon: Camera
  },
  {
    key: 'roleFit',
    label: 'Mức độ nhập vai',
    hint: 'Diễn viên có giữ được tinh thần nhân vật xuyên suốt tiết mục không?',
    icon: Theater
  },
  {
    key: 'voice',
    label: 'Lời thoại & đài từ',
    hint: 'Khả năng phát âm, nhả chữ, truyền tải thông điệp có rõ ràng không?',
    icon: Mic2
  },
  {
    key: 'connection',
    label: 'Kết nối với khán giả',
    hint: 'Diễn viên có sức hút sân khấu, tạo tương tác và dấu ấn rõ ràng không?',
    icon: Users
  },
  {
    key: 'costume',
    label: 'Tạo hình & trang phục',
    hint: 'Trang phục, makeup, ngôn ngữ hình thể có đồng bộ với vai diễn không?',
    icon: Sparkles
  }
];

export const ACTORS = [
  {
    id: 'a1',
    name: 'Nguyễn Minh Anh',
    role: 'Ông lão trông sông',
    team: 'Vai chính',
    score: 1.8
  },
  {
    id: 'a2',
    name: 'Trần Hải Yến',
    role: 'Người kể chuyện',
    team: 'Narrator',
    score: 4.6
  },
  {
    id: 'a3',
    name: 'Lê Quang Huy',
    role: 'Chàng trai trẻ',
    team: 'Vai phụ nổi bật',
    score: 4.5
  }
];

export const REVIEW_ANALYTICS = [
  {
    id: 'r1',
    showId: 's1',
    showName: 'Ký ức sông Hàn',
    submittedAt: '2026-04-15T22:10:00',
    showRatings: {
      content: 1,
      sound: 1,
      lighting: 1,
      pacing: 1,
      overall: 1,
      ticketing: 1,
      seating: 1
    },
    actorReview: {
      actorId: 'a1',
      actorName: 'Nguyễn Minh Anh',
      emotion: 5,
      roleFit: 5,
      voice: 4,
      connection: 5,
      costume: 4
    },
    audienceInsight: {
      discovery: 'Facebook',
      companion: 'Đi cùng gia đình',
      returnIntent: 'Chắc chắn có',
      recommendScore: 9,
      positiveTags: ['Diễn xuất', 'Cảm xúc', 'Ánh sáng'],
      issues: ['Âm thanh chưa rõ']
    },
    comments: {
      like: 'Show rất cảm xúc, ánh sáng đẹp.',
      improve: 'Một vài đoạn nhạc nền hơi to.',
      actorLike: 'Diễn xuất chắc tay.',
      actorImprove: 'Có thể tiết chế thêm ở đoạn cao trào.'
    }
  },
  {
    id: 'r2',
    showId: 's1',
    showName: 'Ký ức sông Hàn',
    submittedAt: '2026-04-15T22:18:00',
    showRatings: {
      content: 4,
      sound: 3,
      lighting: 5,
      pacing: 4,
      overall: 4,
      ticketing: 5,
      seating: 3
    },
    actorReview: {
      actorId: 'a2',
      actorName: 'Trần Hải Yến',
      emotion: 5,
      roleFit: 4,
      voice: 5,
      connection: 4,
      costume: 4
    },
    audienceInsight: {
      discovery: 'TikTok',
      companion: 'Đi cùng bạn bè',
      returnIntent: 'Có thể',
      recommendScore: 8,
      positiveTags: ['Nội dung', 'Sân khấu'],
      issues: ['Ghế ngồi chưa thoải mái']
    },
    comments: {
      like: 'Kịch bản dễ theo dõi.',
      improve: 'Ghế ngồi hơi mỏi nếu xem lâu.',
      actorLike: 'Lời thoại tốt.',
      actorImprove: 'Một vài đoạn cần nhấn nhá hơn.'
    }
  },
  {
    id: 'r3',
    showId: 's2',
    showName: 'Đà Nẵng by Night',
    submittedAt: '2026-04-14T21:45:00',
    showRatings: {
      content: 4,
      sound: 4,
      lighting: 4,
      pacing: 3,
      overall: 4,
      ticketing: 4,
      seating: 4
    },
    actorReview: {
      actorId: 'a3',
      actorName: 'Lê Quang Huy',
      emotion: 4,
      roleFit: 4,
      voice: 4,
      connection: 5,
      costume: 4
    },
    audienceInsight: {
      discovery: 'Bạn bè giới thiệu',
      companion: 'Đi một mình',
      returnIntent: 'Chưa chắc',
      recommendScore: 7,
      positiveTags: ['Tương tác', 'Trang phục'],
      issues: ['Check-in chậm', 'Thiếu hướng dẫn']
    },
    comments: {
      like: 'Tương tác sân khấu tốt.',
      improve: 'Khâu vào chỗ nên rõ ràng hơn.',
      actorLike: 'Kết nối khán giả tốt.',
      actorImprove: 'Nhịp diễn đôi lúc hơi nhanh.'
    }
  },
  {
    id: 'r4',
    showId: 's2',
    showName: 'Đà Nẵng by Night',
    submittedAt: '2026-04-14T22:02:00',
    showRatings: {
      content: 5,
      sound: 4,
      lighting: 5,
      pacing: 4,
      overall: 5,
      ticketing: 5,
      seating: 4
    },
    actorReview: {
      actorId: 'a1',
      actorName: 'Nguyễn Minh Anh',
      emotion: 5,
      roleFit: 5,
      voice: 5,
      connection: 5,
      costume: 4
    },
    audienceInsight: {
      discovery: 'Website nhà hát',
      companion: 'Đi cùng gia đình',
      returnIntent: 'Chắc chắn có',
      recommendScore: 10,
      positiveTags: ['Diễn xuất', 'Âm thanh', 'Ánh sáng'],
      issues: []
    },
    comments: {
      like: 'Rất chỉn chu và cảm xúc.',
      improve: '',
      actorLike: 'Vai rất thuyết phục.',
      actorImprove: ''
    }
  }
];

export const POSITIVE_TAGS = ['Diễn xuất', 'Nội dung', 'Âm thanh', 'Ánh sáng', 'Sân khấu', 'Trang phục', 'Cảm xúc', 'Tương tác'];
export const ISSUE_TAGS = ['Khó nhìn sân khấu', 'Âm thanh chưa rõ', 'Ghế ngồi chưa thoải mái', 'Check-in chậm', 'Chỗ để xe', 'Điều hoà/nhiệt độ', 'Quá đông', 'Thiếu hướng dẫn'];
export const DISCOVERY_OPTIONS = ['Facebook', 'TikTok', 'Bạn bè giới thiệu', 'Tour / công ty lữ hành', 'Website nhà hát', 'Đến trực tiếp'];
export const COMPANION_OPTIONS = ['Đi một mình', 'Đi cùng gia đình', 'Đi cùng bạn bè', 'Đi theo tour / đoàn', 'Đi cùng đồng nghiệp'];
export const RETURN_OPTIONS = ['Chắc chắn có', 'Có thể', 'Chưa chắc', 'Không'];

export const scoreTone = {
  1: 'Rất tệ',
  2: 'Tệ',
  3: 'Ổn',
  4: 'Tốt',
  5: 'Rất tốt'
};

export const SHOWS = [
  {
    id: 's1',
    name: 'Ký ức sông Hàn',
    time: '20:00 – 22:00 | 15/04/2026',
    location: 'Nhà hát Trưng Vương',
    status: 'completed'
  },
  {
    id: 's2',
    name: 'Đà Nẵng by Night',
    time: '19:30 – 21:30 | 14/04/2026',
    location: 'Nhà hát Trưng Vương',
    status: 'upcoming'
  }
];

export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Mock data for Show Management
export const SHOW_MANAGEMENT_DATA = {
  activeShows: 12,
  totalShowings: 48,
  averageAttendance: '85%',
  revenueChange: '+12%',
  monthlyStats: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Số suất diễn',
        data: [35, 42, 38, 48, 45, 52],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
      }
    ]
  }
};

// Mock data for Ticket Booking
export const TICKET_BOOKING_DATA = {
  totalTickets: 2450,
  soldTickets: 1890,
  availableTickets: 560,
  bookingRate: '77%',
  ticketTypeStats: {
    labels: ['VVIP', 'VIP', 'Standard', 'Economic'],
    datasets: [
      {
        label: 'Số vé bán ra',
        data: [150, 450, 800, 490],
        backgroundColor: ['#7c3aed', '#2563eb', '#10b981', '#f59e0b'],
      }
    ]
  }
};

// Mock data for Room Booking
export const ROOM_BOOKING_DATA = {
  totalRooms: 5,
  bookedHours: 320,
  occupancyRate: '68%',
  pendingBookings: 8,
  roomOccupancy: {
    labels: ['Phòng A', 'Phòng B', 'Phòng C', 'Phòng D', 'Phòng E'],
    datasets: [
      {
        label: 'Giờ sử dụng',
        data: [85, 72, 90, 45, 28],
        backgroundColor: '#3b82f6',
      }
    ]
  }
};
