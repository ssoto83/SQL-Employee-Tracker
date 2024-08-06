INSERT INTO departments (name) VALUES ('Sales'), ('Engineering'), ('Finance');

INSERT INTO roles (title, salary, department_id) VALUES
('Sales Manager', 60000, 1),
('Software Engineer', 80000, 2),
('Accountant', 50000, 3);


INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Robert', 'Brown', 3, NULL),
('Julia', 'Banks', 1, NULL),
('Aaron', 'Smith', 2, NULL),
('Christina', 'Yang', 2, NULL);
