const bcrypt = require("bcryptjs");

const generateHash = async () => {
  const hashedPassword = await bcrypt.hash("Admin123", 10);

  console.log(hashedPassword);
};

generateHash();