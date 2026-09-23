# JIZURA 字面 — Công cụ tự dựng video chữ (lyric motion)

[日本語](README.md) | **Tiếng Việt**

Nhập lời bài hát vào, ứng dụng trình duyệt này sẽ ghép các kiểu biểu hiện thường thấy trong video chữ (lyric motion / 文字PV) để tự dựng từng cảnh, rồi xuất ra MP4. Bố cục, chuyển động, trang trí, chuyển cảnh và phần hoàn thiện được chia thành 707 thành phần nhỏ (cùng 24 phong cách), và cách kết hợp thay đổi mỗi lần — đổi hạt giống (seed) là ra một bố cục khác, bao nhiêu lần cũng được. Kèm theo còn có bảng điều khiển (ScriptUI) cho After Effects.

**▶ Dùng trên trình duyệt: <https://852wa.github.io/JIZURA/>**　／　Bảng AE: [Tải JIZURA_AE.jsx](https://852wa.github.io/JIZURA/JIZURA_AE.jsx) (nhấp chuột phải vào liên kết → "Lưu liên kết thành…")

- Ngôn ngữ giao diện có thể chọn 日本語 / English / Tiếng Việt (menu ngôn ngữ ở góc trên bên phải; lần đầu mở sẽ theo ngôn ngữ của trình duyệt).
- Không cần cài đặt. Lời bài hát, bài hát và việc xuất file đều được xử lý hoàn toàn trong trình duyệt, không gửi lên máy chủ (thứ duy nhất tải từ bên ngoài là phông chữ Google Fonts, và chỉ tải những phông mà bố cục hiện tại dùng).
- Nút Ngẫu nhiên (phím `R`): mỗi lần nhấn sẽ đổi toàn bộ phong cách, không khí, chuyển động, bảng màu và bố cục.
- Tỉ lệ khung 16:9 / 9:16 / 4:3 / 3:4 / 1:1 / 4:5 / 21:9, từ 720p đến 4K, 24 / 30 / 60fps.
- Khi nạp bài hát, ứng dụng dò nhịp và căn các cảnh theo nhịp. Cũng có thể đồng bộ thủ công bằng cách chạm.
- Xuất MP4 (kèm nhạc), chuỗi PNG, PNG trong suốt. Có thể xuất cả dữ liệu bố cục (JSON) để chỉnh sửa trong After Effects.

| Tệp | Nội dung |
|---|---|
| `index.html` | Bản trình duyệt (đã build, 1 tệp duy nhất). GitHub Pages mở tệp này. Tải về và mở trên máy cũng dùng được |
| `JIZURA_AE.jsx` | Bảng điều khiển cho After Effects (đã build) |
| `src/` `app/` | Mã nguồn bản trình duyệt (engine, gói biểu hiện, giao diện) |
| `ae/` | Mã nguồn bảng AE |
| `docs/EXPRESSION_PACKS.md` | Hướng dẫn cho người muốn thêm thành phần biểu hiện (gói) |

### Môi trường hoạt động

- **Xuất MP4**: cần trình duyệt hỗ trợ WebCodecs (khuyên dùng Chrome / Edge. Safari 16.4 trở lên và Firefox 130 trở lên cũng hỗ trợ WebCodecs, nhưng có xuất được H.264 hay không còn tùy trình duyệt và hệ điều hành). Ở môi trường không hỗ trợ, vẫn dùng được xem trước và xuất chuỗi PNG.
- Phông chữ được tải từ Google Fonts, chỉ tải những phông cần dùng vào lúc cần (khi ngoại tuyến sẽ dùng phông có sẵn trên máy thay thế).

---

## Điều khoản sử dụng (quyền đối với sản phẩm và giấy phép)

- **Quyền đối với video và hình ảnh (sản phẩm) bạn tạo bằng công cụ này thuộc về người tạo ra chúng.** Bạn được tự do sử dụng, cho mục đích thương mại hay phi thương mại.
- Quyền đối với lời bài hát và bài hát đã dùng thuộc về chủ sở hữu tương ứng.
- Bản thân công cụ được phát hành theo giấy phép MIT. Xem chi tiết tại [LICENSE](LICENSE).
- Lời bài hát và bài hát bạn nhập chỉ được xử lý trong trình duyệt, không gửi lên máy chủ.
- Trong ứng dụng, bạn cũng xem được nội dung này qua nút "Điều khoản sử dụng" ở góc trên bên phải (ở chế độ Đơn giản là liên kết bên dưới nút xuất).

