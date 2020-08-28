// Creating our category model
module.exports = function(sequelize, DataTypes) {
  const Category = sequelize.define(
    "Category",
    {
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      totalAnswered: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalCorrect: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["UserId", "categoryName"]
        }
      ]
    }
  );

  Category.associate = function(models) {
    Category.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      },
      onDelete: "cascade"
    });
  };

  return Category;
};