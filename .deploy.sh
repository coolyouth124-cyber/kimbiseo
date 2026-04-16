#!/bin/bash

# 🚀 김비서 배포 스크립트
# 사용법: bash .deploy.sh

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🚀 김비서 배포 프로세스 시작"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 1️⃣ 변경 파일 확인
echo "📦 Step 1: 변경 파일 확인"
echo "───────────────────────────────────────────────────────────────"

CHANGES=$(git status --porcelain)

if [ -z "$CHANGES" ]; then
    echo "✅ 변경 사항 없음 - 최신 상태입니다"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "✅ 배포 완료!"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "📊 현재 상태:"
    git log --oneline -1
    echo ""
    exit 0
fi

echo "변경된 파일:"
echo "$CHANGES"
echo ""

# 2️⃣ 변경 파일 스테이징
echo "📥 Step 2: 변경 파일 스테이징"
echo "───────────────────────────────────────────────────────────────"
git add -A
echo "✅ 모든 변경 사항을 스테이징했습니다"
echo ""

# 3️⃣ 커밋 메시지 생성
echo "📝 Step 3: 커밋 메시지 입력"
echo "───────────────────────────────────────────────────────────────"
echo "커밋 메시지를 입력해주세요 (또는 기본값 선택):"
echo "1) [업데이트] 변경사항 반영"
echo "2) [버그 수정] 버그 해결"
echo "3) [기능] 새로운 기능 추가"
echo "4) [데이터] 데이터 업데이트"
echo "5) [문서] 문서 추가/수정"
echo "6) 직접 입력"
echo ""

read -p "선택 (기본값: 1): " choice
choice=${choice:-1}

case $choice in
    1) COMMIT_MSG="[업데이트] 변경사항 반영" ;;
    2) COMMIT_MSG="[버그 수정] 버그 해결" ;;
    3) COMMIT_MSG="[기능] 새로운 기능 추가" ;;
    4) COMMIT_MSG="[데이터] 데이터 업데이트" ;;
    5) COMMIT_MSG="[문서] 문서 추가/수정" ;;
    6)
        read -p "커밋 메시지를 입력하세요: " COMMIT_MSG
        ;;
    *) COMMIT_MSG="[업데이트] 변경사항 반영" ;;
esac

echo ""
echo "💬 커밋 메시지: $COMMIT_MSG"
echo ""

# 4️⃣ 커밋 실행
echo "✍️  Step 4: 커밋 생성"
echo "───────────────────────────────────────────────────────────────"
git commit -m "$COMMIT_MSG

Co-Authored-By: Kim Secretary Bot <noreply@anthropic.com>"

if [ $? -eq 0 ]; then
    echo "✅ 커밋이 성공적으로 생성되었습니다"
else
    echo "❌ 커밋 생성 실패!"
    exit 1
fi

echo ""

# 5️⃣ 푸쉬 실행
echo "🚀 Step 5: GitHub에 푸쉬"
echo "───────────────────────────────────────────────────────────────"
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ GitHub에 성공적으로 푸쉬되었습니다"
else
    echo "❌ 푸쉬 실패! 네트워크 연결을 확인하세요"
    exit 1
fi

echo ""

# 6️⃣ 최종 정보
echo "═══════════════════════════════════════════════════════════════"
echo "✅ 배포 완료!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📊 배포 정보:"
echo "  커밋: $(git log --oneline -1)"
echo "  브랜치: $(git rev-parse --abbrev-ref HEAD)"
echo "  리모트: $(git config --get remote.origin.url | sed 's/.*\///')"
echo ""
echo "🔗 저장소: https://github.com/coolyouth124-cyber/kimbiseo"
echo ""
echo "다음 단계:"
echo "  • GitHub에서 커밋 확인"
echo "  • 변경사항 검증"
echo "  • 필요시 PR 생성"
echo ""