---

## Ngẫu nhiên (chế độ Đơn giản)

Chuyển màn hình bằng "Đơn giản / Chi tiết" ở góc trên bên phải. Khi mới mở, ứng dụng ở chế độ Đơn giản.

- **Tạo ngẫu nhiên cho tôi** (hoặc phím `R`): mỗi lần nhấn sẽ chọn lại ngẫu nhiên cùng lúc những thứ sau, rồi phát lại từ đầu.
  - Phong cách (không trùng với lần ngay trước)
  - Không khí (Glitch / Êm dịu / Pop / Đồ họa / Biên tập / Cảm xúc / Tất cả). Mỗi kiểu không khí thay đổi độ mạnh chuyển động, lượng glitch, cũng như các kỹ thuật bố cục, xuất hiện và biến mất được dùng.
  - Phông chữ cho tiêu đề và khung chữ Minchō (có chân)
  - Bảng màu (thỉnh thoảng màu nhấn và màu lệch A/B cũng được chọn ngẫu nhiên)
  - Bố cục các cảnh (hạt giống)
- **◀ Phương án trước / Phương án sau ▶**: qua lại giữa các phương án đã tạo bằng Ngẫu nhiên. Có thể quay lại phương án ưng ý rồi mới xuất.
- **Chỉ đổi phần này**: giữ nguyên phương án hiện tại, chỉ chọn lại một phần.
  - Phong cách / Bảng màu (màu nhấn, màu lệch A/B) / Không khí (chuyển động và kỹ thuật dùng) / Bố cục (tổ hợp bố cục và chuyển động)
- Lời bài hát, bài hát, thời gian và cài đặt xuất không bị Ngẫu nhiên thay đổi. Các dòng đã khóa trong danh sách dòng cũng được giữ nguyên.

### Phạm vi hiệu ứng dùng khi chọn ngẫu nhiên

Hai ô đánh dấu bên dưới nút Ngẫu nhiên (ở chế độ Chi tiết thì nằm phía trên tab "Kỹ thuật") quyết định những hiệu ứng nào được chọn khi Ngẫu nhiên, Xáo trộn và bốc lại từng dòng.

- **Dùng cả hiệu ứng bổ sung** (mặc định: tắt): khi tắt, chỉ dùng hiệu ứng của bản công khai đầu tiên (356 thành phần, 12 phong cách). Khi bật, các hiệu ứng thêm vào sau này (351 thành phần, 12 phong cách, 6 phông chữ) cũng thành ứng viên.
- **Dùng cả hiệu ứng phong cách Nhật** (mặc định: bật): đồ họa kiểu Nhật như đèn lồng, bưu thiếp, cửa shōji, quạt, gia huy, sóng seigaiha, cánh hoa anh đào…, cùng các phong cách kiểu Nhật (Hoa anh đào, Mực tàu & son). Khi tắt, chúng sẽ không được chọn. Điều kiện này được áp dụng sau ô "hiệu ứng bổ sung".
- Cả hai không ảnh hưởng khi bạn tự chỉ định bố cục… cho từng dòng hoặc tự chọn phong cách.
- Trong tab "Kỹ thuật" và danh sách phong cách, phần bổ sung có nhãn "Mới", phần kiểu Nhật có nhãn "Nhật". Những mục không được chọn ngẫu nhiên với cài đặt hiện tại sẽ hiển thị mờ.

## Màu ngẫu nhiên

Nằm ở "Chi tiết" → tab "Phong cách" → "Màu nhấn & màu lệch".

- **Màu ngẫu nhiên**: chọn lại tổ hợp màu nhấn và màu lệch A/B (hai màu của hiệu ứng lệch màu).
  - Gần một nửa số lần sẽ chọn từ các tổ hợp đã được căn chỉnh sẵn cho hợp nhau (như cặp màu bổ túc). Phần còn lại được tạo mới từ vòng thuần sắc mỗi lần.
  - Độ sáng được tự điều chỉnh theo độ sáng của nền để chữ luôn đủ đậm và dễ đọc (màu nhấn có tỉ lệ tương phản với nền từ 3 trở lên).
