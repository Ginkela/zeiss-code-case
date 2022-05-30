import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/lib/table";

import { getMachines, getSingleMachine, subscribe, WsData } from "../api/index";
import Modal from "./historyModal";
import useFreshCallback from "../hook/use-fresh-callback";
import "antd/lib/table/style/css";
import "antd/lib/tag/style/css";

const Machine = () => {
  const [machines, setMachines] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [events, setEvents] = useState<MachineEvent[]>([]);

  const handleCheck = (id: string) => {
    handleGetSingleMachine(id).then((res) => {
      setEvents(res?.data?.events ?? []);
      setVisible(true);
    });
  };

  const columns: ColumnsType<MachineType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "machineType",
      dataIndex: "machineType",
      key: "machineType",
    },
    {
      title: "status",
      key: "status",
      dataIndex: "status",
      width: 200,
      render: (status: string) => {
        const colorMap: { [key: string]: string } = {
          running: "green",
          finished: "orange",
          errored: "red",
          idle: "geekblue",
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: "options",
      key: "options",
      dataIndex: "options",
      render: (_, record: MachineType) => {
        return (
          <a onClick={() => handleCheck(record?.id)}>checkUpdateHistory</a>
        );
      },
    },
  ];

  const onWsMessage = (data: WsData) => {
    if (!data) return;
    console.log(data);
    const newMachines = machines.map((item) => {
      if (item.id === data?.machine_id) {
        return { ...item, status: data?.status };
      }
      return item;
    });
    setMachines(newMachines);
  };

  const { freshCallback } = useFreshCallback({ callback: onWsMessage });

  const handleSubscribe = () => {
    subscribe(freshCallback);
  };

  const handleGetSingleMachine = (id: string) => {
    return getSingleMachine(id).catch((err) => {
      console.log("error: ", JSON.stringify(err));
      throw err;
    });
  };

  const handleGetMachines = () => {
    getMachines()
      .then((res) => {
        const { data = {} } = res;
        const machines = data.map((i: MachineType) => ({
          id: i?.id,
          machineType: i?.machine_type,
          status: i?.status,
        }));
        setMachines(machines);
      })
      .catch((err) => {
        console.log("error: ", JSON.stringify(err));
      });
  };

  useEffect(() => {
    handleSubscribe();
    handleGetMachines();
  }, []);

  return (
    <div className="wrapper">
      <div className="tableWrapper">
        <Table columns={columns} dataSource={machines} pagination={false} />
      </div>
      <Modal events={events} visible={visible} handleOk={() => setVisible(false)} />
    </div>
  );
};

export default Machine;

export interface MachineType {
  floor: number;
  id: string;
  install_date: string;
  last_maintenance: string;
  latitude: number;
  longitude: number;
  machine_type: string;
  status: string;
}

export interface MachineEvent {
  timestamp: string;
  status: string;
}
