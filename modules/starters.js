var inquirer = require('inquirer');
// Todo make all question one array
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
              exec('npm install');
              exec('gulp');
            }
          }
        },
        {
          name: 'Markup',
          value: false
        }
      ]
    },
    {
      message: 'Type project repository (default: no repository)',
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
    exec('git clone ' + info.type.repo + ' ./');
    exec('rm -rf .git');
    if (info.repo) {
      info.branch = info.branch || 'master';
      exec('git init && git add . && git commit -m "Init Starter Kit"');
      exec('git remote add origin ' + info.repo);
      exec('git push origin ' + info.branch);
    }
    info.type.exec && info.type.exec();
  }
};