const Product = require("../models/product");
const Category = require("../models/category");
const Customer = require("../models/customer");
const Event = require("../models/event");
const Role = require("../models/role");
const Order = require("../models/order");
const Promotion = require("../models/promotion");
const { faker } = require("@faker-js/faker");

const { cloudinary } = require("./cloudinary");
const { sizes, roleNames, orderShippingMethods, orderPaymentMethods, orderPaymentStatuses } = require("../constants");

const products = [
  {
    description:
      "Áo Thun Cổ Tròn Linh Vật Bbuff Ver13 với chất liệu Cotton Compact, thành phần: 100% Cotton, thân thiện, thấm hút thoát ẩm, mềm mại, kiểm soát mùi, điều hòa nhiệt, họa tiết in dẻo, thêu xù. HDSD: nên giặt chung với sản phẩm cùng màu, không dùng thuốc tẩy hoặc xà phòng có tính tẩy mạnh, nên phơi trong bóng râm để giữ sản phẩm bền màu",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-linh-vat-bbuff-ver13-0020749/5eeb0240-e80e-2500-4c2f-00190f8b2951.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-linh-vat-bbuff-ver13-0020749/2db36db6-8a4f-2800-8672-00190f8b5c66.jpg?w=800",
    },
    name: "Áo Thun Cổ Tròn Linh Vật Bbuff Ver13",
    price: 285000,
  },
  {
    description:
      "Áo Khoác Varsity 12VAHDT Văn Hiến Chi Bang Ver4. Chất liệu : Vải Poly Thành Phần: 100% Polyester + Thân áo - Co giãn - Vải nhẹ - Mềm mịn - Độ bền cao + Tay áo - Cản gió - Thoáng Khí - Vừa vặn Tối ưu - Trượt nước - Bảo vệ chống tác động môi trường + Họa tiết thêu + thêu da đắp giống - Cổ tay, lai áo được bo vải gân - Áo được cài bằng nút bấm - Túi trong tiện dụng",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-varsity-12vahdt-van-hien-chi-bang-ver4-0020554/41241376-2918-6400-e651-00191513135a.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-varsity-12vahdt-van-hien-chi-bang-ver4-0020554/ff9e2827-165f-6500-0090-00191513145c.jpg?w=540&h=756",
    },
    name: "Áo Khoác Varsity 12VAHDT Văn Hiến Chi Bang Ver4",
    price: 595000,
    to: "/shop/ao-khoac-varsity-12vahdt-van-hien-chi-bang-ver4",
  },
  {
    description:
      "Áo Khoác Hoodie Zipper Y Nguyên Bản 18- Ver24. Chất liệu: French Terry Thành phần: 100% Cotton - Thấm hút thoát ẩm - Mềm mại - Co giãn đàn hồi - Thân thiện môi trường + Họa tiết in vải cây + thêu đổ chỉ + Reverse Coil Zipper (Những chiếc khoá túi này có bề mặt ngoài dẹp, phẳng trong khi răng khoá thì ở trong)",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-hoodie-zipper-y-nguyen-ban-18--ver24-0020718/12f9224e-3df6-8e00-d2b8-001915158d92.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-hoodie-zipper-y-nguyen-ban-18--ver24-0020718/26bc5e6f-240b-8f00-c60d-001915158de7.jpg?w=540&h=756",
    },
    name: "Áo Khoác Hoodie Zipper Y Nguyên Bản 18- Ver24",
    price: 499000,
    to: "/shop/ao-khoac-hoodie-zipper-y-nguyen-ban-18--ver24",
  },
  {
    description:
      "Áo Khoác Hoodie Zipper Thần Cổ Đại Valknut Ver3 - Chất liệu: French Terry - Thành phần: 100% Cotton - Thấm hút thoát ẩm - Mềm mại, ít nhăn - Co giãn tối ưu - Thân thiện môi trường + Họa tiết in trục ống đồng + Reverse Coil Zipper (Những chiếc khoá túi này có bề mặt ngoài dẹp, phẳng trong khi răng khoá thì ở trong)",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-hoodie-zipper-on-gian-than-co-ai-valknut-ver3-0020680/8c818724-bb21-6100-68ec-0018fa32ac79.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-hoodie-zipper-on-gian-than-co-ai-valknut-ver3-0020680/433085ef-b75c-6200-1526-0018fa32ad39.jpg?w=540&h=756",
    },
    name: "Áo Khoác Hoodie Zipper Đơn Giản Thần Cổ Đại Valknut Ver3",
    price: 595000,
    to: "/shop/ao-khoac-hoodie-zipper-on-gian-than-co-ai-valknut-ver3",
  },
  {
    description:
      "Áo Khoác Hoodie Ngân Hà Space Ver5 - Chất liệu: French Terry - Thành phần: 100% Cotton - Thấm hút thoát ẩm - Mềm mại, ít nhăn - Co giãn tối ưu - Thân thiện môi trường + Họa tiết in nước",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-hoodie-ngan-ha-space-ver5-0020570/17e12901-31e0-0100-9459-0018d2e7ba77.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-hoodie-ngan-ha-space-ver5-0020570/76bdbc13-005f-0200-51ee-0018d2e7ba89.jpg?w=540&h=756",
    },
    name: "Áo Khoác Hoodie Ngân Hà Space Ver5",
    price: 425000,
    to: "/shop/ao-khoac-hoodie-ngan-ha-space-ver5",
  },
  {
    description:
      "Chất liệu: Jean Cotton Thành phần: 99% cotton 1% spandex - Độ bền cao - Mang đến sự thoải mái ở phần hông và đùi nhưng vẫn rất gọn gàng HDSD: - Hãy lộn mặt trái của sản phẩm trước khi giặt để hạn chế bay màu vải. - Không nên sử dụng các chất tẩy rửa mạnh trong quá trình giặt.",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/quan-jean-straight-on-gian-m1-0020025/71cb7568-ff5b-3700-0556-001883b5cec9.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/quan-jean-straight-on-gian-m1-0020025/3f97c31d-0111-3800-c75e-001883b5cf76.jpg?w=540&h=756",
    },
    name: "Quần Jean Straight Đơn Giản M1",
    price: 425000,
    to: "/shop/quan-jean-straight-on-gian-m1",
  },
  {
    description: "Chất liệu: Jean Cotton Thành phần: 98% cotton 2% spandex - Độ bền cao - Mặc mát, rất thoải mái.",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/quan-jean-skinny-y2010-a03-0019733/c077b5f7-6135-0100-f60f-0018be85d28f.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/quan-jean-skinny-y2010-a03-0019733/1db40421-2b48-0200-2d1f-0018be85d337.jpg?w=540&h=756",
    },
    name: "Quần Jean Skinny Tối Giản A03",
    price: 425000,
    to: "/shop/quan-jean-skinny-y-toi-gian",
  },
  {
    description:
      "Chất liệu: Vải Quần Tây Thành phần: 70% poly 27% rayon 3% spandex - Mềm mại, bề mặt vải trơn mịn, cảm giác mát nhẹ khi mặc. - Thiết kế quần ống đứng mang đến sự lịch lãm, tự tin và nam tính cho người mặc. - Phù hợp với nhiều môi trường khác nhau như đi làm, đi tiệc, đi học, đi chơi.",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/quan-tay-y2010-hg10-0019773/93df77d3-2771-2200-ee72-0018b9fac4c5.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/quan-tay-y2010-hg10-0019773/d6f1f14f-c76d-2300-871d-0018b9fac57b.jpg?w=540&h=756",
    },
    name: "Quần Tây Tối Giản HG10",
    price: 385000,
    to: "/shop/quan-tay-y2010-hg10",
  },
  {
    description: "Chất liệu: Jean Cotton Thành phần: 98% cotton 2% spandex - Độ bền cao - Mặc mát, rất thoải mái.",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/quan-jean-nam-y2010-dai-b19-0019174/66e37ca9-3d54-0400-65f2-0018f7d6f880.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/quan-jean-nam-y2010-dai-b19-0019174/3339b7c8-f73a-0500-1faa-0018f7d6f891.jpg?w=540&h=756",
    },
    name: "Quần Jean Slimfit Đơn Giản B19",
    price: 425000,
    to: "/shop/quan-jean-nam-y2010-dai-b19",
  },
  {
    description:
      "Sơ Mi Cổ Danton Y Nguyên Bản 18- Ver17 Chất liệu: Vải dù Thành phần: 100% poly - Thấm hút nhanh - Khô nhanh - Co giãn 2 chiều + Họa tiết in chuyển nhiệt",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/so-mi-co-danton-y-nguyen-ban-18--ver17-0020714/3b59d597-9b84-1400-1315-00190f893232.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/so-mi-co-danton-y-nguyen-ban-18--ver17-0020714/eb059ff8-3560-1500-20ba-00190f893260.jpg?w=540&h=756",
    },
    name: "Áo Sơ Mi Cổ Danton Y Nguyên Bản 18- Ver17",
    price: 255000,
    to: "/shop/so-mi-co-danton-y-nguyen-ban-18",
  },
  {
    description:
      "Áo Thun Cổ Tròn Linh Vật Tigeer Ver6 Chất liệu: Cotton Compact 4C Thành phần: 92% cotton 8% spandex -Thân thiện - Thấm hút thoát ẩm - Mềm mại, ít nhăn - Co giãn tối ưu - Kiểm soát mùi - Điều hòa nhiệt + Họa tiết in trame",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-linh-vat-tigeer-ver6-0021143/6f592a9d-c3dc-b500-b003-001931348a84.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-linh-vat-tigeer-ver6-0021143/60317582-fefe-b600-269f-001931348b7f.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Linh Vật Tigeer Ver6",
    price: 257000,
    to: "/shop/ao-thun-co-tron-linh-vat-tigeer-ver6",
  },
  {
    description:
      "Áo Thun Cổ Tròn Y Nguyên Bản 18- Ver39 với chất liệu: Cotton 4 chiều, thành phần: 92% cotton 8% spandex - Thân thiện - Thấm hút thoát ẩm - Mềm mại, ít nhăn - Co giãn tối ưu - Kiểm soát mùi - Điều hòa nhiệt + Họa tiết in cây",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-y-nguyen-ban-18--ver39-0020883/09105e01-36e0-0100-3edd-0019150f7bf8.jpg?w=540&h=756&c=true",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-y-nguyen-ban-18--ver39-0020883/3f6747af-48e6-0200-93a6-0019150f7c55.jpg?w=540&h=756&c=true",
    },
    name: "Áo Thun Cổ Tròn Y Nguyên Bản 18- Ver39",
    oldPrice: 280000,
    price: 255000,
    to: "/shop/ao-thun-co-tron-y-nguyen-ban",
  },
  {
    description:
      "Áo Khoác Hoodie Đơn Giản Y Nguyên Bản Ver19 Chất liệu: French Terry Thành phần: 100% Cotton - Thấm hút thoát ẩm - Mềm mại - Co giãn đàn hồi - Thân thiện môi trường + Họa tiết: in bột nổi",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-hoodie-on-gian-y-nguyen-ban-ver19-0020661/0c496491-0761-7b00-c4a5-001915139083.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-hoodie-on-gian-y-nguyen-ban-ver19-0020661/e35c7293-4ac1-7c00-3baa-0019151390f5.jpg?w=540&h=756",
    },
    name: "Áo Khoác Hoodie Đơn Giản Y Nguyên Bản Ver19",
    price: 385000,
    to: "/shop/ao-khoac-hoodie-on-gian-y-nguyen-ban",
  },
  {
    description:
      "Áo Thun Cổ Trụ Tối Giản M15 Chất liệu: Cotton Compact 2C Thành phần: 100% Cotton - Thân thiện - Thấm hút thoát ẩm - Mềm mại - Kiểm soát mùi - Điều hòa nhiệt + Kẹp logo - HDSD: + Nên giặt chung với sản phẩm cùng màu + Không dùng thuốc tẩy hoặc xà phòng có tính tẩy mạnh + Nên phơi trong bóng râm để giữ sp bền màu",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tru-toi-gian-m15-0021083/7355b7b6-4b8b-6000-3c8e-001947f5dde9.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tru-toi-gian-m15-0021083/e0ccd23b-ac77-6100-a973-001947f5de9c.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Trụ Tối Giản M15",
    price: 287000,
    to: "/shop/ao-thun-co-tru-toi-gian-m15",
  },
  {
    description:
      "Áo Thun Cổ Tròn Linh Vật Tigeer Ver3 Chất liệu: Cotton Compact Thành phần: 100% Cotton - Thân thiện - Thấm hút thoát ẩm - Mềm mại - Kiểm soát mùi - Điều hòa nhiệt + Họa tiết in dẻo + nhãn ép - HDSD: + Nên giặt chung với sản phẩm cùng màu + Không dùng thuốc tẩy hoặc xà phòng có tính tẩy mạnh + Nên phơi trong bóng râm để giữ sp bền màu",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-linh-vat-tigeer-ver3-0020732/e7704cbf-aa18-0200-5f13-001917640b81.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-linh-vat-tigeer-ver3-0020732/2127b273-e9af-5400-8f10-001915127d1e.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Linh Vật Tigeer Ver3",
    price: 255000,
    to: "/shop/ao-thun-co-tron-linh-vat-tigeer-ver3",
  },
  {
    description:
      "Áo Thun Sweater Ngân Hà 4 Element Ver12 Chất liệu: FRENCH TERRY Thành phần: 100% cotton - Thấm hút thoát ẩm - Mềm mại, ít nhăn - Co giãn tối ưu - Thân thiện môi trường - Họa tiết in dẻo",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-sweater-universal-4-element-ver12-0020320/cd8b38d2-ee72-5f00-a9be-00188620d8dd.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-sweater-universal-4-element-ver12-0020320/0dc3c81c-a640-6000-6a25-00188620d9b6.jpg?w=540&h=756",
    },
    name: "Áo Thun Sweater Ngân Hà 4 Element Ver12",
    price: 355000,
    to: "/shop/ao-thun-sweater-ngan-ha-4-element-ver12",
  },
  {
    description:
      "Áo Thun Cổ Tròn Tối Giản M17 Chất liệu: Cotton Compact 4C Thành phần: 92% cotton 8% spandex -Thân thiện - Thấm hút thoát ẩm - Mềm mại, ít nhăn - Co giãn tối ưu - Kiểm soát mùi - Điều hòa nhiệt + Họa tiết may đắp logo TPR",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-toi-gian-m17-0020957/1c0168b0-e3f9-1b00-550f-00193c31e346.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-toi-gian-m17-0020957/49dd0f69-69ed-1c00-7394-00193c31e40c.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Tối Giản M17",
    price: 197000,
    to: "/shop/ao-thun-co-tron-toi-gian-m17",
  },
  {
    description:
      "Quần Short Y Nguyên Bản 18- Ver17 Chất liệu: Vải dù Thành phần: 100% poly - Thấm hút nhanh - Khô nhanh - Co giãn 2 chiều + Họa tiết in chuyển nhiệt",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/quan-short-y-nguyen-ban-18--ver17-0020804/907ccd76-a9db-1200-1200-00190f7132ab.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/quan-short-y-nguyen-ban-18--ver17-0020804/2a8ab318-09fc-1300-ba3c-00190f7132b7.jpg?w=540&h=756",
    },
    name: "Quần Short Y Nguyên Bản 18- Ver17",
    price: 225000,
    to: "/shop/quan-short-y-nguyen-ban-18",
  },
  {
    description:
      "Áo Thun Cổ Tròn Thần Cổ Đại Anubis Ver6 Chất liệu: Cotton Compact 4C Thành phần: 92% cotton 8% spandex -Thân thiện - Thấm hút thoát ẩm - Mềm mại, ít nhăn - Co giãn tối ưu - Kiểm soát mùi - Điều hòa nhiệt + Họa tiết in trame + in nước",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-than-co-ai-anubis-ver6-0021063/625364bf-5465-3301-ad8f-001947fb07b2.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-than-co-ai-anubis-ver6-0021063/e9218cd2-bb5d-3401-4492-001947fb08cb.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Thần Cổ Đại Anubis Ver6",
    oldPrice: 350000,
    price: 287000,
    to: "/shop/ao-thun-co-tron-than-co-ai-anubis-ver6",
  },
  {
    description:
      'Quần Short Thể Thao M7 Chất liệu: COTTON DOUBLE FACE - Vải sợi Cotton được dệt theo "DOUBLE-FACE" có cấu trúc 2 bề mặt giống nhau, có thể sử dụng được cả 2 mặt vải . Thành phần: 85% Cotton 15% Polyester - Co giãn - Độ bền cao - Thoáng Khí - Nhanh khô + Họa tiết phối dây viên phản quang',
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/quan-short-the-thao-m7-0020738/82f871e6-f152-4300-6899-00194cae3206.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/quan-short-the-thao-m7-0020738/76eee784-b0ed-4400-26d6-00194cae32ab.jpg?w=540&h=756",
    },
    name: "Quần Short Thể Thao M7",
    oldPrice: 255000,
    price: 204000,
    to: "/shop/quan-short-the-thao-m7",
  },
  {
    description:
      "Áo Khoác Varsity Đơn Giản Y Nguyên Bản Ver43 Chất liệu : French Terry + phối tay simily đen Thành phần :100% cotton Chất liệu: French Terry Thành phần: 100% Cotton - Thấm hút thoát ẩm - Mềm mại - Co giãn đàn hồi - Thân thiện môi trường + Họa tiết thêu + Cổ áo, cổ tay, lai áo được bo vải gân + Áo được cài bằng nút bấm + Túi trong tiện dụng",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-varsity-on-gian-y-nguyen-ban-ver43-0020735/881a1f35-9898-ed00-52ec-00194cb33175.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-khoac-varsity-on-gian-y-nguyen-ban-ver43-0020735/d5bc31e7-be85-ee00-d19b-00194cb3333f.jpg?w=540&h=756",
    },
    name: "Áo Khoác Varsity Đơn Giản Y Nguyên Bản Ver43",
    oldPrice: 657000,
    price: 525600,
    to: "/shop/ao-khoac-varsity-on-gian-y-nguyen-ban-ver43",
  },
  {
    description:
      "Áo Thun Cổ Tròn Đơn Giản 12VAHDT Vạn Xuân Kiến Quốc Ver9 Chất liệu: Cotton Compact 2C Thành phần: 100% Cotton - Thân thiện - Thấm hút thoát ẩm - Mềm mại - Kiểm soát mùi - Điều hòa nhiệt + Họa tiết thêu 3D - HDSD: + Nên giặt chung với sản phẩm cùng màu + Không dùng thuốc tẩy hoặc xà phòng có tính tẩy mạnh + Nên phơi trong bóng râm để giữ sp bền màu",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-12vahdt-van-xuan-kien-quoc-ver9-0021165/e9beabc0-dd95-2901-527a-0019523804c5.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-12vahdt-van-xuan-kien-quoc-ver9-0021165/3d6a37b1-e11f-2a01-cab5-0019523804d2.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Đơn Giản 12VAHDT Vạn Xuân Kiến Quốc Ver9",
    oldPrice: 227000,
    price: 181600,
    to: "/shop/ao-thun-co-tron-on-gian-12vahdt-van-xuan-kien-quoc-ver9",
  },
  {
    description:
      "Áo Thun Cổ Tròn Đơn Giản Y Nguyên Bản Ver52 với chất liệu: Cotton Compact. Thành phần: 100% Cotton - Thân thiện - Thấm hút thoát ẩm - Mềm mại - Kiểm soát mùi - Điều hòa nhiệt - Họa tiết may miếng đắp. HDSD: Nên giặt chung với sản phẩm cùng màu + Không dùng thuốc tẩy hoặc xà phòng có tính tẩy mạnh + Nên phơi trong bóng râm để giữ sp bền màu",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-y-nguyen-ban-ver52-0020808/66d30e05-af45-6d00-ef44-00190b76cb41.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-y-nguyen-ban-ver52-0020808/5157715c-53b8-6e00-11a0-00190b76cc12.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Đơn Giản Y Nguyên Bản Ver52",
    price: 199000,
    to: "/shop/ao-thun-co-tron-don-gian-y-nguyen-ban-ver52-be",
  },
  {
    description:
      "Áo Thun Cổ Tròn Linh Vật Bbuff Ver10 Chất liệu: Cotton Compact Thành phần: 100% Cotton - Thân thiện - Thấm hút thoát ẩm - Mềm mại - Kiểm soát mùi - Điều hòa nhiệt + Họa tiết in dẻo + in bột nổi - HDSD: + Nên giặt chung với sản phẩm cùng màu + Không dùng thuốc tẩy hoặc xà phòng có tính tẩy mạnh + Nên phơi trong bóng râm để giữ sp bền màu",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-linh-vat-bbuff-ver10-0020445/bbe76d46-63c7-1700-1385-00189739ef77.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-linh-vat-bbuff-ver10-0020445/10578842-cb24-1800-980e-00189739f009.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Linh Vật Bbuff Ver10",
    oldPrice: 250000,
    price: 199000,
    to: "/shop/ao-thun-co-tron-linh-vat-bbuff-ver10",
  },
  {
    description:
      "Áo Thun Cổ Tròn Thể Thao M36 Chất liệu: Nylon Fabric Thành phần : 45% Nylon 45% Polyester 10% Spandex - Mềm mại - Thoáng khí - Nhanh khô - Trọng lượng nhẹ - Làm mát cơ thể + Họa tiết ép silicon + rã + le mí + Thích hợp cho các hoạt động thể thao, vận động hàng ngày",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-the-thao-m36-0021077/26a3231b-3eac-0100-9d48-00194caba9d5.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-the-thao-m36-0021077/3741ad52-37d7-0200-6a1a-00194cabab74.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Thể Thao M36",
    price: 257000,
    to: "/shop/ao-thun-co-tron-the-thao-m36",
  },
  {
    description:
      "Áo Thun Cổ Tròn Đơn Giản Ngân Hà Space Ver14 Chất liệu: Cotton Compact Thành phần: 100% Cotton - Thân thiện - Thấm hút thoát ẩm - Mềm mại - Kiểm soát mùi - Điều hòa nhiệt + Họa tiết thêu - HDSD: + Nên giặt chung với sản phẩm cùng màu + Không dùng thuốc tẩy hoặc xà phòng có tính tẩy mạnh + Nên phơi trong bóng râm để giữ sp bền màu",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-ngan-ha-space-ver14-0020548/e33d0e51-7b50-2300-54e3-0018b1dcfe51.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-ngan-ha-space-ver14-0020548/97e90ce0-662f-2400-100d-0018b1dcff0c.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Đơn Giản Ngân Hà Space Ver14",
    price: 199000,
    to: "/shop/ao-thun-co-tron-on-gian-ngan-ha-space-ver14",
  },
  {
    description:
      "Áo Thun Cổ Tròn Đơn Giản Y Nguyên Bản Ver72 Chất liệu: Vải thun gân Thành phần: 100% polyester + Họa tiết thêu thường",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-y-nguyen-ban-ver72-0021031/91bb041d-1c9f-ff00-06c9-001952372914.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-y-nguyen-ban-ver72-0021031/a0b13363-c81e-0001-e926-001952372957.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Đơn Giản Y Nguyên Bản Ver72",
    price: 180000,
    to: "/shop/ao-thun-form-rong-co-tron-on-gian-y-nguyen-ban-ver72",
  },
  {
    description:
      "Quần Dài Sweatpants Linh Vật Olygre Ver1 - Chất liệu: French Terry - Thành phần: 100% Cotton - Thấm hút thoát ẩm - Mềm mại, ít nhăn - Co giãn tối ưu - Thân thiện môi trường + Họa tiết in dẻo + nhãn ép + Dây rút giấu cạp trong + Gấu quần bo vào mắt cá chân, cực kì hiệu quả trong việc che khuyết điểm",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/quan-dai-sweatpants-linh-vat-olygre-ver1-0020500/6daccbdb-3c40-7500-e124-0018b1dedb4c.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/quan-dai-sweatpants-linh-vat-olygre-ver1-0020500/cb60aa93-44b9-7600-cf41-0018b1dedc2b.jpg?w=540&h=756",
    },
    name: "Quần Dài Vải Linh Vật Olygre Ver1",
    price: 369000,
    to: "/shop/quan-dai-sweatpants-linh-vat-olygre-ver1",
  },
  {
    description:
      "- Chất liệu: MINI ZURRY - Thành Phần: + 95% COTTON Thân thiện với môi trường Thoáng mát + 5% SPANDEX Giúp quần co giãn tối ưu",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/quan-jogger-thun-y2010-bd-b21-0019789/5184377b-db02-2400-e263-0018b9fadc55.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/quan-jogger-thun-y2010-bd-b21-0019789/4f6d90ee-7e39-2500-0259-0018b9fadcf4.jpg?w=540&h=756",
    },
    name: "Quần Jogger Đơn Giản Ver1",
    price: 350000,
    to: "/shop/quan-jogger-thun-y2010-bd-b21",
  },
  {
    description: "Chất liệu : Kaki Thành phần: 100% cotton",
    images: {
      mainImg: "https://cdn2.yame.vn/pimg/non-u-y2010-a21-0019689/166b206d-407f-0c00-a7be-0018e46d7a08.jpg?w=540&h=756",
      subImg: "https://cdn2.yame.vn/pimg/non-u-y2010-a21-0019689/72e45b15-1266-0d00-f56f-0018e46d7a8f.jpg?w=540&h=756",
    },
    name: "PKTT Nón Nguyên Bản A21",
    price: 120000,
    to: "/shop/non-u-y2010-a21",
  },
  {
    description:
      "Thành phần: 90% Cotton 10% Spandex - Mềm mại, bó sát cổ chân - Thoáng khí - Co giãn, đàn hồi cao - Khử mùi",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/pktt-vo-unisex-y2010-v02-0015530/e6d23f18-d49c-7e00-89fc-001819a626c4.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/pktt-vo-unisex-y2010-v02-0015530/29014038-e095-7f00-246a-001819a62757.jpg?w=540&h=756",
    },
    name: "PKTT Vớ Nguyên Bản V02",
    price: 19000,
    to: "/shop/pktt-vo-unisex",
  },
  {
    description:
      "Dây: 100% da bò thật - Bền bỉ - Sang trọng và tinh tế - Dây nịt sử dụng được cả 2 mặt da --- Đầu khóa: Zinc contract (Là một loại hợp kim màu của Kẽm, thêm Nhôm, Đồng, Magie. Có màu trắng xanh ở nhiệt độ thường) - Bề mặt sáng bóng và đẹp - Đặc biệt: không gỉ sét -- (*) Được tặng kèm hộp đựng (box) logo ánh kim sang trọng.",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/pktt-day-nit-on-gian-m18-0020428/b8be4b8c-1611-3400-172f-001891ca6e01.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/pktt-day-nit-on-gian-m18-0020428/0ba42894-b823-3500-983a-001891ca6e09.jpg?w=540&h=756",
    },
    name: "PKTT Dây Nịt Nguyên Bản M18",
    price: 285000,
    to: "/shop/pktt-day-nit-on-gian-m18",
  },
  {
    description:
      "Áo Thun Cổ Tròn Đơn Giản Y Nguyên Bản Ver52 với chất liệu: Cotton Compact. Thành phần: 100% Cotton - Thân thiện - Thấm hút thoát ẩm - Mềm mại - Kiểm soát mùi - Điều hòa nhiệt + Họa tiết may miếng đắp. HDSD: + Nên giặt chung với sản phẩm cùng màu + Không dùng thuốc tẩy hoặc xà phòng có tính tẩy mạnh + Nên phơi trong bóng râm để giữ sp bền màu",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-y-nguyen-ban-ver52-0020809/f0e93712-260d-7a00-9d12-00190b77445b.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-y-nguyen-ban-ver52-0020809/8c8470dd-eecf-7b00-e281-00190b7744bb.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Đơn Giản Y Nguyên Bản Ver52",
    price: 199000,
    to: "/shop/ao-thun-co-tron-don-gian-y-nguyen-ban-ver52-den",
  },
  {
    description:
      "Áo Thun Cổ Tròn Đơn Giản Thần Cổ Đại Horus Ver8 với chất liệu: Cotton Compact Thành phần: 100% Cotton - Thân thiện - Thấm hút thoát ẩm - Mềm mại - Kiểm soát mùi - Điều hòa nhiệt + Họa tiết in dẻo. HDSD: + Nên giặt chung với sản phẩm cùng màu + Không dùng thuốc tẩy hoặc xà phòng có tính tẩy mạnh + Nên phơi trong bóng râm để giữ sp bền màu",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-than-co-ai-horus-ver8-0020796/87f7aa75-fe1a-0e00-34c9-001915106b43.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-on-gian-than-co-ai-horus-ver8-0020796/cf7075d8-546a-0f00-0f6e-001915106c2e.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Đơn Giản Thần Cổ Đại Horus Ver8",
    price: 225000,
    to: "/shop/ao-thun-co-tron-don-gian-than-co-ai-horus-ver8",
  },
  {
    description:
      "Áo Thun Cổ Tròn Tối Giản M6 với chất liệu: Vải Thun Cotton. Thành phần: 100% Cotton + Họa tiết thêu 2D thường",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-toi-gian-m6-0020783/16528c04-1ab8-8700-4858-00190b777c9e.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-toi-gian-m6-0020783/2bff6ee5-50f0-8800-e48f-00190b777d5f.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Tối Giản M6",
    price: 199000,
    to: "/shop/ao-thun-co-tron-toi-gian-m6",
  },
  {
    description:
      "Sơ Mi Cổ Danton Y Nguyên Bản 18- Ver19 với chất liệu: Vải dù. Thành phần: 100% poly - Thấm hút nhanh - Khô nhanh - Co giãn 2 chiều + Họa tiết in chuyển nhiệt",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/so-mi-co-danton-y-nguyen-ban-18--ver19-0020713/4001fbdb-3399-0100-ed99-00190f6e1457.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/so-mi-co-danton-y-nguyen-ban-18--ver19-0020713/64d04885-8b54-0200-bd10-00190f6e15d9.jpg?w=540&h=756",
    },
    name: "Sơ Mi Cổ Danton Y Nguyên Bản 18- Ver19",
    price: 255000,
    to: "/shop/so-mi-co-danton-y-nguyen-ban-18-ver19",
  },
  {
    description:
      'Áo Thun Sweater Y Nguyên Bản 18- Ver47 với chất liệu: COTTON DOUBLE FACE - Vải sợi Cotton được dệt theo "DOUBLE-FACE" có cấu trúc 2 bề mặt giống nhau, có thể sử dụng được cả 2 mặt vải. Thành phần: 87% Cotton 13% Polyester - Co giãn - Độ bền cao - Thoáng Khí - Nhanh khô - Thấm hút + Họa tiết in dẻo',
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-sweater-y-nguyen-ban-18--ver47-0020780/fb43773d-dab5-0100-df18-00191b2ae577.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-sweater-y-nguyen-ban-18--ver47-0020780/10edf8de-3dc6-1400-1662-00190f9052ad.jpg?w=540&h=756",
    },
    name: "Áo Thun Sweater Y Nguyên Bản 18- Ver47",
    price: 355000,
    to: "/shop/ao-thun-sweater-y-nguyen-ban-18",
  },
  {
    description:
      "Áo Thun Cổ Tròn Tối Giản Ver12 với chất liệu: Vải tổ ong Thành phần: 100% Polyester + Họa tiết thêu 2D",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-toi-gian-ver12-0020772/8d37fdf7-e945-0200-a992-0019046480a2.jpg?w=540&h=756",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-toi-gian-ver12-0020772/1453a6bd-3792-0300-4dd3-001904648163.jpg?w=540&h=756",
    },
    name: "Áo Thun Cổ Tròn Tối Giản Ver12",
    price: 199000,
    to: "/shop/ao-thun-co-tron-toi-gian-ver12",
  },
  {
    description:
      "Áo Thun Cổ Tròn 12VAHDT Yên Tử Hàn Ver3. Chất liệu: Cotton Compact 4C. Thành phần: 92% cotton 8% spandex - Thân thiện - Thấm hút thoát ẩm - Mềm mại, ít nhăn - Co giãn tối ưu - Kiểm soát mùi - Điều hòa nhiệt - Họa tiết in dẻo",
    images: {
      mainImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-12vahdt-yen-tu-han-ver3-0021075/b09c330a-1046-c500-45e7-001931357cb8.jpg?w=540&h=756&c=true&ntf=false",
      subImg:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-12vahdt-yen-tu-han-ver3-0021075/f44fc4c6-be22-c600-d8f3-001931357ce4.jpg?w=540&h=756&c=true&ntf=false",
    },
    name: "Áo Thun Cổ Tròn 12VAHDT Yên Tử Hàn Ver3",
    oldPrice: 257000,
    price: 179900,
  },
];

