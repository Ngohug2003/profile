import { AppContent } from "@/types/content";

export const appContent: AppContent = {
  navbar: {
    logoText: "Hưng Dev Studio",
    menuItems: [
      { name: "Trang chủ", id: "trang-chu" },
      { name: "Giới thiệu", id: "gioi-thieu" },
      { name: "Dịch vụ", id: "dich-vu" },
      { name: "Dự án", id: "du-an" },
      { name: "Liên hệ", id: "lien-he" },
    ],
    ctaText: "Tư vấn",
  },
  hero: {
    badge: "Website & SEO Partner",
    title: "Thiết kế website chuyên nghiệp giúp doanh nghiệp phát triển",
    description: "Tôi giúp cá nhân, cửa hàng và doanh nghiệp xây dựng landing page, website bán hàng hiện đại, tải cực nhanh, chuẩn SEO và dễ vận hành.",
    ctaPrimary: "Liên hệ tư vấn",
    ctaSecondary: "Xem dịch vụ",
    trustCards: [
      {
        iconName: "Smartphone",
        title: "Responsive",
        subtitle: "Hiển thị đẹp mọi thiết bị",
      },
      {
        iconName: "Search",
        title: "Chuẩn SEO",
        subtitle: "Tối ưu dễ lên top Google",
      },
      {
        iconName: "Zap",
        title: "Tốc độ tối đa",
        subtitle: "Website tải mượt, cực nhanh",
      },
    ],
  },
  problems: {
    badge: "Vấn đề",
    title: "Website của bạn có đang gặp những trở ngại này?",
    description: "Một trang web tải chậm, giao diện cũ kỹ hoặc không chuẩn SEO có thể âm thầm khiến bạn mất đi hàng nghìn khách hàng tiềm năng.",
    problems: [
      {
        iconName: "Zap",
        title: "Tốc độ tải trang chậm",
        desc: "Khách hàng rời đi ngay lập tức nếu trang web mất quá 3 giây để hiển thị đầy đủ thông tin.",
      },
      {
        iconName: "Smartphone",
        title: "Giao diện không tương thích di động",
        desc: "Bố cục lộn xộn, chữ quá nhỏ hoặc nút bấm khó thao tác trên điện thoại di động làm mất điểm tối đa.",
      },
      {
        iconName: "Search",
        title: "Không chuẩn SEO, thiếu người xem",
        desc: "Trang web được thiết kế sơ sài, thiếu tối ưu onpage khiến thương hiệu không thể tiếp cận khách hàng trên Google.",
      },
    ],
  },
  about: {
    badge: "Giới thiệu",
    title: "Tôi là Hưng — Full-stack Developer tại Hà Nội",
    description: "Với hơn 5 năm kinh nghiệm trong thiết kế và phát triển web, tôi mang đến các giải pháp website chuẩn hóa giúp tối đa hóa hiệu quả kinh doanh của bạn.",
    bioText1: "Tôi tin rằng một website xuất sắc không chỉ nằm ở giao diện đẹp, mà cốt lõi phải là tốc độ tải trang nhanh, cấu trúc mã nguồn tối ưu chuẩn SEO và trải nghiệm sử dụng tinh giản trên điện thoại.",
    bioText2: "Thay vì sử dụng các giao diện dựng sẵn cồng kềnh, tôi tự tay tối ưu từng dòng code bằng React/Next.js và Tailwind CSS, mang đến cho bạn sản phẩm nhẹ nhất và chuẩn hóa cao nhất.",
    focusCards: [
      {
        iconName: "Code",
        title: "Lập trình tối ưu",
        desc: "Mã nguồn sạch, viết tay toàn bộ, không dùng theme dựng sẵn cồng kềnh.",
      },
      {
        iconName: "Cpu",
        title: "Hiệu năng ấn tượng",
        desc: "Website phản hồi tức thì, đạt điểm xanh tối đa trên Google PageSpeed Insights.",
      },
      {
        iconName: "ShieldAlert",
        title: "Tối ưu hóa SEO",
        desc: "Cấu trúc HTML chuẩn Semantic giúp bot Google dễ dàng quét và lập chỉ mục nhanh.",
      },
    ],
  },
  services: {
    badge: "Dịch vụ",
    title: "Giải pháp thiết kế web tinh gọn & hiệu quả",
    description: "Cung cấp các gói dịch vụ được tối ưu hóa cho từng nhu cầu cụ thể, đảm bảo chi phí hợp lý và hiệu quả đầu tư cao nhất.",
    services: [
      {
        name: "Gói Landing Page",
        price: "Từ 3.500.000đ",
        desc: "Tối ưu hóa mục tiêu chuyển đổi bán hàng cho một trang sản phẩm đơn lẻ hoặc chiến dịch quảng cáo.",
        popular: false,
        features: [
          "Thiết kế 1 trang độc quyền chuyên nghiệp",
          "Responsive đầy đủ trên di động/máy tính",
          "Tích hợp biểu mẫu và Google Sheets nhận data",
          "Tối ưu hóa tốc độ tải trang cực nhanh",
          "Tặng 1 năm tên miền quốc tế và hosting",
        ],
        ctaText: "Bắt đầu ngay",
        illustrationType: "landing",
      },
      {
        name: "Website Doanh Nghiệp / Bán Hàng",
        price: "Từ 6.500.000đ",
        desc: "Phù hợp cho các cửa hàng, doanh nghiệp dịch vụ muốn giới thiệu sản phẩm và tăng uy tín thương hiệu.",
        popular: true,
        popularBadge: "Phổ biến",
        features: [
          "Bố cục nhiều trang: Trang chủ, Sản phẩm, Liên hệ...",
          "Hệ thống quản lý sản phẩm tinh gọn, dễ dùng",
          "Kết nối nút đặt mua nhanh, Zalo, Messenger",
          "Tối ưu SEO onpage từng bài viết, sản phẩm",
          "Bàn giao tài liệu hướng dẫn quản trị chi tiết",
        ],
        ctaText: "Nhận báo giá",
        illustrationType: "ecommerce",
      },
      {
        name: "Tối ưu SEO & Tăng tốc web",
        price: "Từ 2.000.000đ",
        desc: "Dịch vụ tối ưu lại mã nguồn có sẵn để nâng điểm PageSpeed và gia tăng thứ hạng tìm kiếm tự nhiên.",
        popular: false,
        features: [
          "Nén ảnh thế hệ mới, tối ưu hóa CSS/JS",
          "Nâng điểm Google PageSpeed Insights lên 90+",
          "Cấu trúc lại thẻ H1-H6, sitemap, meta tags",
          "Xử lý lỗi bảo mật SSL/HTTPS, chuyển hướng",
          "Báo cáo chi tiết trước và sau khi tối ưu",
        ],
        ctaText: "Tối ưu ngay",
        illustrationType: "seo",
      },
    ],
  },
  workflow: {
    badge: "Quy trình",
    title: "Quy trình làm việc 5 bước chuyên nghiệp",
    description: "Quy trình làm việc rõ ràng, nhanh gọn giúp bạn dễ dàng theo sát tiến độ và nhận sản phẩm đúng hẹn.",
    steps: [
      {
        number: "01",
        title: "Tư vấn & Báo giá",
        desc: "Trao đổi chi tiết về ý tưởng dự án, đối tượng khách hàng, chức năng cần có và chốt chi phí triển khai phù hợp nhất.",
        details: ["Khảo sát yêu cầu", "Lập dự toán chi tiết"],
      },
      {
        number: "02",
        title: "Phác thảo Wireframe",
        desc: "Thiết kế bố cục nội dung cơ bản của trang web bằng hình vẽ đen trắng giúp bạn duyệt trước cấu trúc trước khi code.",
        details: ["Dàn trang nội dung", "Duyệt wireframe"],
      },
      {
        number: "03",
        title: "Lập trình mã nguồn",
        desc: "Bắt tay vào code giao diện tỉ mỉ theo đúng chuẩn responsive, đảm bảo tốc độ tải mượt mà và tối ưu hóa SEO.",
        details: ["Lập trình React/Next.js", "Tối ưu di động"],
      },
      {
        number: "04",
        title: "Kiểm thử & Tối ưu",
        desc: "Tiến hành rà soát lỗi trên các thiết bị, tối ưu điểm số tốc độ tải trang trên Google PageSpeed Insights đạt mức xanh.",
        details: ["Test responsive", "Tăng tốc độ load"],
      },
      {
        number: "05",
        title: "Bàn giao & Hướng dẫn",
        desc: "Cấu trúc tên miền, hosting chạy chính thức, gửi tài liệu hướng dẫn và video giúp bạn làm chủ website dễ dàng.",
        details: ["Chạy chính thức", "Bàn giao mã nguồn"],
      },
    ],
  },
  portfolio: {
    badge: "Dự án tiêu biểu",
    title: "Những sản phẩm đã hoàn thiện",
    description: "Tổng hợp các dự án website, landing page thực tế được tối ưu hóa giao diện và cấu trúc chuẩn chuyển đổi cao.",
    projects: [
      {
        title: "SHOPZONE",
        category: "E-Commerce",
        desc: "Cửa hàng phụ kiện âm thanh cao cấp với tính năng lọc sản phẩm nhanh, thanh toán mượt mà và giao diện tối giản.",
        imageAlt: "Shopzone e-commerce preview",
        features: ["Tốc độ load dưới 1.5s", "Hỗ trợ thanh toán nhanh", "Đạt 98 điểm di động"],
        ctaText: "Xem dự án",
        techStack: ["Next.js", "Tailwind CSS", "Zustand"],
      },
      {
        title: "VELOCE CHRONO",
        category: "Landing Page",
        desc: "Trang sản phẩm đồng hồ titan cao cấp với các hiệu ứng chuyển động mượt mà, cấu trúc tăng tối đa chuyển đổi mua hàng.",
        imageAlt: "Veloce chrono preview",
        features: ["Responsive 100%", "Tối ưu hóa chuyển đổi", "Tải trang tức thì"],
        ctaText: "Xem dự án",
        techStack: ["React", "Framer Motion", "Tailwind CSS"],
      },
    ],
    bannerTitle: "Sẵn sàng sở hữu website chuẩn SEO của riêng bạn?",
    bannerDesc: "Hãy để tôi giúp bạn xây dựng một trang web hiện đại, tải nhanh và mang lại hiệu quả kinh doanh thực tế.",
    bannerCta: "Bắt đầu ngay",
  },
  faq: {
    badge: "FAQ",
    title: "Câu hỏi thường gặp22222",
    description: "Giải đáp những băn khoăn phổ biến giúp bạn dễ dàng chuẩn bị và phối hợp triển khai dự án website hiệu quả.",
    faqItems: [
      {
        title: "Làm một website hoặc landing page mất bao lâu?",
        content: "Thông thường từ 3–7 ngày làm việc tùy thuộc vào khối lượng nội dung, cấu trúc trang và mức độ phức tạp của dự án.",
        illustrationType: "calendar",
      },
      {
        title: "Tôi chưa chuẩn bị xong nội dung thì có làm được không?",
        content: "Hoàn toàn được. Tôi sẽ hỗ trợ bạn xây dựng khung sườn nội dung cơ bản, định hướng biên soạn bài viết và cấu trúc bố cục tối ưu chuyển đổi.",
      },
      {
        title: "Website có tương thích tốt trên điện thoại di động không?",
        content: "Tất nhiên. Website được thiết kế responsive chuẩn hóa hiển thị trên mọi thiết bị: điện thoại di động, máy tính bảng và màn hình máy tính lớn.",
      },
      {
        title: "Website có được tối ưu để hỗ trợ SEO tốt không?",
        content: "Có. Mã nguồn sẽ được tối ưu onpage kỹ lưỡng bao gồm các thẻ tiêu đề (H1-H6), thẻ meta, sitemap, robots.txt và kết nối Google Search Console.",
      },
      {
        title: "Tôi được hỗ trợ những gì sau khi bàn giao sản phẩm?",
        content: "Tôi hỗ trợ kỹ thuật, khắc phục lỗi phát sinh và cung cấp tài liệu/video hướng dẫn quản trị chi tiết để bạn tự tin làm chủ website.",
      },
      {
        title: "Có thể nâng cấp thêm chức năng sau này không?",
        content: "Có. Kiến trúc website được xây dựng dạng module linh hoạt giúp dễ dàng tích hợp thêm trang blog, giỏ hàng bán hàng nâng cao hoặc hệ thống thanh toán tự động về sau.",
      },
    ],
    supportTitle: "Bạn cần trao đổi thêm?",
    supportDesc: "Tôi sẵn sàng hỗ trợ phản hồi nhanh chóng.",
    supportCta: "Liên hệ tư vấn",
    supportBenefits: [
      "Tư vấn trực tiếp, phản hồi trong 24h",
      "Báo giá minh bạch, rõ ràng từng hạng mục",
    ],
    supportEmail: "hello@hungdev.studio",
    supportPhone: "0987 123 456",
  },
  contact: {
    badge: "Liên hệ",
    title: "Sẵn sàng xây dựng website của bạn?",
    description: "Hãy chia sẻ thông tin về dự án, tôi sẽ phản hồi và tư vấn giải pháp kỹ thuật tối ưu nhất cho bạn.",
    servicesList: [
      {
        title: "Tư vấn thiết kế Landing Page",
        desc: "Tối ưu hóa tỷ lệ chuyển đổi khách hàng, thiết kế giao diện phù hợp với chiến dịch marketing của bạn.",
      },
      {
        title: "Phát triển Website Bán Hàng",
        desc: "Trưng bày sản phẩm đẹp mắt, kết nối biểu mẫu đặt hàng nhanh chóng và dễ quản lý nội dung sản phẩm.",
      },
      {
        title: "Tối ưu hóa cấu trúc SEO",
        desc: "Tối ưu Onpage chuẩn chỉ, tăng tốc độ tải trang giúp website thân thiện tối đa với bộ máy tìm kiếm.",
      },
    ],
    channels: [
      {
        type: "phone",
        label: "0987 123 456",
        href: "tel:0987123456",
      },
      {
        type: "email",
        label: "hello@hungdev.studio",
        href: "mailto:hello@hungdev.studio",
      },
      {
        type: "facebook",
        label: "Facebook",
        href: "https://facebook.com/hungdev",
      },
    ],
    formTitle: "Đăng ký nhận tư vấn",
    formSubtitle: "Mô tả tóm tắt về yêu cầu dự án, sản phẩm, đối tượng khách hàng và mục tiêu của bạn...",
    formSubmitText: "Gửi yêu cầu tư vấn",
  },
  footer: {
    brandDesc: "Dịch vụ tư vấn thiết kế Landing Page, phát triển website bán hàng tinh gọn và tối ưu hóa cấu trúc SEO cơ bản.",
    email: "hello@hungdev.studio",
    phone: "0987 123 456",
    facebook: "facebook.com/hungdev",
    columns: [
      {
        title: "Dịch vụ",
        links: [
          { text: "Landing Page", href: "#dich-vu" },
          { text: "Website Bán Hàng", href: "#dich-vu" },
          { text: "SEO Onpage", href: "#dich-vu" },
        ],
      },
      {
        title: "Liên kết",
        links: [
          { text: "Trang chủ", href: "#" },
          { text: "Giới thiệu", href: "#gioi-thieu" },
          { text: "Quy trình", href: "#quy-trinh" },
          { text: "Câu hỏi", href: "#faq" },
        ],
      },
    ],
    copyright: "© 2026 Hung Dev Studio. Bản quyền đã được bảo hộ.",
    privacyText: "Bảo mật tuyệt đối",
    backToTopText: "Đầu trang",
  },
};
export default appContent;
