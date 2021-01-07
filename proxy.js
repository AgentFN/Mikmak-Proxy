var net = require("net");
var fs = require("fs");
process.on("uncaughtException", function(error) {
  console.error(error);
});

var rules = JSON.parse(fs.readFileSync("./rules.json"));
var localport = "443"
var remotehost = "213.8.147.210"
var remoteport = "443"

var server = net.createServer(function (localsocket) {
  var remotesocket = new net.Socket();

  remotesocket.connect(remoteport, remotehost);

  localsocket.on('connect', function (data) {
    console.log(">>> connection #%d from %s:%d",
      server.connections,
      localsocket.remoteAddress,
      localsocket.remotePort
    );
  });

  localsocket.on('data', function (data) {
    rules = JSON.parse(fs.readFileSync("./rules.json"));
    // WE WRITE TO REMOTE SERVER
    console.log("%s:%d - writing data to remote",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    var flushed = remotesocket.write(data);
    console.log("\n\nREQUEST DATA > " + data.toString());
    if (!flushed) {
      console.log("  remote not flushed; pausing local");
      localsocket.pause();
    }
  });

  remotesocket.on('data', function(data) {
    console.log("%s:%d - writing data to local",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    console.log("data from remote socket:",data.toString());
    rules = JSON.parse(fs.readFileSync("./rules.json"));

    let tempered = null;

    rules.forEach(rule => {
      try{
        if (data.toString().indexOf(`{"t":"xt","b":{"r":-1,"o":{"rank":11,"userName":"יאיר539"`) === 0){
          fs.writeFileSync("output.txt", data.toString("base64"));
          console.log("overrwite!!!@!!!!!!");
          let buf = Buffer.from(`eyJ0IjoieHQiLCJiIjp7InIiOi0xLCJvIjp7InJhbmsiOjExLCJ1c2VyTmFtZSI6IteZ15DXmdeoNTM5IiwibGlzdCI6Ilt7XCJpZFwiOjQsXCJuYW1lXCI6J9ei15nXk9efINeU157XnNeaJyxcImlwXCI6JzEyNy4wLjAuMScsXCJwb3J0XCI6NDQzLFwiY2FwaWNpdHlcIjowLjEsXCJkdFwiOjF9LHtcImlkXCI6MixcIm5hbWVcIjonLi4uLi4uLi4uLicsXCJpcFwiOicyMTMuOC4xNDcuMTk2JyxcInBvcnRcIjo0NDMsXCJjYXBpY2l0eVwiOjIuMyxcImR0XCI6MjAyMDA3MzAyMjA3fSx7XCJpZFwiOjgsXCJuYW1lXCI6Jy4uLi4uLi4uLi4uLi4uLi4nLFwiaXBcIjonMjEzLjguMTQ3LjIwMicsXCJwb3J0XCI6NDQzLFwiY2FwaWNpdHlcIjozLjQsXCJkdFwiOjIwMjAwNzMwMjIwN30se1wiaWRcIjo3LFwibmFtZVwiOicuLi4uLi4uLi4uICcsXCJpcFwiOicyMTMuOC4xNDcuMjAxJyxcInBvcnRcIjo0NDMsXCJjYXBpY2l0eVwiOjEuNCxcInNhZmVcIjp0cnVlLFwiZHRcIjoyMDIwMDczMDIyMDd9LHtcImlkXCI6MSxcIm5hbWVcIjonLi4uLi4uLi4nLFwiaXBcIjonMjEzLjguMTQ3LjE5NScsXCJwb3J0XCI6NDQzLFwiY2FwaWNpdHlcIjoyLjMsXCJkdFwiOjIwMjAwNzMwMjIwN30se1wiaWRcIjoxMCxcIm5hbWVcIjonLi4uLi4uLi4uLi4uJyxcImlwXCI6JzIxMy44LjE0Ny4yMTQnLFwicG9ydFwiOjQ0MyxcImNhcGljaXR5XCI6MC4wLFwiZHRcIjoyMDIwMDczMDIyMDd9XSIsInNhZmVDaGF0IjpmYWxzZSwiX2NtZCI6InNlcnZlcl9saXN0In19fQA=`,"base64");
          data = buf;
      }
      if (data.toString().indexOf(`{"t":"xt","b":{"r":-1,"o":{"rank":1,"userName":"בברלי6313"`) === 0){
        fs.writeFileSync("output.txt", data.toString("base64"));
        console.log("overrwite!!!@!!!!!!");
        let buf = Buffer.from(`eyJ0IjoieHQiLCJiIjp7InIiOi0xLCJvIjp7InJhbmsiOjEsInVzZXJOYW1lIjoi15HXkdeo15zXmTYzMTMiLCJsaXN0IjoiW3tcImlkXCI6MSxcIm5hbWVcIjon16LXmdeT158nLFwiaXBcIjonMTI3LjAuMC4xJyxcInBvcnRcIjo0NDMsXCJjYXBpY2l0eVwiOjAuMSxcImR0XCI6MjAyMDA3MjYxNDU0fV0iLCJzYWZlQ2hhdCI6ZmFsc2UsIl9jbWQiOiJzZXJ2ZXJfbGlzdCJ9fX0A`,"base64");
        data = buf;
    }
         if (data.toString().indexOf(rule.when) !== -1){
            console.log("Running rule",rule.name);
            tempered = data.toString("utf8");  
            for (let key in rule.replace){
                while(tempered.indexOf(key) !== -1){
                  tempered = tempered.replace(key, rule.replace[key]);
                }
            }
         }
      }catch(ex){
          console.log("Error",ex);
      }
    });

    if (tempered !== null){
        console.log("response was tempered",tempered,"\n\n\n");
        data = tempered + decodeURIComponent("%00");
    }
   
    var flushed = localsocket.write(data);
    if (!flushed) {
      console.log("  local not flushed; pausing remote");
      remotesocket.pause();
    }
  });

  localsocket.on('drain', function() {
    console.log("%s:%d - resuming remote",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    remotesocket.resume();
  });

  remotesocket.on('drain', function() {
    console.log("%s:%d - resuming local",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    localsocket.resume();
  });

  localsocket.on('close', function(had_error) {
    console.log("%s:%d - closing remote",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    remotesocket.end();
  });

  remotesocket.on('close', function(had_error) {
    console.log("%s:%d - closing local",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    localsocket.end();
  });

});

server.listen(localport);

console.log("redirecting connections from 127.0.0.1:%d to %s:%d", localport, remotehost, remoteport);