import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddressCard from "../AddressCard/AddressCard";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { getUserAddresses, addAddress, updateOrderAddress } from "../../../State/Auth/Action";
import { useNavigate } from "react-router-dom";

const ConfirmDeliverAddress = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addresses, addressesLoading, addressesError } = useSelector(
    (state) => state.auth
  );

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    dispatch(getUserAddresses());
  }, [dispatch]);

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
        if (!res.ok) throw new Error("Something went wrong with fetching province");
        const data = await res.json();
        setProvinces(data.data || []);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    }
    fetchProvinces();
  }, []);

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const addressData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      addressLine: formData.get("address"),
      province: selectedProvince || "",
      district: selectedDistrict || "",
      ward: selectedWard || "",
      phoneNumber: formData.get("phoneNumber"),
      isDefault: false,
    };

    if (
      !addressData.firstName ||
      !addressData.lastName ||
      !addressData.addressLine ||
      !addressData.phoneNumber ||
      !addressData.province ||
      !addressData.district ||
      !addressData.ward
    ) {
      alert(
        "Vui lòng điền đầy đủ thông tin, bao gồm Tỉnh/Thành phố, Quận/Huyện, và Phường/Xã!"
      );
      return;
    }

    try {
      // Thêm địa chỉ mới
      const savedAddress = await dispatch(addAddress(addressData));

      const orderId = localStorage.getItem("pendingOrderId");
      if (!orderId) {
        alert("Không tìm thấy đơn hàng để cập nhật địa chỉ!");
        return;
      }

      // Cập nhật địa chỉ vào đơn hàng
      await dispatch(updateOrderAddress(orderId, savedAddress.payload));

      localStorage.removeItem("pendingOrderId");
      navigate("/order-confirmation", { state: { orderId } });
    } catch (error) {
      console.error("Failed to update order address:", error);
      alert("Có lỗi xảy ra khi cập nhật địa chỉ: " + error.message);
    }
  };

  const handleConfirmWithSelectedAddress = async () => {
    if (!selectedAddressId) {
      alert("Vui lòng chọn một địa chỉ giao hàng!");
      return;
    }

    const selectedAddress = addresses.find((addr) => addr.addressId === selectedAddressId);
    if (!selectedAddress) {
      alert("Địa chỉ không hợp lệ!");
      return;
    }

    const addressData = {
      firstName: selectedAddress.firstName,
      lastName: selectedAddress.lastName,
      addressLine: selectedAddress.addressLine,
      province: selectedAddress.province,
      district: selectedAddress.district,
      ward: selectedAddress.ward,
      phoneNumber: selectedAddress.phoneNumber,
      isDefault: selectedAddress.isDefault,
    };

    try {
      const orderId = localStorage.getItem("pendingOrderId");
      if (!orderId) {
        alert("Không tìm thấy đơn hàng để cập nhật địa chỉ!");
        return;
      }

      // Cập nhật địa chỉ vào đơn hàng
      await dispatch(updateOrderAddress(orderId, addressData));

      localStorage.removeItem("pendingOrderId");
      navigate("/order-confirmation", { state: { orderId } });
    } catch (error) {
      console.error("Failed to update order address:", error);
      alert("Có lỗi xảy ra khi cập nhật địa chỉ: " + error.message);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 grid grid-cols-1 border rounded-e-sm shadow-md h-[30rem] overflow-y-scroll">
          {addressesLoading ? (
            <p>Loading addresses...</p>
          ) : addressesError ? (
            <p>Error: {addressesError}</p>
          ) : addresses.length === 0 ? (
            <p>Không có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
          ) : (
            addresses.map((address) => (
              <div
                key={address.addressId}
                className="p-5 py-7 border-b cursor-pointer"
              >
                <AddressCard
                  address={address}
                  isSelected={selectedAddressId === address.addressId}
                  onSelect={handleSelectAddress}
                />
                {selectedAddressId === address.addressId && (
                  <Button
                    onClick={handleConfirmWithSelectedAddress}
                    sx={{ mt: 2 }}
                    size="large"
                    variant="contained"
                  >
                    Giao ở địa chỉ này
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="col-span-2 grid grid-cols-2">
          <div className="col-span-3">
            <Box className="w-full border rounded-s-md shadow-md p-5">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  <div className="col-span-1 grid grid-cols-1">
                    <TextField
                      required
                      id="lastName"
                      name="lastName"
                      label="Họ"
                      fullWidth
                      autoComplete="family-name"
                    />
                  </div>
                  <div className="col-span-1 grid grid-cols-1">
                    <TextField
                      required
                      id="firstName"
                      name="firstName"
                      label="Tên"
                      fullWidth
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="col-span-2 grid grid-cols-1">
                    <TextField
                      required
                      id="address"
                      name="address"
                      label="Địa chỉ"
                      fullWidth
                      autoComplete="address"
                      multiline
                      rows={4}
                    />
                  </div>
                  <div className="col-span-1 grid grid-cols-1">
                    <Autocomplete
                      id="province"
                      options={provinces}
                      getOptionLabel={(option) => option.full_name || ""}
                      onChange={async (event, newValue) => {
                        setSelectedProvince(newValue?.full_name || null);
                        setSelectedDistrict(null);
                        setSelectedWard(null);
                        if (newValue) {
                          try {
                            const res = await fetch(
                              `https://esgoo.net/api-tinhthanh/2/${newValue.id}.htm`
                            );
                            if (!res.ok) throw new Error("Get Districts fail");
                            const data = await res.json();
                            setDistricts(data.data || []);
                          } catch (error) {
                            console.error("Failed to fetch districts:", error);
                            setDistricts([]);
                          }
                        } else {
                          setDistricts([]);
                          setWards([]);
                        }
                      }}
                      value={provinces.find((p) => p.full_name === selectedProvince) || null}
                      renderInput={(params) => (
                        <TextField
                          required
                          {...params}
                          label="Tỉnh/Thành phố"
                          variant="outlined"
                          fullWidth
                          error={!selectedProvince}
                          helperText={!selectedProvince ? "Vui lòng chọn Tỉnh/Thành phố" : ""}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-1 grid grid-cols-1">
                    <Autocomplete
                      id="district"
                      options={districts}
                      getOptionLabel={(option) => option.full_name || ""}
                      onChange={async (event, newValue) => {
                        setSelectedDistrict(newValue?.full_name || null);
                        setSelectedWard(null);
                        if (newValue) {
                          try {
                            const res = await fetch(
                              `https://esgoo.net/api-tinhthanh/3/${newValue.id}.htm`
                            );
                            if (!res.ok) throw new Error("Get Wards fail");
                            const data = await res.json();
                            setWards(data.data || []);
                          } catch (error) {
                            console.error("Failed to fetch wards:", error);
                            setWards([]);
                          }
                        } else {
                          setWards([]);
                        }
                      }}
                      value={districts.find((d) => d.full_name === selectedDistrict) || null}
                      renderInput={(params) => (
                        <TextField
                          required
                          {...params}
                          label="Quận/Huyện"
                          variant="outlined"
                          fullWidth
                          error={!selectedDistrict}
                          helperText={!selectedDistrict ? "Vui lòng chọn Quận/Huyện" : ""}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-1 grid grid-cols-1">
                    <Autocomplete
                      id="ward"
                      options={wards}
                      getOptionLabel={(option) => option.full_name || ""}
                      onChange={(event, newValue) => {
                        setSelectedWard(newValue?.full_name || null);
                      }}
                      value={wards.find((w) => w.full_name === selectedWard) || null}
                      renderInput={(params) => (
                        <TextField
                          required
                          {...params}
                          label="Phường/Xã"
                          variant="outlined"
                          fullWidth
                          error={!selectedWard}
                          helperText={!selectedWard ? "Vui lòng chọn Phường/Xã" : ""}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-1 grid grid-cols-1">
                    <TextField
                      type="number"
                      required
                      id="phoneNumber"
                      name="phoneNumber"
                      label="Số điện thoại"
                      fullWidth
                      autoComplete="phone-number"
                    />
                  </div>
                  <div className="col-span-2 grid grid-cols-1">
                    <div className="w-full h-full py-4 flex justify-center items-center">
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                          padding: "0.8rem",
                          bgcolor: "RGB(42 193 36)",
                          fontSize: "1rem",
                        }}
                      >
                        Hoàn thành
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeliverAddress;