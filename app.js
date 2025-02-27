import express, { urlencoded } from "express";
import cors from "cors";
import mysql from "mysql2";
import "dotenv/config"; // This automatically loads the .env file
import morgan from "morgan";
import { default as expressWs } from "express-ws";

// express-app/app.js

// import submitFormRouter from './app/api/submitform.js';
// import signupRouter from './app/api/signup.js';
// console.log = function () {}; // Disables all console.log statements
const app = express();
const ws = expressWs(app);
const clients = new Set();
// const wss = new WebSocket('ws://localhost:3006');

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));

// Default route
app.get("/", (req, res) => {
  res.send({ error: false, message: "hello world" });
});
console.log(process.env.DB_HOST);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database.");
});

app.get("/test", (req, res) => {
  const sql = "SELECT 1 + 1 AS solution";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});

app.get("/start", (req, res) => {
  const sql = 'UPDATE Fields SET value = "True" WHERE field_name = "START"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});

app.get("/Fields", (req, res) => {
  const sql = `SELECT value FROM Fields where field_name = ${req.query.field_name}`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.send(results);
  });
});

app.get("/Readings", (req, res) => {
  const sql = `SELECT ID_Reading,OD_Reading FROM Readings ORDER BY ID DESC LIMIT 20`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.send(results);
  });
});

app.get("/Tables", (req, res) => {
  const sql = `SELECT * FROM Df ORDER BY ID`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed: ", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.send(results);
  });
});

app.get("/delete/Tables", (req, res) => {
  const sql = `DELETE FROM Df WHERE ID = ${req.query.ID}`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send(results);
  });
});

app.post("/insert/Tables", (req, res) => {
  console.log(req.body);
  let keys = "";
  let values = "";
  for (const [key, value] of Object.entries(req.body)) {
    keys += `${key} ,`;
    values += `'${value}' ,`;
  }
  const sql = `INSERT INTO Df (${keys.slice(0, -1)}) VALUE (${values.slice(
    0,
    -1
  )})`;
  console.log(sql);
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send(results);
  });
});

app.post("/update/Tables", (req, res) => {
  console.log(req.body);
  let string = "";
  for (const [key, value] of Object.entries(req.body)) {
    string += `${key} = '${value}' ,`;
  }
  const sql = `UPDATE Df SET ${string.slice(0, -1)} WHERE ID = ${req.body.ID}`;
  console.log(sql);
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send(results);
  });
});

app.post("/login", (req, res) => {
 
  if (req.body.username == "admin" && req.body.password == "admin") {
    res.send({ success: true, session: "DJ06QPIFTAK4AWXB229J" ,role:"admin"});
  }
  else if (req.body.username == "operator" && req.body.password == "operator") {
    res.send({ success: true, session: "DJ06QPIFTAK4AWXB229J" ,role:"operator"});
  }
  else {res.send({ success: false });}
});

app.get("/NewEntry", (req, res) => {
  const sql = `UPDATE Fields SET value = "False" WHERE field_name = "NEW_ENTRY"`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});

app.get("/Start", (req, res) => {
  const sql = `UPDATE Fields SET value = "True" WHERE field_name = "START"`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});
app.get("/Index", (req, res) => {
  const sql = `UPDATE Fields SET value = "False" WHERE field_name = "INSERT_INDEXING"`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});


// app.get("/Semifinish", (req, res) => {
//   const sql = `UPDATE Fields SET value = "False" WHERE field_name = "SemiFinish"`;
//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error("Database test query failed:", err.message);
//       return res.status(505).send("Database test query failed");
//     }
//     res.status(200).send({ results });
//   });
// });

// app.get("/roughinginsert", (req, res) => {
//   const sql = `UPDATE Fields SET value = "False" WHERE field_name = "RoughingInsert"`;
//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error("Database test query failed:", err.message);
//       return res.status(505).send("Database test query failed");
//     }
//     res.status(200).send({ results });
//   });
// });

