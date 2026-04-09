import React, { createContext, useEffect, useState, ReactNode } from "react";
import { User } from "../../../packages/auth/types/user.type";
import { useUser } from "../../../packages/auth/context/useuser";
import { useTenant } from "../../../packages/tenant/context/usetenant";
import { BankDetails, TxContextValue } from "./finances.types";

export const TxContext = createContext<TxContextValue | null>(null);

export function TxProvider({ children, user }: { children: ReactNode; user?: User }) {
  const { token } = useUser() || {};
  const { tenant } = useTenant() || {};
  const [balance, setBalance] = useState<number>(0);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [vatOwed, setVatOwed] = useState<number>(0);
  const [vatNumber, setVatNumber] = useState<string>("");
  const [isVatRegistered, setIsVatRegistered] = useState<boolean>(false);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountName: "",
    accountNumber: "",
    bankName: "",
    sortCode: "",
  });

  const [payouts, setPayouts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingBalances, setLoadingBalances] = useState<boolean>(false);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);
  const [loadingPayouts, setLoadingPayouts] = useState<boolean>(false);
  const [requestingPayout, setRequestingPayout] = useState<boolean>(false);

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
        // eslint-disable-next-line no-console
        console.log("TxProvider: fetchOnce start", { userId: user?.id });
        // TX is provided on window by the runtime environment
        const TX: any = typeof window !== "undefined" ? (window as any).TX : null;
        if (!TX) {
          // eslint-disable-next-line no-console
          console.log("TxProvider: window.TX not available yet");
          return false;
        }

        if (user?.id && typeof TX.setUserId === "function") {
          try {
            TX.setUserId(Number(user.id));
            // eslint-disable-next-line no-console
            console.log("TxProvider: called TX.setUserId", { userId: user.id });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log("TxProvider: TX.setUserId failed", e);
          }
        }

        let didSomething = false;
        let acctId: number | null = null;

        if (typeof TX.getUserBalances === "function") {
          // eslint-disable-next-line no-console
          console.log("TxProvider: calling TX.getUserBalances");
          setLoadingBalances(true);
          const balances = await TX.getUserBalances().catch(() => null);
          // expected format: [{id:57, account_type:"user", balance:"7.83"}]
          if (Array.isArray(balances) && balances.length > 0) {
            const b = balances[0];
            const bal = parseFloat(b.balance || 0) || 0;
            setBalance(bal);
            acctId = typeof b.id !== "undefined" ? b.id : null;
            // eslint-disable-next-line no-console
            console.log("TxProvider: detected acctId from balances[0]", { acctId });
            setAccountId(acctId);
            didSomething = true;
          } else if (balances && typeof balances.balance !== "undefined") {
            const bal = parseFloat(balances.balance || 0) || 0;
            setBalance(bal);
            acctId = typeof balances.id !== "undefined" ? balances.id : null;
            // eslint-disable-next-line no-console
            console.log("TxProvider: detected acctId from balances object", { acctId });
            setAccountId(acctId);
            didSomething = true;
          }
          setLoadingBalances(false);
        }

        const ledgerId = acctId || accountId;
        if (!ledgerId) {
          // eslint-disable-next-line no-console
          console.log("TxProvider: no ledgerId available after balances", { acctId, accountId });
        }
        if (typeof TX.getAccountLedger === "function" && ledgerId) {
          // eslint-disable-next-line no-console
          console.log("TxProvider: calling TX.getAccountLedger", { ledgerId });
          setLoadingTransactions(true);
          const txs = await TX.getAccountLedger(ledgerId, 100).catch(() => null);
          if (Array.isArray(txs)) {
            const mapped = txs.map((it: any) => {
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
              } as any;
            });
            setTransactions(mapped);
            didSomething = true;
          }
          setLoadingTransactions(false);
        }

        if (typeof TX.getPayoutHistory === "function") {
          // eslint-disable-next-line no-console
          console.log("TxProvider: calling TX.getPayoutHistory");
          setLoadingPayouts(true);
          const ph = await TX.getPayoutHistory().catch(() => null);
          if (Array.isArray(ph)) {
            const mapped = ph.map((p: any) => ({ ...p, amount: Number(p.amount) || 0 }));
            setPayouts(mapped);
            didSomething = true;
          }
          setLoadingPayouts(false);
        }

        // fetch events for reports
        try {
          const tokenToUse = token || (typeof TX.getAuthToken === "function" ? await TX.getAuthToken().catch(() => null) : (window as any).AUTH_TOKEN);
          const appIdToUse = tenant || (typeof TX.getAppId === "function" ? TX.getAppId() : (window as any).APP_ID);
          if (user?.id) {
            setLoadingEvents(true);
            const headers: any = { Accept: "application/json" };
            if (tokenToUse) headers.Authorization = `Bearer ${tokenToUse}`;
            if (appIdToUse) headers.APP_ID = appIdToUse;
            try {
              const url = `http://cairnsgames.co.za/php/finances/api.php/finances/${user.id}`;
              const resp = await fetch(url, { headers }).catch(() => null);
              if (resp && resp.ok) {
                const json = await resp.json().catch(() => null);
                if (Array.isArray(json)) {
                  setEvents(json);
                  didSomething = true;
                }
              }
            } catch (e) {
              // ignore
            }
            setLoadingEvents(false);
          }
        } catch (err) {
          // ignore
        }

        return didSomething;
      } catch (err) {
        return false;
      }
    }

    const tryLoad = async () => {
      if (cancelled) return;
      if (!user) {
        resetState();
        // eslint-disable-next-line no-console
        console.log("TxProvider: no user, reset state and abort loader");
        return;
      }
      attempts += 1;
      // eslint-disable-next-line no-console
      console.log("TxProvider: loader attempt", { attempts });
      const ok = await fetchOnce();
      if (ok || attempts >= maxAttempts) {
        return;
      }
      // eslint-disable-next-line no-console
      console.log("TxProvider: scheduling retry", { attempts });
      setTimeout(tryLoad, 500);
    };

    // eslint-disable-next-line no-console
    console.log("TxProvider: starting loader", { userId: user?.id });
    tryLoad();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;

    async function loadLedger() {
      try {
        const TX: any = typeof window !== "undefined" ? (window as any).TX : null;
        if (!TX) {
          // eslint-disable-next-line no-console
          console.log("TxProvider: loadLedger - window.TX not available yet");
          return;
        }
        if (typeof TX.getAccountLedger !== "function") {
          // eslint-disable-next-line no-console
          console.log("TxProvider: loadLedger - TX.getAccountLedger not available");
          return;
        }
        // eslint-disable-next-line no-console
        console.log("TxProvider: loadLedger calling TX.getAccountLedger", { accountId });
        setLoadingTransactions(true);
        const txs = await TX.getAccountLedger(accountId, 100).catch(() => null);
        if (cancelled) return;
        if (Array.isArray(txs)) {
          const mapped = txs.map((it: any) => {
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
            } as any;
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

  async function refresh() {
    try {
      const TX: any = typeof window !== "undefined" ? (window as any).TX : null;
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

      const ledgerId = accountId;
      if (typeof TX.getAccountLedger === "function" && ledgerId) {
        setLoadingTransactions(true);
        const txs = await TX.getAccountLedger(ledgerId, 100).catch(() => null);
        if (Array.isArray(txs)) {
          const mapped = txs.map((it: any) => {
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
            } as any;
          });
          setTransactions(mapped);
        }
        setLoadingTransactions(false);
      }

      if (typeof TX.getPayoutHistory === "function") {
        setLoadingPayouts(true);
        const ph = await TX.getPayoutHistory().catch(() => null);
        if (Array.isArray(ph)) setPayouts(ph.map((p: any) => ({ ...p, amount: Number(p.amount) || 0 })));
        setLoadingPayouts(false);
      }
      // also fetch events on refresh path if possible
      if (user?.id) {
        try {
          setLoadingEvents(true);
          const tokenToUse = token || (typeof TX.getAuthToken === "function" ? await TX.getAuthToken().catch(() => null) : (window as any).AUTH_TOKEN);
          const appIdToUse = tenant || (typeof TX.getAppId === "function" ? TX.getAppId() : (window as any).APP_ID);
          const headers: any = { Accept: "application/json" };
          if (tokenToUse) headers.Authorization = `Bearer ${tokenToUse}`;
          if (appIdToUse) headers.APP_ID = appIdToUse;
          const url = `http://cairnsgames.co.za/php/finances/api.php/finances/${user.id}`;
          const resp = await fetch(url, { headers }).catch(() => null);
          if (resp && resp.ok) {
            const json = await resp.json().catch(() => null);
            if (Array.isArray(json)) setEvents(json);
          }
        } catch (e) {
          // ignore
        }
        setLoadingEvents(false);
      }
    } catch (err) {
      // ignore
    }
  }

  async function requestPayout(accountType = "user", amount = 0) {
    try {
      const TX: any = typeof window !== "undefined" ? (window as any).TX : null;
      if (!TX || typeof TX.requestPayout !== "function") {
        throw new Error("TX.requestPayout not available");
      }

      const amt = Number(amount) || 0;
      setRequestingPayout(true);
      const res = await TX.requestPayout(accountType, amt);
      await refresh();
      setRequestingPayout(false);
      return res;
    } catch (err) {
      setRequestingPayout(false);
      throw err;
    }
  }

  const value: TxContextValue = {
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
    events,
    setEvents,
    loadingEvents,
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
