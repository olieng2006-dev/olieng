/* =====================================================
   script.js — "เราเลิกเป็นเพื่อนกันเถอะ" เวอร์ชันหมากวน

   กติกา:
   - ปุ่ม "ยอม"    (ส้ม  กว้าง 30%) → ยอมเลิก → หมาเฉลยว่า "โดนหลอก"
   - ปุ่ม "ไม่ยอม" (ขาว  กว้าง 70%) → วนฉากไปเรื่อย ๆ มีมุกแซวระหว่างทาง
   - กล่องปุ่ม "ไม่ยอม" หดเล็กลงเรื่อย ๆ ทุกครั้งที่กด
   - กด "ไม่ยอม" ครบ 100 ครั้ง → ปุ่ม "ไม่ยอม" หายไป
     แล้วหมาประกาศ "ยอมไม่เลิกก็ได้" (เพื่อนชนะ)

   สารบัญ:  A. ตั้งค่า  B. เนื้อหาฉาก  C. มุกระหว่างทาง
            D. เชื่อมหน้าเว็บ  E. แสดงฉาก  F. ปุ่มกด  G. ดาว  H. เริ่ม
===================================================== */


/* ---------- A. ตั้งค่าหลัก ---------- */

/* 🔧 ต้องกด "ไม่ยอม" กี่ครั้งปุ่มถึงจะหาย (ลอง 5 เพื่อทดสอบเร็ว ๆ แล้วค่อยเปลี่ยนกลับ 100) */
const MAX_REFUSE = 100;

/* 🔧 ขนาดกล่องปุ่ม "ไม่ยอม" (1 = ขนาดปกติ, 0 = เล็กจนหายไป)
   กล่องหดลงเรื่อย ๆ ทุกครั้งที่กด จาก BOX_START เหลือ BOX_END ตอนกดครั้งที่ 100
   (ทั้งกล่องและตัวหนังสือหดไปด้วยกัน)
   BOX_END = 0   → เล็กจนมองไม่เห็นพอดีตอนครบ 100
   BOX_END = 0.2 → ยังเหลือกล่องจิ๋ว ๆ ก่อนจะหายตอนกดครั้งที่ 100 */
const BOX_START = 1;
const BOX_END   = 0;

/* 🔧 ข้อความบนปุ่ม */
const LABEL_YES = 'ยอม';
const LABEL_NO  = 'ไม่ยอม';

/* 🔧 จำนวนดาว และสัญลักษณ์ดาว */
const STARS_ON_FINISH = 30;
const STARS_ON_CLICK  = 45;
const STAR_SYMBOLS = ['✦','✧','★','♡'];


/* ---------- B. ฉากที่วนระหว่างกด "ไม่ยอม" ----------
   mood = สีหน้า: 'smug'(กวน) | 'cry' | 'plead' | 'sob' | 'smile'(แลบลิ้น)
   🔧 เพิ่มมุก = คัดลอกก้อน {...} วางต่อท้าย (อย่าลืม , คั่น)
   🔧 ฉากวนซ้ำเรื่อย ๆ จนครบ 100 ครั้ง ยิ่งมีหลายฉาก ยิ่งไม่ซ้ำ
   ⚠️ ข้อความอยู่ใน '...' ถ้ามี ' ข้างใน ให้ใช้ "..." ครอบแทน */
const scenes = [
  {
    mood:'smug',
    title:'กูว่าเราเลิกเป็นเพื่อนกันดีกว่า',
    text:'ไม่มีอะไรหรอก แค่มึงอ่านแล้วไม่ตอบ ไอ้ควาย'
  },
  {
    mood:'plead',
    title:'กูพูดจริงนะเว้ย',
    text:'มึงเป็นเพื่อนที่ดี แต่กูจะไปหาตัวเอง(ในvalo) อย่ามาตามกูละ'
  },
  {
    mood:'sob',
    title:'ฮือออ',
    text:'กูรู้ว่ามึงเสียใจ แต่กูใจแข็งเว้ย กดปุ่มสีส้มเลย กูจะได้โล่ง'
  },
  {
    mood:'smug',
    title:'ถามอีกรอบ ตอบดี ๆ นะ',
    text:'เลิกเป็นเพื่อนกันนะ ตอบผิดอีกกูถามใหม่ไม่จบนะเหี้ย'
  },
  {
    mood:'cry',
    title:'มึงกดผิดปุ่มไอ้ควาย',
    text:'ปุ่มที่ถูกคือสีส้ม มันเล็กก็จริง แต่มันคือทางออกของมึงนะ กูรอได้ กูว่างทั้งวัน'
  },
  {
    mood:'plead',
    title:'ขอร้องละ มึงยอมเหอะ',
    text:'กูทำWebนี้มาทั้งคืน มึงยอมง่าย ๆ หน่อยจะตายเหรอ'
  },
  {
    mood:'smug',
    title:'ปุ่มใหญ่ ๆ นั่นหลอกมึงนะ',
    text:'ปุ่มขาวมันกว้างจริง แต่ไม่ได้แปลว่าถูก ไอ้ควาย กดผิดมานานละ'
  },
  {
    mood:'sob',
    title:'กูเหนื่อยละ ฮือ',
    text:'นิ้วมึงไม่เมื่อยเหรอวะ กูเมื่อยแทน ยอมเหอะ'
  }
];


