'use strict';
module.exports = (sequelize, DataTypes) => {
  const EmployeeTask = sequelize.define('EmployeeTask', {
    employee_id: DataTypes.UUID,
    task_id: DataTypes.UUID
  }, {});
  EmployeeTask.associate = function(models) {
    // associations can be defined here
  };
  return EmployeeTask;
};