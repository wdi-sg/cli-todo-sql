"use strict";
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING,
      done: DataTypes.BOOLEAN,
      description: DataTypes.STRING
    },
    {}
  );
  Task.associate = function(models) {
    Task.belongsTo(models.Building,{
      foreignKey:'building_id',
    });
    Task.belongsToMany(models.Employee,{
      through: 'EmployeeTask',
      as: 'employees',
      foreignKey: 'task_id'
    })
  };
  return Task;
};
