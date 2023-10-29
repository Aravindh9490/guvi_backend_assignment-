const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const databasePath = path.join(__dirname, "userData.db");

const app = express();

app.use(express.json());
app.use(cors());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(process.env.PORT || 3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const validatePassword = (password) => {
  return password.length > 4;
};

app.post("/register", async (request, response) => {
  const { email, password, confirm_password } = request.body;

  const selectUserQuery = `SELECT * FROM user WHERE email = '${email}';`;
  const databaseUser = await database.get(selectUserQuery);

  if (databaseUser === undefined && password === confirm_password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUserQuery = `
     INSERT INTO
      user (email, password)
     VALUES
      (
       '${email}',
       '${hashedPassword}'
      );`;
    if (validatePassword(password)) {
      await database.run(createUserQuery);
      response.send("User created successfully. Please Login");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

app.post("/login", async (request, response) => {
  const { email, password } = request.body;
  //   console.log(email, password);
  const selectUserQuery = `SELECT * FROM user WHERE email = '${email}';`;
  const databaseUser = await database.get(selectUserQuery);
  //   console.log(databaseUser);

  if (databaseUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,
      databaseUser.password
    );
    if (isPasswordMatched === true) {
      const payload = { email: email };
      const jwtToken = jwt.sign(payload, "abcdef");
      //   console.log(jwtToken);
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

const authentication = (request, response, next) => {
  let jwtToken;
  const token = request.headers["authorization"];
  if (token !== undefined) {
    jwtToken = token.split(" ")[1];
  }
  if (token === undefined) {
    response.status(401);
    res.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "abcdef", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  }
};

app.put("/change-password", authentication, async (request, response) => {
  const { email, oldPassword, newPassword } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE email = '${email}';`;
  const databaseUser = await database.get(selectUserQuery);
  if (databaseUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      databaseUser.password
    );
    if (isPasswordMatched === true) {
      if (validatePassword(newPassword)) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatePasswordQuery = `
          UPDATE
            user
          SET
            password = '${hashedPassword}'
          WHERE
            email = '${email}';`;

        const user = await database.run(updatePasswordQuery);

        response.send("Password updated");
      } else {
        response.status(400);
        response.send("Password is too short");
      }
    } else {
      response.status(400);
      response.send("Invalid current password");
    }
  }
});

app.put("/user-details", authentication, async (request, response) => {
  const {
    username,
    name,
    gender,
    location,
    email,
    age,
    mobile_num,
    dob,
    full_address,
  } = request.body;
  console.log(email);

  const selectUserQuery = `
  UPDATE 
  user
  SET
  username="${username}",
  name="${name}",
  gender="${gender}",
  location="${location}",
  age=${age},
  mobile_num=${mobile_num},
  dob="${dob}",
  full_address="${full_address}"

  WHERE
  email="${email}";
  `;
  const result = await database.run(selectUserQuery);
  const output = await database.get(
    `SELECT * FROM user WHERE email="${email}";`
  );

  //   response.send("successfully added");
  response.send({ output: output, statues: "successfully added" });
});

app.get("/all", async (req, res) => {
  const sqlQuery = `select * from user;`;
  const result = await database.all(sqlQuery);
  res.send(result);
});

module.exports = app;