/* ---------- C. มุกระหว่างทาง (โชว์เหนือปุ่ม) ----------
   key = จำนวนครั้งที่กด "ไม่ยอม" | value = ข้อความที่โชว์
   ข้อความจะค้างอยู่จนถึงมุกถัดไป (ไม่มีตัวเลขนับ x/100 ให้เห็น)
   🔧 เพิ่ม/ลบ/แก้ได้เลย ไม่อยากให้มีมุก → ให้เป็น {} */
const milestones = {
  3:  'ไม่ยอม 3 รอบละนะ ดื้อฉิบหาย 😤',
  5:  'มึงนี่ใจแข็งเหมือนกูเลยว่ะ 👀',
  8:  'มึงกลัวปุ่มสีส้มหรือไงวะ 🤔',
  10: 'ครบ 10 รอบ! มึงนี่แชมป์ความดื้อเลย 🏆',
  15: 'ปุ่มส้มมันไม่กัดนะเว้ย กดดิ',
  20: '20 รอบละ นิ้วมึงมีไฟหรือไง 🔥',
  25: '25 ละนะ กูเริ่มกลัวมึงละ 😰',
  30: 'ดื้อถึงขั้นนี้ กูนับถือ 🫡',
  40: '40 รอบ มึงคือตำนานแล้ว ✨',
  50: '50 รอบละ มึงยังไม่เมื่อยอีกเหรอวะ !!😳',
  60: 'กูเริ่มสงสัยละ มึงมีเวลาว่างเยอะมากเปล่า',
  70: '70 รอบละ กูไม่ไหวละ 🥲',
  80: 'เหลืออีก 20 รอบ มึงอย่าหยุดนะ',
  90: 'อีก 10 รอบเท่านั้น!! จะ100แล้ววววววววววววว 😱',
  95: 'อีก 5 รอบ กูแทบจะร้องไห้แล้ว 😭',
  99: 'อีกรอบเดียว… กดเลย!! 😱'
};


/* ---------- ฉากพิเศษ 2 อัน ---------- */

/* ฉากเฉลย: กดปุ่ม "ยอม" ก่อนครบ 100 → โดนหลอก
   🔧 count = จำนวนครั้งที่เพื่อนกด "ไม่ยอม" มาแล้ว */
function makeFinalScene(count){
  const extra = count === 0
    ? 'ยอมไวชิบหาย กูตกใจ 😳'
    : `มึงไม่ยอมไป ${count} รอบ ดื้อโคตร แต่กูรักมึงนะ`;
  return {
    mood:'smile',
    title:'ดีมากไอ้เหี้ย 🤣',
    text:`ใครจะไปเลิกคบมึงวะ (กูไง) ${extra}`,
    main:'ปล่อยดาวฉลอง ✦'
  };
}

/* ฉากแพ้: ครบ 100 ครั้ง → ปุ่ม "ไม่ยอม" หาย แล้วขึ้นข้อความนี้ */
const giveUpScene = {
  mood:'smile',
  title:'เออ ๆ ยอมไม่ก็ได้วะ',
  text:'มึงกดมา 100 รอบ กูยอมใจวะ ไม่เลิกก็ไม่เลิก ไอ้เห้ย แต่มึงต้องเลี้ยงข้าวกูนะ',
  main:'เป็นเพื่อนกันต่อ 🤝'
};


/* ---------- D. เชื่อมกับหน้าเว็บ (id ต้องตรงกับ index.html) ---------- */
const $ = id => document.getElementById(id);

