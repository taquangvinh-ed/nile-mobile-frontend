import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../../State/Auth/Action";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const { order, orderLoading, orderError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (!orderId) {
    return <div>Không tìm thấy thông tin đơn hàng!</div>;
  }

  if (orderLoading) return <div>Loading...</div>;
  if (orderError) return <div>Error: {orderError}</div>;
  if (!order) return <div>Không tìm thấy đơn hàng!</div>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Đơn hàng đã được đặt thành công!</h1>
      <p>Mã đơn hàng: {order.id}</p>
      <p>Ngày đặt hàng: {new Date(order.orderDate).toLocaleString()}</p>
      <p>Tổng tiền: {order.totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
      <p>Chiết khấu: {order.totalDiscountPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
      <p>Số lượng sản phẩm: {order.totalItem}</p>
      <p>Trạng thái: {order.status}</p>
      <h2>Địa chỉ giao hàng:</h2>
      {order.shippingAddress ? (
        <p>
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}, {order.shippingAddress.addressLine}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}
        </p>
      ) : (
        <p>Chưa có địa chỉ giao hàng</p>
      )}
      <p>Số điện thoại: {order.shippingAddress?.phoneNumber || "N/A"}</p>
      <h2>Chi tiết đơn hàng:</h2>
      <ul>
        {order.orderDetails.map((detail) => (
          <li key={detail.id}>
            {detail.variation.name} - Số lượng: {detail.quantity} - Giá: {detail.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderConfirmation;