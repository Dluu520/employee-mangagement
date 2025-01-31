"use client";
import { useEffect, useState } from "react";

const bitCoinURL = "https://api.coindesk.com/v1/bpi/currentprice.json";
// TypeScript interfaces for type safety

interface Coin {
  time: {
    updated: string;
    updatedISO: string;
    updateduk: string;
  };
  bpi: {
    USD: {
      rate: string;
    };
  };
  disclaimer: string;
}
const [coins, setCoins] = useState<Coin>();
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState();
// useEffect fetches API data for coins (currently commented out)
useEffect(() => {
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const coinRes = await fetch(`${bitCoinURL}`);
      const coinData = (await coinRes.json()) as Coin;
      setCoins(coinData);
    } catch (e: any) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };
  fetchPosts();
}, []);

if (error) {
  console.error(error);
}
// This component fetches and displays the current Bitcoin rate
export default function CoinAPI() {
  const [coins, setCoins] = useState<Coin>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Fetch the coin data
  useEffect(() => {
    const fetchCoins = async () => {
      setIsLoading(true);
      try {
        const coinRes = await fetch(`${bitCoinURL}`);
        const coinData = (await coinRes.json()) as Coin;
        setCoins(coinData);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoins();
  }, []);

  return (
    <div>
      <div>Coin List</div>
      {/* Display Bitcoin rate */}
      <div className="border border-black">
        Coin rate: {coins?.bpi.USD.rate}
      </div>
    </div>
  );
}