- Cũng có thể chọn màu trực tiếp. Bỏ chọn "Ghi đè bằng màu của tôi" để quay về màu gốc của phong cách.

---

## Cách dùng bản trình duyệt

1. **Lời bài hát**: mỗi dòng là một câu. Cú pháp như sau:
   - `màu bình minh/em vẫn nhớ` … dùng `/` để đánh dấu chỗ ngắt cảnh
   - `*trong suốt*` … nhấn mạnh (dễ được chọn hiệu ứng lớn, mạnh)
   - `!` ở cuối dòng … thêm chớp sáng và rung
   - `lời|chú thích` … chữ nhỏ hiển thị trong bố cục chú thích
   - `[01:23.45]lời` … dùng nguyên dấu thời gian LRC
2. **Bài hát và thời gian**
   - Khi nạp bài hát, BPM và nhịp được dò tự động, chỗ ngắt cảnh được căn theo nhịp.
   - Nhấn "Chạm để đồng bộ" thì bài hát sẽ phát. Hãy nhấn Space đúng lúc mỗi dòng bắt đầu.
   - Cũng có thể sửa trực tiếp số giây trong danh sách dòng.
3. **Chọn bố cục**
   - "Xáo trộn" bốc lại toàn bộ.
   - Nút xúc xắc ở mỗi dòng chỉ bốc lại dòng đó.
   - Nút khóa giữ cố định bố cục của dòng đó; cũng có thể chỉ định trực tiếp kiểu bố cục.
4. **Phong cách**: có 24 bộ gồm bảng màu, phông chữ và chất liệu (bao gồm Hoa anh đào / Biển sâu / Hoàng hôn / Sổ tay rừng / Vapor / Báo giấy / Synth thập niên 80 / Giấy kraft / Kẹo ngọt / Acid / Mực tàu & son / Đêm vàng…). Ngay trong một video, màu nền cũng thay đổi theo từng cảnh.
   - Phông chữ được chọn từ 18 họ phông của Google Fonts (bao gồm Reggae One / Rampart One / Potta One / Kiwi Maru / Klee One / Shippori Mincho B1). Vì **chỉ tải những phông mà bố cục hiện tại đang dùng**, dù số phông tăng lên thì việc khởi động và vận hành cũng không bị nặng.
   - Có thể thay phông chữ bằng các cách sau:
     - Nhập tên phông đã cài trên máy
     - Nạp tệp .ttf / .otf
5. **Hiệu ứng và kỹ thuật**
   - Tab "Hiệu ứng" điều chỉnh độ mạnh chuyển động, glitch, lệch màu, lượng trang trí, mật độ cảnh, chất liệu và bước khung hình.
   - Tab "Kỹ thuật" cho phép bật/tắt từng thành phần trong 10 nhóm (Bố cục, Xuất hiện, Giữ, Biến mất, Trang trí, Xử lý chữ, Nền, Máy quay, Hiệu ứng màn hình, Chuyển cảnh) — được xét kết hợp với hai ô "bổ sung" và "phong cách Nhật" ở trên. Mỗi nhóm được thu gọn, có các nút "Bật hết / Tắt hết / Đảo" và ô lọc theo tên.
6. **Xuất**
   - MP4 (H.264 trên Chrome / Edge; có thể kèm bài hát)
   - Chuỗi PNG (ZIP)
   - PNG trong suốt (ZIP, không nền; dùng để ghép trong AE…)
   - Tỉ lệ khung chọn được 16:9 / 9:16 / 4:3 / 3:4 / 1:1 / 4:5 / 21:9, độ phân giải từ 720p đến 4K, tốc độ khung hình 24 / 30 / 60fps (chi tiết ở mục "Xuất ở 24 / 30 / 60fps" bên dưới).
7. **Xuất cho AE**: xuất bố cục hiện tại (thời gian, bố cục, hiệu ứng, bảng màu) ra JSON. Khi nạp vào bảng AE, bạn sẽ có composition giữ nguyên bố cục đó và chỉnh sửa được.

