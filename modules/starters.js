var inquirer = require('inquirer'),
  colors = require('colors'),
  shell = require('shelljs');

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
            slug: 'angular',
            repo: 'https://github.com/SidKH/angular-starter-kit.git',
            branch: 'master',
            exec: function () {
              console.log('Installing Npm and Bower dependencies'.info);
              shell.exec('npm install');
              logComplete();
            }
          }
        },
        {
          name: 'Skeleton',
          value: {
            slug: 'skeleton',
            repo: 'https://github.com/SidKH/markup-starter',
            branch: 'master',
            exec: function () {
              console.log('Installing Npm and Bower dependencies'.info);
              shell.exec('npm install');
              logComplete();
            }
          }
        }
      ]
    },
    {
      message: 'Do you need markup starter?',
      type: 'list',
      name: 'isMarkup',
      choices: [
        {
          name:'Yes',
          value: true
        },
        {
          name: 'No',
          value: false
        }
      ],
      when: function (answers) {
        return answers.type.slug === 'skeleton';
      }
    },
    {
      message: 'Type new project repository url (Default: no repository)',
      type: 'input',
      name: 'repo',
      when: function (answers) {
        return !answers.isMarkup;
      }
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
    if (info.isMarkup) {
      shell.exec('mkdir markup');
      shell.cd('markup');
    }
    console.log('Getting starter files'.info);
    shell.exec('git clone ' + info.type.repo + ' ./');
    logComplete();
    shell.exec('rm -rf .git');
    if (info.repo) {
      info.branch = info.branch || 'master';
      console.log('Create initial commit and push it into repository'.info);
      shell.exec('git init && git add . && git commit -m "Init Starter Kit"');
      logComplete();
      shell.exec('git remote add origin ' + info.repo);
      console.log('Pushing the code to the repository'.info);
      shell.exec('git push origin ' + info.branch);
      logComplete();
    }
    info.type.exec && info.type.exec();
    console.log('Starter was successfully installed. Good luck :)'.success);
  }
};