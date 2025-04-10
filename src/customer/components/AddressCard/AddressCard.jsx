import React from "react";
import { Checkbox } from "@mui/material";

const AddressCard = ({ address, isSelected, onSelect }) => {
  const handleSelect = () => {
    onSelect(address.addressId); // Gọi hàm onSelect khi địa chỉ được chọn
  };

  return (
    <div className="flex border rounded-lg shadow-2xl p-4">
      <Checkbox
        checked={isSelected}
        onChange={handleSelect}
        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
      />
      <div className="flex flex-wrap flex-col ml-4">
        <div>
          <p className="font-semibold">
            {address.lastName} {address.firstName}
          </p>
          <p>{address.addressLine}</p>
          <p>
            {address.ward}, {address.district}, {address.province}
          </p>
        </div>
        <div className="mt-2">
          <p className="font-semibold">Số điện thoại</p>
          <p>{address.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
