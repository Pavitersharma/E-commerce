import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, qty = 1 } = action.payload;
      // Note: backend products have _id, frontend items might have id. Let's unify by checking item._id || item.id
      const productId = product._id || product.id;
      const exists = state.items.find((item) => (item._id || item.id) === productId);

      let newItems;
      if (exists) {
        newItems = state.items.map((item) =>
          (item._id || item.id) === productId ? { ...item, qty: item.qty + qty } : item
        );
      } else {
        newItems = [...state.items, { ...product, qty }];
      }
      return { ...state, items: newItems };
    }
    case "REMOVE_FROM_CART": {
      const productId = action.payload;
      const newItems = state.items.filter((item) => (item._id || item.id) !== productId);
      return { ...state, items: newItems };
    }
    case "UPDATE_QTY": {
      const { productId, qty } = action.payload;
      const newItems = state.items.map((item) =>
        (item._id || item.id) === productId ? { ...item, qty } : item
      );
      return { ...state, items: newItems };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
};

const getInitialCartState = () => {
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    return { items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialCartState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addToCart = (product, qty = 1) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, qty } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: "UPDATE_QTY", payload: { productId, qty } });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getSubtotal = () => {
    return state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const getCartCount = () => {
    return state.items.reduce((sum, item) => sum + item.qty, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        getSubtotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
