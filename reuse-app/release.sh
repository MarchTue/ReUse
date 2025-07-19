#!/bin/bash

set -e

# 사용법 안내 및 인자 검증
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <major|minor|patch> <issue_number>"
  echo "Example: $0 patch 55"
  exit 1
fi

RELEASE_TYPE=$1
ISSUE_NUMBER=$2 

PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo "현재 버전: $PACKAGE_VERSION"

# 1. 버전 범핑 (npm version 명령 사용, Git 태그 생성은 하지 않음)
echo "package.json 버전 범핑 중..."
npm version "${RELEASE_TYPE}" --no-git-tag-version

# 업데이트된 package.json에서 새 버전 가져오기
NEW_PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo "새 버전: $NEW_PACKAGE_VERSION"

# 2. package.json 변경사항 커밋
echo "package.json 변경사항 커밋 중..."
git add package.json
git commit -m "[FE]Docs #${ISSUE_NUMBER}: Release ${NEW_PACKAGE_VERSION} preparation"

# 3. CHANGELOG.md 생성/업데이트 (Node.js 스크립트 호출)
echo "CHANGELOG.md 생성/업데이트 중..."
# Node.js 스크립트에 새 버전을 인자로 전달
node changelog-gen.js "${NEW_PACKAGE_VERSION}"

# 4. 생성된 CHANGELOG.md 커밋
# 변경 지점: 이 커밋도 이전과 동일하게 이슈 번호를 포함하도록 수정
echo "CHANGELOG.md 커밋 중..."
git add CHANGELOG.md
git commit -m "[FE]Docs #${ISSUE_NUMBER}: Update CHANGELOG for ${NEW_PACKAGE_VERSION}" --amend --no-edit # 이전 커밋에 병합

# 5. Git 태그 생성
echo "Git 태그 v${NEW_PACKAGE_VERSION} 생성 중..."
git tag "v${NEW_PACKAGE_VERSION}" -m "Release v${NEW_PACKAGE_VERSION}"

# 6. 원격 저장소에 푸시 (태그 포함)
# echo "원격 저장소에 푸시 중..."
# git push origin main --follow-tags # 'main' 브랜치 대신 현재 작업 브랜치를 사용하거나 조정하세요.

echo "릴리즈 프로세스 완료: v${NEW_PACKAGE_VERSION}"