app.get("/Tool2", (req, res) => {
  console.log("updating")
  const sql = 'UPDATE Fields SET value = "True" WHERE field_name = "RoughingInsert"';
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
  console.log("finished")
});
app.get("/updateTool2", (req, res) => {
  console.log("Updating TOOL2 and RoughingInsert...");

  const updateTool2 = `UPDATE Fields SET value = "False" WHERE field_name = "TOOL2"`;
  const updateRoughingInsert = `UPDATE Fields SET value = "True" WHERE field_name = "RoughingInsert"`;

  connection.query(updateTool2, (err, result1) => {
    if (err) {
      console.error("Failed to update TOOL2:", err.message);
      return res.status(500).send("Failed to update TOOL2");
    }

    connection.query(updateRoughingInsert, (err, result2) => {
      if (err) {
        console.error("Failed to update RoughingInsert:", err.message);
        return res.status(500).send("Failed to update RoughingInsert");
      }

      console.log("Finished updating TOOL2 and RoughingInsert.");
      res.status(200).send({ message: "Tool2 and RoughingInsert updated successfully" });
    });
  });
});


app.get("/updateTool3", (req, res) => {
  console.log("Updating TOOL2 and RoughingInsert...");

  const updateTool2 = `UPDATE Fields SET value = "False" WHERE field_name = "TOOL3"`;
  const updateRoughingInsert = `UPDATE Fields SET value = "True" WHERE field_name = "SemiFinish"`;

  connection.query(updateTool2, (err, result1) => {
    if (err) {
      console.error("Failed to update TOOL2:", err.message);
      return res.status(500).send("Failed to update TOOL2");
    }

    connection.query(updateRoughingInsert, (err, result2) => {
      if (err) {
        console.error("Failed to update RoughingInsert:", err.message);
        return res.status(500).send("Failed to update RoughingInsert");
      }

      console.log("Finished updating TOOL2 and RoughingInsert.");
      res.status(200).send({ message: "Tool2 and RoughingInsert updated successfully" });
    });
  });
});


app.get("/updateTool8", (req, res) => {
  console.log("Updating TOOL2 and RoughingInsert...");

  const updateTool2 = `UPDATE Fields SET value = "False" WHERE field_name = "TOOL8"`;
  const updateRoughingInsert = `UPDATE Fields SET value = "True" WHERE field_name = "INSERT_INDEXING"`;

  connection.query(updateTool2, (err, result1) => {
    if (err) {
      console.error("Failed to update TOOL2:", err.message);
      return res.status(500).send("Failed to update TOOL2");
    }

    connection.query(updateRoughingInsert, (err, result2) => {
      if (err) {
        console.error("Failed to update RoughingInsert:", err.message);
        return res.status(500).send("Failed to update RoughingInsert");
      }

      console.log("Finished updating TOOL2 and RoughingInsert.");
      res.status(200).send({ message: "Tool2 and RoughingInsert updated successfully" });
    });
  });
});

