/* ============================================================
   JIZURA — export: MP4 (WebCodecs + mp4-muxer), animated GIF, PNG sequence ZIP,
   file saving (artifact download capability or plain browser download)
   ============================================================ */
(() => {
'use strict';

/* ---------- saving ---------- */
J.saveFile = async (filename, data) => {
  const blob = data instanceof Blob ? data : new Blob([data]);
  try {
    if (window.claude && typeof window.claude.use === 'function') {
      const dl = await window.claude.use('downloads');
      if (dl) { await dl.save({ filename, data: blob }); return 'saved'; }
    }
  } catch (e) {
    if (e && e.code === 'declined') return 'declined';
    if (e && e.code && e.code !== 'unavailable' && e.code !== 'not_granted') throw e;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return 'saved';
};

/* ---------- codec negotiation ---------- */
J.pickVideoCodec = async (w, h, fps, bitrate) => {
  if (typeof VideoEncoder === 'undefined') return null;
  const cands = [
    { codec: 'avc1.640033', mux: 'avc', label: 'H.264 High' },
    { codec: 'avc1.4d0033', mux: 'avc', label: 'H.264 Main' },
    { codec: 'avc1.42003e', mux: 'avc', label: 'H.264 Baseline' },
    { codec: 'vp09.00.51.08', mux: 'vp9', label: 'VP9' },
    { codec: 'av01.0.12M.08', mux: 'av1', label: 'AV1' },
  ];
  for (const c of cands) {
    const cfg = { codec: c.codec, width: w, height: h, bitrate, framerate: fps };
    if (c.mux === 'avc') cfg.avc = { format: 'avc' };
    try { const s = await VideoEncoder.isConfigSupported(cfg); if (s.supported) return Object.assign({}, c, { cfg }); } catch (e) {}
  }
  return null;
};
J.pickAudioCodec = async (sr, chn) => {
  if (typeof AudioEncoder === 'undefined') return null;
  for (const c of [{ codec: 'mp4a.40.2', mux: 'aac', sr: 48000 }, { codec: 'opus', mux: 'opus', sr: 48000 }]) {
    try { const s = await AudioEncoder.isConfigSupported({ codec: c.codec, sampleRate: c.sr, numberOfChannels: chn, bitrate: 192000 }); if (s.supported) return c; } catch (e) {}
  }
  return null;
};

async function resample(buffer, sr, duration) {
  const chn = Math.min(2, buffer.numberOfChannels);
  const len = Math.ceil(duration * sr);
  const oc = new OfflineAudioContext(chn, len, sr);
  const src = oc.createBufferSource(); src.buffer = buffer; src.connect(oc.destination); src.start(0);
  return oc.startRendering();
}

/* ---------- MP4 ---------- */
J.exportMP4 = async ({ plan, project, audio, quality = 'high', onProgress, signal }) => {
  const [w, h] = J.outputSize(project);
  const fps = plan.fps;
  const px = w * h * fps;
  const bitrate = Math.round(px * (quality === 'max' ? 0.42 : quality === 'high' ? 0.28 : 0.16));
  const vc = await J.pickVideoCodec(w, h, fps, bitrate);
  if (!vc) throw new Error(J.t('exp.noCodec'));
  let ac = null;
  if (audio && audio.buffer && project.includeAudio !== false) ac = await J.pickAudioCodec(48000, Math.min(2, audio.buffer.numberOfChannels));
  const target = new Mp4Muxer.ArrayBufferTarget();
  const muxOpts = { target, video: { codec: vc.mux, width: w, height: h, frameRate: fps }, fastStart: 'in-memory', firstTimestampBehavior: 'offset' };
  if (ac) muxOpts.audio = { codec: ac.mux, numberOfChannels: Math.min(2, audio.buffer.numberOfChannels), sampleRate: ac.sr };
  const muxer = new Mp4Muxer.Muxer(muxOpts);
  let err = null;
  const venc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: e => { err = e; } });
  venc.configure(Object.assign({}, vc.cfg, { latencyMode: 'quality' }));
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { alpha: false });
  const R = new J.Renderer();
  const total = Math.max(1, Math.round(plan.duration * fps));
  const scale = w / plan.W;
  const prevRes = J.glyphs.maxRes; J.glyphs.maxRes = h >= 1000 ? 768 : 512;
  try {
  for (let i = 0; i < total; i++) {
    if (signal && signal.aborted) { try { venc.close(); } catch (e) {} throw new Error(J.t('exp.cancelled')); }
    if (err) throw err;
    R.frame(ctx, plan, i / fps, { scale });
    const vf = new VideoFrame(canvas, { timestamp: Math.round(i * 1e6 / fps), duration: Math.round(1e6 / fps) });
    venc.encode(vf, { keyFrame: i % (fps * 2) === 0 });
    vf.close();
    while (venc.encodeQueueSize > 4) await new Promise(r => setTimeout(r, 2));
    if (i % 3 === 0) { onProgress && onProgress(i / total, J.t('exp.frame', { i: i + 1, n: total })); await new Promise(r => setTimeout(r, 0)); }
  }
  } finally { J.glyphs.maxRes = prevRes; }
  await venc.flush(); venc.close();
  if (ac) {
    onProgress && onProgress(0.99, J.t('exp.audio'));
    const rs = await resample(audio.buffer, ac.sr, plan.duration);
    const chn = rs.numberOfChannels;
    const aenc = new AudioEncoder({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: e => { err = e; } });
    aenc.configure({ codec: ac.codec, sampleRate: ac.sr, numberOfChannels: chn, bitrate: 192000 });
    const frames = rs.length, block = 4800;
    for (let off = 0; off < frames; off += block) {
      const n = Math.min(block, frames - off);
      const data = new Float32Array(n * chn);
      for (let c = 0; c < chn; c++) data.set(rs.getChannelData(c).subarray(off, off + n), c * n);
      const ad = new AudioData({ format: 'f32-planar', sampleRate: ac.sr, numberOfFrames: n, numberOfChannels: chn, timestamp: Math.round(off * 1e6 / ac.sr), data });
      aenc.encode(ad); ad.close();
      if (aenc.encodeQueueSize > 16) await new Promise(r => setTimeout(r, 1));
    }
    await aenc.flush(); aenc.close();
    if (err) throw err;
  }
  muxer.finalize();
  onProgress && onProgress(1, J.t('exp.complete'));
  return { blob: new Blob([target.buffer], { type: 'video/mp4' }), codec: vc.label, audio: ac ? ac.mux : null, width: w, height: h };
};

