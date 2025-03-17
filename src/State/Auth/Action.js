import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import {
  ADD_TO_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  GET_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_PRODUCT_DETAILS_FAILURE,
  GET_PRODUCT_DETAILS_REQUEST,
  GET_PRODUCT_DETAILS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_THIRD_LEVELS_FAILURE,
  GET_THIRD_LEVELS_REQUEST,
  GET_THIRD_LEVELS_SUCCESS,
  GET_USER_ADDRESSES_FAILURE,
  GET_USER_ADDRESSES_REQUEST,
  GET_USER_ADDRESSES_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_CART_ITEM_QUANTITY_FAILURE,
  UPDATE_CART_ITEM_QUANTITY_REQUEST,
  UPDATE_CART_ITEM_QUANTITY_SUCCESS,
  UPDATE_CART_ITEM_SELECTION,
} from "./ActionType";

const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

export const register = (registerData) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/signup`,
      registerData
    );
    const user = response.data;
    console.log("user", user);
    if (user.jwt) {
      localStorage.setItem("jwt", user.jwt);
    }
    dispatch(registerSuccess(user));
    return { payload: { success: true, user } };
  } catch (error) {
    dispatch(registerFailure(error.message));
    return { payload: { success: false, error: error.message } };
  }
};

const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

export const login = (loginData) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    const user = response.data;

    if (!user || !user.jwt) {
      throw new Error("Invalid response from server: No JWT token");
    }

    if (user.jwt) {
      localStorage.setItem("jwt", user.jwt);
    }
    dispatch(loginSuccess(user));
    return { payload: { success: true, user } };
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { payload: { success: false, error: error.message } };
  }
};

const getUserRequest = () => ({ type: GET_USER_REQUEST });
const getUserSuccess = (user) => ({ type: GET_USER_SUCCESS, payload: user });
const getUserFailure = (error) => ({ type: GET_USER_FAILURE, payload: error });

export const getUser = () => async (dispatch) => {
  dispatch(getUserRequest());
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      throw new Error("No JWT token found");
    }
    const response = await axios.get(`${API_BASE_URL}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = response.data;
    dispatch(getUserSuccess(user));
    return { payload: { success: true, user } };
  } catch (error) {
    const status = error.response?.status;
    let errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch user";

    if (status === 401) {
      errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
      dispatch(logout());
    }

    dispatch(getUserFailure(errorMessage));
    return { payload: { success: false, error: errorMessage } };
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({ type: LOGOUT, payload: null });
};

const getProductsRequest = () => ({ type: GET_PRODUCTS_REQUEST });
const getProductsSuccess = (products) => ({
  type: GET_PRODUCTS_SUCCESS,
  payload: products,
});
const getProductsFailure = (error) => ({
  type: GET_PRODUCTS_FAILURE,
  payload: error,
});

export const getProductsByThirdLevel = (thirdLevel) => async (dispatch) => {
  dispatch(getProductsRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/filter`, {
      params: { thirdLevel, pageNumber: 0, pageSize: 8 },
    });
    const products = response.data.content;
    dispatch(getProductsSuccess(products));
    return { payload: { success: true, products } };
  } catch (error) {
    dispatch(getProductsFailure(error.message));
    return { payload: { success: false, error: error.message } };
  }
};

const getThirdLevelsRequest = () => ({ type: GET_THIRD_LEVELS_REQUEST });
const getThirdLevelsSuccess = (thirdLevels) => ({
  type: GET_THIRD_LEVELS_SUCCESS,
  payload: thirdLevels,
});
const getThirdLevelsFailure = (error) => ({
  type: GET_THIRD_LEVELS_FAILURE,
  payload: error,
});

export const getThirdLevels = () => async (dispatch) => {
  dispatch(getThirdLevelsRequest());
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/products/third-levels`
    );
    const thirdLevels = response.data;
    dispatch(getThirdLevelsSuccess(thirdLevels));
    return { payload: { success: true, thirdLevels } };
  } catch (error) {
    dispatch(getThirdLevelsFailure(error.message));
    return { payload: { success: false, error: error.message } };
  }
};

const getProductDetailsRequest = () => ({ type: GET_PRODUCT_DETAILS_REQUEST });
const getProductDetailsSuccess = (product) => ({
  type: GET_PRODUCT_DETAILS_SUCCESS,
  payload: product,
});
const getProductDetailsFailure = (error) => ({
  type: GET_PRODUCT_DETAILS_FAILURE,
  payload: error,
});

export const getProductDetails = (productId) => async (dispatch) => {
  dispatch(getProductDetailsRequest());
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/products/id/${productId}`
    );
    const product = response.data;
    dispatch(getProductDetailsSuccess(product));
    return { payload: { success: true, product } };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch product details";
    dispatch(getProductDetailsFailure(errorMessage));
    return { payload: { success: false, error: errorMessage } };
  }
};

const addToCartRequest = () => ({ type: ADD_TO_CART_REQUEST });
const addToCartSuccess = (cartItem) => ({
  type: ADD_TO_CART_SUCCESS,
  payload: cartItem,
});
const addToCartFailure = (error) => ({
  type: ADD_TO_CART_FAILURE,
  payload: error,
});

export const addToCart = (variation) => async (dispatch) => {
  dispatch(addToCartRequest());
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      throw new Error("No JWT token found. Please log in.");
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/cart/items`,
      { variation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const cartItem = { ...response.data, isSelected: false };
    dispatch(addToCartSuccess(cartItem));
    return { payload: { success: true, cartItem } };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to add to cart";
    dispatch(addToCartFailure(errorMessage));
    return { payload: { success: false, error: errorMessage } };
  }
};