### Xuất ở 24 / 30 / 60fps

1. Trong tab "Xuất" (ở chế độ Đơn giản là mục "Xuất" bên phải), chọn tỉ lệ khung, độ phân giải và **fps**.
2. Nhấn "Xuất MP4". Video được xuất với đúng số khung hình của fps đã chọn (ví dụ 6 giây: 144 khung ở 24fps, 360 khung ở 60fps).
3. Độ "giật" của chuyển động được quyết định riêng, không phụ thuộc fps, bởi **Bước khung hình** trong tab "Hiệu ứng".
   - **Mỗi 2 khung (12 hình/giây)**: chuyển động hơi giật, đúng chất video chữ. Xuất ở fps nào cũng cho cùng một cảm giác (mặc định).
   - **Mỗi 3 khung (8 hình/giây)**: chuyển động mang cảm giác vẽ tay hơn, hơi khựng.
   - **Đầy đủ**: chuyển động ở mọi khung theo fps xuất. 60fps + Đầy đủ là mượt nhất (chuyển động máy quay và dải chữ chạy rất đẹp).
4. Các lần đổi ngẫu nhiên của glitch và nhấp nháy được giữ cùng tốc độ theo chuẩn 24fps dù đổi fps. Xuất ở 60fps thì nhấp nháy cũng không nhanh gấp đôi.
5. Gợi ý: YouTube / MV nên dùng 24fps (hoặc 30fps); video dọc cho mạng xã hội muốn mượt thì 30–60fps + Đầy đủ. 60fps và 4K sẽ tốn thời gian xuất hơn.

Trong bảng AE, chọn tốc độ khung hình của composition bằng mục "fps" (24 / 30 / 60). Khi tạo từ JSON, composition sẽ có fps đã chọn trong bản trình duyệt.

### Các thành phần biểu hiện (tự ghép thành bố cục)

Tổng số thành phần là **707** (356 của bản công khai đầu tiên + 351 phần bổ sung. Phần bổ sung chỉ thành ứng viên ngẫu nhiên khi bật "Dùng cả hiệu ứng bổ sung"). Mỗi cảnh ghép một thành phần từ mỗi nhóm (riêng Trang trí từ 0 đến 3 cái).

