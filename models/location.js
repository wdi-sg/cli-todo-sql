"use strict";
module.exports = (sequelize, DataTypes) => {
  const Building = sequelize.define(
    "Location",
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
  Building.associate = function(models) {
    // associations can be defined here
  };
  return Building;
};