const getCartRequest = () => ({ type: GET_CART_REQUEST });
const getCartSuccess = (cart) => ({ type: GET_CART_SUCCESS, payload: cart });
const getCartFailure = (error) => ({ type: GET_CART_FAILURE, payload: error });

export const getCart = () => async (dispatch) => {
  dispatch(getCartRequest());
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      throw new Error("No JWT token found. Please log in.");
    }

    const response = await axios.get(`${API_BASE_URL}/api/user/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const cartData = response.data;
    // Thêm thuộc tính isSelected mặc định là false cho từng CartItem
    const cartWithSelection = {
      ...cartData,
      cartItems: cartData.cartItems.map((item) => ({
        ...item,
        isSelected: false,
      })),
    };
    dispatch(getCartSuccess(cartWithSelection));
    return { payload: { success: true, cart: cartWithSelection } };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch cart";
    dispatch(getCartFailure(errorMessage));
    return { payload: { success: false, error: errorMessage } };
  }
};

export const updateCartItemSelection = (cartItemId, isSelected) => ({
  type: UPDATE_CART_ITEM_SELECTION,
  payload: { cartItemId, isSelected },
});

const updateCartItemQuantityRequest = () => ({
  type: UPDATE_CART_ITEM_QUANTITY_REQUEST,
});
const updateCartItemQuantitySuccess = (cartItem) => ({
  type: UPDATE_CART_ITEM_QUANTITY_SUCCESS,
  payload: cartItem,
});
const updateCartItemQuantityFailure = (error) => ({
  type: UPDATE_CART_ITEM_QUANTITY_FAILURE,
  payload: error,
});

export const updateCartItemQuantity =
  (cartItemId, quantity) => async (dispatch) => {
    dispatch(updateCartItemQuantityRequest());
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No JWT token found. Please log in.");
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/cart/items/${cartItemId}`,
        null, // Không cần body vì quantity nằm trong query param
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            quantity: quantity,
          },
        }
      );
      const updatedCartItem = response.data;
      dispatch(updateCartItemQuantitySuccess(updatedCartItem));
      return { payload: { success: true, cartItem: updatedCartItem } };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update cart item quantity";
      dispatch(updateCartItemQuantityFailure(errorMessage));
      return { payload: { success: false, error: errorMessage } };
    }
  };

export const getUserAddresses = () => async (dispatch, getState) => {
  dispatch({ type: GET_USER_ADDRESSES_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${API_BASE_URL}/api/user/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: GET_USER_ADDRESSES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: GET_USER_ADDRESSES_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch addresses",
    });
  }
};


export const addAddress = (addressData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch("http://localhost:8081/api/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add address");
    }

    const data = await response.json();
    dispatch({ type: "ADD_ADDRESS_SUCCESS", payload: data });
    dispatch(getUserAddresses()); // Cập nhật danh sách địa chỉ sau khi thêm
    return data; // Trả về dữ liệu địa chỉ để sử dụng nếu cần
  } catch (error) {
    dispatch({ type: "ADD_ADDRESS_FAIL", payload: error.message });
    throw error;
  }
};

export const updateAddress = (addressData) => async (dispatch) => {
  dispatch({ type: UPDATE_ADDRESS_REQUEST });
  try {
    const token = localStorage.getItem("jwt");
    const response = await axios.post(
      `${API_BASE_URL}/api/user/addresses`,
      addressData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: UPDATE_ADDRESS_SUCCESS, payload: response.data });
    // Sau khi thêm thành công, gọi lại getUserAddresses để cập nhật danh sách
    dispatch(getUserAddresses());
  } catch (error) {
    dispatch({
      type: UPDATE_ADDRESS_FAILURE,
      payload: error.response?.data?.message || "Failed to update address",
    });
  }
};

export const removeCartItem = (cartItemId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(
      `http://localhost:8081/api/cart/items/${cartItemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove cart item");
    }

    dispatch({ type: "REMOVE_CART_ITEM_SUCCESS", payload: cartItemId });
    dispatch(getCart());
  } catch (error) {
    dispatch({ type: "REMOVE_CART_ITEM_FAIL", payload: error.message });
    throw error;
  }
};

export const createOrder = (orderData) => async (dispatch) => {
  try {
      const token = localStorage.getItem("jwt");
      const url = `http://localhost:8081/api/orders/user/create?userId=${orderData.userId}`;
      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              shippingAddress: orderData.shippingAddress,
              selectedVariationIds: orderData.selectedVariationIds,
          }),
      });

      if (!response.ok) {
          let errorData = null;
          try {
              errorData = await response.json(); // Thử parse lỗi
          } catch (e) {
              throw new Error("Server returned an invalid response");
          }
          throw new Error(errorData?.message || "Failed to create order");
      }

      const data = await response.json(); // Parse dữ liệu thành công
      dispatch({ type: "CREATE_ORDER_SUCCESS", payload: data });
      dispatch(getCart());
      return data;
  } catch (error) {
      dispatch({ type: "CREATE_ORDER_FAIL", payload: error.message });
      throw error;
  }
};

export const updateOrderAddress = (orderId, shippingAddress) => async (dispatch) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`http://localhost:8081/api/orders/${orderId}/update-address`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(shippingAddress),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update order address");
    }

    const data = await response.json();
    dispatch({ type: "UPDATE_ORDER_ADDRESS_SUCCESS", payload: data });
    return data;
  } catch (error) {
    dispatch({ type: "UPDATE_ORDER_ADDRESS_FAIL", payload: error.message });
    throw error;
  }
};

export const getOrderById = (orderId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`http://localhost:8081/api/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch order");
    }

    const data = await response.json();
    dispatch({ type: "GET_ORDER_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "GET_ORDER_FAIL", payload: error.message });
    throw error;
  }
};