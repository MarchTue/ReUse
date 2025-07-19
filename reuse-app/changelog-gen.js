const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const commitPattern = /^\[(?<scope>FE|ALL)\]\s*(?<type>feat|fix|refactor|style|test|chore|docs)\s*#(?<issue>\d+)\s*[:：]\s*(?<subject>.*)$/i;

const generateChangelog = (currentVersion) => {
  console.log(`\nCHANGELOG v${currentVersion} 생성을 시작합니다...`);

  let lastTag = '';
  try {
    lastTag = execSync('git describe --tags --abbrev=0 HEAD~1').toString().trim();
    console.log(`DEBUG: 마지막 태그: ${lastTag}`);
  } catch (error) {
    console.log('DEBUG: 이전 태그가 없습니다. 모든 커밋을 대상으로 합니다.');
    lastTag = '';
  } // 변경 지점: 여기에 닫는 중괄호 } 가 추가되었습니다.

  const gitLogCommand = lastTag ? `git log --pretty=format:"%H %s" ${lastTag}..HEAD` : `git log --pretty=format:"%H %s"`;
  const gitLog = execSync(gitLogCommand).toString().split('\n').filter(line => line.trim() !== '');

  const changelogEntries = {
    '✨ Features': [],
    '🐛 Bug Fixes': [],
    '♻️ Code Refactoring': [],
    '🎨 Styles': [],
    '✅ Tests': [],
    '🧹 Chores': [],
    '📚 Documentation': []
  };

  for (const line of gitLog) {
    const [hash, ...messageParts] = line.split(' ');
    const fullMessage = messageParts.join(' ');
    const match = fullMessage.match(commitPattern);

    if (match) {
      const { scope, type, issue, subject } = match.groups;
      const formattedSubject = subject.trim();
      const issueLink = `[#${issue}](https://github.com/MarchTue/ReUse/issues/${issue})`;

      const entry = `- ${formattedSubject} ${issueLink} (${hash.substring(0, 7)})`;

      switch (type.toLowerCase()) {
        case 'feat':
          changelogEntries['✨ Features'].push(entry);
          break;
        case 'fix':
          changelogEntries['🐛 Bug Fixes'].push(entry);
          break;
        case 'refactor':
          changelogEntries['♻️ Code Refactoring'].push(entry);
          break;
        case 'style':
          changelogEntries['🎨 Styles'].push(entry);
          break;
        case 'test':
          changelogEntries['✅ Tests'].push(entry);
          break;
        case 'chore':
          changelogEntries['🧹 Chores'].push(entry);
          break;
        case 'docs':
          changelogEntries['📚 Documentation'].push(entry);
          break;
      }
    } else {
      console.log(`DEBUG: 필터링된 커밋 (패턴 불일치): "${fullMessage}"`);
    }
  }

  // 현재 날짜 가져오기 (YYYY-MM-DD 형식)
  const today = new Date();
  const date = today.toISOString().split('T')[0];

  let newChangelogContent = `## ${currentVersion} (${date})\n\n`;

  for (const section in changelogEntries) {
    if (changelogEntries[section].length > 0) {
      newChangelogContent += `### ${section}\n\n`;
      changelogEntries[section].forEach(entry => {
        newChangelogContent += `${entry}\n`;
      });
      newChangelogContent += '\n';
    }
  }

  // 기존 CHANGELOG.md가 있다면 내용을 읽어와 새 내용 앞에 추가
  const changelogPath = 'CHANGELOG.md';
  let existingContent = '';
  if (fs.existsSync(changelogPath)) {
    existingContent = fs.readFileSync(changelogPath, 'utf8');
    // 헤더 'All notable changes to this project will be documented in this file.'는 한 번만 남기기
    const headerPattern = /^(# Changelog\n\nAll notable changes to this project will be documented in this file\.\s*See \[standard-version\]\(https:\/\/github\.com\/conventional-changelog\/standard-version\) for commit guidelines\.\s*\n*?\n*?)/;
    // 기존 standard-version 헤더는 처음 한 번만 추가되도록 처리
    if (existingContent.match(headerPattern)) {
      existingContent = existingContent.replace(headerPattern, '');
    }
  } else {
    // 파일이 없으면 초기 헤더 추가
    newChangelogContent = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n' + newChangelogContent;
  }

  // 새로운 내용을 기존 내용 앞에 추가 (가장 최신 버전이 위로 오도록)
  fs.writeFileSync(changelogPath, newChangelogContent + existingContent.trim() + '\n');
  console.log(`CHANGELOG.md 파일이 v${currentVersion} 버전으로 성공적으로 업데이트되었습니다.`);
};

// 명령줄 인자로 현재 버전을 받음
const versionArg = process.argv[2];
if (!versionArg) {
  console.error('오류: 버전을 인자로 제공해야 합니다. 예: node changelog-generator.js 1.0.0');
  process.exit(1);
}

generateChangelog(versionArg);