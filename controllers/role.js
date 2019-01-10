const Role = require("../models").Role;
const Employee = require("../models").Employee;

module.exports = {
  list(req, res) {
    return Role.findAll({
      include: [
        {
          model: Employee,
          as: "employees"
        }
      ]
    })
      .then(roles => console.log(roles))
      .catch(err => console.log(err));
  },
  add(req, res) {
    return Role.create({
      name: req.body.name
    })
      .then(role => console.log(role))
      .catch(err => console.log(err));
  },
  addEmployee(req, res) {
    return Role.findById(req.body.role_id, {
      include: [
        {
          model: Employee,
          as: "employees"
        }
      ]
    })
      .then(role => {
        if (!role) {
          console.log("no such role exist");
        }
        Employee.findById(req.body.employee_id).then(employee => {
          if (!employee) {
            console.log("no such employee");
          }
          role.addEmployee(employee);
          return console.log(role);
        });
      })
      .catch(err => console.log(err));
  }
};