| Nhóm | Số lượng | Ví dụ |
|---|---|---|
| Bố cục | 140 | Giữa màn hình, chữ dọc, xuyên màn hình, phụ đề dưới, bong bóng thoại, giấy ô vuông viết văn, mưa chữ, đường hầm, neon, danh đề cuối phim, trang đôi tạp chí, mục lục, báo, đĩa than, băng cassette, polaroid, tờ tem, ema, đèn lồng, noren, tanzaku, omikuji, tranh cuộn treo, shōji, biển tên ga, khối lập phương, hình trụ, lá cờ bay, con lắc, xếp khối, bóng bay chữ, bảng đèn điện tử, biển hiệu, ô chữ, xếp hình, múa bóng, kính vạn hoa, khóa kéo, stencil… |
| Xuất hiện | 100 | Tách rời → hợp lại, cắt lát, lật, domino, iris, rèm sáo, xoắn ốc hợp lại, bật đèn neon, đóng dấu, lò xo, ná cao su, bóng nảy, mở quạt, xoay trụ, stop-motion, dán sticker, vo nhàu rồi phẳng lại, mở thư, bảng lật, kính lúp, kéo phim, bật màn hình CRT, đang tải, xoay trống, dữ liệu rơi, nét bút phẩy, giọt mực, đếm nhịp vào, từng nét một… |
| Giữ | 38 | Rung nhẹ, lơ lửng, dao động, đập theo nhịp, nhịp tim, thạch rung, ngọn lửa lung linh, gió giật, đung đưa treo, giãn theo âm lượng, đảo theo nhịp, bóng loáng, thỉnh thoảng lật mặt, chuyển tiêu cự, rung dây đàn… |
| Biến mất | 86 | Nổ tung, sụp đổ, đóng cửa, tắt TV, hút vào, tan chảy, xóa lùi (backspace), bóc sticker, vo tròn vứt đi, xé bỏ, cháy xém biến mất, bảng xóa phấn, hóa cát bay đi, máy hủy giấy, bay theo bóng bay, vỡ kính, lốc xoáy, rơi lả tả, sóng xung kích, chìm nước, chém một nhát, thổi tắt… |
| Trang trí | 115 | Tâm ngắm, dấu cắt in (tombo), radar, đường kích thước, pháo giấy, cánh hoa, lóa sáng, bokeh, nét bút phẩy, con dấu rakkan, gia huy, sóng seigaiha, pháo hoa, đèn lồng, dây shimenawa, quạt, lá phong, sương mờ, mạch điện, dấu căn chỉnh in, ghim bấm, kẹp giấy, bầu trời sao, tuần trăng, đom đóm, Memphis, nút phát, nút thích, nốt nhạc… |
| Xử lý chữ | 52 | Chữ viền kép, viền, 3D, bóng dài, phát sáng, bút dạ quang, chấm lưới (halftone), dấu chấm nhấn, ống neon, chrome, cầu vồng, lệch bản màu, đổ bóng nhiều lớp, chữ stencil, karaoke, khoanh tròn, ngoặc kép Nhật, phản chiếu, viền sticker, kiểu giấy viết văn, chữ cắt dán… |
| Nền | 62 | Tia tỏa, vòng tròn đồng tâm, đèn sân khấu, chữ khổng lồ, lưới retro, chấm bi, cực quang, gradient lưới, seigaiha, asanoha, houndstooth, tartan, đường đồng mức, trời sao, đêm trăng, phố xá, hoàng hôn, sóng biển, cửa sổ mưa, pháo hoa, dãy núi, nhiễu VHS, đá cẩm thạch, cắt giấy… |
| Máy quay | 28 | Tiến chậm vào, lia, góc nghiêng (Dutch), cầm tay, zoom theo nhịp, zoom giật, quay quanh, lộn vòng, con lắc, lấy nét, động đất, chóng mặt (vertigo), zoom xoáy, lia nhanh… |
| Hiệu ứng màn hình | 66 | Glitch cắt lát / khối, đảo màu, chớp sáng, tách RGB, cuộn VHS, nhấp nháy strobe, cháy phim, sắc sai tỏa tia, bloom, mắt cá, pixel sort, dither 1-bit, kính vạn hoa, lóa anamorphic, nhiễu tuyết, vết xước phim, đường tập trung, lấp lánh, sọc màu, vỡ kính, màn trập… |
| Chuyển cảnh | 20 | Quét cạnh, quét dải chéo, quét đồng hồ, iris vào, đẩy, phủ, zoom xuyên, mở cửa hai cánh, chuyển rèm sáo, chuyển bàn cờ, vỡ khối, lia vụt, mực, sập ô gạch, khối lập phương, chuyển chớp sáng, chuyển khảm… |

- Xử lý chữ càng dễ được dùng khi "Lượng trang trí" càng nhiều; nền được chọn theo từng dòng ("Đổi nền" càng cao thì đổi càng thường xuyên).
- Chuyển cảnh thỉnh thoảng được chèn vào chỗ hai cảnh nối liền nhau, tùy theo độ mạnh chuyển động (ghép khung hình cuối của cảnh trước với cảnh sau để chuyển).
- Mỗi thành phần được gắn thẻ không khí (Glitch / Êm dịu / Pop / Đồ họa / Biên tập / Cảm xúc), và Ngẫu nhiên sẽ ưu tiên các thành phần hợp với không khí đã chọn.

Dưới đây là danh sách bộ cơ bản (các thành phần cũng có trong bảng AE).

