import { createContext, useState, useEffect } from "react";

export const TxContext = createContext(null);

export function TxProvider({ children, user }) {
  const [balance, setBalance] = useState(0);
  const [accountId, setAccountId] = useState(null);
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

    function resetState() {
      setBalance(0);
      setAccountId(null);
      setVatOwed(0);
      setVatNumber("");
      setIsVatRegistered(false);
      setBankDetails({ accountName: "", accountNumber: "", bankName: "", sortCode: "" });
      setPayouts([]);
      setTransactions([]);
      setLoadingBalances(false);
      setLoadingTransactions(false);
      setLoadingPayouts(false);
      setRequestingPayout(false);
    }

    async function fetchOnce() {
      try {
        console.log("TxProvider: fetchOnce start", { userId: user?.id });
        const TX = typeof window !== "undefined" ? window.TX : null;
        if (!TX) {
          console.log("TxProvider: window.TX not available yet");
          return false;
        }

        // Ensure TX knows the current user so its calls can return user-scoped data
        if (user?.id && typeof TX.setUserId === "function") {
          try {
            TX.setUserId(Number(user.id));
            console.log("TxProvider: called TX.setUserId", { userId: user.id });
          } catch (e) {
            console.log("TxProvider: TX.setUserId failed", e);
          }
        }

        let didSomething = false;
        let acctId = null;

        if (typeof TX.getUserBalances === "function") {
          console.log("TxProvider: calling TX.getUserBalances");
          setLoadingBalances(true);
          const balances = await TX.getUserBalances().catch(() => null);
          console.log("TxProvider: getUserBalances result", { balances });
          // expected format: [{id:57, account_type:"user", balance:"7.83"}]
          if (Array.isArray(balances) && balances.length > 0) {
            const b = balances[0];
            const bal = parseFloat(b.balance || 0) || 0;
            setBalance(bal);
            acctId = typeof b.id !== "undefined" ? b.id : null;
            console.log("TxProvider: detected acctId from balances[0]", { acctId });
            setAccountId(acctId);
            didSomething = true;
          } else if (balances && typeof balances.balance !== "undefined") {
            const bal = parseFloat(balances.balance || 0) || 0;
            setBalance(bal);
            acctId = typeof balances.id !== "undefined" ? balances.id : null;
            console.log("TxProvider: detected acctId from balances object", { acctId });
            setAccountId(acctId);
            didSomething = true;
          }
          setLoadingBalances(false);
        }

        // Fetch transactions via ledger for the user's account id (if available)
        const ledgerId = acctId || accountId;
        if (!ledgerId) {
          console.log("TxProvider: no ledgerId available after balances", { acctId, accountId });
        }
        if (typeof TX.getAccountLedger === "function" && ledgerId) {
          console.log("TxProvider: calling TX.getAccountLedger", { ledgerId });
          setLoadingTransactions(true);
          const txs = await TX.getAccountLedger(ledgerId, 100).catch(() => null);
          // expected format: array of ledger transaction objects
          if (Array.isArray(txs)) {
            const mapped = txs.map((it) => {
              const transactionAmount = Number(it.transaction_amount ?? it.transactionAmount ?? it.amount ?? 0);
              const grossAmount = Number(it.gross_amount ?? it.grossAmount ?? it.gross ?? it.amount ?? 0);
              const taxAmount = Number(it.tax_amount ?? it.tax ?? 0);
              const platformFee = Number(it.platform_gross_amount ?? it.platformGrossAmount ?? it.platform_fee ?? 0);
              let netVal = typeof it.net_amount !== "undefined" ? it.net_amount : typeof it.netAmount !== "undefined" ? it.netAmount : typeof it.net !== "undefined" ? it.net : undefined;
              if (typeof netVal === "undefined" || netVal === null) netVal = grossAmount - taxAmount;
              const netAmount = Number(netVal || 0);
              const date = it.created_at || it.date || "";
              return {
                ...it,
                transactionAmount,
                grossAmount,
                taxAmount,
                platformFee,
                netAmount,
                date,
              };
            });
            setTransactions(mapped);
            didSomething = true;
          }
          setLoadingTransactions(false);
        }

        if (typeof TX.getPayoutHistory === "function") {
          console.log("TxProvider: calling TX.getPayoutHistory");
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
      // if no user, reset and don't attempt
      if (!user) {
        resetState();
        console.log("TxProvider: no user, reset state and abort loader");
        return;
      }
      attempts += 1;
      console.log("TxProvider: loader attempt", { attempts });
      const ok = await fetchOnce();
      if (ok || attempts >= maxAttempts) {
        // stop retrying
        return;
      }
      // retry after delay
      console.log("TxProvider: scheduling retry", { attempts });
      setTimeout(tryLoad, 500);
    };

    console.log("TxProvider: starting loader", { userId: user?.id });
    tryLoad();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // When accountId becomes available, attempt to load the ledger separately
  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;

    async function loadLedger() {
      try {
        const TX = typeof window !== "undefined" ? window.TX : null;
        if (!TX) {
          console.log("TxProvider: loadLedger - window.TX not available yet");
          return;
        }
        if (typeof TX.getAccountLedger !== "function") {
          console.log("TxProvider: loadLedger - TX.getAccountLedger not available");
          return;
        }
        console.log("TxProvider: loadLedger calling TX.getAccountLedger", { accountId });
        setLoadingTransactions(true);
        const txs = await TX.getAccountLedger(accountId, 100).catch(() => null);
        if (cancelled) return;
        if (Array.isArray(txs)) {
          const mapped = txs.map((it) => {
            const transactionAmount = Number(it.transaction_amount ?? it.transactionAmount ?? it.amount ?? 0);
            const grossAmount = Number(it.gross_amount ?? it.grossAmount ?? it.gross ?? it.amount ?? 0);
            const taxAmount = Number(it.tax_amount ?? it.tax ?? 0);
            const platformFee = Number(it.platform_gross_amount ?? it.platformGrossAmount ?? it.platform_fee ?? 0);
            let netVal = typeof it.net_amount !== "undefined" ? it.net_amount : typeof it.netAmount !== "undefined" ? it.netAmount : typeof it.net !== "undefined" ? it.net : undefined;
            if (typeof netVal === "undefined" || netVal === null) netVal = grossAmount - taxAmount;
            const netAmount = Number(netVal || 0);
            const date = it.created_at || it.date || "";
            return {
              ...it,
              transactionAmount,
              grossAmount,
              taxAmount,
              platformFee,
              netAmount,
              date,
            };
          });
          setTransactions(mapped);
        }
        setLoadingTransactions(false);
      } catch (err) {
        // ignore
      }
    }

    loadLedger();

    return () => {
      cancelled = true;
    };
  }, [accountId]);

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
          setAccountId(typeof b.id !== "undefined" ? b.id : null);
        } else if (balances && typeof balances.balance !== "undefined") {
          setBalance(Number(balances.balance) || 0);
          setAccountId(typeof balances.id !== "undefined" ? balances.id : null);
                }
        setLoadingBalances(false);
      }

      // Fetch ledger for current accountId (if available)
      const ledgerId = accountId;
      if (typeof TX.getAccountLedger === "function" && ledgerId) {
        setLoadingTransactions(true);
        const txs = await TX.getAccountLedger(ledgerId, 100).catch(() => null);
        if (Array.isArray(txs)) {
          const mapped = txs.map((it) => {
            const transactionAmount = Number(it.transaction_amount ?? it.transactionAmount ?? it.amount ?? 0);
            const grossAmount = Number(it.gross_amount ?? it.grossAmount ?? it.gross ?? it.amount ?? 0);
            const taxAmount = Number(it.tax_amount ?? it.tax ?? 0);
            const platformFee = Number(it.platform_gross_amount ?? it.platformGrossAmount ?? it.platform_fee ?? 0);
            let netVal = typeof it.net_amount !== "undefined" ? it.net_amount : typeof it.netAmount !== "undefined" ? it.netAmount : typeof it.net !== "undefined" ? it.net : undefined;
            if (typeof netVal === "undefined" || netVal === null) netVal = grossAmount - taxAmount;
            const netAmount = Number(netVal || 0);
            const date = it.created_at || it.date || "";
            return {
              ...it,
              transactionAmount,
              grossAmount,
              taxAmount,
              platformFee,
              netAmount,
              date,
            };
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
    accountId,
    setAccountId,
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