app.get("/stillokTool2", (req, res) => {
  const sql = 'UPDATE Fields SET value = "False" WHERE field_name = "TOOL2"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});

app.get("/stillokTool3", (req, res) => {
  const sql = 'UPDATE Fields SET value = "False" WHERE field_name = "TOOL3"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});


app.get("/stillokTool8", (req, res) => {
  const sql = 'UPDATE Fields SET value = "False" WHERE field_name = "TOOL8"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});




app.get("/Tool2value", (req, res) => {
  console.log("updating")
  const sql = 'UPDATE Fields SET value = "False" WHERE field_name = "TOOL2"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
  console.log("finished")
});


app.get("/Tool3", (req, res) => {
  const sql = 'UPDATE Fields SET value = "True" WHERE field_name = "SemiFinish"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});

app.get("/Tool8", (req, res) => {
  const sql = 'UPDATE Fields SET value = "True" WHERE field_name = "INSERT_INDEXING"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});

app.get("/Toolsvalue", (req, res) => {
  const sql = 'SELECT field_name AS name, value FROM Fields WHERE field_name IN ("TOOL2", "TOOL3", "TOOL8")';

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database query failed:", err.message);
      return res.status(500).send("Database query failed");
    }

    res.status(200).json({ values: results });
  });
});

app.get("/usllsl", (req, res) => {
 

  const sql = "SELECT Feature,USL, LSL FROM Df";  // double-check case of table and columns

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Database query failed:", err);  // This logs exact MySQL error
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }
    console.log(result)

    res.json({ results: result });
  });
});







app.post("/addReason", (req, res) => {
  const { reason } = req.body; // Get reason from request body

  if (!reason) {
      return res.status(400).json({ message: "Reason is required" });
  }

  const sql = "INSERT INTO reasons (reason) VALUES (?)";
  
  connection.query(sql, [reason], (err, results) => {
      if (err) {
          console.error("Database insert failed:", err.message);
          return res.status(500).json({ message: "Database insert failed" });
      }
      res.status(200).json({ message: "Reason added successfully!", results });
  });
});


app.post('/logindetails', (req, res) => {
  const { role } = req.body;
  if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
  }

  const query = "INSERT INTO user_logins (username) VALUES (?)";
  connection.query(query, [role], (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Login role stored successfully" });
  });
});







app.get("/Tool", (req, res) => {
  const sql = `UPDATE Fields SET value = "False" WHERE field_name = "TOOL_BROKEN"`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});

app.get("/lastEntry", (req, res) => {
  const sql = `SELECT LSL,USL FROM Df ORDER BY ID DESC LIMIT 1`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});

app.get("/extremeshift", (req, res) => {
 
  const sql = `SELECT value FROM Fields WHERE field_name="Extremeshift"`;
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database query failed:", err.message);
      return res.status(500).send("Database query failed"); // Use 500 for server errors
    }
    
    // Assuming results is an array and you want to send it back
    res.status(200).send({ results });
  });
});


app.get("/Setup", (req, res) => {
  const sql = `
    UPDATE Fields 
    SET value = 'True' 
    WHERE field_name = 'SETUP';

    UPDATE Fields 
    SET value = 'False' 
    WHERE field_name = 'CALIBRATION';

    UPDATE Fields 
    SET value = 'False' 
    WHERE field_name IN ('LOW', 'HIGH', 'MEDIUM', 'ZERO', 'START');
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});


app.get("/Calibration", (req, res) => {
  const sql = `
  UPDATE Fields 
  SET value = "True" 
  WHERE field_name = "CALIBRATION";
  
  UPDATE Fields 
  SET value = "False" 
  WHERE field_name = "SETUP";
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});

app.get("/BP", (req, res) => {
  const sql = `UPDATE Fields SET value = "True" WHERE field_name = "BP";`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});

app.get("/Home", (req, res) => {
  const sql = `UPDATE Fields SET value = "False" WHERE field_name = "CALIBRATION";  
  UPDATE Fields SET value = "False" WHERE field_name = "SETUP";`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Database test query failed:", err.message);
      return res.status(505).send("Database test query failed");
    }
    res.status(200).send({ results });
  });
});
const checkFlag = () => {
  connection.query("SELECT * FROM Fields", (error, results) => {
    if (error) throw error;

    // If the flag is true, send a message to all connected WebSocket clients
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        const result = results.reduce((acc, item) => {
          acc[item.field_name] = item.value;
          return acc;
        }, {});
        client.send(JSON.stringify(result));
      }
    });

    // Optionally, reset the flag to false after sending the message
    // connection.query('UPDATE Flags SET value = false WHERE flag_name = "my_flag"');
  });
};

// Periodically check the flag every 5 seconds
setInterval(checkFlag, 100);
app.ws("/ws", (ws, req) => {
  console.log("New WebSocket client connected!");
  
  clients.add(ws);

  ws.on("message", (msg) => {
    console.log("Received message:", msg);
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    clients.delete(ws);
  });

  // Send an initial message to confirm connection
  ws.send(JSON.stringify({ message: "Connected to WebSocket server!" }));
});



// Start the server
const port = 3006; // Choose a port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


export default app;