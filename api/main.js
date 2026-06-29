const { isAuthed } = require('./_auth');

const HTML = `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AFG 보험심사평가</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background:#F0F4F8;color:#1E293B;min-height:100vh}
.hdr{background:white;border-bottom:3px solid #1B2A4A;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px;box-shadow:0 2px 8px rgba(0,0,0,.07);position:sticky;top:0;z-index:50}
.logo{display:flex;align-items:center;gap:14px}
.ldiv{width:1px;height:38px;background:#E2E8F0}
.lmain{font-size:15px;font-weight:700;color:#1B2A4A}
.lsub{font-size:10px;color:#94a3b8;margin-top:1px}
.hbtn{padding:6px 12px;border-radius:8px;border:1px solid #E2E8F0;background:transparent;color:#64748b;font-size:12px;cursor:pointer;font-family:inherit}
.wrap{max-width:960px;margin:0 auto;padding:18px 16px}
.notice{background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:9px 14px;font-size:11px;color:#92400E;margin-bottom:13px;line-height:1.7}
.card{background:white;border-radius:13px;border:1px solid #E2E8F0;overflow:hidden;margin-bottom:11px;box-shadow:0 1px 4px rgba(0,0,0,.05)}
.cbody{padding:15px 17px}
.tabs{display:flex;border-bottom:1px solid #E2E8F0}
.tab{padding:10px 17px;border:none;background:transparent;color:#64748b;font-size:12px;cursor:pointer;border-bottom:2px solid transparent;font-family:inherit}
.tab.on{color:#1B2A4A;border-bottom-color:#1B2A4A;font-weight:700;background:#EEF6FF}
.row{display:flex;gap:7px;margin-bottom:9px;align-items:center;flex-wrap:wrap}
input[type=text]{padding:8px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:12px;font-family:inherit;outline:none;background:#F8FAFC;color:#1E293B}
input[type=text]:focus{border-color:#1B2A4A}
textarea{width:100%;padding:10px 12px;border:1.5px solid #E2E8F0;border-radius:9px;font-size:12px;font-family:inherit;resize:vertical;min-height:110px;outline:none;background:#F8FAFC;color:#1E293B;line-height:1.8}
textarea:focus{border-color:#1B2A4A}
.bmain{padding:9px 16px;background:#1B2A4A;color:white;border:none;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap}
.bmain:disabled{background:#CBD5E1;cursor:not-allowed}
.bsec{padding:9px 12px;background:transparent;border:1px solid #E2E8F0;color:#64748b;border-radius:9px;font-size:11px;cursor:pointer;font-family:inherit}
.upzone{border:2px dashed #E2E8F0;border-radius:9px;padding:26px 18px;text-align:center;cursor:pointer;background:#F8FAFC}
.upzone:hover{border-color:#1B2A4A}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:11px 0}
.sc{background:white;border:1px solid #E2E8F0;border-radius:9px;padding:10px 12px;cursor:pointer}
.sc.on{border-color:#6366F1}
.rbanner{border-radius:11px;padding:12px 16px;margin-bottom:11px;display:flex;align-items:center;justify-content:space-between;border-width:2px;border-style:solid}
.hlbox{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:9px;padding:12px 14px;font-size:12px;line-height:2.1;white-space:pre-wrap;max-height:190px;overflow-y:auto;margin-bottom:9px}
.aibox{background:#F0F4FF;border:1px solid #C7D2FE;border-radius:9px;padding:12px 14px;font-size:12px;line-height:1.85;white-space:pre-wrap}
.cats{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:9px}
.ctag{padding:3px 9px;border-radius:20px;font-size:10px;font-weight:600;cursor:pointer;border:1px solid}
.tbl{width:100%;border-collapse:collapse;font-size:11px}
.tbl th{padding:6px 9px;text-align:left;color:#64748b;font-weight:600;border-bottom:1px solid #E2E8F0;font-size:10px;white-space:nowrap;background:#F8FAFC}
.tbl td{padding:6px 9px;border-bottom:1px solid #F1F5F9;vertical-align:top}
.tbl tr:hover td{background:#F8FAFC}
.bdg{display:inline-block;padding:1px 7px;border-radius:20px;font-size:10px;font-weight:700;border:1px solid;white-space:nowrap}
.pbdg{display:inline-block;padding:0px 6px;border-radius:10px;font-size:9px;font-weight:700;border:1px solid;white-space:nowrap}
.kwd{margin:6px 0 9px;border-radius:9px;padding:9px 12px;font-size:11px}
.sh{font-size:11px;font-weight:700;color:#475569;margin-bottom:7px}
.fbrow{display:flex;gap:4px;margin-bottom:7px;flex-wrap:wrap}
.fb{padding:2px 8px;border-radius:20px;border:1px solid #E2E8F0;background:transparent;color:#64748b;font-size:10px;cursor:pointer;font-family:inherit;font-weight:600}
.fb.on{background:#1B2A4A;border-color:#1B2A4A;color:white}
.empty{text-align:center;padding:44px 18px;color:#94a3b8}
.pwm{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;display:flex;align-items:center;justify-content:center}
.pwc{background:white;border-radius:15px;padding:28px;width:290px;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.2)}
.hpanel{position:fixed;top:64px;right:0;width:280px;height:calc(100vh - 64px);background:white;border-left:1px solid #E2E8F0;z-index:40;overflow-y:auto;box-shadow:-4px 0 16px rgba(0,0,0,.07);transform:translateX(100%);transition:transform .2s}
.hpanel.open{transform:translateX(0)}
.hitem{padding:11px 14px;border-bottom:1px solid #F1F5F9;cursor:pointer;font-size:12px}
.hitem:hover{background:#F8FAFC}
@media(max-width:600px){.g4{grid-template-columns:repeat(2,1fr)}.hdr{padding:0 12px}.wrap{padding:12px 10px}}
</style></head><body>

<div class="hdr">
  <div class="logo">
    <svg width="76" height="24" viewBox="0 0 180 50">
      <g transform="translate(2,2)">
        <g opacity=".25"><polygon points="18,0 28,8 18,16 8,8" fill="#1B2A4A"/><polygon points="28,0 38,8 28,16 18,8" fill="#1B2A4A"/><polygon points="8,0 18,8 8,16 -2,8" fill="#1B2A4A"/></g>
        <g opacity=".55"><polygon points="14,16 24,24 14,32 4,24" fill="#1B2A4A"/><polygon points="24,16 34,24 24,32 14,24" fill="#1B2A4A"/></g>
        <g opacity="1"><polygon points="18,32 28,40 18,48 8,40" fill="#1B2A4A"/></g>
        <g opacity=".4"><polygon points="4,8 14,16 4,24" fill="#1B2A4A"/><polygon points="32,8 42,16 32,24" fill="#1B2A4A"/></g>
      </g>
      <text x="54" y="36" font-family="Arial Black,Arial" font-weight="900" font-size="32" fill="#1B2A4A">AFG</text>
      <line x1="124" y1="8" x2="124" y2="44" stroke="#ccc" stroke-width="1"/>
      <text x="130" y="20" font-family="Arial" font-weight="700" font-size="9" fill="#1B2A4A" letter-spacing="2">AUTHENTIC</text>
      <text x="130" y="33" font-family="Arial" font-size="9" fill="#1B2A4A" letter-spacing="2">FINANCIAL</text>
      <text x="130" y="46" font-family="Arial" font-size="9" fill="#1B2A4A" letter-spacing="2">GROUP</text>
    </svg>
    <div class="ldiv"></div>
    <div><div class="lmain">보험심사평가</div><div class="lsub">금감원 2024 · HIRA KCD · 160개 항목</div></div>
  </div>
  <div style="display:flex;gap:6px">
    <button class="hbtn" onclick="toggleH()">🗂 히스토리</button>
    <button class="hbtn" onclick="location.href='/logout'">로그아웃</button>
  </div>
</div>

<div class="hpanel" id="hp">
  <div style="padding:12px 14px;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center">
    <span style="font-weight:700;font-size:13px">심사 히스토리</span>
    <button onclick="toggleH()" style="background:transparent;border:none;font-size:16px;cursor:pointer;color:#94a3b8">✕</button>
  </div>
  <div id="hl"><div style="padding:22px;text-align:center;color:#94a3b8;font-size:12px">아직 심사 이력이 없습니다</div></div>
</div>

<div class="wrap">
  <div class="notice">
    <strong>금감원 고지기간 기준</strong> &nbsp;|&nbsp;
    <span style="background:#D1FAE5;color:#065F46;padding:1px 6px;border-radius:6px">3개월: 진단·치료·투약</span>&nbsp;
    <span style="background:#DBEAFE;color:#1E40AF;padding:1px 6px;border-radius:6px">1년: 추가검사</span>&nbsp;
    <span style="background:#FEF3C7;color:#92400E;padding:1px 6px;border-radius:6px">5년: 7일이상치료·30일이상투약·수술·입원</span>&nbsp;
    <span style="background:#FEE2E2;color:#991B1B;padding:1px 6px;border-radius:6px">항상: 10대질병·암·에이즈</span>
  </div>

  <div class="card">
    <div class="tabs">
      <button class="tab on" onclick="sTab('text',this)">📝 직접 입력</button>
      <button class="tab" onclick="sTab('file',this)">📁 파일 업로드 (TXT/PDF · 🔒비밀번호 지원)</button>
    </div>
    <div class="cbody">
      <div class="row">
        <input type="text" id="pname" placeholder="피심사자 성명 (선택)" style="max-width:160px">
        <button class="bmain" id="aBtn" onclick="doAnalyze()" disabled>⚖️ 고지의무 통합 분석</button>
        <button class="bsec" onclick="doReset()">초기화</button>
        <button class="bsec" id="rBtn" style="display:none" onclick="doReport()">📄 리포트</button>
      </div>
      <div id="tPane"><textarea id="itxt" placeholder="병력 정보를 입력하세요.&#10;예) 2019년 고혈압 진단, 발살탄 투약 / 2021년 2형당뇨 / 2023년 위선암 내시경절제술&#10;추간판탈출증 요추, 우울증 에스시탈로프람 투약, 갑상선결절 TI-RADS 4..." oninput="chkBtn()"></textarea></div>
      <div id="fPane" style="display:none">
        <div class="upzone" onclick="document.getElementById('fi').click()">
          <div style="font-size:24px;margin-bottom:5px">📁</div>
          <div id="flbl" style="font-size:12px;font-weight:600;color:#475569">클릭하여 파일 업로드</div>
          <div style="font-size:10px;color:#94a3b8;margin-top:2px">TXT · PDF (🔒 비밀번호 PDF 포함)</div>
        </div>
        <input type="file" id="fi" accept=".txt,.pdf" style="display:none" onchange="hFile(event)">
      </div>
    </div>
  </div>

  <div class="pwm" id="pwm" style="display:none">
    <div class="pwc">
      <div style="font-size:28px;margin-bottom:8px">🔒</div>
      <div style="font-weight:700;font-size:14px;margin-bottom:4px">PDF 비밀번호 입력</div>
      <div id="pwfn" style="font-size:10px;color:#94a3b8;margin-bottom:13px"></div>
      <input type="password" id="pwi" placeholder="비밀번호" style="width:100%;padding:8px 12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:13px;font-family:inherit;outline:none;margin-bottom:8px" onkeydown="if(event.key==='Enter')cPw()">
      <div style="display:flex;gap:6px">
        <button class="bmain" style="flex:1" onclick="cPw()">확인</button>
        <button class="bsec" style="flex:1" onclick="xPw()">취소</button>
      </div>
    </div>
  </div>

  <div id="res" style="display:none">
    <div class="rbanner" id="rb">
      <div>
        <div style="font-size:10px;color:#64748b;margin-bottom:2px">전체 보험 통합 위반 위험도</div>
        <div style="font-size:20px;font-weight:700" id="rv">—</div>
        <div style="font-size:10px;color:#64748b;margin-top:1px" id="rs"></div>
      </div>
      <button class="bmain" onclick="doReport()">📄 AFG 리포트</button>
    </div>
    <div class="g4" id="cg"></div>
    <div class="cats" id="ct"></div>
    <div class="card"><div class="cbody">
      <div class="sh">🔎 병력 원문 하이라이트 <span style="font-size:9px;color:#94a3b8;font-weight:400">— 항목 클릭 시 상세</span></div>
      <div class="hlbox" id="hlb"></div>
      <div id="kwd" style="display:none"></div>
      <div style="display:flex;gap:9px;margin-top:4px;flex-wrap:wrap">
        <span style="font-size:9px;color:#94a3b8;display:flex;align-items:center;gap:3px"><span style="width:6px;height:6px;border-radius:50%;background:#A855F7;display:inline-block"></span>필수고지</span>
        <span style="font-size:9px;color:#94a3b8;display:flex;align-items:center;gap:3px"><span style="width:6px;height:6px;border-radius:50%;background:#EF4444;display:inline-block"></span>고위험</span>
        <span style="font-size:9px;color:#94a3b8;display:flex;align-items:center;gap:3px"><span style="width:6px;height:6px;border-radius:50%;background:#F59E0B;display:inline-block"></span>중위험</span>
        <span style="font-size:9px;color:#94a3b8;display:flex;align-items:center;gap:3px"><span style="width:6px;height:6px;border-radius:50%;background:#3B82F6;display:inline-block"></span>저위험</span>
      </div>
    </div></div>
    <div class="card"><div class="cbody">
      <div class="sh">🤖 AI 통합 심사 의견</div>
      <div class="aibox" id="aib">분석 중...</div>
    </div></div>
    <div class="card"><div class="cbody">
      <div class="sh" id="tl">📋 발견 항목 상세</div>
      <div class="fbrow" id="sfr"></div>
      <div style="overflow-x:auto"><table class="tbl">
        <thead><tr><th>항목</th><th>분류</th><th>위험도</th><th>고지기간</th><th>KCD</th><th>심사 포인트</th></tr></thead>
        <tbody id="tb"></tbody>
      </table></div>
    </div></div>
  </div>

  <div class="empty" id="emp">
    <div style="font-size:36px;margin-bottom:11px">⚖️</div>
    <div style="font-size:13px;font-weight:600;color:#475569;margin-bottom:3px">병력 정보를 입력하고 분석을 시작하세요</div>
    <div style="font-size:10px">금감원 2024 · HIRA KCD · 160개 항목 · alias 400개+ 완전 매칭</div>
  </div>
</div>

<script>
const S={critical:{l:'필수고지',bg:'#F3E8FF',b:'#A855F7',t:'#6B21A8',d:'#A855F7'},high:{l:'고위험',bg:'#FEE2E2',b:'#EF4444',t:'#991B1B',d:'#EF4444'},medium:{l:'중위험',bg:'#FEF3C7',b:'#F59E0B',t:'#92400E',d:'#F59E0B'},low:{l:'저위험',bg:'#DBEAFE',b:'#3B82F6',t:'#1E40AF',d:'#3B82F6'}};
const PL={M3:'3개월',Y1:'1년',Y5:'5년',ALWAYS:'항상'};
const PC={M3:'#10B981',Y1:'#3B82F6',Y5:'#F59E0B',ALWAYS:'#EF4444'};
const DB=[
  {k:'암',a:['악성종양','악성신생물','암종'],c:'10대필수',s:'critical',p:'ALWAYS',kcd:'C00-C97',d:'모든 암 — 10대 필수. 부위·병기·치료 완료 여부 확인'},
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
  {k:'간질',a:['뇌전증','경련','경련발작'],c:'뇌·신경계',s:'high',p:'Y5',kcd:'G40-G41',d:'발작 빈도·현재 투약 확인'},
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

let F=[],T='',sk=null,fs='all',fc='all',H=[],pf=null,ho=false;

function sTab(t,el){document.querySelectorAll('.tab').forEach(b=>b.classList.remove('on'));el.classList.add('on');document.getElementById('tPane').style.display=t==='text'?'block':'none';document.getElementById('fPane').style.display=t==='file'?'block':'none';}
function chkBtn(){document.getElementById('aBtn').disabled=!document.getElementById('itxt').value.trim();}
function toggleH(){ho=!ho;document.getElementById('hp').classList.toggle('open',ho);}
function doReset(){document.getElementById('itxt').value='';document.getElementById('pname').value='';document.getElementById('flbl').textContent='클릭하여 파일 업로드';document.getElementById('res').style.display='none';document.getElementById('emp').style.display='block';document.getElementById('rBtn').style.display='none';document.getElementById('aBtn').disabled=true;F=[];T='';sk=null;}
async function hFile(e){const f=e.target.files[0];if(!f)return;document.getElementById('flbl').textContent=f.name;if(f.name.toLowerCase().endsWith('.pdf')){await pPdf(f,'');}else{document.getElementById('itxt').value=await f.text();chkBtn();}e.target.value='';}
async function pPdf(file,pw){
  try{if(!window.pdfjsLib)throw new Error('로딩중');window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const p={data:await file.arrayBuffer()};if(pw)p.password=pw;const pdf=await window.pdfjsLib.getDocument(p).promise;
  let o='';for(let i=1;i<=pdf.numPages;i++){const pg=await pdf.getPage(i);const ct=await pg.getTextContent();o+=ct.items.map(it=>it.str).join(' ')+'\n';}
  document.getElementById('itxt').value=o;document.getElementById('pwm').style.display='none';pf=null;chkBtn();
  }catch(e){const m=e.message||'';if(m.toLowerCase().includes('password')||m.toLowerCase().includes('encrypted')){pf=file;document.getElementById('pwfn').textContent=file.name;document.getElementById('pwm').style.display='flex';document.getElementById('pwi').value='';setTimeout(()=>document.getElementById('pwi').focus(),100);}else{alert('PDF 오류: '+m);}}}
function cPw(){if(pf)pPdf(pf,document.getElementById('pwi').value);}
function xPw(){document.getElementById('pwm').style.display='none';pf=null;}
function fm(text){const r=new Map();DB.forEach(kw=>{const ts=[kw.k,...(kw.a||[])];for(const t of ts){if(text.includes(t)){if(!r.has(kw.k))r.set(kw.k,{...kw,m:t});break;}}});return[...r.values()];}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function hlTxt(text,matches){const pos=[];matches.forEach(m=>{const t=m.m||m.k;let i=0;while(true){const f=text.indexOf(t,i);if(f===-1)break;pos.push({s:f,e:f+t.length,k:m.k,a:t,sv:m.s});i=f+1;}});pos.sort((a,b)=>a.s-b.s);let o='',c=0;pos.forEach(({s,e,k,a,sv})=>{if(s<c)return;if(s>c)o+=esc(text.slice(c,s));const cf=S[sv];o+=`<mark style="background:${cf.bg};border:1.5px solid ${cf.b};border-radius:4px;padding:1px 4px;color:${cf.t};font-weight:600;cursor:pointer" onclick="selK('${k}')">${esc(a)}</mark>`;c=e;});if(c<text.length)o+=esc(text.slice(c));return o;}
function selK(k){sk=sk===k?null:k;rdDet();rdTbl();}
function rdDet(){const d=document.getElementById('kwd');if(!sk){d.style.display='none';return;}const item=DB.find(x=>x.k===sk);if(!item){d.style.display='none';return;}const c=S[item.s];d.innerHTML=`<div class="kwd" style="background:${c.bg};border:1.5px solid ${c.b}"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><strong style="color:${c.t};font-size:12px">${item.k}</strong><span class="bdg" style="background:${c.bg};border-color:${c.b};color:${c.t}">${c.l}</span><span class="pbdg" style="border-color:${PC[item.p]};color:${PC[item.p]}">${PL[item.p]}</span>${item.kcd?`<span style="font-size:9px;color:${c.t};opacity:.7">KCD:${item.kcd}</span>`:''}</div>${item.a?.length?`<div style="font-size:10px;color:${c.t};opacity:.8;margin-bottom:3px">동의어: ${item.a.join(', ')}</div>`:''}<div style="font-size:11px;color:${c.t}">${item.d}</div></div>`;d.style.display='block';}
function rdTbl(){const filtered=F.filter(f=>(fs==='all'||f.s===fs)&&(fc==='all'||f.c===fc));document.getElementById('tb').innerHTML=filtered.map(item=>{const c=S[item.s];return`<tr style="${sk===item.k?'background:#F0F4FF':''}cursor:pointer" onclick="selK('${item.k}')"><td style="font-weight:600">${item.k}${item.m!==item.k?`<div style="font-size:9px;color:#94a3b8">${item.m}</div>`:''}</td><td style="color:#64748b;font-size:10px">${item.c}</td><td><span class="bdg" style="background:${c.bg};border-color:${c.b};color:${c.t}">${c.l}</span></td><td><span class="pbdg" style="border-color:${PC[item.p]};color:${PC[item.p]}">${PL[item.p]}</span></td><td style="color:#94a3b8;font-size:9px">${item.kcd||'-'}</td><td style="color:#475569;font-size:10px">${item.d}</td></tr>`;}).join('');document.getElementById('tl').textContent='📋 발견 항목 상세 ('+filtered.length+'/'+F.length+'건)';}
function rdHist(){const list=document.getElementById('hl');if(!H.length){list.innerHTML='<div style="padding:20px;text-align:center;color:#94a3b8;font-size:12px">아직 심사 이력이 없습니다</div>';return;}list.innerHTML=H.map((h,i)=>`<div class="hitem" onclick="ldH(${i})"><div style="display:flex;justify-content:space-between;margin-bottom:2px"><span style="font-weight:600">${h.n||'고객'} · ${h.cnt}건</span><span style="font-size:10px;color:#94a3b8">${h.t}</span></div><div style="color:#94a3b8;margin-bottom:3px">${h.prev}</div><div style="display:flex;gap:3px">${h.cc>0?`<span style="background:#F3E8FF;color:#6B21A8;border-radius:20px;padding:0px 6px;font-size:9px;font-weight:700">필수 ${h.cc}</span>`:''}<span style="background:#FEE2E2;color:#991B1B;border-radius:20px;padding:0px 6px;font-size:9px;font-weight:700">고 ${h.hc}</span></div></div>`).join('');}
function ldH(i){const h=H[i];document.getElementById('itxt').value=h.txt;document.getElementById('pname').value=h.n||'';F=h.f;T=h.txt;render(h.f,h.txt,h.ai);toggleH();}

async function doAnalyze(){
  const text=document.getElementById('itxt').value.trim();if(!text)return;
  T=text;F=fm(text);sk=null;fs='all';fc='all';
  render(F,text,'분석 중...');
  const pn=document.getElementById('pname').value||'고객';
  const cr=F.filter(f=>f.s==='critical');
  const prompt='당신은 보험심사평가사입니다. 금감원 2024 기준으로 분석해 주세요.\n피심사자: '+pn+'\n발견 필수고지: '+(cr.map(f=>f.k).join(', ')||'없음')+'\n전체: '+(F.map(f=>f.k).join(', ')||'없음')+'\n병력:\n'+text+'\n\n형식:\n【종합 위험 평가】(2~3문장)\n【보험 유형별 영향】\n• 생명보험:\n• 실손보험:\n• 암보험:\n• 치매보험:\n• 간편보험(333) 가입 여부:\n【핵심 심사 포인트】(3~5가지, 고지기간 명시)\n【심사관 권고사항】(1~3가지)\n전문적이고 간결한 한국어로.';
  try{const resp=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1000,messages:[{role:'user',content:prompt}]})});const data=await resp.json();const ai=data.content?.map(c=>c.text||'').join('\n')||'분석 실패';document.getElementById('aib').textContent=ai;const ts=new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});H.unshift({n:pn,txt:text,f:F,ai,cnt:F.length,cc:F.filter(f=>f.s==='critical').length,hc:F.filter(f=>f.s==='high').length,prev:text.slice(0,45)+'…',t:ts});if(H.length>15)H.pop();rdHist();}catch(e){document.getElementById('aib').textContent='AI 오류: '+e.message;}
}

function render(matches,text,ai){
  const cc=matches.filter(f=>f.s==='critical').length,hc=matches.filter(f=>f.s==='high').length,mc=matches.filter(f=>f.s==='medium').length,lc=matches.filter(f=>f.s==='low').length,tot=matches.length;
  const rl=cc>0?'최고위험':hc>=3?'매우 높음':hc>=1?'높음':mc>=3?'보통':'낮음';
  const rc=cc>0?'#A855F7':hc>=3?'#EF4444':hc>=1?'#F97316':mc>=1?'#F59E0B':'#10B981';
  document.getElementById('emp').style.display='none';document.getElementById('res').style.display='block';document.getElementById('rBtn').style.display='inline-block';
  const rb=document.getElementById('rb');rb.style.borderColor=rc;rb.style.boxShadow='0 0 0 3px '+rc+'22';rb.style.background=rc+'0D';
  document.getElementById('rv').textContent=rl;document.getElementById('rv').style.color=rc;
  document.getElementById('rs').textContent='총 '+tot+'건 · 필수 '+cc+' / 고위험 '+hc+' / 중위험 '+mc+' / 저위험 '+lc;
  document.getElementById('cg').innerHTML=[{l:'필수고지',n:cc,k:'critical'},{l:'고위험',n:hc,k:'high'},{l:'중위험',n:mc,k:'medium'},{l:'저위험',n:lc,k:'low'}].map(it=>{const c=S[it.k];return'<div class="sc" onclick="tSv(\''+it.k+'\')"><div style="display:flex;align-items:center;gap:4px;margin-bottom:3px"><span style="width:6px;height:6px;border-radius:50%;background:'+c.d+';display:inline-block"></span><span style="font-size:9px;color:#64748b">'+it.l+'</span></div><div style="font-size:18px;font-weight:700;color:'+c.t+'">'+it.n+'</div></div>';}).join('');
  const cats=[...new Set(matches.map(f=>f.c))];
  document.getElementById('ct').innerHTML=cats.map(cat=>{const items=matches.filter(f=>f.c===cat);const top=items.some(f=>f.s==='critical')?'critical':items.some(f=>f.s==='high')?'high':items.some(f=>f.s==='medium')?'medium':'low';const c=S[top];return'<span class="ctag" style="background:'+c.bg+';border-color:'+c.b+';color:'+c.t+'" onclick="tCt(\''+cat+'\')">'+cat+' '+items.length+'</span>';}).join('');
  document.getElementById('hlb').innerHTML=hlTxt(text,matches);
  document.getElementById('kwd').style.display='none';
  document.getElementById('aib').textContent=ai;
  document.getElementById('sfr').innerHTML=['all','critical','high','medium','low'].map(s=>'<button class="fb'+(fs===s?' on':'')+'" onclick="sSv(\''+s+'\')">'+( s==='all'?'전체':S[s].l)+'</button>').join('');
  rdTbl();
}
function tSv(k){fs=fs===k?'all':k;rdTbl();}
function sSv(s){fs=s;document.querySelectorAll('.fb').forEach((b,i)=>{b.classList.toggle('on',['all','critical','high','medium','low'][i]===s);});rdTbl();}
function tCt(c){fc=fc===c?'all':c;rdTbl();}

function doReport(){
  const pn=document.getElementById('pname').value||'고객';
  const ts=new Date().toLocaleString('ko-KR');
  const ai=document.getElementById('aib').textContent;
  const cc=F.filter(f=>f.s==='critical').length,hc=F.filter(f=>f.s==='high').length,mc=F.filter(f=>f.s==='medium').length,lc=F.filter(f=>f.s==='low').length;
  const rl=cc>0?'최고위험':hc>=3?'매우 높음':hc>=1?'높음':mc>=3?'보통':'낮음';
  const rc=cc>0?'#A855F7':hc>=3?'#EF4444':hc>=1?'#F97316':mc>=1?'#F59E0B':'#10B981';
  const LOGO_SVG='<svg width="80" height="26" viewBox="0 0 180 50"><g transform="translate(2,2)"><g opacity=".25"><polygon points="18,0 28,8 18,16 8,8" fill="#1B2A4A"/><polygon points="28,0 38,8 28,16 18,8" fill="#1B2A4A"/><polygon points="8,0 18,8 8,16 -2,8" fill="#1B2A4A"/></g><g opacity=".55"><polygon points="14,16 24,24 14,32 4,24" fill="#1B2A4A"/><polygon points="24,16 34,24 24,32 14,24" fill="#1B2A4A"/></g><g opacity="1"><polygon points="18,32 28,40 18,48 8,40" fill="#1B2A4A"/></g><g opacity=".4"><polygon points="4,8 14,16 4,24" fill="#1B2A4A"/><polygon points="32,8 42,16 32,24" fill="#1B2A4A"/></g></g><text x="54" y="36" font-family="Arial Black,Arial" font-weight="900" font-size="32" fill="#1B2A4A">AFG</text><line x1="124" y1="8" x2="124" y2="44" stroke="#ccc" stroke-width="1"/><text x="130" y="20" font-family="Arial" font-weight="700" font-size="9" fill="#1B2A4A" letter-spacing="2">AUTHENTIC</text><text x="130" y="33" font-family="Arial" font-size="9" fill="#1B2A4A" letter-spacing="2">FINANCIAL</text><text x="130" y="46" font-family="Arial" font-size="9" fill="#1B2A4A" letter-spacing="2">GROUP</text></svg>';
  const sgs=[{items:F.filter(f=>f.s==='critical'),c:S.critical,l:'🟣 필수고지 (10대질병)'},{items:F.filter(f=>f.s==='high'),c:S.high,l:'🔴 고위험'},{items:F.filter(f=>f.s==='medium'),c:S.medium,l:'🟡 중위험'},{items:F.filter(f=>f.s==='low'),c:S.low,l:'🔵 저위험'}].filter(g=>g.items.length>0);
  const cols=sgs.length<=2?'1fr '.repeat(sgs.length).trim():'1fr 1fr';
  const html='<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>보험심사평가 리포트</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:\'Apple SD Gothic Neo\',\'Malgun Gothic\',sans-serif;background:#f0f4f8;font-size:13px}@media print{body{background:white}.np{display:none}@page{margin:10mm 15mm}}</style></head><body><div style="max-width:880px;margin:0 auto;padding:18px"><div style="background:white;border-radius:13px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1);margin-bottom:14px"><div style="padding:16px 24px 12px;border-bottom:3px solid #1B2A4A;display:flex;align-items:center;justify-content:space-between"><div style="display:flex;align-items:center;gap:14px">'+LOGO_SVG+'<div style="width:1px;height:34px;background:#e2e8f0"></div><div><div style="font-size:16px;font-weight:700;color:#1B2A4A">보험심사평가</div><div style="font-size:10px;color:#64748b;margin-top:1px">고지의무 위반 종합 분석 리포트 · 금감원 2024</div></div></div><div style="text-align:right"><div style="font-size:10px;color:#94a3b8">심사일시</div><div style="font-size:11px;font-weight:700">'+ts+'</div><div style="margin-top:4px;display:inline-block;background:#1B2A4A;color:white;font-size:9px;padding:2px 8px;border-radius:4px">보험심사평가사 작성</div></div></div><div style="background:#fefce8;padding:7px 24px;border-bottom:1px solid #fde68a;font-size:10px;color:#92400e">⚠️ 3개월: 진단·치료·투약 / 1년: 추가검사 / 5년: 7일이상치료·30일이상투약·수술·입원 / 10대질병: 항상</div><div style="padding:15px 24px;display:flex;gap:12px;border-bottom:1px solid #f1f5f9"><div style="flex:1;background:#f8fafc;border-radius:9px;padding:12px 15px;border:1px solid #e2e8f0"><div style="font-size:10px;color:#64748b;margin-bottom:3px">피심사자</div><div style="font-size:19px;font-weight:700;color:#0f172a">'+pn+' 님</div><div style="margin-top:6px;font-size:10px;color:#64748b">총 <strong>'+F.length+'건</strong> (필수 '+cc+' / 고 '+hc+' / 중 '+mc+' / 저 '+lc+')</div></div><div style="flex:1;background:#f8fafc;border-radius:9px;padding:12px 15px;border:2px solid '+rc+';text-align:center"><div style="font-size:10px;color:#64748b;margin-bottom:3px">종합 위반 위험도</div><div style="font-size:24px;font-weight:700;color:'+rc+'">'+rl+'</div></div></div><div style="padding:12px 24px;border-bottom:1px solid #f1f5f9"><div style="font-size:11px;font-weight:700;margin-bottom:10px">[ 보험 고지의무 해당 항목 ]</div><div style="display:grid;grid-template-columns:'+cols+';gap:8px">'+sgs.map(g=>'<div style="background:'+g.c.bg+';border:1.5px solid '+g.c.b+';border-radius:8px;padding:10px"><div style="font-size:10px;font-weight:700;color:'+g.c.t+';margin-bottom:7px;padding-bottom:5px;border-bottom:1px solid '+g.c.b+'">'+g.l+' ('+g.items.length+'건)</div>'+g.items.map(f=>'<div style="margin-bottom:5px;line-height:1.5"><strong style="font-size:11px;color:'+g.c.t+'">• '+f.k+'</strong>'+(f.m!==f.k?'<span style="font-size:9px;color:'+g.c.t+';opacity:.7"> ('+f.m+')</span>':'')+'<br><span style="font-size:10px;color:'+g.c.t+';opacity:.8">'+f.d+'</span></div>').join('')+'</div>').join('')+'</div></div>'+(ai&&ai!=='분석 중...'?'<div style="padding:12px 24px;border-bottom:1px solid #f1f5f9"><div style="font-size:11px;font-weight:700;margin-bottom:7px">AI 통합 심사 의견</div><div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:8px;padding:10px 13px;font-size:11px;line-height:1.85;white-space:pre-wrap">'+ai+'</div></div>':'')+'<div style="padding:12px 24px;border-bottom:1px solid #f1f5f9"><div style="font-size:11px;font-weight:700;margin-bottom:8px">발견 항목 상세</div><table style="width:100%;border-collapse:collapse;font-size:10px"><thead><tr style="background:#f8fafc"><th style="padding:5px 8px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">항목</th><th style="padding:5px 8px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">분류</th><th style="padding:5px 8px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">위험도</th><th style="padding:5px 8px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">고지기간</th><th style="padding:5px 8px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">KCD</th><th style="padding:5px 8px;text-align:left;color:#64748b;border-bottom:1px solid #e2e8f0">심사 포인트</th></tr></thead><tbody>'+F.map(f=>'<tr><td style="padding:5px 8px;font-weight:700;border-bottom:1px solid #f1f5f9">'+f.k+(f.m!==f.k?'<div style="font-size:9px;color:#94a3b8">'+f.m+'</div>':'')+'</td><td style="padding:5px 8px;color:#64748b;border-bottom:1px solid #f1f5f9">'+f.c+'</td><td style="padding:5px 8px;border-bottom:1px solid #f1f5f9"><span style="background:'+S[f.s].bg+';color:'+S[f.s].t+';border:1px solid '+S[f.s].b+';border-radius:20px;padding:1px 6px;font-size:9px;font-weight:700">'+S[f.s].l+'</span></td><td style="padding:5px 8px;border-bottom:1px solid #f1f5f9"><span style="border:1px solid '+PC[f.p]+';color:'+PC[f.p]+';border-radius:8px;padding:0 5px;font-size:9px;font-weight:700">'+PL[f.p]+'</span></td><td style="padding:5px 8px;color:#94a3b8;border-bottom:1px solid #f1f5f9">'+(f.kcd||'-')+'</td><td style="padding:5px 8px;color:#475569;border-bottom:1px solid #f1f5f9">'+f.d+'</td></tr>').join('')+'</tbody></table></div><div style="padding:10px 24px;background:#f8fafc;display:flex;align-items:center;justify-content:space-between"><span style="font-size:10px;color:#94a3b8">AFG Authentic · 금감원 2024 · HIRA KCD</span><span style="font-size:10px;color:#94a3b8">'+ts+'</span></div></div><div class="np" style="text-align:center;padding-bottom:16px"><button onclick="window.print()" style="padding:9px 26px;background:#1B2A4A;color:white;border:none;border-radius:8px;font-size:12px;cursor:pointer;margin-right:6px">🖨️ 인쇄 / PDF 저장</button><button onclick="window.close()" style="padding:9px 14px;background:transparent;color:#64748b;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;cursor:pointer">닫기</button></div></div></body></html>';
  const w=window.open('','_blank');if(!w){alert('팝업 차단됨. 허용 후 재시도.');return;}w.document.write(html);w.document.close();
}
</script>
</body></html>`;

module.exports = (req, res) => {
  if (!isAuthed(req)) {
    res.writeHead(302, { Location: '/login' });
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML);
};
