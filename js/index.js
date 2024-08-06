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
    'Update a role',
    'Delete an employee',
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
        case 'Update a role':
            updateRole();
            break;
        case 'Delete an employee':
            deleteEmployee();
            break;
        case 'Exit':
            client.end();
            console.log('Goodbye!');
            return;
    }
};

const viewDepartments = async () => {
    const res = await client.query('SELECT * FROM departments');
    console.table(res.rows);
    mainMenu();
};

const viewRoles = async () => {
    const res = await client.query(`
        SELECT roles.id, roles.title, departments.name, roles.salary AS salary
        FROM roles
        Join departments ON roles.department_id = departments.id
        `);
        console.table(res.rows);
        mainMenu();
};

const viewEmployees = async () => {
    const res = await client.query(`
        SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department,
        roles.salary, CONCAT(manager.first_name, '', manager.last_name) AS manager
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees manager ON employees.manager_id = manager.id
        `);
        console.table(res.rows);
        mainMenu();
};

const addDepartment = async () => {
    const answer = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the new department:'
    });

    await client.query('INSERT INTO departments (name) VALUES ($1)', [answer.name]);
    console.log(`added ${answer.name} to the database`);
    mainMenu();
};

const addRole = async () => {
    const departments = await client.query('SELECT * FROM departments');
    const departmentChoices = departments.rows.map(({ id, name }) => ({ name, value: id }));

    const answer = await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the new role:'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for the new role:'
        },
        {
            name: 'department_id',
            type: 'list',
            message: 'Select the department for the new role:',
            choices: departmentChoices
        }
    ]);

    await client.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [answer.title, answer.salary, answer.department_id]);
    console.log(`Added ${answer.title} to the database`);
    mainMenu();
};

const addEmployee = async () => {
    const roles = await client.query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

    const employees = await client.query('SELECT * FROM employees');
    const managerChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    managerChoices.unshift({ name: 'None', value: null });

    const answer = await inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'Enter the first name of the new employee:'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'Enter the last name of the new employee:'
        },
        {
            name: 'role_id',
            type: 'list',
            message: 'Select the role for the new employee:',
            choices: roleChoices
        },
        {
            name: 'manager_id',
            type: 'list',
            message: 'Select the manager for the new employee:',
            choices: managerChoices
        }
    ]);

    await client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]);
    console.log(`Added ${answer.first_name} ${answer.last_name} to the database`);
    mainMenu();
};

const updateEmployeeRole = async () => {
    const employees = await client.query('SELECT * FROM employees');
    const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const roles = await client.query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

    const managers = await client.query('SELECT * FROM employees');
    const managerChoices = managers.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    managerChoices.unshift({ name: 'None', value: null });

    const answer = await inquirer.prompt([
        {
            name: 'employee_id',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employeeChoices
        },
        {
            name: 'role_id',
            type: 'list',
            message: 'Select the new role for the employee:',
            choices: roleChoices
        },
        {
            name: 'manager_id',
            type: 'list',
            message: 'Select the manager for the employee:',
            choices: managerChoices
        }
    ]);

    await client.query('UPDATE employees SET role_id = $1, manager_id = $2 WHERE id = $3', [answer.role_id, answer.manager_id, answer.employee_id]);
    console.log('Updated employee role and manager');
    mainMenu();
};
const updateRole = async () => {
    const roles = await client.query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

    const answer = await inquirer.prompt([
        {
            name: 'role_id',
            type: 'list',
            message: 'Select the role to update:',
            choices: roleChoices
        },
        {
            name: 'title',
            type: 'input',
            message: 'Enter the new title for the role:'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the new salary for the role:'
        },
        {
            name: 'department_id',
            type: 'input',
            message: 'Enter the new department ID for the role:'
        }
    ]);

    await client.query('UPDATE roles SET title = $1, salary = $2, department_id = $3 WHERE id = $4', [answer.title, answer.salary, answer.department_id, answer.role_id]);
    console.log('Updated role');
    mainMenu();
};

const deleteEmployee = async () => {
    const employees = await client.query('SELECT * FROM employees');
    const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const answer = await inquirer.prompt({
        name: 'employee_id',
        type: 'list',
        message: 'Select the employee to delete:',
        choices: employeeChoices
    });

    await client.query('DELETE FROM employees WHERE id = $1', [answer.employee_id]);
    console.log('Deleted employee');
    mainMenu();
};

mainMenu();
