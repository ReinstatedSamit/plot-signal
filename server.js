const server = require("http").createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method == "GET") {
    res.write(
      "<h1> Welcome to localhost:8080 ! <br/>This server is running... </h1>"
    );
    res.end();
  } else if (req.method == "POST") {
    var body = "";
    req.on("data", function (data) {
      body += data;
    });
    req.on("end", function () {
      total_number_of_data = parseInt(body);
      number_of_data = total_number_of_data /4;    // One fourth of total data
      increment = Math.ceil(total_number_of_data / 50);
    });
  }
});

const _ = require("lodash");
const loadDataFromSQL = require("./connection.js");
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});

let total_number_of_data = 20000; // By default shown data number
let number_of_data = Math.floor(total_number_of_data/4);  // One fourth of total data
let increment = 100;
let n = 0;

// Load data after every 2 seconds
let datas = loadDataFromSQL(total_number_of_data);
setInterval(async () => {
 let newData = await loadDataFromSQL(total_number_of_data);
 
 if(newData != datas){
  datas =newData;
}

 if ((n + number_of_data > total_number_of_data - 25)) {
  n =  0;
}

}, 2000);

// 1. listen for socket connections
io.on("connection",  (client) => {

  // Rolling Data after every 100 ms
  setInterval(async () => {
    // Increase the initial point to  for rolling data
    increaseNumber();

    // Sent data to the client after processing
    client.emit("myData", {
      channel1: {
        y: datas.channel0?.slice(n, n + number_of_data),
        x: _.range(n, n + number_of_data, 1),
      },
      channel2: {
        y: datas.channel3?.slice(n, n + number_of_data),
        x: _.range(n, n + number_of_data, 1),
      },
      channel3: {
        y: datas.channel4?.slice(n, n + number_of_data),
        x: _.range(n, n + number_of_data, 1),
      },
      channel4: {
        y: datas.channel5?.slice(n, n + number_of_data),
        x: _.range(n, n + number_of_data, 1),
      },
      channel5: {
        y: datas.channel6?.slice(n, n + number_of_data),
        x: _.range(n, n + number_of_data, 1),
      },
      channel6: {
        y: datas.channel7?.slice(n, n + number_of_data),
        x: _.range(n, n + number_of_data, 1),
      },
    });
  }, 300);
});

server.listen(8080);

const increaseNumber = () => {
  n += increment;
  // if (n + number_of_data + 20 < datas.channel0?.length) {
  //   n += increment;
  // }
};
