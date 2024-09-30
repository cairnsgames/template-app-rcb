import React, { createContext, useState, useEffect, useMemo } from "react";
import usePubSub from "../../../hooks/usepubsub";
import useEventing from "../../eventing/useeventing";
import useGeoLocation from "../../../hooks/usegeolocation";

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

  const [activeOrder, setactiveOrder] = useState();

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
      // fetchOrderItems();
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
      const response = await fetch(combineUrlAndPath(process.env.REACT_APP_BREEZO_API,`api.php/user/${user.id}/cart`),
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
      const response = await fetch(combineUrlAndPath(process.env.REACT_APP_BREEZO_API,`/api.php/cart/${carts[0].id}/items`),
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
      const response = await combineUrlAndPath(
        process.env.REACT_APP_BREEZO_API,`api.php/user/${user.id}/orders`,
        { headers }
      );
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  // Fetch invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch(combineUrlAndPath(
        process.env.REACT_APP_BREEZO_API,`api.php/user/${user.id}/invoices`),
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
      const response = await fetch(combineUrlAndPath(
        process.env.REACT_APP_BREEZO_API,`api.php/supplier/${user.id}/payments`),
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
      const response = await fetch(combineUrlAndPath(
        process.env.REACT_APP_BREEZO_API,`api.php/supplier/${user.id}/commission`),
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
      const response = await fetch(combineUrlAndPath(
        process.env.REACT_APP_BREEZO_API,`api.php/supplier/${user.id}/items`),
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
      await fetch(combineUrlAndPath(
        process.env.REACT_APP_BREEZO_API,`/api.php/cart_item/${itemId}`),
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

  // Create, Update, Delete functions can be added similarly
  const createOrderFromCart = async (cartId) => {
    // Create order from cart
    const order = await fetch(combineUrlAndPath(
      process.env.REACT_APP_BREEZO_API,`api.php/placeorder`),
      { method: "POST", headers, body: JSON.stringify({ cart_id: cartId }) }
    );
    return await order.json();
  };

  const values = useMemo(
    () => ({
      carts,
      cartItems,
      orders,
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
      createOrderFromCart,
    }),
    [carts, cartItems, orders, invoices, payments, commission, items, loading]
  );

  return (
    <BreezoContext.Provider value={values}>{children}</BreezoContext.Provider>
  );
};

// Custom hook for using the BreezoContext
export default BreezoProvider;
