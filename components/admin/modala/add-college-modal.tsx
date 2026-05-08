"use client";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

type AddCollegeModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export function AddCollegeModal({ isOpen, closeModal }: AddCollegeModalProps) {
  const handleAddCollege = () => {
    // Handle save logic here
    console.log("Saving changes...");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] m-4 text-start"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add college
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Enter the details below to register a new college in the system.
            Once added, you can assign admins and configure departments and
            courses.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                College Information
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 ">
                  <Label>College Name</Label>
                  <Input type="text" defaultValue="Musharof" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Email Address</Label>
                  <Input type="text" defaultValue="randomuser@pimjo.com" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Phone</Label>
                  <Input type="text" defaultValue="+09 363 398 46" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Country</Label>
                  <Input type="text" defaultValue="United States" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>State</Label>
                  <Input type="text" defaultValue="United States" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>City</Label>
                  <Input type="text" defaultValue="United States" />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Postal Code</Label>
                  <Input type="text" defaultValue="United States" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleAddCollege}>
              Add College
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