- **Bố cục (17 loại)**: Giữa / Trộn to nhỏ / Chữ dọc / Dải chạy / Lát kín / Rải rác / Vòng tròn / Quỹ đạo sóng / Xuyên màn hình / Dán nhãn / Nén dọc / Chú thích / Gõ chữ / Dải chéo / Cửa sổ tròn / Chồng dư ảnh / Viên nang
- **Xuất hiện (13 loại)**: Tách rời → hợp lại (tách chữ thành từng nét hoặc bộ thủ) / Cắt lát / Gõ chữ / Bật ra / Rơi xuống / Co giãn / Quét / Mờ / Xoay / Nhấp nháy / Xáo chữ / Zoom / Cắt thẳng
- **Giữ**: Rung nhẹ / Trôi / Thở / Sóng / Glitch
- **Biến mất (11 loại)**: Nổ tung / Sụp đổ / Tan biến / Cắt lát / Quét / Thu nhỏ / Mờ / Co giãn / Văng tứ tung / Glitch / Cắt thẳng
- **Trang trí (15 loại)**: Dấu khung / Vòng tọa độ / Vòng chấm / Mũi tên / Gạch chéo / Tia lửa / Đường chỉ dẫn / Dạng sóng / Mã vạch / Lưới / Sọc / Vết mực / Dải thô / Hình khối / Số lớn
- **Hoàn thiện**
  - Lệch màu có độ trễ thời gian (tách RGB)
  - Glitch cắt lát / glitch khối toàn màn hình
  - Đảo màu / chớp sáng / zoom blur / khảm
  - Rung / mỗi 2 khung / hạt nhiễu / chất liệu giấy / đường quét / lan sáng / tối viền

---

## Cách dùng bảng After Effects

### Cài đặt

1. Đặt `JIZURA_AE.jsx` vào thư mục sau rồi khởi động lại AE.
   - Windows: `C:\Program Files\Adobe\Adobe After Effects <phiên bản>\Support Files\Scripts\ScriptUI Panels\`
   - Mac: `/Applications/Adobe After Effects <phiên bản>/Scripts/ScriptUI Panels/`
2. Vào menu "Window" → "JIZURA_AE.jsx" để mở bảng; bảng có thể gắn (dock) vào giao diện.
3. Nếu chỉ muốn thử, có thể chạy bằng "File → Scripts → Run Script File" (sẽ mở dạng cửa sổ nổi).

### Cách dùng

- **Từ lời bài hát**: chọn lời, phong cách, kích thước, hiệu ứng rồi nhấn "Tạo composition".
  - Thời gian có thể chọn một trong ba cách:
    - Tự động (tính từ số ký tự và BPM)
    - Marker của layer đang chọn
    - Marker của composition
  - Quy trình khuyên dùng: chọn layer bài hát, vừa phát vừa nhấn phím `*` trên bàn phím số để đặt marker ở đầu mỗi dòng. Chọn "Dùng marker của layer đang chọn làm đầu dòng" rồi tạo.
- **Tạo ngẫu nhiên**: mỗi lần nhấn sẽ chọn ngẫu nhiên phong cách, không khí, độ mạnh hiệu ứng, mỗi 2 khung / chớp sáng / HUD, hạt giống và bảng màu, cập nhật lên bảng điều khiển và tạo composition mới. Nếu ưng kết quả, bạn có thể chỉnh các giá trị từ đó rồi nhấn "Tạo composition" để tạo lại.
- **Không khí** (mục "Hiệu ứng"): khi chọn, chỉ dùng các kỹ thuật bố cục, xuất hiện và biến mất hợp với không khí đó. Việc thu hẹp kỹ thuật nào do hạt giống quyết định, nên cùng hạt giống sẽ cho cùng kết quả.
- **Màu nhấn & màu lệch**: "Màu ngẫu nhiên" chọn lại màu nhấn và màu lệch A/B. Cũng có thể nhập trực tiếp dạng `#RRGGBB`. Khi đánh dấu "Ghi đè màu của phong cách", màu được áp dụng cho mọi cảnh của composition tạo ra (độ sáng tự điều chỉnh theo nền).
- **Về các thành phần mới của bản trình duyệt**: bảng AE chỉ dựng được các thành phần của bộ cơ bản (bố cục 17, xuất hiện 13, giữ 6, biến mất 11, trang trí 15). Khi "Xuất cho AE" từ bản trình duyệt, mỗi thành phần mới được thay bằng thành phần gần giống nhất (xử lý chữ, nền, máy quay và chuyển cảnh chưa được hỗ trợ ở bản AE nên sẽ không dùng). Khi có thay thế, thanh trạng thái ở cuối bảng sẽ hiện "có thay thế".
- **Về các phong cách bổ sung**: bố cục tạo bằng các phong cách mới của bản trình duyệt (12 loại từ Hoa anh đào đến Đêm vàng) khi nạp bằng JSON vẫn giữ nguyên bảng màu và phông chữ đã chỉ định (nếu máy không có phông đó, sẽ dùng phông gần giống hoặc phông chỉ định trong tab "Phông chữ"). Hiện tại danh sách phong cách và thành phần của chính bảng AE chỉ có bộ cơ bản. Phần bổ sung sẽ được hỗ trợ trong các bản cập nhật sau.
- **Kích thước**: 1920×1080 / 1080×1920 / 1080×1080 / 3840×2160 / 1280×720 / 1440×1080 (4:3) / 1080×1440 (3:4), hoặc bằng kích thước composition đang hoạt động.
- **Từ JSON**: nạp tệp JSON tạo bằng "Xuất cho AE" của bản trình duyệt. Bố cục đã quyết định trên trình duyệt sẽ được dựng lại y nguyên trong AE.
- **Phông chữ**
  - Nếu máy có Noto Sans JP / Noto Serif JP / Dela Gothic One…, chúng sẽ được dùng tự động (tự chọn từ AE 2024 trở lên).
  - Nếu không có, sẽ dùng phông chỉ định trong tab "Phông chữ". Mặc định là Yu Gothic và Yu Mincho.

