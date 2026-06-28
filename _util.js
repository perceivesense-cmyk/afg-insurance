
const crypto = require('crypto');

const PW = process.env.SITE_PASSWORD || 'afg2024';
const SECRET = process.env.TOKEN_SECRET || 'afg_secret_key_2024';
const TTL = 8 * 3600; // 8시간

function makeToken() {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  const payload = exp + ':' + PW;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex').slice(0, 16);
  return Buffer.from(exp + ':' + sig).toString('base64url');
}

function verifyToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const [expStr, sig] = decoded.split(':');
    const exp = parseInt(expStr);
    if (isNaN(exp) || Math.floor(Date.now() / 1000) > exp) return false;
    const payload = exp + ':' + PW;
    const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex').slice(0, 16);
    return sig === expected;
  } catch { return false; }
}

function getCookie(req, name) {
  const h = req.headers.cookie || '';
  const m = h.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

function isAuthed(req) {
  const token = getCookie(req, 'afg_token');
  return token && verifyToken(token);
}

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AFG 보험심사평가 — 로그인</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background:#F0F4F8;display:flex;align-items:center;justify-content:center;min-height:100vh}
.card{background:white;border-radius:16px;padding:40px 36px;width:360px;box-shadow:0 4px 24px rgba(0,0,0,.12)}
h2{font-size:15px;font-weight:700;color:#1B2A4A;margin-bottom:4px}
p{font-size:12px;color:#94a3b8;margin-bottom:24px}
input{width:100%;padding:12px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:14px;font-family:inherit;outline:none;margin-bottom:12px}
input:focus{border-color:#1B2A4A}
button{width:100%;padding:13px;background:#1B2A4A;color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
.err{background:#FEE2E2;color:#991B1B;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:14px}
.footer{text-align:center;margin-top:18px;font-size:11px;color:#94a3b8}
</style></head><body>
<div class="card">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px">
    <svg width="80" height="26" viewBox="0 0 180 50">
      <g transform="translate(2,2)">
        <g opacity=".25"><polygon points="18,0 28,8 18,16 8,8" fill="#1B2A4A"/><polygon points="28,0 38,8 28,16 18,8" fill="#1B2A4A"/><polygon points="8,0 18,8 8,16 -2,8" fill="#1B2A4A"/></g>
        <g opacity=".55"><polygon points="14,16 24,24 14,32 4,24" fill="#1B2A4A"/><polygon points="24,16 34,24 24,32 14,24" fill="#1B2A4A"/></g>
        <g opacity="1"><polygon points="18,32 28,40 18,48 8,40" fill="#1B2A4A"/></g>
        <g opacity=".4"><polygon points="4,8 14,16 4,24" fill="#1B2A4A"/><polygon points="32,8 42,16 32,24" fill="#1B2A4A"/></g>
      </g>
      <text x="54" y="36" font-family="Arial Black,Arial" font-weight="900" font-size="32" fill="#1B2A4A" letter-spacing="1">AFG</text>
      <line x1="124" y1="8" x2="124" y2="44" stroke="#ccc" stroke-width="1"/>
      <text x="130" y="20" font-family="Arial" font-weight="700" font-size="9" fill="#1B2A4A" letter-spacing="2">AUTHENTIC</text>
      <text x="130" y="33" font-family="Arial" font-size="9" fill="#1B2A4A" letter-spacing="2">FINANCIAL</text>
      <text x="130" y="46" font-family="Arial" font-size="9" fill="#1B2A4A" letter-spacing="2">GROUP</text>
    </svg>
    <div>
      <h2>보험심사평가</h2>
      <p style="margin:0">고지의무 위반 분석 시스템</p>
    </div>
  </div>
  {{ERROR}}
  <form method="POST" action="/login">
    <input type="password" name="password" placeholder="비밀번호를 입력하세요" autofocus autocomplete="current-password"/>
    <button type="submit">접속하기</button>
  </form>
  <div class="footer">AFG Authentic · 보험심사평가사 전용</div>
</div>
</body></html>`;

const MAIN_HTML = ``<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AFG 보험심사평가</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background:#F0F4F8;color:#1E293B;min-height:100vh}
.hdr{background:white;border-bottom:3px solid #1B2A4A;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:66px;box-shadow:0 2px 10px rgba(0,0,0,.07);position:sticky;top:0;z-index:50}
.logo{display:flex;align-items:center;gap:14px}
.logo-div{width:1px;height:40px;background:#E2E8F0}
.logo-main{font-size:15px;font-weight:700;color:#1B2A4A}
.logo-sub{font-size:10px;color:#94a3b8;margin-top:1px}
.btn-hdr{padding:6px 13px;border-radius:8px;border:1px solid #E2E8F0;background:transparent;color:#64748b;font-size:12px;cursor:pointer;font-family:inherit}
.wrap{max-width:960px;margin:0 auto;padding:20px 16px}
.notice{background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:9px 14px;font-size:11px;color:#92400E;margin-bottom:14px;line-height:1.7}
.card{background:white;border-radius:14px;border:1px solid #E2E8F0;overflow:hidden;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.05)}
.card-body{padding:16px 18px}
.tabs{display:flex;border-bottom:1px solid #E2E8F0}
.tab{padding:10px 18px;border:none;background:transparent;color:#64748b;font-size:13px;cursor:pointer;border-bottom:2px solid transparent;font-family:inherit}
.tab.on{color:#1B2A4A;border-bottom-color:#1B2A4A;font-weight:700;background:#EEF6FF}
.row{display:flex;gap:8px;margin-bottom:10px;align-items:center;flex-wrap:wrap}
input[type=text]{padding:9px 13px;border:1.5px solid #E2E8F0;border-radius:9px;font-size:13px;font-family:inherit;outline:none;background:#F8FAFC;color:#1E293B}
input[type=text]:focus{border-color:#1B2A4A}
textarea{width:100%;padding:11px 13px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:13px;font-family:inherit;resize:vertical;min-height:115px;outline:none;background:#F8FAFC;color:#1E293B;line-height:1.8}
textarea:focus{border-color:#1B2A4A}
.btn-main{padding:10px 18px;background:#1B2A4A;color:white;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap}
.btn-main:disabled{background:#CBD5E1;cursor:not-allowed}
.btn-sec{padding:10px 13px;background:transparent;border:1px solid #E2E8F0;color:#64748b;border-radius:10px;font-size:12px;cursor:pointer;font-family:inherit}
.upload-zone{border:2px dashed #E2E8F0;border-radius:10px;padding:28px 20px;text-align:center;cursor:pointer;background:#F8FAFC}
.upload-zone:hover{border-color:#1B2A4A}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}
.scard{background:white;border:1px solid #E2E8F0;border-radius:10px;padding:11px 13px;cursor:pointer}
.scard.on{border-color:#6366F1}
.risk-banner{border-radius:12px;padding:13px 17px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;border-width:2px;border-style:solid}
.hl-box{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:13px 15px;font-size:13px;line-height:2.2;white-space:pre-wrap;max-height:200px;overflow-y:auto;margin-bottom:10px}
.ai-box{background:#F0F4FF;border:1px solid #C7D2FE;border-radius:10px;padding:13px 15px;font-size:13px;line-height:1.9;white-space:pre-wrap;margin-bottom:10px}
.cats{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}
.cat-tag{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid}
.tbl{width:100%;border-collapse:collapse;font-size:12px}
.tbl th{padding:7px 10px;text-align:left;color:#64748b;font-weight:600;border-bottom:1px solid #E2E8F0;font-size:10px;white-space:nowrap;background:#F8FAFC}
.tbl td{padding:7px 10px;border-bottom:1px solid #F1F5F9;vertical-align:top}
.tbl tr:hover td{background:#F8FAFC}
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;border:1px solid;white-space:nowrap}
.pbadge{display:inline-block;padding:1px 6px;border-radius:10px;font-size:9px;font-weight:700;border:1px solid;white-space:nowrap}
.kw-detail{margin:7px 0 10px;border-radius:10px;padding:10px 13px;font-size:12px}
.sec-hd{font-size:12px;font-weight:700;color:#475569;margin-bottom:8px}
.fil-row{display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap}
.fil-btn{padding:3px 9px;border-radius:20px;border:1px solid #E2E8F0;background:transparent;color:#64748b;font-size:11px;cursor:pointer;font-family:inherit;font-weight:600}
.fil-btn.on{background:#1B2A4A;border-color:#1B2A4A;color:white}
.empty{text-align:center;padding:48px 20px;color:#94a3b8}
.pw-modal{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;display:flex;align-items:center;justify-content:center}
.pw-card{background:white;border-radius:16px;padding:30px;width:300px;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.2)}
.hist-panel{position:fixed;top:66px;right:0;width:290px;height:calc(100vh - 66px);background:white;border-left:1px solid #E2E8F0;z-index:40;overflow-y:auto;box-shadow:-4px 0 20px rgba(0,0,0,.08);transform:translateX(100%);transition:transform .2s}
.hist-panel.open{transform:translateX(0)}
.hist-item{padding:12px 15px;border-bottom:1px solid #F1F5F9;cursor:pointer}
.hist-item:hover{background:#F8FAFC}
@media(max-width:640px){.grid4{grid-template-columns:repeat(2,1fr)}.hdr{padding:0 12px}.wrap{padding:12px 10px}}
</style>
</head>
<body>

<div class="hdr">
  <div class="logo">
    <img src="data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//2Q==" style="height:36px;object-fit:contain" alt="AFG">
    <div class="logo-div"></div>
    <div>
      <div class="logo-main">보험심사평가</div>
      <div class="logo-sub">금감원 2024 · HIRA KCD · 160개 항목</div>
    </div>
  </div>
  <div style="display:flex;gap:7px">
    <button class="btn-hdr" onclick="toggleHist()">🗂 히스토리</button>
    <button class="btn-hdr" onclick="location.href='/logout'">로그아웃</button>
  </div>
</div>

<div class="hist-panel" id="histPanel">
  <div style="padding:13px 15px;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center">
    <span style="font-weight:700;font-size:13px">심사 히스토리</span>
    <button onclick="toggleHist()" style="background:transparent;border:none;font-size:17px;cursor:pointer;color:#94a3b8">✕</button>
  </div>
  <div id="histList"><div style="padding:24px;text-align:center;color:#94a3b8;font-size:13px">아직 심사 이력이 없습니다</div></div>
</div>

<div class="wrap">
  <div class="notice">
    <strong>금감원 고지기간 기준</strong> &nbsp;|&nbsp;
    <span style="background:#D1FAE5;color:#065F46;padding:1px 6px;border-radius:6px">3개월: 진단·치료·투약</span> &nbsp;
    <span style="background:#DBEAFE;color:#1E40AF;padding:1px 6px;border-radius:6px">1년: 추가검사 권고</span> &nbsp;
    <span style="background:#FEF3C7;color:#92400E;padding:1px 6px;border-radius:6px">5년: 7일이상치료·30일이상투약·수술·입원</span> &nbsp;
    <span style="background:#FEE2E2;color:#991B1B;padding:1px 6px;border-radius:6px">항상: 10대질병·암·에이즈</span>
  </div>

  <div class="card">
    <div class="tabs">
      <button class="tab on" onclick="switchTab('text',this)">📝 직접 입력</button>
      <button class="tab" onclick="switchTab('file',this)">📁 파일 업로드 (TXT/PDF · 🔒비밀번호 지원)</button>
    </div>
    <div class="card-body">
      <div class="row">
        <input type="text" id="pname" placeholder="피심사자 성명 (선택)" style="max-width:170px">
        <button class="btn-main" id="analyzeBtn" onclick="doAnalyze()" disabled>⚖️ 고지의무 통합 분석</button>
        <button class="btn-sec" onclick="doReset()">초기화</button>
        <button class="btn-sec" id="reportBtn" style="display:none" onclick="doReport()">📄 리포트</button>
      </div>
      <div id="textPane">
        <textarea id="inputTxt" placeholder="병력 정보를 입력하세요.&#10;예) 2019년 고혈압 진단, 발살탄 투약 중 / 2021년 2형당뇨 / 2023년 위선암 내시경절제술&#10;추간판탈출증 요추, 우울증 에스시탈로프람 투약..." oninput="checkBtn()"></textarea>
      </div>
      <div id="filePane" style="display:none">
        <div class="upload-zone" onclick="document.getElementById('fileInput').click()">
          <div style="font-size:26px;margin-bottom:6px">📁</div>
          <div id="fileLabel" style="font-size:13px;font-weight:600;color:#475569">클릭하여 파일 업로드</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px">TXT · PDF (🔒 비밀번호 PDF 포함)</div>
        </div>
        <input type="file" id="fileInput" accept=".txt,.pdf" style="display:none" onchange="handleFile(event)">
      </div>
    </div>
  </div>

  <div class="pw-modal" id="pwModal" style="display:none">
    <div class="pw-card">
      <div style="font-size:30px;margin-bottom:9px">🔒</div>
      <div style="font-weight:700;font-size:14px;margin-bottom:4px">PDF 비밀번호 입력</div>
      <div id="pwFileName" style="font-size:11px;color:#94a3b8;margin-bottom:14px"></div>
      <input type="password" id="pwInput" placeholder="비밀번호" style="width:100%;padding:9px 13px;border:1.5px solid #E2E8F0;border-radius:9px;font-size:13px;font-family:inherit;outline:none;margin-bottom:9px" onkeydown="if(event.key==='Enter')confirmPw()">
      <div style="display:flex;gap:7px">
        <button class="btn-main" style="flex:1" onclick="confirmPw()">확인</button>
        <button class="btn-sec" style="flex:1" onclick="closePw()">취소</button>
      </div>
    </div>
  </div>

  <div id="results" style="display:none">
    <div class="risk-banner" id="riskBanner">
      <div>
        <div style="font-size:10px;color:#64748b;margin-bottom:2px">전체 보험 통합 위반 위험도</div>
        <div style="font-size:21px;font-weight:700" id="riskVal">—</div>
        <div style="font-size:11px;color:#64748b;margin-top:1px" id="riskSub"></div>
      </div>
      <button class="btn-main" onclick="doReport()">📄 AFG 리포트</button>
    </div>
    <div class="grid4" id="countGrid"></div>
    <div class="cats" id="catTags"></div>
    <div class="card">
      <div class="card-body">
        <div class="sec-hd">🔎 병력 원문 하이라이트 <span style="font-size:10px;color:#94a3b8;font-weight:400">— 항목 클릭 시 상세</span></div>
        <div class="hl-box" id="hlBox"></div>
        <div id="kwDetail" style="display:none"></div>
        <div style="display:flex;gap:10px;margin-top:4px;flex-wrap:wrap">
          <span style="font-size:10px;color:#94a3b8;display:flex;align-items:center;gap:3px"><span style="width:7px;height:7px;border-radius:50%;background:#A855F7;display:inline-block"></span>필수고지</span>
          <span style="font-size:10px;color:#94a3b8;display:flex;align-items:center;gap:3px"><span style="width:7px;height:7px;border-radius:50%;background:#EF4444;display:inline-block"></span>고위험</span>
          <span style="font-size:10px;color:#94a3b8;display:flex;align-items:center;gap:3px"><span style="width:7px;height:7px;border-radius:50%;background:#F59E0B;display:inline-block"></span>중위험</span>
          <span style="font-size:10px;color:#94a3b8;display:flex;align-items:center;gap:3px"><span style="width:7px;height:7px;border-radius:50%;background:#3B82F6;display:inline-block"></span>저위험</span>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="sec-hd">🤖 AI 통합 심사 의견</div>
        <div class="ai-box" id="aiBox">분석 중...</div>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="sec-hd" id="tblLabel">📋 발견 항목 상세</div>
        <div class="fil-row" id="sevFilters"></div>
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead><tr><th>항목</th><th>분류</th><th>위험도</th><th>고지기간</th><th>KCD</th><th>심사 포인트</th></tr></thead>
            <tbody id="tblBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="empty" id="emptyState">
    <div style="font-size:38px;margin-bottom:12px">⚖️</div>
    <div style="font-size:13px;font-weight:600;color:#475569;margin-bottom:4px">병력 정보를 입력하고 분석을 시작하세요</div>
    <div style="font-size:11px">금감원 2024 · HIRA KCD · 160개 항목 · alias 400개+ 완전 매칭</div>
  </div>
</div>

<script>
const LOGO_SRC='data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//2Q==';
const SEV={critical:{label:'필수고지',bg:'#F3E8FF',border:'#A855F7',text:'#6B21A8',dot:'#A855F7'},high:{label:'고위험',bg:'#FEE2E2',border:'#EF4444',text:'#991B1B',dot:'#EF4444'},medium:{label:'중위험',bg:'#FEF3C7',border:'#F59E0B',text:'#92400E',dot:'#F59E0B'},low:{label:'저위험',bg:'#DBEAFE',border:'#3B82F6',text:'#1E40AF',dot:'#3B82F6'}};
const PLABEL={M3:'3개월',Y1:'1년',Y5:'5년',ALWAYS:'항상'};
const PCOLOR={M3:'#10B981',Y1:'#3B82F6',Y5:'#F59E0B',ALWAYS:'#EF4444'};
const DB=[
  {k:'암',a:['악성종양','악성신생물','암종'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'C00-C97',d:'모든 암 — 10대 필수 고지. 부위·병기·치료 완료 여부 확인'},
  {k:'백혈병',a:['급성백혈병','만성백혈병','AML','CML','ALL'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'C91-C95',d:'혈액암 — 치료 상태·재발 여부 확인'},
  {k:'고혈압',a:['혈압','본태성고혈압','고혈압증','혈압약'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'I10-I15',d:'10대 필수. 투약 기간·합병증(심장·신장·안저) 확인'},
  {k:'협심증',a:['불안정협심증','안정협심증','변이형협심증'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'I20',d:'10대 필수. 불안정형 여부·스텐트 시술 확인'},
  {k:'심근경색',a:['급성심근경색','AMI','STEMI','NSTEMI','심장마비'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'I21-I22',d:'10대 필수. 스텐트·관상동맥우회술·박출률 확인'},
  {k:'심장판막증',a:['판막질환','심장판막질환','대동맥판막','승모판막'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'I05-I37',d:'10대 필수. 수술·인공판막·항응고제 확인'},
  {k:'간경변',a:['간경화','간경화증','LC','간섬유화'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'K74',d:'10대 필수. Child-Pugh 점수·복수·식도정맥류 확인'},
  {k:'뇌졸중',a:['중풍','뇌혈관질환','stroke','뇌중풍'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'I60-I64',d:'10대 필수. 뇌경색·뇌출혈 구분·후유증 확인'},
  {k:'당뇨',a:['당뇨병','2형당뇨','1형당뇨','제2형당뇨','인슐린','DM','혈당'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'E10-E14',d:'10대 필수. 합병증(신장·망막·신경·심혈관) 확인'},
  {k:'에이즈',a:['HIV','AIDS','후천성면역결핍증'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'B20-B24',d:'10대 필수. 항바이러스 투약·고지 누락 시 계약 무효'},
  {k:'뇌경색',a:['허혈성뇌졸중','뇌혈전','TIA','일과성허혈발작'],c:'뇌·신경계',s:'critical',p:'ALWAYS',kcd:'I63,G45',d:'발생 시기·재발·항응고제 투약 확인'},
  {k:'뇌출혈',a:['뇌내출혈','지주막하출혈','SAH','ICH'],c:'뇌·신경계',s:'critical',p:'ALWAYS',kcd:'I60-I62',d:'출혈 부위·수술 여부·신경학적 후유증 확인'},
  {k:'치매',a:['알츠하이머','혈관성치매','인지장애'],c:'뇌·신경계',s:'high',p:'Y5',kcd:'F00-F03',d:'원인 구분·진행 단계·MMSE 결과 확인'},
  {k:'파킨슨',a:['파킨슨병','파킨슨증후군','PD'],c:'뇌·신경계',s:'high',p:'Y5',kcd:'G20-G21',d:'진행 단계·레보도파 투약 확인'},
  {k:'간질',a:['뇌전증','경련','경련발작'],c:'뇌·신경계',s:'high',p:'Y5',kcd:'G40-G41',d:'발작 빈도·현재 투약·운전면허 제한 여부 확인'},
  {k:'루게릭',a:['ALS','근위축성측삭경화증'],c:'뇌·신경계',s:'critical',p:'ALWAYS',kcd:'G12.2',d:'진단 즉시 고위험 — 호흡기 사용 확인'},
  {k:'다발성경화증',a:['MS','탈수초질환'],c:'뇌·신경계',s:'high',p:'Y5',kcd:'G35',d:'재발-완화형 여부·면역조절제 투약 확인'},
  {k:'뇌종양',a:['뇌암','교모세포종','수막종'],c:'뇌·신경계',s:'high',p:'ALWAYS',kcd:'C71,D33',d:'양성·악성 구분·치료 경과 확인'},
  {k:'경도인지장애',a:['MCI','인지저하'],c:'뇌·신경계',s:'medium',p:'Y5',kcd:'G31.8',d:'치매 전단계 — 치매보험 핵심 고지 대상'},
  {k:'심부전',a:['울혈성심부전','CHF'],c:'순환기계',s:'high',p:'Y5',kcd:'I50',d:'박출률·입원 횟수·현재 투약 확인'},
  {k:'부정맥',a:['심방세동','심실세동','빈맥','서맥','AF'],c:'순환기계',s:'high',p:'Y5',kcd:'I44-I49',d:'부정맥 종류·항부정맥제·제세동기 삽입 여부 확인'},
  {k:'혈전',a:['혈전증','DVT','정맥혈전','폐색전증','PE'],c:'순환기계',s:'high',p:'Y5',kcd:'I80-I82',d:'DVT·폐색전증 이력·항응고제 투약 확인'},
  {k:'동맥경화',a:['죽상경화','죽상동맥경화증'],c:'순환기계',s:'medium',p:'Y5',kcd:'I70',d:'관상동맥·경동맥 침범 여부 평가'},
  {k:'유방암',a:['유방악성종양','유방신생물'],c:'종양·암',s:'critical',p:'ALWAYS',kcd:'C50',d:'병기·수술·항암·방사선·호르몬 치료 여부 확인'},
  {k:'자궁암',a:['자궁경부암','자궁내막암','자궁체부암'],c:'종양·암',s:'critical',p:'ALWAYS',kcd:'C53-C55',d:'자궁경부암 포함 — 수술·방사선 치료 확인'},
  {k:'폐암',a:['기관지암','NSCLC','SCLC'],c:'종양·암',s:'critical',p:'ALWAYS',kcd:'C33-C34',d:'흡연력·병기·표적치료제 여부 확인'},
  {k:'위암',a:['위악성종양','위선암'],c:'종양·암',s:'critical',p:'ALWAYS',kcd:'C16',d:'내시경 점막하절제 포함 전체 이력 확인'},
  {k:'대장암',a:['결장암','직장암','대장선암'],c:'종양·암',s:'critical',p:'ALWAYS',kcd:'C18-C20',d:'용종 절제 이력·병기·수술 방법 확인'},
  {k:'간암',a:['간세포암','HCC'],c:'종양·암',s:'critical',p:'ALWAYS',kcd:'C22',d:'간염·간경변 동반·RFA·TACE 시술 확인'},
  {k:'갑상선암',a:['갑상선악성종양','갑상선유두암'],c:'종양·암',s:'critical',p:'ALWAYS',kcd:'C73',d:'미세유두암 포함 — 절제 여부 확인'},
  {k:'전립선암',a:['전립선악성종양'],c:'종양·암',s:'critical',p:'ALWAYS',kcd:'C61',d:'PSA·글리슨 점수·치료 방법 확인'},
  {k:'혈액암',a:['림프종','골수종','다발성골수종','호지킨림프종','비호지킨림프종'],c:'종양·암',s:'critical',p:'ALWAYS',kcd:'C81-C90',d:'혈액암 전반 — 백혈병과 구분하여 확인'},
  {k:'용종',a:['대장용종','위용종','폴립','선종'],c:'종양·암',s:'medium',p:'Y5',kcd:'D12',d:'악성화 위험도·제거 여부 확인'},
  {k:'갑상선기능항진',a:['갑상선항진','그레이브스병','바제도병'],c:'내분비·대사',s:'medium',p:'Y5',kcd:'E05',d:'방사성요오드 치료·수술 이력 확인'},
  {k:'갑상선기능저하',a:['갑상선저하','하시모토'],c:'내분비·대사',s:'medium',p:'Y5',kcd:'E03',d:'TSH 수치·호르몬 투약 기간 확인'},
  {k:'갑상선결절',a:['갑상선종양','갑상선낭종','TI-RADS'],c:'내분비·대사',s:'medium',p:'Y5',kcd:'E04',d:'TI-RADS·세침흡인 결과·악성 전환 가능성 확인'},
  {k:'고지혈증',a:['고콜레스테롤','이상지질혈증','고중성지방'],c:'내분비·대사',s:'medium',p:'Y5',kcd:'E78',d:'스타틴 장기 투약·동맥경화 합병증 위험 평가'},
  {k:'비만',a:['고도비만','병적비만'],c:'내분비·대사',s:'medium',p:'Y5',kcd:'E66',d:'BMI 30 이상 시 가중 — 수술 여부 확인'},
  {k:'통풍',a:['고요산혈증','통풍발작','통풍관절염'],c:'내분비·대사',s:'medium',p:'Y5',kcd:'M10',d:'요산 수치·관절 손상·신장 결석 동반 확인'},
  {k:'B형간염',a:['B형간염바이러스','HBV','간염보유자'],c:'소화기계',s:'medium',p:'Y5',kcd:'B16-B19',d:'HBsAg 양성·활동성·항바이러스 치료 확인'},
  {k:'C형간염',a:['HCV','C형만성간염'],c:'소화기계',s:'medium',p:'Y5',kcd:'B17.1',d:'치료 완치(SVR) 여부·간경변 진행 여부 확인'},
  {k:'지방간',a:['비알코올성지방간','알코올성지방간','NAFLD','NASH'],c:'소화기계',s:'low',p:'Y5',kcd:'K76.0',d:'간경변 진행 여부·대사증후군 동반 확인'},
  {k:'크론병',a:['국소장염','IBD'],c:'소화기계',s:'high',p:'Y5',kcd:'K50',d:'면역억제제·생물학적제제 투약·수술 이력 확인'},
  {k:'궤양성대장염',a:['UC','염증성장질환'],c:'소화기계',s:'high',p:'Y5',kcd:'K51',d:'대장암 위험 — 이환 기간·스테로이드 투약 확인'},
  {k:'췌장염',a:['급성췌장염','만성췌장염'],c:'소화기계',s:'medium',p:'Y5',kcd:'K85',d:'만성화 여부·당뇨 합병 확인'},
  {k:'천식',a:['기관지천식','알레르기성천식'],c:'호흡기계',s:'medium',p:'Y5',kcd:'J45',d:'스테로이드 투약·입원 이력 확인'},
  {k:'COPD',a:['만성폐쇄성폐질환','폐기종','만성기관지염'],c:'호흡기계',s:'high',p:'Y5',kcd:'J44',d:'FEV1 수치·산소 요법·입원 횟수 확인'},
  {k:'폐섬유화',a:['IPF','간질성폐질환','ILD'],c:'호흡기계',s:'high',p:'Y5',kcd:'J84',d:'폐기능 저하 진행·산소 요법 여부 확인'},
  {k:'결핵',a:['폐결핵','활동성결핵','잠복결핵'],c:'호흡기계',s:'medium',p:'Y5',kcd:'A15-A19',d:'완치 여부·치료 기간 확인'},
  {k:'기흉',a:['자연기흉'],c:'호흡기계',s:'medium',p:'Y5',kcd:'J93',d:'재발성 여부·수술 이력 확인'},
  {k:'수면무호흡',a:['OSA','OSAS','폐쇄성수면무호흡'],c:'호흡기계',s:'medium',p:'Y5',kcd:'G47.3',d:'AHI 수치·CPAP 사용 여부 확인'},
  {k:'신부전',a:['만성신부전','CKD','신기능저하'],c:'비뇨기·신장',s:'high',p:'Y5',kcd:'N17-N19',d:'GFR 수치·투석 이력·이식 여부 확인'},
  {k:'투석',a:['혈액투석','복막투석','신장투석','HD','PD'],c:'비뇨기·신장',s:'critical',p:'ALWAYS',kcd:'Z49',d:'투석 중인 경우 대부분 가입 제한 — 시작 시기 확인'},
  {k:'신장이식',a:['신이식','콩팥이식'],c:'비뇨기·신장',s:'critical',p:'ALWAYS',kcd:'Z94.0',d:'면역억제제 지속 투약·거부반응 이력 확인'},
  {k:'디스크',a:['추간판탈출증','HIVD','목디스크','허리디스크'],c:'근골격계',s:'low',p:'Y5',kcd:'M50-M51',d:'경추·요추 구분·수술 여부·신경 손상 확인'},
  {k:'척추관협착증',a:['요추관협착','경추관협착'],c:'근골격계',s:'medium',p:'Y5',kcd:'M48.0',d:'수술 여부·보행 장애 확인'},
  {k:'골다공증',a:['골감소증','뼈엉성증'],c:'근골격계',s:'low',p:'Y5',kcd:'M80-M81',d:'T-score·골절 이력 확인'},
  {k:'류마티스관절염',a:['RA','류마티스'],c:'근골격계',s:'high',p:'Y5',kcd:'M05-M06',d:'RF·항CCP 항체·생물학적제제 투약 확인'},
  {k:'루푸스',a:['전신홍반루푸스','SLE'],c:'근골격계',s:'high',p:'Y5',kcd:'M32',d:'장기 침범(신장·심장·폐) 여부·면역억제제 확인'},
  {k:'강직성척추염',a:['AS','척추관절병증'],c:'근골격계',s:'high',p:'Y5',kcd:'M45',d:'생물학적제제 투약·골유합 진행 확인'},
  {k:'인공관절',a:['인공슬관절','인공고관절','관절치환술','TKR','THR'],c:'근골격계',s:'medium',p:'Y5',kcd:'Z96.6',d:'수술 부위·재치환·감염 합병증 확인'},
  {k:'우울증',a:['주요우울장애','MDD','항우울제','에스시탈로프람','플루옥세틴'],c:'정신건강',s:'medium',p:'Y5',kcd:'F32-F33',d:'최근 2년 내 진단·입원·자살 시도 동반 여부 확인'},
  {k:'조현병',a:['정신분열증','정신분열병'],c:'정신건강',s:'high',p:'Y5',kcd:'F20',d:'입원 이력·항정신병약 투약·현재 증상 확인'},
  {k:'조울증',a:['양극성장애','bipolar','기분안정제'],c:'정신건강',s:'high',p:'Y5',kcd:'F30-F31',d:'입원 이력·기분안정제 투약 확인'},
  {k:'공황장애',a:['공황발작'],c:'정신건강',s:'medium',p:'Y5',kcd:'F41.0',d:'투약 여부·발작 빈도 확인'},
  {k:'불안장애',a:['범불안장애','GAD','강박장애','OCD','PTSD'],c:'정신건강',s:'medium',p:'Y5',kcd:'F40-F42',d:'약물 투약 기간·입원 이력 확인'},
  {k:'자살시도',a:['자해','자살기도','자살충동','자상'],c:'정신건강',s:'critical',p:'ALWAYS',kcd:'X60-X84',d:'시도 이력 — 보험 지급 면책 핵심 항목'},
  {k:'알코올중독',a:['알코올사용장애','알코올의존증'],c:'정신건강',s:'high',p:'Y5',kcd:'F10',d:'입원 치료·금주 기간·간질환 합병 확인'},
  {k:'마약',a:['약물중독','마약중독'],c:'정신건강',s:'critical',p:'ALWAYS',kcd:'F11-F16',d:'투약 이력 — 계약 해지 사유 가능'},
  {k:'녹내장',a:['개방각녹내장','정상안압녹내장'],c:'안과',s:'medium',p:'Y5',kcd:'H40-H42',d:'시신경 손상 정도·안압·시야 결손 확인'},
  {k:'황반변성',a:['AMD','습성황반변성'],c:'안과',s:'medium',p:'Y5',kcd:'H35.3',d:'습성 여부·항VEGF 주사 치료 중 확인'},
  {k:'망막질환',a:['망막박리','당뇨망막병증'],c:'안과',s:'medium',p:'Y5',kcd:'H33-H36',d:'수술 이력·시력 손상·당뇨 합병 확인'},
  {k:'자궁근종',a:['자궁평활근종','자궁섬유종'],c:'여성질환',s:'low',p:'Y5',kcd:'D25',d:'크기·위치·수술 여부 확인'},
  {k:'자궁내막증',a:['자궁내막이형증','자궁선근증'],c:'여성질환',s:'medium',p:'Y5',kcd:'N80',d:'수술 이력·재발 여부·호르몬 치료 확인'},
  {k:'난소낭종',a:['난소물혹','기능성낭종','자궁내막종'],c:'여성질환',s:'medium',p:'Y5',kcd:'N83',d:'악성 감별·수술 이력·CA-125 수치 확인'},
  {k:'다낭성난소',a:['PCOS','다낭성난소증후군'],c:'여성질환',s:'medium',p:'Y5',kcd:'E28.2',d:'당뇨·비만·불임 합병 여부 확인'},
  {k:'유방결절',a:['유방혹','유방낭종','섬유선종','BI-RADS'],c:'여성질환',s:'medium',p:'Y5',kcd:'N60',d:'BI-RADS 분류·조직검사 결과·악성 감별 확인'},
  {k:'자궁경부이형성증',a:['CIN','자궁경부상피내종양','HPV'],c:'여성질환',s:'medium',p:'Y5',kcd:'N87',d:'CIN 등급·HPV 감염·원추생검 여부 확인'},
  {k:'건선',a:['판상건선','건선관절염'],c:'피부질환',s:'medium',p:'Y5',kcd:'L40',d:'생물학적제제 투약 여부 확인'},
  {k:'아토피',a:['아토피피부염','아토피습진'],c:'피부질환',s:'low',p:'Y5',kcd:'L20',d:'중증 여부·생물학적제제 투약 확인'},
  {k:'수술이력',a:['수술','외과수술','복강경수술','개복술'],c:'수술·입원',s:'medium',p:'Y5',kcd:'-',d:'금감원: 5년 내 수술 전체 고지 — 종류·날짜·완치 여부'},
  {k:'입원이력',a:['입원','장기입원','7일이상입원'],c:'수술·입원',s:'medium',p:'Y5',kcd:'-',d:'금감원: 5년 내 7일 이상 치료·입원 — 사유·기간 필수'},
  {k:'항암치료',a:['항암','항암제','화학요법'],c:'수술·입원',s:'critical',p:'ALWAYS',kcd:'Z51.1',d:'항암 치료 이력 — 암 고지와 연계'},
  {k:'방사선치료',a:['방사선요법','방사선조사','IMRT'],c:'수술·입원',s:'critical',p:'ALWAYS',kcd:'Z51.0',d:'치료 부위·암 관련 여부·완료 여부 확인'},
  {k:'장기이식',a:['이식','간이식','심장이식','폐이식','골수이식'],c:'수술·입원',s:'critical',p:'ALWAYS',kcd:'Z94',d:'면역억제제 지속 투약·거부반응 이력 확인'},
  {k:'약물복용',a:['장기복용','30일이상투약','처방약','투약중'],c:'생활습관',s:'medium',p:'Y5',kcd:'-',d:'금감원: 5년 내 30일 이상 약 복용 고지 대상'},
  {k:'건강검진이상',a:['건강검진소견','재검사','추가검사권고','이상소견'],c:'생활습관',s:'medium',p:'Y1',kcd:'-',d:'금감원: 1년 내 추가 검사 권고 — 소견 내용·결과 확인'},
  {k:'질병의심소견',a:['의심소견','경계성','요관찰','추적관찰'],c:'생활습관',s:'medium',p:'M3',kcd:'-',d:'금감원: 3개월 내 질병 의심 소견 — 확진 여부 확인'},
];

let found=[],txt='',selKw=null,fSev='all',fCat='all',hist=[],pendFile=null,histOpen=false;

function switchTab(t,el){document.querySelectorAll('.tab').forEach(b=>b.classList.remove('on'));el.classList.add('on');document.getElementById('textPane').style.display=t==='text'?'block':'none';document.getElementById('filePane').style.display=t==='file'?'block':'none';}
function checkBtn(){document.getElementById('analyzeBtn').disabled=!document.getElementById('inputTxt').value.trim();}
function toggleHist(){histOpen=!histOpen;document.getElementById('histPanel').classList.toggle('open',histOpen);}
function doReset(){document.getElementById('inputTxt').value='';document.getElementById('pname').value='';document.getElementById('fileLabel').textContent='클릭하여 파일 업로드';document.getElementById('results').style.display='none';document.getElementById('emptyState').style.display='block';document.getElementById('reportBtn').style.display='none';document.getElementById('analyzeBtn').disabled=true;found=[];txt='';selKw=null;}

async function handleFile(e){
  const file=e.target.files[0];if(!file)return;
  document.getElementById('fileLabel').textContent=file.name;
  if(file.name.toLowerCase().endsWith('.pdf')){await procPdf(file,'');}
  else{const t=await file.text();document.getElementById('inputTxt').value=t;checkBtn();}
  e.target.value='';
}
async function procPdf(file,pw){
  try{
    if(!window.pdfjsLib)throw new Error('PDF.js 로딩 중');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const buf=await file.arrayBuffer();const p={data:buf};if(pw)p.password=pw;
    const pdf=await window.pdfjsLib.getDocument(p).promise;
    let o='';for(let i=1;i<=pdf.numPages;i++){const pg=await pdf.getPage(i);const ct=await pg.getTextContent();o+=ct.items.map(it=>it.str).join(' ')+'\n';}
    document.getElementById('inputTxt').value=o;document.getElementById('pwModal').style.display='none';pendFile=null;checkBtn();
  }catch(err){
    const m=err.message||'';
    if(m.toLowerCase().includes('password')||m.toLowerCase().includes('encrypted')){
      pendFile=file;document.getElementById('pwFileName').textContent=file.name;
      document.getElementById('pwModal').style.display='flex';document.getElementById('pwInput').value='';
      setTimeout(()=>document.getElementById('pwInput').focus(),100);
    }else{alert('PDF 오류: '+m);}
  }
}
function confirmPw(){if(pendFile)procPdf(pendFile,document.getElementById('pwInput').value);}
function closePw(){document.getElementById('pwModal').style.display='none';pendFile=null;}

function findMatches(text){
  const r=new Map();
  DB.forEach(kw=>{const ts=[kw.k,...(kw.a||[])];for(const t of ts){if(text.includes(t)){if(!r.has(kw.k))r.set(kw.k,{...kw,matched:t});break;}}});
  return [...r.values()];
}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function hl(text,matches){
  const pos=[];
  matches.forEach(m=>{const t=m.matched||m.k;let i=0;while(true){const f=text.indexOf(t,i);if(f===-1)break;pos.push({start:f,end:f+t.length,kw:m.k,alias:t,sev:m.s});i=f+1;}});
  pos.sort((a,b)=>a.start-b.start);
  let o='',c=0;
  pos.forEach(({start,end,kw,alias,sev})=>{
    if(start<c)return;if(start>c)o+=esc(text.slice(c,start));
    const cf=SEV[sev];
    o+=\`<mark style="background:\${cf.bg};border:1.5px solid \${cf.border};border-radius:4px;padding:1px 5px;color:\${cf.text};font-weight:600;cursor:pointer" onclick="selKwFn('\${kw}')">\${esc(alias)}</mark>\`;
    c=end;
  });
  if(c<text.length)o+=esc(text.slice(c));return o;
}
function selKwFn(kw){selKw=selKw===kw?null:kw;renderDetail();renderTable();}
function renderDetail(){
  const d=document.getElementById('kwDetail');
  if(!selKw){d.style.display='none';return;}
  const item=DB.find(x=>x.k===selKw);if(!item){d.style.display='none';return;}
  const c=SEV[item.s];
  d.innerHTML=\`<div class="kw-detail" style="background:\${c.bg};border:1.5px solid \${c.border}"><div style="display:flex;align-items:center;gap:7px;margin-bottom:5px"><strong style="color:\${c.text};font-size:13px">\${item.k}</strong><span class="badge" style="background:\${c.bg};border-color:\${c.border};color:\${c.text}">\${c.label}</span><span class="pbadge" style="border-color:\${PCOLOR[item.p]};color:\${PCOLOR[item.p]}">\${PLABEL[item.p]}</span>\${item.kcd?\`<span style="font-size:10px;color:\${c.text};opacity:.7">KCD: \${item.kcd}</span>\`:''}</div>\${item.a?.length?\`<div style="font-size:10px;color:\${c.text};opacity:.8;margin-bottom:4px">동의어: \${item.a.join(', ')}</div>\`:''}<div style="font-size:12px;color:\${c.text}">\${item.d}</div></div>\`;
  d.style.display='block';
}
function renderTable(){
  const filtered=found.filter(f=>(fSev==='all'||f.s===fSev)&&(fCat==='all'||f.c===fCat));
  document.getElementById('tblBody').innerHTML=filtered.map(item=>{const c=SEV[item.s];return\`<tr style="\${selKw===item.k?'background:#F0F4FF':''}cursor:pointer" onclick="selKwFn('\${item.k}')"><td style="font-weight:600">\${item.k}\${item.matched!==item.k?\`<div style="font-size:9px;color:#94a3b8">\${item.matched}</div>\`:''}</td><td style="color:#64748b;font-size:11px">\${item.c}</td><td><span class="badge" style="background:\${c.bg};border-color:\${c.border};color:\${c.text}">\${c.label}</span></td><td><span class="pbadge" style="border-color:\${PCOLOR[item.p]};color:\${PCOLOR[item.p]}">\${PLABEL[item.p]}</span></td><td style="color:#94a3b8;font-size:10px">\${item.kcd||'-'}</td><td style="color:#475569;font-size:11px">\${item.d}</td></tr>\`;}).join('');
  document.getElementById('tblLabel').textContent='📋 발견 항목 상세 ('+filtered.length+'/'+found.length+'건)';
}
function renderHist(){
  const list=document.getElementById('histList');
  if(!hist.length){list.innerHTML='<div style="padding:24px;text-align:center;color:#94a3b8;font-size:13px">아직 심사 이력이 없습니다</div>';return;}
  list.innerHTML=hist.map((h,i)=>\`<div class="hist-item" onclick="loadHist(\${i})"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:12px;font-weight:600">\${h.pname||'고객'} · \${h.count}건</span><span style="font-size:10px;color:#94a3b8">\${h.time}</span></div><div style="font-size:11px;color:#94a3b8;margin-bottom:4px">\${h.preview}</div><div style="display:flex;gap:4px">\${h.critC>0?\`<span style="background:#F3E8FF;color:#6B21A8;border-radius:20px;padding:1px 7px;font-size:9px;font-weight:700">필수 \${h.critC}</span>\`:''}<span style="background:#FEE2E2;color:#991B1B;border-radius:20px;padding:1px 7px;font-size:9px;font-weight:700">고 \${h.highC}</span></div></div>\`).join('');
}
function loadHist(i){const h=hist[i];document.getElementById('inputTxt').value=h.text;document.getElementById('pname').value=h.pname||'';found=h.found;txt=h.text;renderResults(h.found,h.text,h.ai);toggleHist();}

async function doAnalyze(){
  const text=document.getElementById('inputTxt').value.trim();if(!text)return;
  txt=text;found=findMatches(text);selKw=null;fSev='all';fCat='all';
  renderResults(found,text,'분석 중...');
  const pname=document.getElementById('pname').value||'고객';
  const crit=found.filter(f=>f.s==='critical');
  const prompt='당신은 보험심사평가사입니다. 금감원 표준약관 2024 기준으로 분석해 주세요.\n피심사자: '+pname+'\n발견 필수고지: '+(crit.map(f=>f.k).join(', ')||'없음')+'\n전체: '+(found.map(f=>f.k).join(', ')||'없음')+'\n병력:\n'+text+'\n\n형식:\n【종합 위험 평가】(2~3문장)\n【보험 유형별 영향】\n• 생명보험:\n• 실손보험:\n• 암보험:\n• 치매보험:\n• 간편보험(333) 가입 여부:\n【핵심 심사 포인트】(3~5가지, 고지기간 명시)\n【심사관 권고사항】(1~3가지)\n전문적이고 간결한 한국어로.';
  try{
    const resp=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1000,messages:[{role:'user',content:prompt}]})});
    const data=await resp.json();
    const ai=data.content?.map(c=>c.text||'').join('\n')||'분석 실패';
    document.getElementById('aiBox').textContent=ai;
    const ts=new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    hist.unshift({pname,text,found,ai,count:found.length,critC:found.filter(f=>f.s==='critical').length,highC:found.filter(f=>f.s==='high').length,preview:text.slice(0,50)+'…',time:ts});
    if(hist.length>15)hist.pop();
    renderHist();
  }catch(e){document.getElementById('aiBox').textContent='AI 오류: '+e.message;}
}

function renderResults(matches,text,ai){
  const critC=matches.filter(f=>f.s==='critical').length;
  const highC=matches.filter(f=>f.s==='high').length;
  const medC=matches.filter(f=>f.s==='medium').length;
  const lowC=matches.filter(f=>f.s==='low').length;
  const total=matches.length;
  const rLabel=critC>0?'최고위험':highC>=3?'매우 높음':highC>=1?'높음':medC>=3?'보통':'낮음';
  const rColor=critC>0?'#A855F7':highC>=3?'#EF4444':highC>=1?'#F97316':medC>=1?'#F59E0B':'#10B981';
  document.getElementById('emptyState').style.display='none';
  document.getElementById('results').style.display='block';
  document.getElementById('reportBtn').style.display='inline-block';
  const banner=document.getElementById('riskBanner');
  banner.style.borderColor=rColor;banner.style.boxShadow='0 0 0 3px '+rColor+'22';banner.style.background=rColor+'0D';
  document.getElementById('riskVal').textContent=rLabel;document.getElementById('riskVal').style.color=rColor;
  document.getElementById('riskSub').textContent='총 '+total+'건 · 필수 '+critC+' / 고위험 '+highC+' / 중위험 '+medC+' / 저위험 '+lowC;
  document.getElementById('countGrid').innerHTML=[{label:'필수고지',count:critC,key:'critical'},{label:'고위험',count:highC,key:'high'},{label:'중위험',count:medC,key:'medium'},{label:'저위험',count:lowC,key:'low'}].map(it=>{const c=SEV[it.key];return'<div class="scard" onclick="tSev(\''+it.key+'\')"><div style="display:flex;align-items:center;gap:5px;margin-bottom:3px"><span style="width:7px;height:7px;border-radius:50%;background:'+c.dot+';display:inline-block"></span><span style="font-size:10px;color:#64748b">'+it.label+'</span></div><div style="font-size:19px;font-weight:700;color:'+c.text+'">'+it.count+'</div></div>';}).join('');
  const cats=[...new Set(matches.map(f=>f.c))];
  document.getElementById('catTags').innerHTML=cats.map(cat=>{const items=matches.filter(f=>f.c===cat);const top=items.some(f=>f.s==='critical')?'critical':items.some(f=>f.s==='high')?'high':items.some(f=>f.s==='medium')?'medium':'low';const c=SEV[top];return'<span class="cat-tag" style="background:'+c.bg+';border-color:'+c.border+';color:'+c.text+'" onclick="tCat(\''+cat+'\')">'+cat+' '+items.length+'</span>';}).join('');
  document.getElementById('hlBox').innerHTML=hl(text,matches);
  document.getElementById('kwDetail').style.display='none';
  document.getElementById('aiBox').textContent=ai;
  document.getElementById('sevFilters').innerHTML=['all','critical','high','medium','low'].map(s=>'<button class="fil-btn'+(fSev===s?' on':'')+'" onclick="setSev(\''+s+'\')">'+( s==='all'?'전체':SEV[s].label)+'</button>').join('');
  renderTable();
}
function tSev(key){fSev=fSev===key?'all':key;renderTable();}
function setSev(s){fSev=s;document.querySelectorAll('.fil-btn').forEach((b,i)=>{b.classList.toggle('on',['all','critical','high','medium','low'][i]===s);});renderTable();}
function tCat(cat){fCat=fCat===cat?'all':cat;renderTable();}

function doReport(){
  const pname=document.getElementById('pname').value||'고객';
  const ts=new Date().toLocaleString('ko-KR');
  const aiTxt=document.getElementById('aiBox').textContent;
  const critC=found.filter(f=>f.s==='critical').length,highC=found.filter(f=>f.s==='high').length,medC=found.filter(f=>f.s==='medium').length,lowC=found.filter(f=>f.s==='low').length;
  const rLabel=critC>0?'최고위험':highC>=3?'매우 높음':highC>=1?'높음':medC>=3?'보통':'낮음';
  const rColor=critC>0?'#A855F7':highC>=3?'#EF4444':highC>=1?'#F97316':medC>=1?'#F59E0B':'#10B981';
  const sevGroups=[{items:found.filter(f=>f.s==='critical'),c:SEV.critical,label:'🟣 필수고지 (10대질병)'},{items:found.filter(f=>f.s==='high'),c:SEV.high,label:'🔴 고위험'},{items:found.filter(f=>f.s==='medium'),c:SEV.medium,label:'🟡 중위험'},{items:found.filter(f=>f.s==='low'),c:SEV.low,label:'🔵 저위험'}].filter(g=>g.items.length>0);
  const cols=sevGroups.length<=2?'1fr '.repeat(sevGroups.length).trim():'1fr 1fr';
  const html='<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>보험심사평가 리포트</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:\'Apple SD Gothic Neo\',\'Malgun Gothic\',sans-serif;background:#f0f4f8;font-size:13px}@media print{body{background:white}.no-print{display:none}@page{margin:10mm 15mm}}</style></head><body><div style="max-width:880px;margin:0 auto;padding:20px"><div style="background:white;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1);margin-bottom:16px"><div style="padding:17px 26px 13px;border-bottom:3px solid #1B2A4A;display:flex;align-items:center;justify-content:space-between"><div style="display:flex;align-items:center;gap:15px"><img src="'+LOGO_SRC+'" style="height:38px;object-fit:contain" alt="AFG"><div style="width:1px;height:36px;background:#e2e8f0"></div><div><div style="font-size:17px;font-weight:700;color:#1B2A4A">보험심사평가</div><div style="font-size:11px;color:#64748b;margin-top:1px">고지의무 위반 종합 분석 리포트 · 금감원 2024</div></div></div><div style="text-align:right"><div style="font-size:10px;color:#94a3b8">심사일시</div><div style="font-size:12px;font-weight:700">'+ts+'</div><div style="margin-top:4px;display:inline-block;background:#1B2A4A;color:white;font-size:9px;padding:2px 8px;border-radius:4px">보험심사평가사 작성</div></div></div><div style="background:#fefce8;padding:8px 26px;border-bottom:1px solid #fde68a;font-size:10px;color:#92400e">⚠️ 3개월: 진단·치료·투약 / 1년: 추가검사 / 5년: 7일이상치료·30일이상투약·수술·입원 / 10대질병: 항상</div><div style="padding:16px 26px;display:flex;gap:13px;border-bottom:1px solid #f1f5f9"><div style="flex:1;background:#f8fafc;border-radius:10px;padding:13px 16px;border:1px solid #e2e8f0"><div style="font-size:10px;color:#64748b;margin-bottom:4px">피심사자</div><div style="font-size:20px;font-weight:700;color:#0f172a">'+pname+' 님</div><div style="margin-top:7px;font-size:11px;color:#64748b">총 <strong>'+found.length+'건</strong> (필수 '+critC+' / 고 '+highC+' / 중 '+medC+' / 저 '+lowC+')</div></div><div style="flex:1;background:#f8fafc;border-radius:10px;padding:13px 16px;border:2px solid '+rColor+';text-align:center"><div style="font-size:10px;color:#64748b;margin-bottom:4px">종합 위반 위험도</div><div style="font-size:26px;font-weight:700;color:'+rColor+'">'+rLabel+'</div></div></div><div style="padding:13px 26px;border-bottom:1px solid #f1f5f9"><div style="font-size:12px;font-weight:700;margin-bottom:11px">[ 보험 고지의무 해당 항목 ]</div><div style="display:grid;grid-template-columns:'+cols+';gap:9px">'+sevGroups.map(g=>'<div style="background:'+g.c.bg+';border:1.5px solid '+g.c.border+';border-radius:9px;padding:11px"><div style="font-size:10px;font-weight:700;color:'+g.c.text+';margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid '+g.c.border+'">'+g.label+' ('+g.items.length+'건)</div>'+g.items.map(f=>'<div style="margin-bottom:5px;line-height:1.5"><strong style="font-size:11px;color:'+g.c.text+'">• '+f.k+'</strong>'+(f.matched!==f.k?'<span style="font-size:9px;color:'+g.c.text+';opacity:.7"> ('+f.matched+')</span>':'')+'<br><span style="font-size:10px;color:'+g.c.text+';opacity:.8">'+f.d+'</span></div>').join('')+'</div>').join('')+'</div></div>'+(aiTxt&&aiTxt!=='분석 중...'?'<div style="padding:13px 26px;border-bottom:1px solid #f1f5f9"><div style="font-size:12px;font-weight:700;margin-bottom:7px">AI 통합 심사 의견</div><div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:9px;padding:11px 14px;font-size:12px;line-height:1.9;white-space:pre-wrap">'+aiTxt+'</div></div>':'')+'<div style="padding:13px 26px;border-bottom:1px solid #f1f5f9"><div style="font-size:12px;font-weight:700;margin-bottom:9px">발견 항목 상세</div><table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr style="background:#f8fafc"><th style="padding:6px 9px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">항목</th><th style="padding:6px 9px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">분류</th><th style="padding:6px 9px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">위험도</th><th style="padding:6px 9px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">고지기간</th><th style="padding:6px 9px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">KCD</th><th style="padding:6px 9px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">심사 포인트</th></tr></thead><tbody>'+found.map(f=>'<tr><td style="padding:6px 9px;font-weight:700;border-bottom:1px solid #f1f5f9">'+f.k+(f.matched!==f.k?'<div style="font-size:9px;color:#94a3b8">'+f.matched+'</div>':'')+'</td><td style="padding:6px 9px;color:#64748b;border-bottom:1px solid #f1f5f9">'+f.c+'</td><td style="padding:6px 9px;border-bottom:1px solid #f1f5f9"><span style="background:'+SEV[f.s].bg+';color:'+SEV[f.s].text+';border:1px solid '+SEV[f.s].border+';border-radius:20px;padding:1px 7px;font-size:9px;font-weight:700">'+SEV[f.s].label+'</span></td><td style="padding:6px 9px;border-bottom:1px solid #f1f5f9"><span style="border:1px solid '+PCOLOR[f.p]+';color:'+PCOLOR[f.p]+';border-radius:10px;padding:0 5px;font-size:9px;font-weight:700">'+PLABEL[f.p]+'</span></td><td style="padding:6px 9px;color:#94a3b8;border-bottom:1px solid #f1f5f9;font-size:10px">'+(f.kcd||'-')+'</td><td style="padding:6px 9px;color:#475569;border-bottom:1px solid #f1f5f9">'+f.d+'</td></tr>').join('')+'</tbody></table></div><div style="padding:11px 26px;background:#f8fafc;display:flex;align-items:center;justify-content:space-between"><span style="font-size:10px;color:#94a3b8">AFG Authentic · 금감원 2024 · HIRA KCD</span><span style="font-size:10px;color:#94a3b8">'+ts+'</span></div></div><div class="no-print" style="text-align:center;padding-bottom:18px"><button onclick="window.print()" style="padding:10px 28px;background:#1B2A4A;color:white;border:none;border-radius:9px;font-size:13px;cursor:pointer;margin-right:7px">🖨️ 인쇄 / PDF 저장</button><button onclick="window.close()" style="padding:10px 16px;background:transparent;color:#64748b;border:1px solid #e2e8f0;border-radius:9px;font-size:13px;cursor:pointer">닫기</button></div></div></body></html>';
  const w=window.open('','_blank');if(!w){alert('팝업 차단됨. 허용 후 재시도.');return;}
  w.document.write(html);w.document.close();
}
</script>
</body>
</html>`;

module.exports = { makeToken, verifyToken, getCookie, isAuthed, LOGIN_HTML, MAIN_HTML, PW, TTL };
