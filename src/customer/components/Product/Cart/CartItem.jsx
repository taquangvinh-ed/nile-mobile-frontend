import { Checkbox, Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useDispatch } from "react-redux";
import {
  updateCartItemSelection,
  updateCartItemQuantity,
  removeCartItem,
} from "../../../../State/Auth/Action";

const CartItem = ({ item }) => {
  const [quantityProduct, setQuantityProduct] = useState(item.quantity || 1);
  const dispatch = useDispatch();

  const increaseQuantity = async () => {
    const newQuantity = quantityProduct + 1;
    setQuantityProduct(newQuantity);
    try {
      await dispatch(updateCartItemQuantity(item.id, newQuantity));
    } catch (error) {
      console.error("Failed to increase quantity:", error);
      setQuantityProduct(quantityProduct); // Rollback nếu lỗi
    }
  };

  const decreaseQuantity = async () => {
    const newQuantity = quantityProduct > 1 ? quantityProduct - 1 : 1;
    setQuantityProduct(newQuantity);
    try {
      await dispatch(updateCartItemQuantity(item.id, newQuantity));
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
      setQuantityProduct(quantityProduct); // Rollback nếu lỗi
    }
  };

  const handleCheckboxChange = (event) => {
    dispatch(updateCartItemSelection(item.id, event.target.checked));
  };

  const handleRemoveItem = async () => {
    try {
      await dispatch(removeCartItem(item.id));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <div className="flex flex-wrap justify-start my-3">
      <div className="flex items-center justify-start py-7 px-5 rounded-xl border shadow-2xl h-auto w-auto">
        <Checkbox
          checked={item.isSelected || false}
          onChange={handleCheckboxChange}
          sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
        />
        <div className="flex flex-wrap justify-center items-center mx-5">
          <div className="flex justify-center items-center">
            <img
              className="w-[5rem] h-[5rem] lg:w-[7rem] lg:h-[7rem]"
              src={
                item.variation?.imageURL || "https://via.placeholder.com/150"
              }
              alt={item.variation?.name || "Product"}
            />
          </div>
          <div className="space-y-1 flex flex-col">
            <p className="font-semibold">
              {item.variation?.name || "Unknown Product"}
            </p>
            <p className="font-semibold">
              {item.variation?.color || "Unknown Color"}
            </p>
            <p className="opacity-70 text-sm">
              Giá gốc:{" "}
              {(item.variation?.price || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <p className="opacity-70 text-sm">
              Giá khuyến mãi:{" "}
              {(item.discountPrice || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <p className="text-sm text-red-600">
              {item.variation?.discountPercent
                ? `-${item.variation.discountPercent}%`
                : "0%"}
            </p>
          </div>
        </div>
        <div className="lg:flex lg:items-center lg:space-x-10 p-4 justify-center">
          <div className="flex items-center space-x-2 border">
            <IconButton onClick={decreaseQuantity}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            <span className="py-1 px-7 border rounded-sm">
              {quantityProduct}
            </span>
            <IconButton onClick={increaseQuantity}>
              <AddCircleOutlineIcon />
            </IconButton>
          </div>
          <div className="flex items-end">
            <Button onClick={handleRemoveItem} className="flex justify-center">
              <DeleteOutlinedIcon sx={{ color: "RGB(215 47 23)" }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
