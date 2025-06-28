import React, { createContext, useState, useEffect, useMemo } from "react";
import useEventing from "../../eventing/useeventing";
import { combineUrlAndPath } from "../../../functions/combineurlandpath";
import eventing from "../../eventing/eventing";

// Create context for Breezo API management
export const BreezoContext = createContext();

// Data provider component
export const BreezoProvider = ({
  children,
  user,
  tenant,
  token,
  useFeatureFlags,
  useSettings,
}) => {
  const [carts, setCarts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [commission, setCommission] = useState([]);
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState({});
  const [canFetch, setCanFetch] = useState(false);
  const [activeOrder, setActiveOrder] = useState();
  const [activeOrderId, setActiveOrderId] = useState();

  let settings = [];
  let getUserProperty = () => {
    return false;
  };

  if (useSettings) {
    const { settings, getUserProperty } = useSettings();
  }

  if (!process.env.REACT_APP_BREEZO_API) {
    throw new Error(
      "BreezoProvider: REACT_APP_BREEZO_API environment variable is required"
    );
  }

  const eventReload = () => {
    fetchCarts();
    fetchOrders();
  };

  useEventing("breezo", "reload", eventReload);

  useEffect(() => {
    setHeaders({ APP_ID: tenant, token: token });
    setCanFetch(!!user && token !== "");
  }, [user, token]);

  useEffect(() => {
    if (orders.length > 0 && activeOrderId) {
      const order = orders.find((o) => o.id === Number(activeOrderId));
      setActiveOrder(order);
    } else {
      setActiveOrder(null);
    }
  }, [orders, activeOrderId]);

  useEffect(() => {
    if (canFetch) {
      fetchCarts();
      fetchOrders();
      fetchInvoices();
      fetchPayments();
      fetchCommission();
      fetchItems();
    }
  }, [canFetch]);

  useEffect(() => {
    if (canFetch) {
      fetchOrderItems();
    }
  }, [activeOrder]);

  useEffect(() => {
    if (canFetch) {
      fetchCartItems();
    }
  }, [carts]);

  // Fetch carts
  const fetchCarts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_BREEZO_API,
          `api.php/user/${user.id}/cart`
        ),
        { headers }
      );
      const data = await response.json();
      setCarts(data);
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
    setLoading(false);
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    if (carts.length === 0) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_BREEZO_API,
          `/api.php/cart/${carts[0].id}/items`
        ),
        { headers }
      );
      const data = await response.json();
      setCartItems(data ?? []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
    setLoading(false);
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_BREEZO_API,
          `api.php/user/${user.id}/orders`
        ),
        { headers }
      );
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  // Fetch orders
  const fetchOrderItems = async () => {
    if (!activeOrder) {
      setOrderItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_BREEZO_API,
          `api.php/order/${activeOrder.id}/items`
        ),
        { headers }
      );
      const data = await response.json();
      setOrderItems(data);
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
    setLoading(false);
  };

  // Fetch invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_BREEZO_API,
          `api.php/user/${user.id}/invoices`
        ),
        { headers }
      );
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
    setLoading(false);
  };

  // Fetch payments for supplier (using user.id as supplier_id)
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_BREEZO_API,
          `api.php/supplier/${user.id}/payments`
        ),
        { headers }
      );
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
    setLoading(false);
  };

  // Fetch commission for supplier (using user.id as supplier_id)
  const fetchCommission = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_BREEZO_API,
          `api.php/supplier/${user.id}/commission`
        ),
        { headers }
      );
      const data = await response.json();
      setCommission(data);
    } catch (error) {
      console.error("Error fetching commission:", error);
    }
    setLoading(false);
  };

  // Fetch items for supplier (using user.id as supplier_id)
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_BREEZO_API,
          `api.php/supplier/${user.id}/items`
        ),
        { headers }
      );
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setLoading(false);
  };

  const deleteItem = async (itemId) => {
    setLoading(true);
    try {
      await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_BREEZO_API,
          `/api.php/cart_item/${itemId}`
        ),
        { method: "DELETE", headers }
      );
      setCartItems((prev) => prev.filter((c) => c.id !== itemId));
      fetchCarts();
      setLoading(false);
    } catch (error) {
      console.error("Error deleting calendar:", error);
      setLoading(false);
    }
  };

  const fetchOrCreateCart = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(
          process.env.REACT_APP_BREEZO_API,
          `api.php/user/${user.id}/cart`
        ),
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setCarts(data);
        return data[0];
      } else {
        const createResponse = await fetch(
          combineUrlAndPath(process.env.REACT_APP_BREEZO_API, "api.php/cart"),
          {
            method: "POST",
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userid: user.id }),
          }
        );
        const newCart = await createResponse.json();
        const cartData = Array.isArray(newCart) && newCart.length > 0 ? newCart[0] : newCart;
        setCarts([cartData]);
        return cartData;
      }
    } catch (error) {
      console.error("Error fetching/creating cart:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (cartId, itemData) => {
    if (!cartId) {
      cartId = await fetchOrCreateCart();
    }
    setLoading(true);
    try {
      const response = await fetch(
        combineUrlAndPath(process.env.REACT_APP_BREEZO_API, "api.php/cart_item"),
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            ...itemData,
          }),
        }
      );
      eventing.publish("breezo", "reload", {});
      await fetchCartItems();
      return response.json();
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create, Update, Delete functions can be added similarly
  const createOrderFromCart = async (cartId) => {
    // Create order from cart
    const order = await fetch(
      combineUrlAndPath(process.env.REACT_APP_BREEZO_API, `api.php/placeorder`),
      { method: "POST", headers, body: JSON.stringify({ cart_id: cartId }) }
    );
    return await order.json();
  };

  const orderPaid = async () => {
    setTimeout(() => {
      fetchOrders();
  },750);
  }

  const isParentInCart = (id) => {
    return cartItems.find(item => item.parent_id === id && (item.item_type_id === 1 || item.item_type_id === 3));
  };

  const values = useMemo(
    () => ({
      carts,
      cartItems,
      activeOrder,
      orders,
      orderItems,
      invoices,
      payments,
      commission,
      items,
      loading,
      fetchCarts,
      fetchCartItems,
      fetchOrders,
      fetchInvoices,
      fetchPayments,
      fetchCommission,
      fetchItems,
      deleteItem,
      setActiveOrderId,
      createOrderFromCart,
      orderPaid,
      fetchOrCreateCart,
      addItemToCart,
      isParentInCart
    }),
    [
      carts,
      cartItems,
      orders,
      orderItems,
      invoices,
      payments,
      commission,
      items,
      loading,
    ]
  );

  return (
    <BreezoContext.Provider value={values}>{children}</BreezoContext.Provider>
  );
};

// Custom hook for using the BreezoContext
export default BreezoProvider;
