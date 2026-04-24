#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Kim Secretary Agent - 일일 업무 브리핑 자동 생성 시스템
Version: 1.0
Last Updated: 2026-04-09
"""

import json
import csv
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum


class TaskPriority(Enum):
    """업무 우선순위"""
    LOW = "낮음"
    NORMAL = "보통"
    HIGH = "높음"


class TaskStatus(Enum):
    """업무 상태"""
    WAITING = "대기"
    IN_PROGRESS = "진행중"
    COMPLETED = "완료"


class ProjectStatus(Enum):
    """프로젝트 상태"""
    PLANNING = "기획중"
    READY = "준비중"
    IN_PROGRESS = "진행중"
    FINISHING = "마무리"
    COMPLETED = "완료"


@dataclass
class Task:
    """업무 데이터"""
    name: str
    priority: str
    status: str
    owner: str
    deadline: str
    category: str

    def days_until_deadline(self, today: datetime) -> int:
        """마감일까지의 일 수"""
        try:
            deadline_date = datetime.strptime(self.deadline, "%Y-%m-%d")
            return (deadline_date - today).days
        except ValueError:
            return float('inf')

    def is_urgent(self, today: datetime) -> bool:
        """긴급 여부 판정"""
        days = self.days_until_deadline(today)
        return days <= 1 and days >= 0


@dataclass
class Project:
    """프로젝트 데이터"""
    name: str
    progress: int
    status: str
    owner: str
    start_date: str
    deadline: str
    budget: int
    spent: int

    def spending_rate(self) -> float:
        """집행률"""
        if self.budget == 0:
            return 0
        return (self.spent / self.budget) * 100

    def is_at_risk(self) -> bool:
        """위험도 판정"""
        # 예산 초과
        if self.spent > self.budget * 1.1:
            return True
        # 진행률이 낮은데 마감이 임박
        if self.progress < 50 and self._days_remaining() < 14:
            return True
        return False

    def _days_remaining(self) -> int:
        """남은 일 수"""
        try:
            deadline = datetime.strptime(self.deadline, "%Y-%m-%d")
            return (deadline - datetime.now()).days
        except ValueError:
            return float('inf')


@dataclass
class SalesRecord:
    """매출 데이터"""
    date: str
    product: str
    category: str
    quantity: int
    unit_price: int
    revenue: int
    region: str


class KimSecretaryAgent:
    """김비서 에이전트 - 메인 클래스"""

    def __init__(self, config_path: str = "settings.json"):
        """초기화"""
        self.config = self._load_config(config_path)
        self.data_folder = Path(self.config.get("dataManagement", {}).get("dataPath", "./김비서-데이터"))
        self.today = datetime.now()
        self.tomorrow = self.today + timedelta(days=1)

        # 데이터 저장소
        self.tasks: List[Task] = []
        self.projects: List[Project] = []
        self.sales: List[SalesRecord] = []
        self.schedule_items: Dict = {}
        self.meetings: List[Dict] = []

    def _load_config(self, config_path: str) -> Dict:
        """설정 파일 로드"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"경고: {config_path}를 찾을 수 없습니다. 기본 설정을 사용합니다.")
            return self._get_default_config()

    def _get_default_config(self) -> Dict:
        """기본 설정"""
        return {
            "dataManagement": {
                "dataPath": "./김비서-데이터"
            },
            "briefingConfig": {
                "timezone": "Asia/Seoul",
                "outputFormat": "markdown"
            }
        }

    def run(self, target_date: Optional[str] = None):
        """에이전트 실행"""
        if target_date:
            self.today = datetime.strptime(target_date, "%Y-%m-%d")
            self.tomorrow = self.today + timedelta(days=1)

        print(f"[김비서 Agent] {self.today.strftime('%Y-%m-%d')} 브리핑 생성 시작...")

        # 1단계: 데이터 로드
        self._load_all_data()

        # 2단계: 분석
        self._analyze_data()

        # 3단계: 브리핑 생성
        briefing = self._generate_briefing()

        # 4단계: 저장
        output_file = self._save_briefing(briefing)

        print(f"✓ 완료: {output_file}")
        return briefing

    def _load_all_data(self):
        """모든 데이터 파일 로드"""
        print("📂 데이터 파일 로드 중...")

        # 1. 매출 데이터
        self._load_sales_data()

        # 2. 업무 목록
        self._load_task_data()

        # 3. 주간 일정
        self._load_schedule_data()

        # 4. 프로젝트 현황
        self._load_project_data()

        # 5. 회의록
        self._load_meeting_data()

        print(f"✓ 데이터 로드 완료")

    def _load_sales_data(self):
        """매출 데이터 로드"""
        filepath = self.data_folder / "매출데이터.csv"
        if not filepath.exists():
            print(f"  경고: {filepath}를 찾을 수 없습니다.")
            return

        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not row.get('날짜'):
                    continue
                self.sales.append(SalesRecord(
                    date=row['날짜'],
                    product=row['제품'],
                    category=row['카테고리'],
                    quantity=int(row['수량']) if row.get('수량') else 0,
                    unit_price=int(row['단가']) if row.get('단가') else 0,
                    revenue=int(row['매출액']) if row.get('매출액') else 0,
                    region=row['지역']
                ))
        print(f"  ✓ 매출 데이터: {len(self.sales)}건")

    def _load_task_data(self):
        """업무 목록 로드"""
        filepath = self.data_folder / "업무목록.csv"
        if not filepath.exists():
            print(f"  경고: {filepath}를 찾을 수 없습니다.")
            return

        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not row.get('업무'):
                    continue
                self.tasks.append(Task(
                    name=row['업무'],
                    priority=row['우선순위'],
                    status=row['상태'],
                    owner=row['담당자'],
                    deadline=row['마감일'],
                    category=row['카테고리']
                ))
        print(f"  ✓ 업무 목록: {len(self.tasks)}건")

    def _load_schedule_data(self):
        """주간 일정 로드"""
        filepath = self.data_folder / "주간일정.txt"
        if not filepath.exists():
            print(f"  경고: {filepath}를 찾을 수 없습니다.")
            return

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            self.schedule_items = self._parse_schedule_text(content)
        print(f"  ✓ 주간 일정 파일 로드 완료")

    def _load_project_data(self):
        """프로젝트 현황 로드"""
        filepath = self.data_folder / "프로젝트현황.csv"
        if not filepath.exists():
            print(f"  경고: {filepath}를 찾을 수 없습니다.")
            return

        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not row.get('프로젝트명'):
                    continue
                self.projects.append(Project(
                    name=row['프로젝트명'],
                    progress=int(row['진행률']) if row.get('진행률') else 0,
                    status=row['상태'],
                    owner=row['담당자'],
                    start_date=row['시작일'],
                    deadline=row['마감일'],
                    budget=int(row['예산(만원)']) if row.get('예산(만원)') else 0,
                    spent=int(row['집행(만원)']) if row.get('집행(만원)') else 0
                ))
        print(f"  ✓ 프로젝트 현황: {len(self.projects)}건")

    def _load_meeting_data(self):
        """회의록 로드"""
        filepath = self.data_folder / "회의록.txt"
        if not filepath.exists():
            print(f"  경고: {filepath}를 찾을 수 없습니다.")
            return

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # 간단한 파싱 - 실제로는 더 복잡할 수 있음
            self.meetings = self._parse_meeting_text(content)
        print(f"  ✓ 회의록 파일 로드 완료")

    def _parse_schedule_text(self, content: str) -> Dict:
        """일정 텍스트 파싱"""
        schedule = {}
        lines = content.split('\n')
        for line in lines:
            if '■' in line and '(' in line:
                # 요일 추출
                pass
        return schedule

    def _parse_meeting_text(self, content: str) -> List[Dict]:
        """회의록 텍스트 파싱"""
        meetings = []
        # 간단한 구현 - 실제로는 더 상세함
        return meetings

    def _analyze_data(self):
        """데이터 분석"""
        print("📊 데이터 분석 중...")

        # 분석 항목
        urgent_tasks = self._get_urgent_tasks()
        risk_projects = self._get_risk_projects()
        top_products = self._get_top_products()

        print(f"  ✓ 분석 완료:")
        print(f"    - 긴급 업무: {len(urgent_tasks)}건")
        print(f"    - 위험 프로젝트: {len(risk_projects)}건")
        print(f"    - 상위 제품: {len(top_products)}건")

    def _get_urgent_tasks(self) -> List[Task]:
        """긴급 업무 추출"""
        urgent = []
        for task in self.tasks:
            if task.is_urgent(self.today):
                urgent.append(task)
        return sorted(urgent, key=lambda t: t.days_until_deadline(self.today))

    def _get_risk_projects(self) -> List[Project]:
        """위험 프로젝트 추출"""
        return [p for p in self.projects if p.is_at_risk()]

    def _get_top_products(self, limit: int = 5) -> List[Tuple[str, int]]:
        """상위 제품 추출"""
        product_revenue = {}
        for sale in self.sales:
            if sale.product not in product_revenue:
                product_revenue[sale.product] = 0
            product_revenue[sale.product] += sale.revenue

        sorted_products = sorted(product_revenue.items(), key=lambda x: x[1], reverse=True)
        return sorted_products[:limit]

    def _generate_briefing(self) -> str:
        """브리핑 생성"""
        print("📝 브리핑 생성 중...")

        lines = []

        # 헤더
        lines.extend(self._get_header())

        # 오늘의 일정
        lines.extend(self._get_today_section())

        # 매출 현황
        lines.extend(self._get_sales_section())

        # 프로젝트 현황
        lines.extend(self._get_project_section())

        # 진행 중인 업무
        lines.extend(self._get_task_section())

        # 주의사항
        lines.extend(self._get_alert_section())

        # 푸터
        lines.extend(self._get_footer())

        return '\n'.join(lines)

    def _get_header(self) -> List[str]:
        """헤더 생성"""
        day_name = self._get_korean_day_name(self.today.weekday())
        date_str = self.today.strftime("%Y년 %m월 %d일")

        return [
            "# 김비서 Agent - 일일 브리핑",
            "",
            f"**날짜**: {date_str} ({day_name})",
            f"**생성시간**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "",
            "---",
            ""
        ]

    def _get_today_section(self) -> List[str]:
        """오늘 섹션"""
        lines = ["## 📋 오늘의 일정 및 업무", ""]

        urgent = self._get_urgent_tasks()
        if urgent:
            lines.append("### 🔴 긴급 할 일")
            lines.append("")
            for task in urgent:
                days = task.days_until_deadline(self.today)
                marker = "D-0 (오늘!)" if days == 0 else f"D-{days}"
                lines.append(f"- **{marker}** | {task.name} (담당: {task.owner})")
            lines.append("")
        else:
            lines.append("특별한 긴급 업무는 없습니다.")
            lines.append("")

        return lines

    def _get_sales_section(self) -> List[str]:
        """매출 섹션"""
        lines = ["## 📊 매출 현황", ""]

        if not self.sales:
            lines.append("매출 데이터가 없습니다.")
            lines.append("")
            return lines

        total_revenue = sum(s.revenue for s in self.sales)
        top_products = self._get_top_products()

        lines.append(f"**총 매출액**: {total_revenue:,}원")
        lines.append(f"**기록 건수**: {len(self.sales)}건")
        lines.append("")

        if top_products:
            lines.append("### 상위 제품")
            lines.append("")
            for i, (product, revenue) in enumerate(top_products, 1):
                lines.append(f"{i}. {product}: {revenue:,}원")
            lines.append("")

        return lines

    def _get_project_section(self) -> List[str]:
        """프로젝트 섹션"""
        lines = ["## 🎯 프로젝트 현황", ""]

        if not self.projects:
            lines.append("프로젝트 데이터가 없습니다.")
            lines.append("")
            return lines

        # 상태별 분류
        by_status = {}
        for project in self.projects:
            if project.status not in by_status:
                by_status[project.status] = []
            by_status[project.status].append(project)

        for status, projects in by_status.items():
            lines.append(f"### {status} ({len(projects)}개)")
            lines.append("")
            for project in projects:
                lines.append(
                    f"- **{project.name}** - 진행률: {project.progress}% | "
                    f"담당: {project.owner}"
                )
            lines.append("")

        return lines

    def _get_task_section(self) -> List[str]:
        """업무 섹션"""
        lines = ["## 📝 진행 중인 업무", ""]

        if not self.tasks:
            lines.append("업무 목록이 없습니다.")
            lines.append("")
            return lines

        # 상태별 분류
        by_status = {}
        for task in self.tasks:
            if task.status not in by_status:
                by_status[task.status] = []
            by_status[task.status].append(task)

        for status in [TaskStatus.IN_PROGRESS.value, TaskStatus.WAITING.value, TaskStatus.COMPLETED.value]:
            if status in by_status:
                lines.append(f"### {status} ({len(by_status[status])}건)")
                lines.append("")
                for task in by_status[status]:
                    lines.append(f"- {task.name}")
                    lines.append(f"  - 담당: {task.owner} | 마감: {task.deadline}")
                lines.append("")

        return lines

    def _get_alert_section(self) -> List[str]:
        """알림 섹션"""
        lines = ["## 🚨 주의사항", ""]

        risk_projects = self._get_risk_projects()
        if risk_projects:
            lines.append("### 위험 프로젝트")
            lines.append("")
            for project in risk_projects:
                lines.append(f"- {project.name} (진행률: {project.progress}%)")
            lines.append("")

        return lines

    def _get_footer(self) -> List[str]:
        """푸터"""
        return [
            "---",
            "",
            "**생성**: 김비서 Agent v1.0",
            f"**문의**: 설정 파일 확인 (settings.json)"
        ]

    def _get_korean_day_name(self, weekday: int) -> str:
        """요일명 (한글)"""
        days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"]
        return days[weekday]

    def _save_briefing(self, content: str) -> str:
        """브리핑 저장"""
        output_dir = self.data_folder
        output_dir.mkdir(parents=True, exist_ok=True)

        date_str = self.today.strftime("%Y%m%d")
        filename = f"브리핑_{date_str}.md"
        filepath = output_dir / filename

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        return str(filepath)


def main():
    """메인 실행"""
    import sys

    # 인자 파싱
    target_date = None
    if len(sys.argv) > 1 and sys.argv[1].startswith("--date="):
        target_date = sys.argv[1].split("=")[1]

    # 에이전트 실행
    agent = KimSecretaryAgent()
    agent.run(target_date)


if __name__ == "__main__":
    main()
