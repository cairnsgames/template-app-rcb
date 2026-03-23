import { createContext, useState, useEffect } from "react";

export const TxContext = createContext(null);

export function TxProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [vatOwed, setVatOwed] = useState(0);
  const [vatNumber, setVatNumber] = useState("");
  const [isVatRegistered, setIsVatRegistered] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    sortCode: "",
  });

  const [payouts, setPayouts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingPayouts, setLoadingPayouts] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20; // try for ~10 seconds

    async function fetchOnce() {
      try {
        const TX = typeof window !== "undefined" ? window.TX : null;
        if (!TX) return false;

        let didSomething = false;

        if (typeof TX.getUserBalances === "function") {
          setLoadingBalances(true);
          const balances = await TX.getUserBalances().catch(() => null);
          // expected format: [{id:57, account_type:"user", balance:"7.83"}]
          if (Array.isArray(balances) && balances.length > 0) {
            const b = balances[0];
            const bal = parseFloat(b.balance || 0) || 0;
            setBalance(bal);
            didSomething = true;
          } else if (balances && typeof balances.balance !== "undefined") {
            const bal = parseFloat(balances.balance || 0) || 0;
            setBalance(bal);
            didSomething = true;
          }
          setLoadingBalances(false);
        }

        if (typeof TX.getTransactions === "function") {
          setLoadingTransactions(true);
          const txs = await TX.getTransactions().catch(() => null);
          // expected format: array of transaction objects
          if (Array.isArray(txs)) {
            const mapped = txs.map((it) => {
              const amount = Number(it.amount) || 0;
              const tax = Number(it.tax) || 0;
              const net = typeof it.net !== "undefined" ? Number(it.net) || amount - tax : amount - tax;
              const date = it.created_at || it.date || "";
              return { ...it, amount, tax, net, date };
            });
            setTransactions(mapped);
            didSomething = true;
          }
          setLoadingTransactions(false);
        }

        if (typeof TX.getPayoutHistory === "function") {
          setLoadingPayouts(true);
          const ph = await TX.getPayoutHistory().catch(() => null);
          if (Array.isArray(ph)) {
            const mapped = ph.map((p) => ({ ...p, amount: Number(p.amount) || 0 }));
            setPayouts(mapped);
            didSomething = true;
          }
          setLoadingPayouts(false);
        }

        return didSomething;
      } catch (err) {
        return false;
      }
    }

    const tryLoad = async () => {
      if (cancelled) return;
      attempts += 1;
      const ok = await fetchOnce();
      if (ok || attempts >= maxAttempts) {
        // stop retrying
        return;
      }
      // retry after delay
      setTimeout(tryLoad, 500);
    };

    tryLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  // allow manual refresh from UI
  async function refresh() {
    try {
      const TX = typeof window !== "undefined" ? window.TX : null;
      if (!TX) return;
      if (typeof TX.getUserBalances === "function") {
        setLoadingBalances(true);
        const balances = await TX.getUserBalances().catch(() => null);
        if (Array.isArray(balances) && balances.length > 0) {
          const b = balances[0];
          setBalance(Number(b.balance) || 0);
        } else if (balances && typeof balances.balance !== "undefined") {
          setBalance(Number(balances.balance) || 0);
                }
        setLoadingBalances(false);
      }

      if (typeof TX.getTransactions === "function") {
        setLoadingTransactions(true);
        const txs = await TX.getTransactions().catch(() => null);
        if (Array.isArray(txs)) {
          const mapped = txs.map((it) => {
            const amount = Number(it.amount) || 0;
            const tax = Number(it.tax) || 0;
            const net = typeof it.net !== "undefined" ? Number(it.net) || amount - tax : amount - tax;
            const date = it.created_at || it.date || "";
            return { ...it, amount, tax, net, date };
          });
          setTransactions(mapped);
        }
        setLoadingTransactions(false);
      }

      if (typeof TX.getPayoutHistory === "function") {
        setLoadingPayouts(true);
        const ph = await TX.getPayoutHistory().catch(() => null);
        if (Array.isArray(ph)) setPayouts(ph.map((p) => ({ ...p, amount: Number(p.amount) || 0 })));
        setLoadingPayouts(false);
      }
    } catch (err) {
      // ignore
    }
  }

  // request a payout via TX library
  async function requestPayout(accountType = "user", amount = 0) {
    try {
      const TX = typeof window !== "undefined" ? window.TX : null;
      if (!TX || typeof TX.requestPayout !== "function") {
        throw new Error("TX.requestPayout not available");
      }

      const amt = Number(amount) || 0;
      setRequestingPayout(true);
      const res = await TX.requestPayout(accountType, amt);
      // after requesting, refresh data
      await refresh();
      setRequestingPayout(false);
      return res;
    } catch (err) {
      setRequestingPayout(false);
      throw err;
    }
  }

  const value = {
    balance,
    setBalance,
    vatOwed,
    setVatOwed,
    vatNumber,
    setVatNumber,
    isVatRegistered,
    setIsVatRegistered,
    bankDetails,
    setBankDetails,
    payouts,
    setPayouts,
    transactions,
    setTransactions,
    refresh,
    requestPayout,
    loadingBalances,
    loadingTransactions,
    loadingPayouts,
    requestingPayout,
  };

  return <TxContext.Provider value={value}>{children}</TxContext.Provider>;
}

export default TxProvider;
