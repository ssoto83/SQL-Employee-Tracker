const inquirer = require('inquirer');
const client = require('./db');

const menuOptions = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role', 
    'Add an employee',
    'Update an employee role',
    'Exit'
];

const mainMenu = async () => {
    const answer = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: menuOptions
    });

    switch (answer.action) {
        case 'View all departments':
            viewDepartments();
            break;            
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;        
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployeeRole();
            break;
        case 'Exit':
            client.end();
            console.log('Goodbye!');
            return;
    }
};

const viewDepartments = async () => {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
    mainMenu();
};