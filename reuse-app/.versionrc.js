module.exports = {
  parserOpts: {
    headerPattern: /^\[(?<scope>BE|FE|ALL)\]\s*(?<type>[a-zA-Z]+)\s*#(?<issue>\d+)\s*:\s*(?<subject>.*)$/,
    headerCorrespondence: ['scope', 'type', 'issue', 'subject'],
    noteKeywords: ['BREAKING CHANGE'],
    issuePrefixes : ['#'],
  },
  types : [
    {type: 'Feat', section : '✨ Features', hidden : false},
    {type: 'Fix', section : '🐛 Bug Fixes', hidden : false},
    {type: 'Refactor', section : '♻️ Code Refactoring', hidden : false},
    {type: 'Style', section : '🎨 Styles', hidden : false},
    {type: 'Setup', section : '⚙️ Configuration & Setup', hidden : false},
    {type: 'Test', section : '✅ Tests', hidden : false},
    {type: 'Docs', section : '📚 Documentation', hidden : false},
    {type: 'Chore', section : '🧹 Chores', hidden : false},
  ],
  writerOpts : {
    transform : (commit, context) => {
      if (commit.scope && commit.scope !== 'FE' && commit.scope !== 'ALL') {
        return null; // 해당 커밋을 CHANGELOG에서 제외
      }
      
      // 이슈번호를 이슈 페이지로
      if (commit.issue && context.repository && context.host && context.owner) {
        commit.subject = commit.subject.replace(
          new RegExp(`#${commit.issue}`, 'g'),
          `[#${commit.issue}](${context.host}/${context.owner}/${context.repository}/issues/${commit.issue})`
        );
      }
      
      if (commit.scope) {
        commit.subject = `[${commit.scope}] ${commit.subject}`
      }
      
      if (!commit.type) {
        commit.type = 'Chore'
      }
      
      return commit;
    }
  },
    git: {
    commit: true, 
    tag: true,   
    commitCmd: 'git commit --no-verify', 
  }
}