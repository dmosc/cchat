import { io, Socket } from "socket.io-client";

class SocketClient {
  private socket: Socket;
  private static instance: SocketClient;

  private constructor() {
    this.socket = io({ path: "/api/socket" });
  }

  static getInstance() {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  emit(payload: { event: string; [key: string]: any }) {
    fetch("/api/socket-forward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  }
}

export default SocketClient.getInstance();