### Những gì được tạo ra

- Pre-comp cho từng cảnh (thư mục `JIZURA <tên bài> cuts`)
  - Chữ chuyển động bằng Text Animator (Expression Selector), nên dù gõ lại chữ, chuyển động vẫn được giữ.
- Hiệu ứng lệch màu được thể hiện bằng các layer bóng ma: nhân bản từng cảnh với độ trễ thời gian và tô màu bằng hiệu ứng "Tint".
- Adjustment layer `JZ FX` trên cùng gom các hiệu ứng sau:
  - Mỗi 2 khung (Posterize Time)
  - Rung (Transform)
  - Glitch cắt lát (Wave Warp)
  - Zoom blur / đảo màu / Glow / Noise
- Ngoài ra còn tạo `JZ Flash`, `JZ Vignette` và HUD (timecode, bộ đếm dòng).

### Lưu ý

- Từ AE 2020 trở đi, engine expression được giả định là JavaScript (mặc định cho dự án mới).
- Bảng này đã được kiểm thử trong môi trường mô phỏng mô hình đối tượng của AE: đã xác nhận không có lỗi với mọi tổ hợp phong cách × bố cục × xuất hiện/biến mất, cũng như Tạo ngẫu nhiên và Màu ngẫu nhiên. Tuy nhiên chưa chạy thử trên AE thật. Nếu có điều gì ngoài dự kiến (ví dụ ở cài đặt hiệu ứng), sau khi tạo xong bảng sẽ liệt kê các mục đó, và phần còn lại vẫn được tạo bình thường.

---

## Phát triển & build

```
python3 build.py              # src/ app/ vendor/ → index.html
node tools/export_ae_data.js  # khi thay đổi phong cách…: cập nhật ae/data.json
python3 build_ae.py           # ae/ → JIZURA_AE.jsx
```
Để build chỉ cần Python 3 và Node.js (không cần gói npm). Khi thêm thành phần biểu hiện, xem `docs/EXPRESSION_PACKS.md` (công cụ kiểm thử nằm trong `dev/`).

### Công khai trên repository của bạn (khi fork…)

1. Push lên sao cho `index.html` nằm ngay thư mục gốc của repository.
2. Vào **Settings → Pages**, đặt Source là **Deploy from a branch**, Branch là `main` / `/ (root)` rồi lưu.
3. Vài phút sau có thể mở tại `https://<tên người dùng>.github.io/<tên repository>/`.

## Giấy phép

[Giấy phép MIT](LICENSE). Được phép sử dụng, sửa đổi và phân phối lại, cho mục đích thương mại hay phi thương mại (với điều kiện kèm theo thông báo bản quyền và văn bản giấy phép).
Quyền đối với video và hình ảnh tạo bằng công cụ này thuộc về người tạo ra chúng (và chủ sở hữu quyền đối với lời bài hát, bài hát đó). Giấy phép của phần mềm này không áp dụng cho sản phẩm đầu ra.

Về phần mềm của bên thứ ba đi kèm, xem [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
