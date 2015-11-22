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
              console.log(124);
            }
          }
        },
        {
          name: 'Markup',
          value: false
        }
      ]
    }
  ];

  var qRepo = [
    {
      message: 'Type project repository (default: no repository)',
      type: 'input',
      name: 'repo'
    }
  ];

  var qBranch = [
    {
      message: function () {
        console.log(234, arguments);
        return '234433';
      },
      type: 'input',
      name: 'branch'
    }
  ]

  inquirer.prompt(qTypes, function (answType) {
    inquirer.prompt(qRepo, function (answRepo) {
      if (!answRepo.repo) {
        commands(answType.type);
      } else {
        inquirer.prompt(qBranch, function (answBranch) {
          commands(answType.type, answRepo.repo, answBranch.branch); 
        });
      }
    });
  });

  function commands(starter, projRepo, branch) {
    exec('git clone ' + starter.repo + ' ./');
    exec('rm -rf .git');
    if (projRepo) {
      branch = branch || 'master';
      exec('git init && git add . && git commit -m "Init Starter Kit"');
      exec('git remote add origin ' + projRepo);
      exec('git push origin ' + branch);
    }
  }
};