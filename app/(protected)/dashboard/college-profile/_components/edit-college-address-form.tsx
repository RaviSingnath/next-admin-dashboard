"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "@/components/common/form-wrapper";
import handleFormSubmit from "@/lib/helper/handle-form-submit";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { AddressSearch } from "@/features/address/components/address-search";
import { TEditAddress, zEditAddress } from "@/features/address/address.schema";
import { updateCollegeAddressAction } from "../_lib/college-profile.action";
import { CollegeAddress } from "@/features/colleges/queries/get-college-with-address";

type EditCollegeAddressFormProps = {
  closeModal: () => void;
  collegeAddress: CollegeAddress;
};

export default function EditCollegeAddressForm({
  closeModal,
  collegeAddress,
}: EditCollegeAddressFormProps) {
  const router = useRouter();

  const form = useForm<TEditAddress>({
    resolver: zodResolver(zEditAddress),
    defaultValues: {
      city: collegeAddress?.city || "",
      state_province: collegeAddress?.state_province || "",
      country: collegeAddress?.country || "",
      postal_code: collegeAddress?.postal_code || "",
    },
  });

  const {
    register,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onUserSelectAddress = (address: TEditAddress) => {
    reset(address, {
      keepDirty: true,
      keepErrors: true,
      keepTouched: true,
      keepDefaultValues: false,
    });
  };

  const onSubmit = async (formData: TEditAddress) => {
    await handleFormSubmit({
      action: () => updateCollegeAddressAction(formData),
      setError,
      router,
      successMessage: "College address updated successfully",
      onSuccess: () => {
        reset();
        closeModal();
      },
    });
  };

  return (
    <FormWrapper
      form={form}
      closeModal={closeModal}
      onSubmit={onSubmit}
      isPending={isSubmitting}
      submitLabel="Update"
      pendingLabel="Updating..."
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <Label>Search Address</Label>
          <AddressSearch onSelect={onUserSelectAddress} />
        </div>

        <div>
          <Label>Country</Label>
          <Input
            type="text"
            error={!!errors.country}
            hint={errors.country?.message}
            {...register("country")}
          />
        </div>

        <div>
          <Label>State</Label>
          <Input
            type="text"
            error={!!errors.state_province}
            hint={errors.state_province?.message}
            {...register("state_province")}
          />
        </div>

        <div>
          <Label>City</Label>
          <Input
            type="text"
            error={!!errors.city}
            hint={errors.city?.message}
            {...register("city")}
          />
        </div>

        <div>
          <Label>Postal Code</Label>
          <Input
            type="text"
            error={!!errors.postal_code}
            hint={errors.postal_code?.message}
            {...register("postal_code")}
          />
        </div>
      </div>
    </FormWrapper>
  );
}
