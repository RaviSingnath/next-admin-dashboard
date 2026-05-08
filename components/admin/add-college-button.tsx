"use client";

import { Plus } from "lucide-react";
import Button from "../ui/button/Button";

export function AddCollegeButton() {
  const handleClick = () => {
    // your logic here
  };

  return (
    <Button onClick={handleClick} size="sm">
      <Plus className="w-4 h-4" />
      Add college
    </Button>
  );
}
