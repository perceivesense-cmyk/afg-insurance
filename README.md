# AFG 보험심사평가 — 고지의무 분석 시스템

## 배포 방법 (Vercel — 무료, 5분 완성)

### 1단계: GitHub에 올리기
1. https://github.com 접속 → 로그인 (없으면 무료 가입)
2. 우상단 `+` → `New repository`
3. Repository name: `afg-insurance` → `Create repository`
4. 아래 명령어 실행 (터미널/CMD):
```
git init
git add .
git commit -m "AFG 보험심사평가 시스템"
git remote add origin https://github.com/[내아이디]/afg-insurance.git
git push -u origin main
```

### 2단계: Vercel에 배포하기
1. https://vercel.com 접속 → GitHub로 로그인
2. `New Project` → 방금 만든 `afg-insurance` 선택
3. `Environment Variables` 섹션에서:
   - Name: `SITE_PASSWORD`
   - Value: `원하는비밀번호` (예: `afg2024`)
4. `Deploy` 클릭

### 3단계: 배포 완료
- 약 1~2분 후 `https://afg-insurance.vercel.app` 형태의 URL 생성
- 이 URL을 동료들에게 공유

---

## 비밀번호 변경 방법

1. https://vercel.com → 프로젝트 선택
2. `Settings` → `Environment Variables`
3. `SITE_PASSWORD` 값 수정
4. `Save` → `Redeploy` 클릭

**완료!** 변경 후 1~2분 내 적용됩니다.

---

## 로컬 실행 (테스트용)

```bash
npm install
SITE_PASSWORD=테스트비밀번호 npm start
# http://localhost:3000 접속
```

---

## 주요 기능
- 🔒 비밀번호 보호 (8시간 세션 유지)
- ⚖️ 금감원 2024 기준 고지의무 분석
- 📋 160개 항목 + alias 400개+ 완전 매칭
- 🟣 10대 필수질병 별도 분류
- 🔑 HIRA KCD 상병코드 표시
- 📄 AFG 로고 리포트 출력 (인쇄/PDF)
- 📁 TXT·PDF 파일 업로드 (비밀번호 PDF 포함)
- 🗂 심사 히스토리 (15건)
- 📱 모바일 반응형

---

## 비밀번호 정책 권장사항
- 월 1회 이상 변경 권장
- 8자 이상, 영문+숫자 조합 권장
- 퇴직자 발생 시 즉시 변경