exports.generateData = async () => {
  // const categoryId = faker.database.mongodbObjectId();
  // const categoryProducts = [];
  // const filteredProducts = products.filter(
  //   (product) => product.name.includes("Nón") || product.name.includes("Vớ N") || product.name.includes("Dây Nịt")
  // );
  // const filteredProducts = products.filter(
  //   (product) => product.name.includes("Ngân Hà 4 Element Ver12")
  // );
  // console.log(filteredProducts);
  // const { resources: resourcesMainImages } = await cloudinary.search
  //   .expression("folder:clothingshop/products/mainImg/phu-kien")
  //   .execute();
  // const mainImgPublicIds = resourcesMainImages.map((item) => item.public_id);
  // const { resources: resourcesSubImages } = await cloudinary.search
  //   .expression("folder:clothingshop/products/subImg/phu-kien")
  //   .execute();
  // const subImgPublicIds = resourcesSubImages.map((item) => item.public_id);
  // filteredProducts.reverse().forEach(async (product, index) => {
  //   const productId = faker.database.mongodbObjectId();
  //   // categoryProducts.push(productId);
  //   const newProduct = new Product({
  //     name: product.name,
  //     category: 'cd9e84d7c0b9ae5c9e8db63b',
  //     price: product.price,
  //     oldPrice: product.oldPrice,
  //     description: product.description,
  //     images: {
  //       // mainImg: mainImgPublicIds[index],
  //       // subImg: subImgPublicIds[index],
  //       mainImg: '',
  //       subImg: ''
  //     },
  //     sizes: [
  //       { name: sizes.SIZE_S, quantity: 100, sold: 0 },
  //       { name: sizes.SIZE_M, quantity: 100, sold: 0 },
  //       { name: sizes.SIZE_L, quantity: 100, sold: 0 },
  //       { name: sizes.SIZE_XL, quantity: 100, sold: 0 },
  //     ],
  //     _id: productId,
  //   });
  //   await newProduct.save();
  // });
  // const category = new Category({
  //   name: "GU THỂ THAO",
  //   types: [
  //     {
  //       type: "Áo thun đơn giản",
  //       products: [],
  //     },
  //     {
  //       type: "Áo khoác đơn giản",
  //       products: [],
  //     },
  //     {
  //       type: "Quần dài đơn giản",
  //       products: [],
  //     }
  //   ],
  //   products: categoryProducts,
  //   _id: categoryId,
  // });
  // await category.save();
  // const category = await Category.findOne({ name: "GU ĐƠN GIẢN" }).populate("products");
  // const simpleTShirtTypeIndex = category.types.findIndex((item) => item.type === "Quần dài đơn giản");
  // const simpleTShirtProducts = category.products.filter((product) => product.name.includes("Quần Jogger Đơn Giản") || product.name.includes("Quần Jean Straight Đơn Giản") || product.name.includes("Quần Jean Slimfit Đơn Giản"));
  // const simpleTShirtProductIds = simpleTShirtProducts.map((product) => product._id);
  // category.types[simpleTShirtTypeIndex].products = simpleTShirtProductIds;
  // await category.save();
  // const { resources: resourcesMainImages } = await cloudinary.search
  //   .expression("folder:clothingshop/banners/ready-to-sell/trouser/mainImg")
  //   .execute();
  // const mainImgPublicId = resourcesMainImages[0].public_id;
  // const { resources: resourcesSubImages } = await cloudinary.search
  //   .expression("folder:clothingshop/banners/ready-to-sell/trouser/subImg")
  //   .execute();
  // const subImgPublicIds = resourcesSubImages.map((item) => item.public_id);
  // const trouserProductsIds = await Product.find({ name: { $regex: "Quần" } })
  //   .select("_id")
  //   .limit(4);
  // const event = new Event({
  //   tag: "/quan-thoi-thuong",
  //   title: "Mở Bán Quần Dài",
  //   description:
  //     "Quần dài là một trong những sản phẩm thời trang cơ bản không thể thiếu trong tủ đồ của bất kỳ ai. Với thiết kế đơn giản và chất liệu cao cấp, quần dài có thể dễ dàng kết hợp với nhiều kiểu áo khác nhau để tạo ra nhiều phong cách khác nhau. Chúng tôi tự hào giới thiệu đến bạn bộ sưu tập quần dài mới nhất của chúng tôi, với nhiều kiểu dáng và màu sắc khác nhau. Chất liệu vải mềm mại, thoáng mát và co giãn tốt giúp bạn cảm thấy thoải mái khi sử dụng. Hãy đến với chúng tôi để trải nghiệm những sản phẩm thời trang chất lượng cao với giá cả hợp lý.",
  //   mainImg: mainImgPublicId,
  //   subImgs: subImgPublicIds,
  //   relatedProducts: trouserProductsIds,
  // });
  // await event.save();
  // const customers = await Customer.find();
  // for (const customer of customers) {
  //   customer.verified = false;
  //   await customer.save();
  // }
  /**
   * Create roles
   */
  // for (const roleName of Object.values(roleNames)) {
  //   const role = new Role({ name: roleName });
  //   await role.save();
  // }
  /**
   * Update product state
   */
  // const products = await Product.find();
  // for (const product of products) {
  //   product.state = "Đang bán";
  //   await product.save();
  // }
  /**
   * Add shipping and payment method
   */
  // const orders = await Order.find();
  // for (const order of orders) {
  //   order.shippingMethod = orderShippingMethods.FAST_DELIVERY;
  //   if (order.paymentStatus === orderPaymentStatuses.PAID) {
  //     order.paymentMethod = orderPaymentMethods.ONLINE_VNPAY;
  //   } else {
  //     order.paymentMethod = orderPaymentMethods.COD;
  //   }
  //   await order.save();
  // }

  /**
   * Update address to array of addresses
   */

  // const customers = await Customer.find();
  // for (const customer of customers) {
  //   customer.address = [
  //     {
  //       name: "Phạm Duy Khánh",
  //       phone: "0886025625",
  //       city: "Tỉnh Bình Phước",
  //       district: "Huyện Lộc Ninh",
  //       ward: "Xã Lộc Phú",
  //       detail: "Ngã 3 Trụ điện",
  //       isDefault: true,
  //     }
  //   ];
  //   await customer.save();
  // }

  /**
   * Update promotions for each customer
   */

  // const customers = await Customer.find();
  // for (const customer of customers) {
  //   customer.promotions = [];
  //   await customer.save();
  // }
};

exports.clearData = async () => {
  await Product.deleteMany();
  await Category.deleteMany();
};