const mochi   = $('mochi');
const titleEl = $('title');
const textEl  = $('text');
const btnMain = $('btnMain');
const btnAlt  = $('btnAlt');
const counter = $('counter');

let index = 0;          // ฉากที่เท่าไหร่ในลิสต์ scenes
let refused = 0;        // กด "ไม่ยอม" มากี่ครั้งแล้ว
let finished = false;   // จบแล้วหรือยัง (ยอม หรือ ครบ 100)


/* ---------- E. แสดงฉาก (fade ออก → เปลี่ยน → fade เข้า) ----------
   scene.main = ข้อความปุ่มซ้าย (ไม่ใส่ = ใช้ "ยอม")
   hideAlt: true = ซ่อนปุ่ม "ไม่ยอม" แล้วให้ปุ่มซ้ายกว้างเต็ม */
function show(scene, hideAlt = false){
  [titleEl, textEl].forEach(e => e.classList.add('swap'));

  setTimeout(() => {
    mochi.dataset.mood  = scene.mood;
    titleEl.textContent = scene.title;
    textEl.textContent  = scene.text;
    btnMain.textContent = scene.main || LABEL_YES;
    btnAlt.textContent  = LABEL_NO;

    btnAlt.style.display = hideAlt ? 'none' : '';
    btnMain.style.flex   = hideAlt ? '1' : '';   // ซ่อนปุ่มขาว → ปุ่มส้มเต็มความกว้าง

    [titleEl, textEl].forEach(e => e.classList.remove('swap'));
  }, 250);   // 🔧 ต้องเท่ากับ .25s ของ .fade ใน style.css
}

/* ถ้าจำนวนครั้งตรงกับมุกที่ตั้งไว้ ให้เปลี่ยนข้อความ ไม่ตรงก็คงข้อความเดิมไว้ */
function updateCounter(){
  if (milestones[refused]) counter.textContent = milestones[refused];
}

/* กล่องปุ่ม "ไม่ยอม" หดลงตามจำนวนครั้งที่กด (เส้นตรง จาก BOX_START → BOX_END)
   ใช้ transform: scale() ทำให้ทั้งกล่องและตัวหนังสือเล็กลงพร้อมกัน
   ปุ่ม "ยอม" ยังกว้าง 30% เท่าเดิม ไม่ขยับ */
function shrinkBox(){
  const t = refused / MAX_REFUSE;                       // 0 → 1
  const scale = BOX_START + (BOX_END - BOX_START) * t;
  btnAlt.style.transform = `scale(${Math.max(scale, 0)})`;
}


/* ---------- F. ปุ่มกด ---------- */

// ปุ่ม "ไม่ยอม" → ไปฉากถัดไป (วนลูป) / ครบ 100 → ปุ่มหาย + ฉากแพ้
btnAlt.addEventListener('click', () => {
  if (finished) return;
  refused++;

  if (refused >= MAX_REFUSE) {
    finished = true;
    show(giveUpScene, true);
    counter.textContent = 'ก็ได้วะ …กูยอม';
    burst(STARS_ON_FINISH);
    return;
  }

  index = (index + 1) % scenes.length;   // % = วนกลับฉากแรกเมื่อครบ
  show(scenes[index]);
  updateCounter();
  shrinkBox();
});

// ปุ่มซ้าย: ยังไม่จบ → "ยอม" = โดนหลอก / จบแล้ว → ปล่อยดาวเพิ่ม
btnMain.addEventListener('click', () => {
  if (!finished) {
    finished = true;
    show(makeFinalScene(refused), true);
    counter.textContent = '';
    burst(STARS_ON_FINISH);
  } else {
    burst(STARS_ON_CLICK);
  }
});


/* ---------- G. เอฟเฟกต์ดาว (สร้างแล้วลบตัวเองเมื่อ animation จบ) ---------- */
function burst(n){
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.textContent = STAR_SYMBOLS[Math.floor(Math.random() * STAR_SYMBOLS.length)];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top  = 60 + Math.random() * 40 + 'vh';
    s.style.fontSize = 12 + Math.random() * 18 + 'px';
    s.style.animationDuration = 2.5 + Math.random() * 2.5 + 's';
    s.style.animationDelay    = Math.random() * 0.8 + 's';
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
}


/* ---------- H. เริ่มทำงาน ---------- */
show(scenes[0]);