/* ---------- PNG sequence as ZIP (store, no compression) ---------- */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (u8) => { let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
class ZipWriter {
  constructor() { this.parts = []; this.central = []; this.offset = 0; }
  add(name, u8) {
    const nb = new TextEncoder().encode(name), crc = crc32(u8);
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
    lh.setUint16(10, 0, true); lh.setUint16(12, 0x21, true); lh.setUint32(14, crc, true); lh.setUint32(18, u8.length, true); lh.setUint32(22, u8.length, true);
    lh.setUint16(26, nb.length, true); lh.setUint16(28, 0, true);
    this.parts.push(lh.buffer, nb, u8);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
    ch.setUint16(12, 0, true); ch.setUint16(14, 0x21, true); ch.setUint32(16, crc, true); ch.setUint32(20, u8.length, true); ch.setUint32(24, u8.length, true);
    ch.setUint16(28, nb.length, true); ch.setUint32(42, this.offset, true);
    this.central.push(ch.buffer, nb);
    this.offset += 30 + nb.length + u8.length;
  }
  finish() {
    const cdSize = this.central.reduce((s, p) => s + (p.byteLength ?? p.length), 0);
    const n = this.central.length / 2;
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, n, true); end.setUint16(10, n, true); end.setUint32(12, cdSize, true); end.setUint32(16, this.offset, true);
    return new Blob([...this.parts, ...this.central, end.buffer], { type: 'application/zip' });
  }
}
J.exportPNGZip = async ({ plan, project, transparent, onProgress, signal, every = 1 }) => {
  const [w, h] = J.outputSize(project);
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const R = new J.Renderer();
  const fps = plan.fps, total = Math.max(1, Math.round(plan.duration * fps));
  const zip = new ZipWriter();
  const scale = w / plan.W;
  for (let i = 0; i < total; i += every) {
    if (signal && signal.aborted) throw new Error(J.t('exp.cancelled'));
    R.frame(ctx, plan, i / fps, { scale, transparent });
    const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
    zip.add(`jizura_${String(i).padStart(5, '0')}.png`, new Uint8Array(await blob.arrayBuffer()));
    onProgress && onProgress(i / total, `PNG ${i + 1}/${total}`);
  }
  onProgress && onProgress(1, J.t('exp.complete'));
  return zip.finish();
};

