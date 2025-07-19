module.exports = {
  parserOpts: {
    headerPattern: /^\[(?<scope>BE|FE|ALL|BC|Docs)\]\s*(?<type>[a-zA-Z]+)(?:\s*#(?<issue>\d+))(?:\s*[:：]\s*)?(?<subject>.*)$/,
    headerCorrespondence: ['scope', 'type', 'issue', 'subject'],
    noteKeywords: ['BREAKING CHANGE'],
    issuePrefixes: ['#'],
  },
  types: [
    { type: 'feat', section: '✨ Features', hidden: false },
    { type: 'fix', section: '🐛 Bug Fixes', hidden: false },
    { type: 'refactor', section: '♻️ Code Refactoring', hidden: false },
    { type: 'style', section: '🎨 Styles', hidden: false },
    { type: 'setup', section: '⚙️ Configuration & Setup', hidden: false },
    { type: 'test', section: '✅ Tests', hidden: false },
    { type: 'docs', section: '📚 Documentation', hidden: false },
    { type: 'chore', section: '🧹 Chores', hidden: false },
  ],
  writerOpts: {
    transform: (commit, context) => {
      console.log(`DEBUG: Initial Commit Data - Type: ${commit.type}, Scope: ${commit.scope}, Issue: ${commit.issue}, Subject: ${commit.subject}`);

      if (!commit.type) {
        console.log(`DEBUG: Filtering out (no type parsed) - Raw Commit: ${JSON.stringify(commit)}`);
        return null; // 타입이 파싱되지 않은 커밋은 여기서 걸러짐
      }

      commit.type = commit.type.toLowerCase();

      const allowedTypes = ['feat', 'fix', 'refactor', 'style', 'setup', 'test', 'docs', 'chore'];
      if (!allowedTypes.includes(commit.type)) {
        console.log(`DEBUG: Filtering out (disallowed type) - Type: ${commit.type}`);
        return null;
      }

      if (commit.scope !== 'FE' && commit.scope !== 'ALL') {
        console.log(`DEBUG: Filtering out (non-FE/ALL scope) - Scope: [${commit.scope}]`);
        return null;
      }
      
      if (!commit.issue) {
          console.log(`DEBUG: Filtering out (missing issue number) - Commit: ${JSON.stringify(commit)}`);
          return null; // 이슈 번호가 없는 커밋은 여기서 걸러짐
      }


      if (!commit.subject) commit.subject = '';

      // 이슈 번호를 GitHub 링크로 변환
      if (commit.issue && context.repository && context.host && context.owner) {
        commit.subject = commit.subject.replace(
          new RegExp(`#${commit.issue}`, 'g'),
          `[#${commit.issue}](${context.host}/${context.owner}/${context.repository}/issues/${commit.issue})`
        );
      }

      // Scope를 subject 앞에 추가
      if (commit.scope) {
        commit.subject = `[${commit.scope}] ${commit.subject}`;
      }

      return commit;
    },
  },
  git: {
    commit: true,
    tag: true,
    commitCmd: 'git commit --no-verify',
  },
};