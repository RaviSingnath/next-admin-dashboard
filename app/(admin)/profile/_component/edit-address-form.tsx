import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appToast } from "@/lib/toast";
import { useAuth } from "@/context/AuthProvider";
import FormWrapper from "@/components/common/form-wrapper";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { AddressSearch } from "@/features/address/components/address-search";
import { TEditAddress, zEditAddress } from "@/features/address/address.schema";
import {
  handleActionError,
  handleUnexpectedError,
} from "@/lib/helper/error-handler";
import { updateAddressAction } from "../_lib/profile.actions";

type EditAddressFormProps = {
  closeModal: () => void;
};

export default function EditAddressForm({ closeModal }: EditAddressFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<TEditAddress>({
    resolver: zodResolver(zEditAddress),
    defaultValues: {
      city: user?.city || "",
      state_province: user?.state_province || "",
      country: user?.country || "",
      postal_code: user?.postal_code || "",
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
    try {
      console.log("formData: ", formData);

      const result = await updateAddressAction(formData);

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof TEditAddress, {
              type: "server",
              message: (messages as string[])[0],
            });
          });

          return;
        }

        handleActionError(result, router);

        return;
      }

      appToast.success("Address added successfully");

      reset();
      closeModal();
    } catch (error) {
      console.error(error);
      handleUnexpectedError(error);
    }
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
