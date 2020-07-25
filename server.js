const connection = require("./db/db.js");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");

// Start Inquirer Prompts
const askQuestions = function() {
    console.log("****************************************************************");
    console.log("*----------------------------WELCOME---------------------------*");
    console.log("****************************************************************");
  inquirer
    .prompt({
      type: "list",
      name: "startPrompts",
      message: "Welcome to the Employee Tracker! What would you like to do?",
      choices: [
        "view all employees",
        "view all roles",
        "view all departments",
        "add employee",
        "add department",
        "add role",
        "update employee role",
      ]
    })
    .then(function(answer) {
      console.log(answer);
      switch (answer.startPrompts) {
        case "view all employees":
          viewallemployees();
          break;

        case "view all roles":
          viewallroles();
          break;

        case "view all departments":
          viewalldepartments();
          break;

        case "add employee":
          addEmployee();
          break;

        case "update employee role":
          updateEmployeeRole();
          break;

        case "update employee manager":
          updateEmployeeManager();
          break;

        case "add department":
          addDepartment();
          break;

        case "add role":
          addRole();
          break;
      }
    });
};
askQuestions();

function viewalldepartments() {
  connection.query("SELECT * FROM department", function(err, answer) {
    console.log("\n Departments Retrieved from Database \n");
    console.table(answer);
  });
  askQuestions();
}

function viewallroles() {
  connection.query("SELECT * FROM role", function(err, answer) {
    console.log("\n Roles Retrieved from Database \n");
    console.table(answer);
  });
  askQuestions();
}

function viewallemployees() {
  console.log("retrieving employees from database");
  var employeeQuery =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name " + 
    "AS department, CONCAT(manager.first_name,' ', manager.last_name) AS manager, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;";
  connection.query(employeeQuery, function(err, answer) {
    console.log("\n Employees retrieved from Database \n");
    if (err) {
      console.log(err)
    };
    console.table(answer);
  });
  askQuestions();
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter employee first name",
        name: "firstname"
      },
      {
        type: "input",
        message: "Enter employee last name",
        name: "lastname"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstname,
          last_name: answer.lastname,
          role_id: null,
          manager_id: null
        },
        function(err, answer) {
          if (err) {
            throw err;
          }
          console.table(answer);
        }
      );
      askQuestions();
    });
}

function updateEmployeeRole() {
  let allEmployees = [];
  connection.query("SELECT * FROM employee", function(err, answer) {
    // console.log(answer);
    for (let i = 0; i < answer.length; i++) {
      let employeeString =
        answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
      allEmployees.push(employeeString);
    }
    // console.log(allEmployees)

    inquirer
      .prompt([
        {
          type: "list",
          name: "updateEmployeeRole",
          message: "select employee to update role",
          choices: allEmployees
        },
        {
          type: "list",
          message: "select new role",
          choices: ["manager", "employee"],
          name: "newrole"
        }
      ])
      .then(function(answer) {
        console.log("about to update", answer);
        const idToUpdate = {};
        idToUpdate.employeeId = parseInt(answer.updateEmployeeRole.split(" ")[0]);
        if (answer.newrole === "manager") {
          idToUpdate.role_id = 1;
        } else if (answer.newrole === "employee") {
          idToUpdate.role_id = 2;
        }
        connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [idToUpdate.role_id, idToUpdate.employeeId],
          function(err, data) {
            askQuestions();
          }
        );
      });
  });
}
function updateEmployeeManager() {
  let allEmployees = [];
  connection.query("SELECT * FROM employee", function(err, answer) {
    // console.log(answer);
    for (let i = 0; i < answer.length; i++) {
      let employeeString =
        answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
      allEmployees.push(employeeString);
    }
    // console.log(allEmployees)

    inquirer
      .prompt([
        {
          type: "list",
          name: "updateEmployeeManager",
          message: "select employee to update their manager",
          choices: allEmployees
        },
        {
          type: "list",
          message: "select new manager",
          choices: allEmployees,
          name: "newmanager"
        }
      ])
      .then(function(answer) {
        console.log("about to update", answer);
        const idToUpdate = {};
        idToUpdate.employeeId = parseInt(answer.updateEmployeeManager.split(" ")[0]);
        if (answer.newrole === "manager") {
          idToUpdate.role_id = 1;
        } else if (answer.newrole === "employee") {
          idToUpdate.role_id = 2;
        }
        connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [idToUpdate.role_id, idToUpdate.employeeId],
          function(err, data) {
            askQuestions();
          }
        );
      });
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      message: "enter department name",
      name: "dept"
    })
    .then(function(answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.dept
        },
        function(err, answer) {
          if (err) {
            throw err;
          }
        }
      ),
        console.table(answer);
      askQuestions();
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "enter employee title",
        name: "addtitle"
      },
      {
        type: "input",
        message: "enter employee salary",
        name: "addsalary"
      },
      {
        type: "input",
        message: "enter employee department id",
        name: "addDepId"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.addtitle,
          salary: answer.addsalary,
          department_id: answer.addDepId
        },
        function(err, answer) {
          if (err) {
            throw err;
          }
          console.table(answer);
        }
      );
      askQuestions();
    });
}