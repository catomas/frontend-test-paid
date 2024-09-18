import React from "react";

interface StatusCircleProps {
  status: "PENDING" | "ERROR" | "APPROVED" | "DECLINED";
}

const StatusCircle: React.FC<StatusCircleProps> = ({ status }) => {
  let color = "";
  let text = "";

  switch (status) {
    case "PENDING":
      color = "bg-yellow-500";
      text = "PENDING";
      break;
    case "ERROR":
      color = "bg-red-500";
      text = "ERROR";
      break;
    case "APPROVED":
      color = "bg-green-500";
      text = "SUCCESS";
      break;
    case "DECLINED":
      color = "bg-red-500";
      text = "DECLINED";
      break;
    default:
      color = "bg-yellow-500";
      text = "PENDING";
  }

  return (
    <div
      className={`w-32 h-32 rounded-full flex items-center justify-center ${color} animate-bounce`}
    >
      <span className="text-white text-xl font-bold">{text}</span>
    </div>
  );
};

export default StatusCircle;
