"use client";

import { Trash2 } from "lucide-react";
import { Tooltip } from "react-tooltip";

type DeleteButtonProps = {
  handleClick: () => void;
  tooltip?: string;
};

const DeleteButton = ({ handleClick, tooltip }: DeleteButtonProps) => {
  return (
    <>
      <Trash2
        onClick={handleClick}
        size={16}
        className="delete-invite cursor-pointer"
      ></Trash2>
      {tooltip && (
        <Tooltip anchorSelect=".delete-invite" place="top">
          {tooltip}
        </Tooltip>
      )}
    </>
  );
};

export default DeleteButton;
