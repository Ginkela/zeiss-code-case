import React, { useState } from "react";
import { Modal } from "antd";
import { MachineEvent } from "./machine";
import "antd/lib/modal/style/css";

const HistoryModal: React.FC<ModalProps> = ({ handleOk, visible, events }) => {
  return (
    <>
      <Modal
        title="Update History"
        visible={visible}
        footer={null}
        onCancel={handleOk}
      >
        <div className="content" style={{maxHeight: 1000, overflow: 'auto'}}>
          {events?.map((event) => (
            <div
              className="event"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>{event?.status}</span> <span>{event?.timestamp}</span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default HistoryModal;

interface ModalProps {
  handleOk: () => void;
  visible?: boolean;
  events: MachineEvent[];
}
