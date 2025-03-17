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
  UPDATE_CART_ITEM_SELECTION,
  UPDATE_CART_ITEM_QUANTITY_REQUEST,
  UPDATE_CART_ITEM_QUANTITY_SUCCESS,
  UPDATE_CART_ITEM_QUANTITY_FAILURE,
  GET_USER_ADDRESSES_FAILURE,
  GET_USER_ADDRESSES_SUCCESS,
  GET_USER_ADDRESSES_REQUEST,
  UPDATE_ADDRESS_FAILURE,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_REQUEST,
} from "./ActionType";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  jwt: null,
  products: [],
  productsLoading: false,
  productsError: null,
  thirdLevels: [],
  thirdLevelsLoading: false,
  thirdLevelsError: null,
  productDetails: null,
  isAuthenticated: false,
  productDetailsLoading: false,
  productDetailsError: null,
  cart: null, // Thay [] thành null để thống nhất với dữ liệu từ GET_CART
  cartLoading: false,
  cartError: null,
  cartSummary: { subtotal: 0, totalDiscount: 0, totalItems: 0 },
  addresses: [], // Thêm state để lưu danh sách địa chỉ
  addressesLoading: false,
  addressesError: null,
  order: null, // Thêm state cho order
  orderLoading: false,
  orderError: null,
};

const calculateCartSummary = (cartItems) => {
  const selectedItems = cartItems.filter((item) => item.isSelected);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalDiscount = selectedItems.reduce(
    (sum, item) => sum + (item.discountPrice || 0),
    0
  );
  const totalItems = selectedItems.length;
  return { subtotal, totalDiscount, totalItems };
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
      return { ...state, isLoading: true, error: null };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user || state.user,
        jwt: action.payload.user?.jwt || state.jwt,
        isAuthenticated: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user || state.user,
        jwt: action.payload.user?.jwt || state.jwt,
        isAuthenticated: true,
        error: null,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload || state.user,
        jwt: state.jwt,
        isAuthenticated: true,
        error: null,
      };
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload || "Unknown error",
        isAuthenticated: false,
        user: null,
        jwt: null,
      };
    case LOGOUT:
      return initialState;

    case GET_PRODUCTS_REQUEST:
      return { ...state, productsLoading: true, productsError: null };
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        productsLoading: false,
        products: action.payload,
        productsError: null,
      };
    case GET_PRODUCTS_FAILURE:
      return {
        ...state,
        productsLoading: false,
        productsError: action.payload,
      };

    case GET_THIRD_LEVELS_REQUEST:
      return { ...state, thirdLevelsLoading: true, thirdLevelsError: null };
    case GET_THIRD_LEVELS_SUCCESS:
      return {
        ...state,
        thirdLevelsLoading: false,
        thirdLevels: action.payload,
        thirdLevelsError: null,
      };
    case GET_THIRD_LEVELS_FAILURE:
      return {
        ...state,
        thirdLevelsLoading: false,
        thirdLevelsError: action.payload,
      };

    case GET_PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        productDetailsLoading: true,
        productDetailsError: null,
      };
    case GET_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        productDetailsLoading: false,
        productDetails: action.payload,
        productDetailsError: null,
      };
    case GET_PRODUCT_DETAILS_FAILURE:
      return {
        ...state,
        productDetailsLoading: false,
        productDetailsError: action.payload,
      };

    case ADD_TO_CART_REQUEST:
      return { ...state, cartLoading: true, cartError: null };
    case ADD_TO_CART_SUCCESS:
      const newCartItems = state.cart
        ? [...state.cart.cartItems, action.payload]
        : [action.payload];
      return {
        ...state,
        cartLoading: false,
        cart: {
          ...state.cart,
          cartItems: newCartItems,
        },
        cartSummary: calculateCartSummary(newCartItems),
        cartError: null,
      };
    case ADD_TO_CART_FAILURE:
      return {
        ...state,
        cartLoading: false,
        cartError: action.payload,
      };

    case GET_CART_REQUEST:
      return { ...state, cartLoading: true, cartError: null };
    case GET_CART_SUCCESS:
      return {
        ...state,
        cartLoading: false,
        cart: action.payload,
        cartSummary: calculateCartSummary(action.payload.cartItems),
        cartError: null,
      };
    case GET_CART_FAILURE:
      return {
        ...state,
        cartLoading: false,
        cartError: action.payload,
      };

    case UPDATE_CART_ITEM_SELECTION:
      const updatedCartItemsSelection = state.cart.cartItems.map((item) =>
        item.id === action.payload.cartItemId
          ? { ...item, isSelected: action.payload.isSelected }
          : item
      );
      return {
        ...state,
        cart: { ...state.cart, cartItems: updatedCartItemsSelection },
        cartSummary: calculateCartSummary(updatedCartItemsSelection),
      };

    case UPDATE_CART_ITEM_QUANTITY_REQUEST:
      return { ...state, cartLoading: true, cartError: null };
    case UPDATE_CART_ITEM_QUANTITY_SUCCESS:
      const updatedCartItemsQuantity = state.cart.cartItems.map((item) =>
        item.id === action.payload.id ? { ...item, ...action.payload } : item
      );
      return {
        ...state,
        cartLoading: false,
        cart: { ...state.cart, cartItems: updatedCartItemsQuantity },
        cartSummary: calculateCartSummary(updatedCartItemsQuantity),
        cartError: null,
      };
    case UPDATE_CART_ITEM_QUANTITY_FAILURE:
      return {
        ...state,
        cartLoading: false,
        cartError: action.payload,
      };
    case GET_USER_ADDRESSES_REQUEST:
      return { ...state, addressesLoading: true, addressesError: null };
    case GET_USER_ADDRESSES_SUCCESS:
      return {
        ...state,
        addressesLoading: false,
        addresses: action.payload,
        addressesError: null,
      };
    case GET_USER_ADDRESSES_FAILURE:
      return {
        ...state,
        addressesLoading: false,
        addressesError: action.payload,
      };
    case UPDATE_ADDRESS_REQUEST:
      return { ...state, addressesLoading: true, addressesError: null };
    case UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        addressesLoading: false,
        addresses: [...state.addresses, action.payload], // Thêm địa chỉ mới vào danh sách
        addressesError: null,
      };
    case UPDATE_ADDRESS_FAILURE:
      return {
        ...state,
        addressesLoading: false,
        addressesError: action.payload,
      };
      case "CREATE_ORDER_SUCCESS":
      return { ...state, order: action.payload, orderLoading: false, orderError: null };
    case "CREATE_ORDER_FAIL":
      return { ...state, orderLoading: false, orderError: action.payload };
    case "UPDATE_ORDER_ADDRESS_SUCCESS":
      return { ...state, order: action.payload, orderLoading: false, orderError: null };
    case "UPDATE_ORDER_ADDRESS_FAIL":
      return { ...state, orderLoading: false, orderError: action.payload };
    case "GET_ORDER_SUCCESS":
      return { ...state, order: action.payload, orderLoading: false, orderError: null };
    case "GET_ORDER_FAIL":
      return { ...state, orderLoading: false, orderError: action.payload };
    default:
      return state;
  }
};
