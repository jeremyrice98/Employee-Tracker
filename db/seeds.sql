USE employee_tracker

INSERT INTO department (id, name)
VALUES 
    (1, "Manager"),
    (2, "HR"),
    (3, "IT");

INSERT INTO role (id, title, salary, department_id)
VALUES 
    (1, "Manager", 200000, 1),
    (2, "Employee", 150000, 2);


INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES 
    (1, "Jeremy", "Rice", 1, Null),
    (2, "Mckenzie", "Bergon", 2, 1);