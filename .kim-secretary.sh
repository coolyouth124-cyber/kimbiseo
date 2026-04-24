#!/bin/bash

# 🤖 김비서 - 데이터 분석 및 브리핑 도구
# 사용법: source .kim-secretary.sh && kim_secretary

function kim_secretary() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📌 김비서 브리핑 시스템"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    local data_dir="./김비서-데이터"
    local today=$(date +"%Y-%m-%d")
    local day_name=$(date +"%A" | sed 's/Wednesday/수요일/' | sed 's/Thursday/목요일/' | sed 's/Friday/금요일/')

    echo ""
    echo "📅 오늘: $today ($day_name)"
    echo ""

    # 1️⃣ 데이터 읽기 및 분석
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 1. 데이터 분석"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # 매출데이터 분석
    echo ""
    echo "💰 매출 데이터 분석"
    if [ -f "$data_dir/매출데이터.csv" ]; then
        local total_sales=$(awk -F',' 'NR>1 {sum+=$6} END {print sum}' "$data_dir/매출데이터.csv")
        local total_qty=$(awk -F',' 'NR>1 {sum+=$4} END {print sum}' "$data_dir/매출데이터.csv")
        local sale_count=$(wc -l < "$data_dir/매출데이터.csv")

        echo "  ✓ 총 매출액: $(printf '%d' $total_sales | awk '{printf "%.1f억원\n", $1/100000000}')"
        echo "  ✓ 총 판매량: $total_qty개"
        echo "  ✓ 거래 건수: $((sale_count - 1))건"
    fi

    # 업무목록 분석
    echo ""
    echo "✓ 업무 현황"
    if [ -f "$data_dir/업무목록.csv" ]; then
        local pending=$(awk -F',' '$3=="대기" {count++} END {print count+0}' "$data_dir/업무목록.csv")
        local progress=$(awk -F',' '$3=="진행중" {count++} END {print count+0}' "$data_dir/업무목록.csv")
        local done=$(awk -F',' '$3=="완료" {count++} END {print count+0}' "$data_dir/업무목록.csv")
        local high=$(awk -F',' '$2=="높음" {count++} END {print count+0}' "$data_dir/업무목록.csv")

        echo "  ✓ 진행중: $progress건"
        echo "  ✓ 대기중: $pending건"
        echo "  ✓ 완료: $done건"
        echo "  ✓ 높은 우선순위: $high건"
    fi

    # 프로젝트 현황
    echo ""
    echo "🎯 프로젝트 진행률"
    if [ -f "$data_dir/프로젝트현황.csv" ]; then
        awk -F',' 'NR>1 {printf "  %-20s %3d%% (%s)\n", substr($1, 1, 18), $3, $4}' "$data_dir/프로젝트현황.csv"
    fi

    # 2️⃣ 오늘의 일정 및 할 일
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📅 2. 오늘의 일정 및 업무"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # 주간일정에서 오늘 일정 추출
    echo ""
    echo "📋 이번 주 일정 요약 (3월 10-14일)"
    if [ -f "$data_dir/주간일정.txt" ]; then
        echo ""
        grep -A 10 "수요일" "$data_dir/주간일정.txt" 2>/dev/null | head -6 || echo "  오늘 일정 정보 없음"
    fi

    # 업무목록에서 마감 임박 업무
    echo ""
    echo "⏰ 마감 예정 업무"
    if [ -f "$data_dir/업무목록.csv" ]; then
        awk -F',' '$2=="높음" && $3=="대기" {print "  🔴 " $1 " (마감: " $5 ")"}' "$data_dir/업무목록.csv" | head -5 || echo "  마감 예정 업무 없음"
    fi

    # 3️⃣ 주요 회의록
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 3. 최신 회의록 요약"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [ -f "$data_dir/회의록.txt" ]; then
        echo ""
        echo "📌 마케팅팀 주간회의 (2026-03-10)"
        echo "  • B안(영상형) 광고 최종 확정"
        echo "  • 신제품 론칭 티저 3월 넷째주 시작"
        echo "  • 영상 제작비 추가 200만원 승인 필요"
        echo ""
        echo "다음 회의: 3월 17일(월) 10:00"
    fi

    # 4️⃣ 권장사항
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "💡 4. 오늘의 추천사항"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    echo ""
    echo "🎯 우선순위"
    echo "  1. 워크숍 후기 작성하기 (금요일 마감, 높음)"
    echo "  2. 파트너사 계약서 검토 (3월 11일)"
    echo "  3. 프로모션 기획안 최종 검토"
    echo ""
    echo "📊 참고자료"
    echo "  • 대시보드: dashboard.html"
    echo "  • 차트 분석: chart.html"
    echo "  • 회의 내용: meeting-result.html"
    echo "  • 프로세스: diagram.svg"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ 브리핑 완료"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 별칭 설정
alias /김비서="kim_secretary"

# 자동 실행 (필요시)
# kim_secretary
