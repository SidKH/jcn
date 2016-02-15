var inquirer = require('inquirer'),
  colors = require('colors');

colors.setTheme({
  info: ['white', 'bgBlack'],
  success: ['green', 'bgBlack'],
  warn: ['orange', 'bgBlack'],
  error: ['red', 'bgBlack']
});

function logComplete() {
  console.log('[Complete]'.success);
  console.log('\n\n');
}

module.exports = function () {
  var qTypes = [
    {
      message: 'Select project type',
      type: 'list',
      name: 'type',
      choices: [
        {
          name: 'Angular',
          value: {
            repo: 'https://github.com/SidKH/angular-starter-kit.git',
            branch: 'master',
            exec: function () {
              console.log('Installing Npm and Bower dependencies'.info);
              exec('npm install');
              logComplete();
            }
          }
        },
        {
          name: 'Markup',
          value: {
            repo: 'https://github.com/SidKH/markup-starter',
            branch: 'markup',
            exec: function () {
              console.log('Installing Npm and Bower dependencies'.info);
              exec('npm install');
              logComplete();
            }
          }
        }
      ]
    },
    {
      message: 'Type project repository (Bitbucket JustCoded)',
      type: 'input',
      name: 'repo'
    },
    {
      message: function (answers) {
        return 'Type your branch (default: ' + answers.type.branch + ')';
      },
      when: function (answers) {
        return answers.repo;
      },
      type: 'input',
      name: 'branch'
    }

  ];

  inquirer.prompt(qTypes, commands);

  function commands(info) {
    if (!info.type) {
      console.log('Still in maintenance, sorry'.red);
      return;
    }
    console.log('Getting starter files'.info);
    exec('git clone ' + info.type.repo + ' ./');
    logComplete();
    exec('rm -rf .git');
    if (info.repo) {
      info.branch = info.branch || 'master';
      console.log('Create initial commit and push it into repository'.info);
      exec('git init && git add . && git commit -m "Init Starter Kit"');
      logComplete();
      exec('git remote add origin ' + info.repo);
      console.log('Pushing the code to the repository'.info);
      exec('git push origin ' + info.branch);
      logComplete();
    }
    info.type.exec && info.type.exec();
    console.log('Starter was successfully installed. Good luck :)'.success);
  }
};