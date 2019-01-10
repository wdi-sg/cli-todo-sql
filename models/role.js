"use strict";
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING
    },
    {}
  );
  Role.associate = function(models) {
    Role.hasMany(models.Employee, {
      foreignKey: "role_id",
      as: "employees"
    });
  };
  return Role;
};

