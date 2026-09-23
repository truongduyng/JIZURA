/* ============================================================
   JIZURA — UI language (日本語 / English / Tiếng Việt)

   J.lang              current language: 'ja' | 'en' | 'vi'
   J.setLang(l)        switch + remember (localStorage 'jizura.lang')
   J.t(key, vars)      UI string; {name} placeholders are filled from vars
   J.tr(jaLabel)       translate a part / style / mood label (see 11s_i18n_names.js)
   J.applyI18n(root)   translate static markup:
                         data-i18n="key"        innerHTML
                         data-i18n-title="key"  title attribute
                         data-i18n-ph="key"     placeholder attribute
                         data-i18n-aria="key"   aria-label attribute
                       The Japanese text written in app/body.html is the 'ja' value
                       for static keys, so those entries only carry [null, en, vi].
   ============================================================ */
(() => {
'use strict';
J.LANGS = { ja: '日本語', en: 'English', vi: 'Tiếng Việt' };
const IDX = { ja: 0, en: 1, vi: 2 };

// key: [日本語, English, Tiếng Việt]
const D = {
  /* ---------- static markup (ja comes from app/body.html) ---------- */
  'songTitle.ph': [null, 'Song title (shown on the title card & HUD)', 'Tên bài hát (hiện trên thẻ tiêu đề & HUD)'],
  'songTitle.aria': [null, 'Song title', 'Tên bài hát'],
  'songArtist': [null, 'Artist', 'Nghệ sĩ'],
  'modes.aria': [null, 'View mode', 'Chế độ hiển thị'],
  'modeEasy': [null, 'Easy', 'Đơn giản'],
  'modeEasy.title': [null, 'A simple screen built around the Omakase button', 'Màn hình đơn giản xoay quanh nút Ngẫu nhiên'],
  'modePro': [null, 'Advanced', 'Chi tiết'],
  'modePro.title': [null, 'Show every setting', 'Hiện tất cả cài đặt'],
  'open': [null, 'Open', 'Mở'],
  'open.title': [null, 'Open a saved project (.json)', 'Mở dự án đã lưu (.json)'],
  'save': [null, 'Save', 'Lưu'],
  'save.title': [null, 'Save the project as .json', 'Lưu dự án thành .json'],
  'ae': [null, 'Export for AE', 'Xuất cho AE'],
  'ae.title': [null, 'Export the composition data for the After Effects panel', 'Xuất dữ liệu bố cục cho bảng After Effects'],
  'terms': [null, 'Terms of use', 'Điều khoản sử dụng'],
  'terms.title': [null, 'Rights to your output & the license', 'Quyền đối với sản phẩm & giấy phép'],
  'colLeft.aria': [null, 'Lyrics and timing', 'Lời bài hát và thời gian'],
  'lyrics': [null, 'Lyrics', 'Lời bài hát'],
  'lyrics.aria': [null, 'Lyrics (1 line = 1 phrase)', 'Lời bài hát (1 dòng = 1 câu)'],
  'syntax': [null, 'Syntax', 'Cú pháp'],
  'syn.1': [null, 'One line is one phrase. An empty line leaves a short pause', 'Mỗi dòng là một câu. Dòng trống tạo một khoảng nghỉ ngắn'],
  'syn.2': [null, '<code>colors of dawn/I remember</code> … <code>/</code> marks a cut break', '<code>màu bình minh/em vẫn nhớ</code> … <code>/</code> đánh dấu chỗ cắt cảnh'],
  'syn.3': [null, '<code>*clear*</code> … emphasis (bigger, more impactful motion)', '<code>*trong suốt*</code> … nhấn mạnh (to hơn, hiệu ứng mạnh hơn)'],
  'syn.4': [null, '<code>!</code> at the end of a line … adds a flash and a shake', '<code>!</code> ở cuối dòng … thêm chớp sáng và rung'],
  'syn.5': [null, '<code>lyric|ruby or note</code> … small text for the annotation layout', '<code>lời|ruby hoặc ghi chú</code> … chữ nhỏ cho bố cục chú thích'],
  'syn.6': [null, '<code>[01:23.45]lyric</code> … uses the LRC timestamp as is', '<code>[01:23.45]lời</code> … dùng nguyên dấu thời gian LRC'],
  'syn.7': [null, 'Lines starting with <code>#</code> … comments (ignored)', 'Dòng bắt đầu bằng <code>#</code> … chú thích (bỏ qua)'],
  'songTiming': [null, 'Song & timing', 'Bài hát & thời gian'],
  'loadAudio': [null, 'Load song', 'Tải bài hát'],
  'loadAudio.title': [null, 'mp3 / wav / m4a etc.', 'mp3 / wav / m4a v.v.'],
  'tapSync': [null, 'Tap to sync', 'Chạm để đồng bộ'],
  'tapSync.title': [null, 'Play the song and tap at the start of each line', 'Phát bài hát và chạm vào đầu mỗi dòng'],
  'offset': [null, 'Start (s)', 'Bắt đầu (giây)'],
  'lineScale': [null, 'Line length', 'Độ dài dòng'],
  'snap': [null, 'Snap to beat', 'Bám theo nhịp'],
  'resetTimes': [null, 'Clear manual timing', 'Xóa thời gian thủ công'],
  'tap.hint': [null, 'Press <span class="kbd">Space</span> or the button the moment each line starts in the song.', 'Nhấn <span class="kbd">Space</span> hoặc nút đúng lúc mỗi dòng bắt đầu trong bài hát.'],
  'tap.next': [null, 'Next:', 'Tiếp:'],
  'tap.stop': [null, 'Finish', 'Kết thúc'],
  'linesCuts': [null, 'Lines & cuts', 'Dòng & cảnh'],
  'preview': [null, 'Preview', 'Xem trước'],
  'scrub.aria': [null, 'Playback position', 'Vị trí phát'],
  'loop': [null, 'Loop', 'Lặp'],
  'prev.title': [null, 'Back to the previous idea', 'Quay lại phương án trước'],
  'prev.aria': [null, 'Previous idea', 'Phương án trước'],
  'next.title': [null, 'Forward to the next idea', 'Đến phương án tiếp theo'],
  'next.aria': [null, 'Next idea', 'Phương án tiếp theo'],
  'shuffle': [null, 'Shuffle', 'Xáo trộn'],
  'shuffle.title': [null, 'Re-draw only the composition, keeping the settings (locked lines stay)', 'Chỉ bốc lại bố cục, giữ nguyên cài đặt (dòng đã khóa được giữ)'],
  'omakase': [null, 'Omakase', 'Ngẫu nhiên'],
  'omakase.title': [null, 'Randomize style, mood, motion and colors all at once (key R)', 'Ngẫu nhiên toàn bộ phong cách, không khí, hiệu ứng và màu (phím R)'],
  'timeline.aria': [null, 'Timeline (click to seek)', 'Dòng thời gian (nhấp để tua)'],
  'colRight.aria': [null, 'Style and export', 'Phong cách và xuất'],
  'omakaseBig': [null, 'Make it for me (Omakase)', 'Tạo ngẫu nhiên cho tôi'],
  'omakase.hint': [null, 'Every press changes the style, mood, motion, colors and composition all at once. You can also press <span class="kbd">R</span>.', 'Mỗi lần nhấn sẽ đổi toàn bộ phong cách, không khí, chuyển động, màu sắc và bố cục. Bạn cũng có thể nhấn phím <span class="kbd">R</span>.'],
  'prev2': [null, '◀ Previous', '◀ Phương án trước'],
  'next2': [null, 'Next ▶', 'Phương án sau ▶'],
  'eExtra': [null, 'Also use the added effects<small>Lets Omakase and Shuffle pick the ~350 effects, 12 color sets and 6 typefaces added after the first public version (when off, only the first version\'s effects are used)</small>', 'Dùng cả hiệu ứng bổ sung<small>Cho phép Ngẫu nhiên và Xáo trộn chọn cả ~350 hiệu ứng, 12 bộ màu và 6 phông chữ được thêm sau bản công khai đầu tiên (khi tắt, chỉ dùng hiệu ứng của bản đầu tiên)</small>'],
  'eWa': [null, 'Also use Japanese-style effects<small>Japanese graphics such as lanterns, postcards, shoji screens, fans, family crests, seigaiha waves and cherry petals. When off, Omakase and Shuffle won\'t pick them</small>', 'Dùng cả hiệu ứng phong cách Nhật<small>Đồ họa kiểu Nhật như đèn lồng, bưu thiếp, vách shoji, quạt, gia huy, sóng seigaiha, cánh hoa anh đào. Khi tắt, Ngẫu nhiên và Xáo trộn sẽ không chọn chúng</small>'],
  'now': [null, 'Current idea', 'Phương án hiện tại'],
  'partial': [null, 'Change just this', 'Chỉ đổi phần này'],
  'eStyle': [null, 'Style', 'Phong cách'],
  'eStyle.title': [null, 'Switch only the style', 'Chỉ đổi phong cách'],
  'ePalette': [null, 'Colors', 'Bảng màu'],
  'ePalette.title': [null, 'Randomize the accent and offset colors A/B', 'Ngẫu nhiên màu nhấn và màu lệch A/B'],
  'eMood': [null, 'Mood', 'Không khí'],
  'eMood.title': [null, 'Only the mood: motion, glitch and the techniques used', 'Chỉ không khí: chuyển động, glitch và kỹ thuật dùng'],
  'eCut': [null, 'Composition', 'Bố cục'],
  'eCut.title': [null, 'Only the combination of layouts and motion', 'Chỉ tổ hợp bố cục và chuyển động'],
  'export': [null, 'Export', 'Xuất'],
  'aspect': [null, 'Aspect', 'Tỉ lệ khung'],
  'ar.9:16': [null, '9:16 vertical', '9:16 dọc'],
  'ar.3:4': [null, '3:4 vertical', '3:4 dọc'],
  'ar.4:5': [null, '4:5 vertical', '4:5 dọc'],
  'res': [null, 'Resolution', 'Độ phân giải'],
  'mp4': [null, 'Export MP4', 'Xuất MP4'],
  'terms.link1': [null, 'About the rights to exported videos', 'Về quyền đối với video đã xuất'],
  'cancel': [null, 'Cancel', 'Hủy'],
  'tab.style': [null, 'Style', 'Phong cách'],
  'tab.fx': [null, 'Effects', 'Hiệu ứng'],
  'tab.tech': [null, 'Techniques', 'Kỹ thuật'],
  'tab.out': [null, 'Export', 'Xuất'],
  'fontRoles': [null, 'Font roles', 'Vai trò phông chữ'],
  'localFont.ph': [null, 'Installed font name (e.g. Arial)', 'Tên phông trên máy (vd: Arial)'],
  'addFont': [null, 'Add', 'Thêm'],
  'fontFile': [null, 'Font file (.ttf/.otf)', 'Tệp phông (.ttf/.otf)'],
  'accentH': [null, 'Accent & offset colors', 'Màu nhấn & màu lệch'],
  'accentOn': [null, 'Override with my colors<small>Applies to every scene. Brightness is adjusted automatically to the background</small>', 'Ghi đè bằng màu của tôi<small>Áp dụng cho mọi cảnh. Độ sáng tự điều chỉnh theo nền</small>'],
  'randPalette': [null, 'Random colors', 'Màu ngẫu nhiên'],
  'bgFgH': [null, 'Background & text color', 'Màu nền & chữ'],
  'colorOn': [null, 'Use my own colors for the main background and text', 'Dùng màu riêng cho nền chính và chữ'],
  'flash': [null, 'Flash', 'Chớp sáng'],
  'koma': [null, 'Frame step', 'Bước khung hình'],
  'koma.title': [null, 'How many drawings per second the motion uses (separate from the output fps)', 'Số hình vẽ mỗi giây cho chuyển động (khác với fps xuất)'],
  'koma.0': [null, 'Full (output fps)', 'Đầy đủ (theo fps xuất)'],
  'koma.12': [null, 'On twos (12/s)', 'Mỗi 2 khung (12/giây)'],
  'koma.8': [null, 'On threes (8/s)', 'Mỗi 3 khung (8/giây)'],
  'hud.auto': [null, 'Depends on style', 'Tùy phong cách'],
  'hud.on': [null, 'Always show', 'Luôn hiện'],
  'hud.off': [null, 'Hide', 'Ẩn'],
  'seed': [null, 'Seed', 'Hạt giống'],
  'newSeed': [null, 'New seed', 'Hạt giống mới'],
  'seed.note': [null, 'The same seed gives the same composition. Per-line "re-draw" and "lock" are in the line list on the left.', 'Cùng hạt giống sẽ cho cùng bố cục. "Bốc lại" và "Khóa" từng dòng nằm ở danh sách dòng bên trái.'],
  'tExtra': [null, 'Also use the added effects<small>Techniques, styles and typefaces marked "Added". When off, Omakase and Shuffle only use the first public version\'s effects</small>', 'Dùng cả hiệu ứng bổ sung<small>Kỹ thuật, phong cách và phông có nhãn "Mới". Khi tắt, Ngẫu nhiên và Xáo trộn chỉ dùng hiệu ứng của bản công khai đầu tiên</small>'],
  'tWa': [null, 'Also use Japanese-style effects<small>Techniques and styles marked "JP". When off, Omakase and Shuffle won\'t pick them (applied after the "added" check; you can still choose them manually per line)</small>', 'Dùng cả hiệu ứng phong cách Nhật<small>Kỹ thuật và phong cách có nhãn "Nhật". Khi tắt, Ngẫu nhiên và Xáo trộn sẽ không chọn (áp dụng sau bước kiểm tra "bổ sung"; vẫn có thể chọn thủ công cho từng dòng)</small>'],
  'techFilter': [null, 'Filter techniques by name', 'Lọc kỹ thuật theo tên'],
  'quality': [null, 'Quality', 'Chất lượng'],
  'q.standard': [null, 'Standard', 'Tiêu chuẩn'],
  'q.high': [null, 'High', 'Cao'],
  'q.max': [null, 'Maximum', 'Cao nhất'],
  'outAudio': [null, 'Include the song in the video', 'Kèm bài hát vào video'],
  'png': [null, 'PNG sequence (ZIP)', 'Chuỗi PNG (ZIP)'],
  'gif': [null, 'Animated GIF', 'GIF động'],
  'gifH': [null, 'Animated GIF', 'GIF động'],
  'gifSize': [null, 'GIF size', 'Cỡ GIF'],
  'gifFps': [null, 'GIF fps', 'fps của GIF'],
  'gif.note': [null, 'GIFs have no sound and 256 colors. Meant for previews to post on social media or in chats (larger sizes and fps make heavier files).', 'GIF không có âm thanh và chỉ 256 màu. Phù hợp làm bản xem trước để đăng mạng xã hội hoặc gửi trong chat (kích thước và fps càng lớn thì tệp càng nặng).'],
  'pnga': [null, 'Transparent PNG (ZIP, no background)', 'PNG trong suốt (ZIP, không nền)'],
  'terms.link2': [null, 'Rights & license for exported videos and images', 'Quyền & giấy phép cho video và ảnh đã xuất'],
  'terms.big': [null, 'The <strong>rights to the videos and images you make with this tool belong to you</strong>, the creator.', '<strong>Quyền đối với video và hình ảnh bạn tạo bằng công cụ này thuộc về bạn</strong>, người tạo ra chúng.'],
  'terms.sub': [null, '* The rights to the lyrics and songs you use belong to their respective owners.', '* Quyền đối với lời bài hát và bài hát bạn sử dụng thuộc về chủ sở hữu tương ứng.'],
  'terms.mit': [null, 'The tool itself is released under the <strong>MIT License</strong>. Full license details:', 'Bản thân công cụ được phát hành theo <strong>Giấy phép MIT</strong>. Chi tiết giấy phép:'],
  'terms.local': [null, 'The lyrics and songs you enter are processed only inside this browser and are never sent to a server.', 'Lời bài hát và bài hát bạn nhập chỉ được xử lý trong trình duyệt này và không bao giờ được gửi lên máy chủ.'],
  'terms.oss': [null, 'Open source used', 'Mã nguồn mở được sử dụng'],
  'terms.ossList': [null, 'MP4 export: mp4-muxer (MIT License)<br>Fonts: typefaces distributed by Google Fonts (SIL Open Font License 1.1)', 'Xuất MP4: mp4-muxer (Giấy phép MIT)<br>Phông chữ: các phông do Google Fonts phân phối (SIL Open Font License 1.1)'],
  'close': [null, 'Close', 'Đóng'],

  /* ---------- strings built by the UI script ---------- */
  'badge.extra': ['追加', 'Added', 'Mới'],
  'badge.extra.title': ['最初の公開版のあとに追加', 'Added after the first public version', 'Được thêm sau bản công khai đầu tiên'],
  'badge.wa': ['和', 'JP', 'Nhật'],
  'badge.wa.title': ['和風の演出', 'Japanese-style effect', 'Hiệu ứng phong cách Nhật'],
  'loadingFonts': ['フォントを読み込み中…', 'Loading fonts…', 'Đang tải phông chữ…'],
  'play': ['再生', 'Play', 'Phát'],
  'pause': ['一時停止', 'Pause', 'Tạm dừng'],
  'noCut': ['この位置にカットはありません', 'No cut at this position', 'Không có cảnh nào ở vị trí này'],
  'chip.layout': ['レイアウト', 'Layout', 'Bố cục'],
  'chip.enter': ['登場', 'In', 'Vào'],
  'chip.hold': ['保持', 'Hold', 'Giữ'],
  'chip.exit': ['退場', 'Out', 'Ra'],
  'chip.decor': ['装飾', 'Decor', 'Trang trí'],
  'chip.treat': ['加工', 'Text', 'Chữ'],
  'chip.bg': ['背景', 'BG', 'Nền'],
  'chip.cam': ['カメラ', 'Camera', 'Máy quay'],
  'chip.trans': ['つなぎ', 'Transition', 'Chuyển cảnh'],
  'auto': ['自動', 'Auto', 'Tự động'],
  'line.start': ['開始（秒）', 'Start (s)', 'Bắt đầu (giây)'],
  'line.manual': ['・手動', ' · manual', ' · thủ công'],
  'line.auto': ['・自動', ' · auto', ' · tự động'],
  'line.aria': ['{n}行目の開始秒', 'Start time of line {n} (s)', 'Thời điểm bắt đầu dòng {n} (giây)'],
  'line.layout': ['レイアウト指定', 'Choose layout', 'Chọn bố cục'],
  'line.reroll': ['この行を再抽選', 'Re-draw this line', 'Bốc lại dòng này'],
  'line.lock': ['この行の構成をロック', 'Lock this line\'s composition', 'Khóa bố cục của dòng này'],
  'linesInfo': ['{l}行 / {c}カット', '{l} lines / {c} cuts', '{l} dòng / {c} cảnh'],
  'style.offExtra': ['（追加分がオフのため、おまかせでは選ばれません）', ' (added effects are off, so Omakase won\'t pick it)', ' (hiệu ứng bổ sung đang tắt nên Ngẫu nhiên sẽ không chọn)'],
  'style.offWa': ['（和風の演出がオフのため、おまかせでは選ばれません）', ' (Japanese-style effects are off, so Omakase won\'t pick it)', ' (hiệu ứng phong cách Nhật đang tắt nên Ngẫu nhiên sẽ không chọn)'],
  'font.default': ['スタイルの既定', 'Style default', 'Mặc định của phong cách'],
  'role.display': ['見出し', 'Headline', 'Tiêu đề'],
  'role.serif': ['明朝枠', 'Serif (mincho)', 'Chữ có chân (Mincho)'],
  'role.body': ['小さな文字', 'Small text', 'Chữ nhỏ'],
  'role.aria': ['{label}のフォント', '{label} font', 'Phông {label}'],
  'col.bg': ['背景', 'Background', 'Nền'],
  'col.fg': ['文字', 'Text', 'Chữ'],
  'col.sub': ['補助', 'Secondary', 'Phụ'],
  'col.accent': ['アクセント', 'Accent', 'Màu nhấn'],
  'col.ghostA': ['ズレ色A', 'Offset A', 'Màu lệch A'],
  'col.ghostB': ['ズレ色B', 'Offset B', 'Màu lệch B'],
  'toast.palette': ['配色：アクセント・ズレ色A/Bを変更', 'Colors: changed accent & offset A/B', 'Màu: đã đổi màu nhấn & màu lệch A/B'],
  'toast.hist': ['{i} / {n} 案目', 'Idea {i} / {n}', 'Phương án {i} / {n}'],
  'toast.omakase': ['おまかせ：{style} × {mood}', 'Omakase: {style} × {mood}', 'Ngẫu nhiên: {style} × {mood}'],
  'toast.style': ['スタイル：{name}', 'Style: {name}', 'Phong cách: {name}'],
  'toast.mood': ['雰囲気：{name}', 'Mood: {name}', 'Không khí: {name}'],
  'toast.cut': ['構成：レイアウトと動きを再抽選', 'Composition: re-drew layouts and motion', 'Bố cục: đã bốc lại bố cục và chuyển động'],
  'toast.extraOn': ['追加分の演出：使う', 'Added effects: on', 'Hiệu ứng bổ sung: bật'],
  'toast.extraOff': ['追加分の演出：使わない（最初の公開版の演出だけ）', 'Added effects: off (first version\'s effects only)', 'Hiệu ứng bổ sung: tắt (chỉ hiệu ứng bản đầu tiên)'],
  'toast.waOn': ['和風の演出：使う', 'Japanese-style effects: on', 'Hiệu ứng phong cách Nhật: bật'],
  'toast.waOff': ['和風の演出：使わない（おまかせ・シャッフルで選ばれません）', 'Japanese-style effects: off (Omakase/Shuffle won\'t pick them)', 'Hiệu ứng phong cách Nhật: tắt (Ngẫu nhiên/Xáo trộn sẽ không chọn)'],
  'toast.lang': ['表示言語：日本語', 'Language: English', 'Ngôn ngữ: Tiếng Việt'],
  'now.custom': ['カスタム', 'Custom', 'Tùy chỉnh'],
  'now.style': ['スタイル', 'Style', 'Phong cách'],
  'now.mood': ['雰囲気', 'Mood', 'Không khí'],
  'now.palette': ['配色', 'Colors', 'Bảng màu'],
  'now.random': ['ランダム', 'Random', 'Ngẫu nhiên'],
  'now.font': ['見出し書体', 'Headline font', 'Phông tiêu đề'],
  'now.cuts': ['構成', 'Composition', 'Bố cục'],
  'now.cutsV': ['{c} カット・レイアウト {k} 種', '{c} cuts · {k} layouts', '{c} cảnh · {k} kiểu bố cục'],
  'now.fx': ['演出', 'Effects', 'Hiệu ứng'],
  'now.fxV': ['加工 {t}・背景 {b}種・カメラ {c}', 'Text FX {t} · {b} backgrounds · Camera {c}', 'Hiệu ứng chữ {t} · {b} nền · Máy quay {c}'],
  'fx.motion': ['動きの強さ', 'Motion', 'Độ mạnh chuyển động'],
  'fx.glitch': ['グリッチ', 'Glitch', 'Glitch'],
  'fx.chroma': ['色ズレ', 'Color offset', 'Lệch màu'],
  'fx.decor': ['装飾の量', 'Decoration', 'Lượng trang trí'],
  'fx.density': ['カットの細かさ', 'Cut density', 'Mật độ cảnh'],
  'fx.texture': ['質感', 'Texture', 'Chất liệu'],
  'fx.bgSwitch': ['背景の切替', 'Background switching', 'Đổi nền'],
  'grp.layout': ['レイアウト', 'Layout', 'Bố cục'],
  'grp.enter': ['登場', 'Entrance', 'Xuất hiện'],
  'grp.hold': ['保持', 'Hold', 'Giữ'],
  'grp.exit': ['退場', 'Exit', 'Biến mất'],
  'grp.decor': ['装飾', 'Decoration', 'Trang trí'],
  'grp.treat': ['文字の加工', 'Text treatment', 'Xử lý chữ'],
  'grp.bg': ['背景', 'Background', 'Nền'],
  'grp.cam': ['カメラ', 'Camera', 'Máy quay'],
  'grp.fx': ['画面効果', 'Screen effects', 'Hiệu ứng màn hình'],
  'grp.trans': ['カット間のつなぎ', 'Transitions between cuts', 'Chuyển cảnh'],
  'tech.on': ['すべてON', 'All on', 'Bật hết'],
  'tech.off': ['すべてOFF', 'All off', 'Tắt hết'],
  'tech.flip': ['反転', 'Invert', 'Đảo'],
  'tech.offExtra': ['（追加分がオフのため、自動では選ばれません）', ' (added effects are off, so it won\'t be picked automatically)', ' (hiệu ứng bổ sung đang tắt nên sẽ không được tự chọn)'],
  'tech.offWa': ['（和風の演出がオフのため、自動では選ばれません）', ' (Japanese-style effects are off, so it won\'t be picked automatically)', ' (hiệu ứng phong cách Nhật đang tắt nên sẽ không được tự chọn)'],
  'codec.ok': ['このブラウザでは {codec} で書き出します（{w}×{h} / {fps}fps）。書き出し中はタブを開いたままにしてください。', 'This browser exports with {codec} ({w}×{h} / {fps}fps). Keep this tab open while exporting.', 'Trình duyệt này sẽ xuất bằng {codec} ({w}×{h} / {fps}fps). Hãy giữ tab này mở trong khi xuất.'],
  'codec.none': ['このブラウザは動画エンコード（WebCodecs）に対応していません。Chrome / Edge の最新版で開くか、連番PNGを使ってください。', 'This browser does not support video encoding (WebCodecs). Open it in the latest Chrome / Edge, or use the PNG sequence.', 'Trình duyệt này không hỗ trợ mã hóa video (WebCodecs). Hãy mở bằng Chrome / Edge mới nhất, hoặc dùng chuỗi PNG.'],
  'codec.noneTitle': ['このブラウザは MP4 書き出しに対応していません（Chrome / Edge 推奨）', 'This browser cannot export MP4 (Chrome / Edge recommended)', 'Trình duyệt này không xuất được MP4 (khuyên dùng Chrome / Edge)'],
  'codec.default': ['書き出しはこのブラウザの中で行われます（Chrome / Edge 推奨）。', 'Export runs inside this browser (Chrome / Edge recommended).', 'Việc xuất diễn ra ngay trong trình duyệt này (khuyên dùng Chrome / Edge).'],
  'exp.prep': ['準備中…', 'Preparing…', 'Đang chuẩn bị…'],
  'exp.doneMp4': ['完成 {mb}MB・{codec}{audio}・{sec}秒', 'Done {mb}MB · {codec}{audio} · {sec}s', 'Hoàn tất {mb}MB · {codec}{audio} · {sec} giây'],
  'exp.donePng': ['完成 {mb}MB', 'Done {mb}MB', 'Hoàn tất {mb}MB'],
  'exp.doneGif': ['完成 {mb}MB・{w}×{h}・{sec}秒', 'Done {mb}MB · {w}×{h} · {sec}s', 'Hoàn tất {mb}MB · {w}×{h} · {sec} giây'],
  'exp.declined': ['（保存はキャンセルされました）', ' (saving was cancelled)', ' (đã hủy lưu)'],
  'exp.error': ['エラー: ', 'Error: ', 'Lỗi: '],
  'exp.noCodec': ['このブラウザは動画エンコード（WebCodecs）に対応していません。Chrome か Edge の最新版で開いてください。', 'This browser does not support video encoding (WebCodecs). Please open it in the latest Chrome or Edge.', 'Trình duyệt này không hỗ trợ mã hóa video (WebCodecs). Hãy mở bằng Chrome hoặc Edge mới nhất.'],
  'exp.cancelled': ['キャンセルしました', 'Cancelled', 'Đã hủy'],
  'exp.frame': ['フレーム {i}/{n}', 'Frame {i}/{n}', 'Khung hình {i}/{n}'],
  'exp.audio': ['音声をエンコード中', 'Encoding audio', 'Đang mã hóa âm thanh'],
  'exp.complete': ['完了', 'Complete', 'Hoàn tất'],
  'exp.aeNote': ['ブラウザ版の新しい表現 {n} 箇所を、AEパネルにある近い表現に置き換えています（文字加工・背景・カメラ・カット間のつなぎはAE版では未対応）', '{n} newer browser-only effects were replaced with the closest ones in the AE panel (text treatments, backgrounds, camera and transitions are not supported in AE)', 'Đã thay {n} hiệu ứng mới chỉ có trên trình duyệt bằng hiệu ứng gần nhất trong bảng AE (xử lý chữ, nền, máy quay và chuyển cảnh chưa hỗ trợ trong AE)'],
  'bpm.auto': ['自動 {bpm}', 'Auto {bpm}', 'Tự động {bpm}'],
  'bpm.none': ['なし', 'None', 'Không'],
  'audio.none': ['曲なし（読み込むと拍を検出してカットを合わせます）', 'No song (load one to detect the beat and fit the cuts to it)', 'Chưa có bài hát (tải lên để phát hiện nhịp và khớp các cảnh)'],
  'audio.analyzing': ['解析中…', 'Analyzing…', 'Đang phân tích…'],
  'audio.loaded': ['{name}（{dur}・約{bpm}BPM）', '{name} ({dur} · ~{bpm} BPM)', '{name} ({dur} · ~{bpm} BPM)'],
  'audio.fail': ['読み込めませんでした: ', 'Could not load: ', 'Không tải được: '],
  'font.fail': ['フォントを読み込めませんでした', 'Could not load the font', 'Không tải được phông chữ'],
  'project.fail': ['プロジェクトを読み込めませんでした', 'Could not load the project', 'Không tải được dự án'],
};

function detect() {
  try { const s = localStorage.getItem('jizura.lang'); if (s && IDX[s] != null) return s; } catch (e) {}
  const navs = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || [];
  for (const l of navs) { const b = String(l || '').slice(0, 2).toLowerCase(); if (IDX[b] != null) return b; }
  return 'en';
}
J.lang = detect();

J.t = (key, vars) => {
  const e = D[key];
  let s = e ? (e[IDX[J.lang]] ?? e[0] ?? e[1]) : key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  return s;
};
J.tr = ja => {
  if (J.lang === 'ja' || ja == null) return ja;
  const e = J.I18N_NAMES && J.I18N_NAMES[ja];
  return (e && e[IDX[J.lang] - 1]) || ja;
};

const ATTRS = [['i18nTitle', 'title'], ['i18nPh', 'placeholder'], ['i18nAria', 'aria-label']];
J.applyI18n = (root = document) => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = J.lang;
  root.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.__i18nHTML == null) el.__i18nHTML = el.innerHTML;          // the Japanese original
    el.innerHTML = J.lang === 'ja' || !D[el.dataset.i18n] ? el.__i18nHTML : J.t(el.dataset.i18n);
  });
  for (const [dk, attr] of ATTRS) {
    root.querySelectorAll(`[data-${dk.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}]`).forEach(el => {
      const store = (el.__i18nAttr = el.__i18nAttr || {});
      if (!(attr in store)) store[attr] = el.getAttribute(attr) || '';
      const key = el.dataset[dk];
      el.setAttribute(attr, J.lang === 'ja' || !D[key] ? store[attr] : J.t(key));
    });
  }
};
J.setLang = l => {
  if (IDX[l] == null) return;
  J.lang = l;
  try { localStorage.setItem('jizura.lang', l); } catch (e) {}
  J.applyI18n();
};
})();