/* ---------- animated GIF (GIF89a, per-frame 256-colour palette, changed-rect frames) ---------- */
class ByteOut {
  constructor(n = 1 << 16) { this.buf = new Uint8Array(n); this.len = 0; }
  grow(n) { if (this.len + n > this.buf.length) { const b = new Uint8Array(Math.max(this.buf.length * 2, this.len + n)); b.set(this.buf.subarray(0, this.len)); this.buf = b; } }
  byte(v) { this.grow(1); this.buf[this.len++] = v; }
  u16(v) { this.grow(2); this.buf[this.len++] = v & 255; this.buf[this.len++] = (v >> 8) & 255; }
  bytes(a) { this.grow(a.length); for (let i = 0; i < a.length; i++) this.buf[this.len++] = typeof a === 'string' ? a.charCodeAt(i) : a[i]; }
  take() { return this.buf.slice(0, this.len); }
}
// median cut over a 15-bit (5:5:5) histogram; every histogram bin belongs to exactly one box, so the box index is the lookup
const HIST = 1 << 15;
function quantize(px, stride, rect) {
  const cnt = new Uint32Array(HIST), sr = new Uint32Array(HIST), sg = new Uint32Array(HIST), sb = new Uint32Array(HIST);
  for (let y = rect.y; y < rect.y + rect.h; y++) {
    for (let x = rect.x, o = (y * stride + x) * 4; x < rect.x + rect.w; x++, o += 4) {
      const r = px[o], g = px[o + 1], b = px[o + 2], k = (r >> 3) << 10 | (g >> 3) << 5 | (b >> 3);
      cnt[k]++; sr[k] += r; sg[k] += g; sb[k] += b;
    }
  }
  let n = 0; for (let k = 0; k < HIST; k++) if (cnt[k]) n++;
  const keys = new Int32Array(n); n = 0; for (let k = 0; k < HIST; k++) if (cnt[k]) keys[n++] = k;
  const tmp = new Int32Array(n);
  const boxes = [{ s: 0, e: n }];
  const stat = (bx) => {
    let r0 = 31, r1 = 0, g0 = 31, g1 = 0, b0 = 31, b1 = 0, c = 0;
    for (let i = bx.s; i < bx.e; i++) {
      const k = keys[i], r = k >> 10, g = (k >> 5) & 31, b = k & 31; c += cnt[k];
      if (r < r0) r0 = r; if (r > r1) r1 = r; if (g < g0) g0 = g; if (g > g1) g1 = g; if (b < b0) b0 = b; if (b > b1) b1 = b;
    }
    const dr = r1 - r0, dg = (g1 - g0) * 1.2, db = (b1 - b0) * 0.8, d = Math.max(dr, dg, db);
    bx.ch = d === dg ? 1 : d === dr ? 0 : 2; bx.score = bx.e - bx.s > 1 ? d * Math.sqrt(c) : -1;
  };
  stat(boxes[0]);
  while (boxes.length < 256) {
    let bi = -1, best = 0;
    for (let i = 0; i < boxes.length; i++) if (boxes[i].score > best) { best = boxes[i].score; bi = i; }
    if (bi < 0) break;
    const bx = boxes[bi], sh = bx.ch === 0 ? 10 : bx.ch === 1 ? 5 : 0;
    const seg = tmp.subarray(bx.s, bx.e);
    for (let i = bx.s; i < bx.e; i++) tmp[i] = (((keys[i] >> sh) & 31) << 15) | keys[i];
    seg.sort();
    let total = 0; for (let i = bx.s; i < bx.e; i++) { keys[i] = tmp[i] & 0x7fff; total += cnt[keys[i]]; }
    let acc = 0, m = bx.e - 1;
    for (let i = bx.s; i < bx.e - 1; i++) { acc += cnt[keys[i]]; if (acc * 2 >= total) { m = i + 1; break; } }
    const nb = { s: m, e: bx.e }; bx.e = m;
    stat(bx); stat(nb); boxes.push(nb);
  }
  const bits = Math.max(1, Math.ceil(Math.log2(Math.max(2, boxes.length))));
  const pal = new Uint8Array(3 << bits), lut = new Uint8Array(HIST);
  boxes.forEach((bx, j) => {
    let c = 0, r = 0, g = 0, b = 0;
    for (let i = bx.s; i < bx.e; i++) { const k = keys[i]; lut[k] = j; c += cnt[k]; r += sr[k]; g += sg[k]; b += sb[k]; }
    if (c) { pal[j * 3] = Math.round(r / c); pal[j * 3 + 1] = Math.round(g / c); pal[j * 3 + 2] = Math.round(b / c); }
  });
  const idx = new Uint8Array(rect.w * rect.h);
  for (let y = rect.y, p = 0; y < rect.y + rect.h; y++) {
    for (let x = rect.x, o = (y * stride + x) * 4; x < rect.x + rect.w; x++, o += 4) idx[p++] = lut[(px[o] >> 3) << 10 | (px[o + 1] >> 3) << 5 | (px[o + 2] >> 3)];
  }
  return { pal, bits, idx };
}
let lzwTab = null;
function lzw(out, idx, bits) {
  const min = Math.max(2, bits), clear = 1 << min, eoi = clear + 1;
  if (!lzwTab) lzwTab = new Int16Array(4096 << 8).fill(-1);
  const tab = lzwTab, used = new Int32Array(4096); let nUsed = 0;
  let size = min + 1, next = eoi + 1, acc = 0, nb = 0;
  const blk = new Uint8Array(255); let bl = 0;
  const flushBlk = () => { if (bl) { out.byte(bl); out.bytes(blk.subarray(0, bl)); bl = 0; } };
  const emit = (c) => { acc |= c << nb; nb += size; while (nb >= 8) { blk[bl++] = acc & 255; acc >>>= 8; nb -= 8; if (bl === 255) flushBlk(); } };
  const reset = () => { for (let i = 0; i < nUsed; i++) tab[used[i]] = -1; nUsed = 0; };
  out.byte(min);
  emit(clear);
  let cur = idx[0];
  for (let i = 1; i < idx.length; i++) {
    const k = idx[i], key = cur << 8 | k, c = tab[key];
    if (c !== -1) { cur = c; continue; }
    emit(cur);
    if (next === 4096) { emit(clear); reset(); size = min + 1; next = eoi + 1; }
    else { if (next >= (1 << size)) size++; tab[key] = next++; used[nUsed++] = key; }
    cur = k;
  }
  emit(cur); emit(eoi);
  if (nb > 0) { blk[bl++] = acc & 255; if (bl === 255) flushBlk(); }
  flushBlk(); out.byte(0);
  reset();
}
J.gifSize = (project, long = 480) => {
  const [w, h] = J.outputSize(project), s = Math.min(1, long / Math.max(w, h));
  return [Math.max(2, Math.round(w * s)), Math.max(2, Math.round(h * s))];
};
J.exportGIF = async ({ plan, project, size = 480, fps = 15, onProgress, signal }) => {
  const [w, h] = J.gifSize(project, size);
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  const R = new J.Renderer();
  const total = Math.max(1, Math.round(plan.duration * fps));
  const scale = w / plan.W;
  const out = new ByteOut(w * h * 8);
  out.bytes('GIF89a'); out.u16(w); out.u16(h); out.byte(0x70); out.byte(0); out.byte(0);
  out.bytes([0x21, 0xff, 0x0b]); out.bytes('NETSCAPE2.0'); out.bytes([3, 1, 0, 0, 0]);   // loop forever
  const cs = i => Math.round(i * 100 / fps);   // frame i starts at cs(i) centiseconds
  let prev = null, pending = null;
  const write = (f) => {
    out.bytes([0x21, 0xf9, 4, 0x04]); out.u16(Math.min(65535, f.delay)); out.byte(0); out.byte(0);   // disposal: keep
    out.byte(0x2c); out.u16(f.rect.x); out.u16(f.rect.y); out.u16(f.rect.w); out.u16(f.rect.h); out.byte(0x80 | (f.q.bits - 1));
    out.bytes(f.q.pal); lzw(out, f.q.idx, f.q.bits);
  };
  for (let i = 0; i < total; i++) {
    if (signal && signal.aborted) throw new Error(J.t('exp.cancelled'));
    R.frame(ctx, plan, i / fps, { scale });
    const px = ctx.getImageData(0, 0, w, h).data, cur = new Uint32Array(px.buffer);
    const delay = cs(i + 1) - cs(i);
    let rect;
    if (!prev) rect = { x: 0, y: 0, w, h };
    else {
      let x0 = w, y0 = h, x1 = -1, y1 = -1;
      for (let y = 0; y < h; y++) {
        const row = y * w; let a = -1, b = -1;
        for (let x = 0; x < w; x++) if (cur[row + x] !== prev[row + x]) { a = x; break; }
        if (a < 0) continue;
        for (let x = w - 1; x >= a; x--) if (cur[row + x] !== prev[row + x]) { b = x; break; }
        if (a < x0) x0 = a; if (b > x1) x1 = b; if (y < y0) y0 = y; y1 = y;
      }
      if (x1 < 0) { pending.delay += delay; continue; }   // identical frame: just hold the previous one longer
      rect = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
    }
    if (pending) write(pending);
    pending = { rect, delay, q: quantize(px, w, rect) };
    prev = cur;
    if (i % 2 === 0) { onProgress && onProgress(i / total, J.t('exp.frame', { i: i + 1, n: total })); await new Promise(r => setTimeout(r, 0)); }
  }
  if (pending) write(pending);
  out.byte(0x3b);
  onProgress && onProgress(1, J.t('exp.complete'));
  return { blob: new Blob([out.take()], { type: 'image/gif' }), width: w, height: h };
};

