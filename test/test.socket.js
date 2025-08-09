const  { io } =  require("socket.io-client");
const readline = require("readline");

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function main() {
  let encrypted_auth_token = await ask("enter tyour auth token: ");
  const PHONE_NUMBER_TO_CHAT = await ask("enter the phone number to chat with: ");

  const socket = io("http://localhost:3000", {
    auth: {
      token: encrypted_auth_token, // sent during handshake
    },
    transports: ["websocket"], // optional, to force WebSocket
  });

  socket.on("connect", async () => {
    console.log("✅ Connected with ID:", socket.id);

    i = 1;
    while (i > 0){
      i++
      if (i > 10000000){
        i = 1
        const msg = await ask(`enter your message to ${PHONE_NUMBER_TO_CHAT} or 'exit' to end chat: `)
        if (msg.trim() == 'exit'){
          i = 0
          return;
        }
        socket.emit("newMessage", {
          msg: msg,
          phone_number: PHONE_NUMBER_TO_CHAT,
        });
      }
    }
  });

  socket.on("messageSent", ({ msg, phone_number }) => {
    console.log("✅ message sent to " + phone_number + ":", msg);
  });

  socket.on("messageRecieved", ({ msg, phone_number }) => {
    console.log("✅ message recieved from " + phone_number + ":", msg);
  });

  socket.on("connect_error", (err) => {

    console.error("❌ Connection failed:", err.message);
  });
}

main()




