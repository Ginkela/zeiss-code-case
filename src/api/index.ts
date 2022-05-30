import axios from "axios";
import { io } from "socket.io-client";

const origin = "http://codingcase.zeiss.services";

export const getMachines = () => {
  return axios
    .get(`${origin}/api/v1/machines`)
    .then((res) => res.data);
}

export const getSingleMachine = (id: string) => {
  return axios.get(`${origin}/api/v1/machines/${id}`).then((res) => res.data);;
};

export const subscribe = (cb: (data: WsData) => void) => {
  const wsUrl = "ws://codingcase.zeiss.services/ws";
  var socket = new WebSocket(wsUrl);
  socket.onopen = function () {
    console.log("open");
  };

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data) ?? {};
    cb(data?.payload);
  };
};

export interface WsData {
  timestamp: string;
  status: string;
  machine_id: string;
  id: string;
}