/* ---------- plan JSON for the After Effects panel ---------- */
/* The After Effects panel implements the original expression set. Newer pack entries are exported as their
   closest original counterpart (the browser key is kept in web* fields so nothing is lost). */
J.AE_MAP = {
  layout: { lowerThird: 'center', corners: 'mixed', staircase: 'mixed', zigzag: 'wave', arcTop: 'ring', spiral: 'ring', gridCells: 'labels', dropCap: 'mixed', justified: 'tile', frameBox: 'center', bubble: 'pill', subtitleBar: 'center', ticker: 'marquee', splitScreen: 'diag', mirror: 'stack', sideways: 'vcols', edgeFrame: 'marquee', perspective: 'stack', hanko: 'vcols', genkou: 'vcols', panels: 'diag', filmstrip: 'labels', quote: 'center', ruler: 'gloss', searchBar: 'type', chat: 'labels', notification: 'pill', ticket: 'pill',
    rain: 'tile', hanging: 'scatter', orbit: 'ring', tunnel: 'tile', wordCloud: 'scatter', bounceLine: 'mixed', elastic: 'condensed', crossBands: 'diag', stickerBomb: 'labels', neon: 'center', keycaps: 'labels', bubbles: 'scatter', slotMachine: 'labels', flipBoard: 'labels', credits: 'type', zoomRepeat: 'stack', splitHalves: 'stack', columnsBig: 'vcols', circleWords: 'ring', dotMatrix: 'type', depthStack: 'stack', typeSpecimen: 'stack', kanjiFocus: 'huge', halfVertical: 'vcols', curtain: 'center', equalizer: 'mixed', tape: 'diag' },
  enter: { riseMask: 'drop', dropMask: 'drop', slideL: 'wipe', slideR: 'wipe', slideWhole: 'stretch', flipX: 'spin', flipY: 'spin', domino: 'spin', fold: 'pop', unroll: 'wipe', strokeDraw: 'assemble', outlineFill: 'blur', splitJoin: 'slice', vSlice: 'slice', shutter: 'wipe', iris: 'zoom', diagWipe: 'wipe', blinds: 'slice', checker: 'flicker', randomOrder: 'flicker', bounceBig: 'drop', squashDrop: 'drop', rubber: 'stretch', glitchIn: 'scramble', echoIn: 'zoom', whip: 'stretch', skewIn: 'stretch', trackIn: 'blur', trackOut: 'blur', blurStagger: 'blur', fadeStagger: 'blur', waveIn: 'pop', spiralIn: 'spin', zoomOut: 'zoom', resolve: 'scramble', magnet: 'assemble', inkBleed: 'blur', neonOn: 'flicker', cursorSweep: 'type', stamp: 'zoom' },
  exit: { sinkMask: 'fall', riseOut: 'drift', slideOutL: 'stretch', slideOutR: 'stretch', flipOutX: 'shrink', flipOutY: 'fall', foldOut: 'shrink', squash: 'shrink', trackOutWide: 'blur', collapse: 'shrink', zoomThrough: 'blur', zoomFar: 'shrink', spinOut: 'scatter', twist: 'shrink', waveOut: 'scatter', blurOutStagger: 'blur', undraw: 'blur', outlineOut: 'blur', irisClose: 'shrink', diagWipeOut: 'wipe', blindsClose: 'slice', checkerOut: 'glitch', splitApart: 'slice', vSliceDrop: 'fall', melt: 'fall', dissolve: 'drift', backspace: 'wipe', scrambleOut: 'glitch', glitchDissolve: 'glitch', echoOut: 'blur', whipOut: 'stretch', gravity: 'fall', popOut: 'scatter', burn: 'drift', sweepCover: 'wipe', shatterLite: 'explode' },
  hold: { float: 'drift', sway: 'wave', pulse: 'breathe', shimmer: 'still', colorRun: 'still', rotateSlow: 'drift', trackBreathe: 'breathe', skewWobble: 'wave', beatHop: 'wave', hWave: 'wave', heartbeat: 'breathe', orbitSmall: 'jitter', jelly: 'breathe', scanBand: 'glitchtick', noiseDrift: 'drift', tilt: 'drift', zoomSlow: 'drift', stretchPulse: 'breathe', glitchJump: 'glitchtick', echoTrail: 'drift' },
  decor: { crosshair: 'brackets', cropMarks: 'brackets', reticle: 'rings', radar: 'rings', progressRing: 'rings', timecodeBar: 'barcode', rulerEdge: 'grid', dimension: 'leaders', indexNum: 'counter', dateStamp: 'barcode', qrBlock: 'barcode', glitchRects: 'bars', concentricSquares: 'shapes', triangleSpin: 'shapes', lineBurst: 'sparks', plusGrid: 'grid', guides: 'grid', waveLine: 'waveform', spiralLine: 'rings', halftonePatch: 'shapes', checkerStrip: 'stripes', beatRing: 'rings', orbitDots: 'dots', constellation: 'sparks', confetti: 'shapes', petals: 'shapes', rainStreaks: 'slash', snow: 'dots', lightLeak: 'blobs', bokeh: 'blobs', speedCorner: 'slash', risingParticles: 'sparks', twinkle: 'sparks', brushStroke: 'bars', tapePieces: 'bars', scribbleCircle: 'rings', scribbleUnder: 'slash', crossOut: 'slash', highlightMark: 'bars', heartsStars: 'shapes', watermarkKanji: 'counter', verticalStrip: 'leaders', romajiLine: 'leaders', bracketsJP: 'brackets', seal: 'shapes' },
  fx: { rgbSplit: 'chroma', smear: 'slice', vhsRoll: 'slice', trackingNoise: 'slice', waveWarp: 'slice', pixelDrift: 'slice', tileShift: 'block', gridRepeat: 'block', mirrorFlash: 'block', strobe: 'invert', blackFrame: 'invert', whiteFrame: 'flash', filmBurn: 'flash', lightSweep: 'flash', panelWipe: 'flash', zoomPunch: 'zoom', whipBlur: 'zoom', posterize: 'mosaic', hueShift: 'chroma', irisTrans: 'zoom', doors: 'slice', blindsTrans: 'slice', splitSlide: 'slice', crtOff: 'flash' },
};
// newer pack entries may declare their own counterpart as def.ae
const aeKey = (g, k, dflt) => {
  if ((J.CORE_ORDER[g] && J.CORE_ORDER[g].includes(k)) || (g === 'layout' && (k === 'title' || k === 'interlude'))) return k;
  const D = J.registry(g)[k], own = D && D.ae;
  return J.AE_MAP[g][k] || (own && J.CORE_ORDER[g].includes(own) ? own : null) || dflt;
};
J.planForAE = (plan, project) => {
  const clean = JSON.parse(JSON.stringify(plan, (k, v) => (k === 'energy' || k === 'buffer' || k === 'peaks' ? undefined : v)));
  let subs = 0;
  for (const c of clean.cuts) {
    const L = aeKey('layout', c.layout, 'center');
    if (L !== c.layout) { c.webLayout = c.layout; c.layout = L; subs++; try { c.params = J.LAYOUTS[L].plan(J.rng(J.h(c.seed, 31)), { text: c.text, n: J.glyphCount(c.text) }, plan.style); } catch (e) { c.params = {}; } }
    const en = aeKey('enter', c.enter, 'blur'); if (en !== c.enter) { c.webEnter = c.enter; c.enter = en; subs++; }
    const ex = aeKey('exit', c.exit, 'blur'); if (ex !== c.exit) { c.webExit = c.exit; c.exit = ex; subs++; }
    const ho = aeKey('hold', c.hold, 'still'); if (ho !== c.hold) { c.webHold = c.hold; c.hold = ho; }
    const seen = new Set();
    c.decor = (c.decor || []).map(d => { const id = aeKey('decor', d.id, null); if (id !== d.id) subs++; return id ? Object.assign({}, d, { id, webId: d.id }) : null; })
      .filter(d => d && !seen.has(d.id) && seen.add(d.id));
  }
  const AE_FX = ['chroma', 'shake', 'slice', 'block', 'invert', 'flash', 'zoom', 'mosaic'];
  clean.events = clean.events.map(ev => { const FX = J.FXE[ev.type]; if (!FX || FX.builtin) return ev; const t = J.AE_MAP.fx[ev.type] || (AE_FX.includes(FX.ae) ? FX.ae : null); return t ? Object.assign({}, ev, { type: t, webType: ev.type }) : null; }).filter(Boolean);
  if (subs) clean.aeNote = J.t('exp.aeNote', { n: subs });
  clean.width = J.outputSize(project)[0]; clean.height = J.outputSize(project)[1];
  clean.fonts = {};
  for (const [role, keys] of Object.entries(plan.style.fonts)) clean.fonts[role] = keys.map(k => J.FONTS[k] ? J.FONTS[k].label : k);
  clean.fontTable = Object.fromEntries(Object.entries(J.FONTS).map(([k, f]) => [k, { label: f.label, family: f.family.replace(/"/g, ''), weight: f.weight, kind: f.kind }]));
  return clean;
};
})();
