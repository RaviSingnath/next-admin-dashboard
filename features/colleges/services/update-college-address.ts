import { TEditAddress } from "@/features/address/address.schema";
import { AddressAdd, AddressUpdate } from "@/features/address/types";
import { RequestContext } from "@/lib/auth/request-context";
import mapAddressFormToDb from "@/lib/helper/map-address";
import {
  addAddressToCollege,
  updateCollegeAddress,
} from "../college.mutations";
import { mapSupabaseError } from "@/lib/errors/supabase-error";
import { addAddress } from "@/features/address/address.mutations";
import { Errors } from "@/lib/errors/error-factory";

type updateAddrerssServiceInput = {
  ctx: RequestContext;
  data: TEditAddress;
};

export async function updateCollegeAddrerssService({
  ctx,
  data,
}: updateAddrerssServiceInput) {
  if (ctx.user.status !== "active") {
    throw new Error("Inactive users cannot edit address");
  }

  if (!ctx.user.college_id) throw Errors.collegeNotAssigned();

  let dbData: AddressAdd | AddressUpdate = await mapAddressFormToDb(data);

  if (ctx.user.college_address_id) {
    const { data: updatedProfileAddress, error: updateProfileAddressError } =
      await updateCollegeAddress(ctx.user.college_address_id, dbData);

    if (updateProfileAddressError)
      throw mapSupabaseError(updateProfileAddressError);

    return {
      profile: updatedProfileAddress,
    };
  } else {
    dbData = { ...dbData, created_by: ctx.user.id };

    const { data: addressAdded, error: addressAddedError } =
      await addAddress(dbData);
    if (addressAddedError) throw addressAddedError;

    const { error: addProfileAddressError } = await addAddressToCollege(
      ctx.user.college_id,
      addressAdded.id,
    );

    if (addProfileAddressError) throw mapSupabaseError(addProfileAddressError);

    return {
      profile: addressAdded,
    };
  }
}
