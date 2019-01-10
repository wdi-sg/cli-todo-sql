"use strict";
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING
    },
    {}
  );
  Employee.associate = function(models) {
    Employee.belongsTo(models.Role,{
      foreignKey: 'role_id',
    });
    Employee.belongsToMany(models.Task,{
      through: 'EmployeeTask',
      as: 'tasks',
      foreignKey: 'employee_id'
    })    
  };
  return Employee;
};
