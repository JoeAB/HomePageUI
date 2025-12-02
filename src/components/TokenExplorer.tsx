import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { CoinGeckoClient } from "../services/CoinGeckoService";
import type { SimplePrice } from '../sharedTypes/CoinGeckTypes'; 
import { Modal } from "react-bootstrap";
import TokenPriceChart from "./TokenHistoryViewer";

interface ChartData {
  id: string;
  symbol: string;
  value: number;
}

type SortOption = "value-desc" | "value-asc" | "symbol-asc" | "symbol-desc";
type FilterOption = "all" | "major" | "mid" | "small";

const TokenExplorer: React.FC = () => {
  const coingeckoClient = new CoinGeckoClient();

  const [priceData, setPriceData] = useState<Record<string, SimplePrice>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("value-desc");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [itemsToShow, setItemsToShow] = useState(20);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const markets = await coingeckoClient.getMarkets({
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 250,
        page: 1,
        sparkline: false
      });

    const normalizedPrices = markets.reduce(
        (acc, coin) => {
            acc[coin.id] = {
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            usdValue: coin.current_price,
            };
            return acc;
        },
        {} as Record<string, SimplePrice>
    );

      setPriceData(normalizedPrices);
      setError(null);
    } catch (err) {
      console.error("Error fetching CoinGecko markets:", err);
      setError("Failed to fetch token prices");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const filteredAndSortedData = useMemo(() => {
    if (!priceData) return [];

    let data: ChartData[] = Object.entries(priceData).map(
        ([, priceObj]) => ({
            id: priceObj.id,
            symbol: priceObj.symbol.toUpperCase(),
            value: priceObj.usdValue ?? 0
        })
    );

    if (searchTerm) {
      data = data.filter(item =>
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBy === "major") {
      data = data.filter(item => item.value >= 100);
    } else if (filterBy === "mid") {
      data = data.filter(item => item.value >= 1 && item.value < 100);
    } else if (filterBy === "small") {
      data = data.filter(item => item.value < 1);
    }

    switch (sortBy) {
      case "value-desc":
        data.sort((a, b) => b.value - a.value);
        break;
      case "value-asc":
        data.sort((a, b) => a.value - b.value);
        break;
      case "symbol-asc":
        data.sort((a, b) => a.symbol.localeCompare(b.symbol));
        break;
      case "symbol-desc":
        data.sort((a, b) => b.symbol.localeCompare(a.symbol));
        break;
    }

    return data;
  }, [priceData, searchTerm, sortBy, filterBy]);

  const displayData = filteredAndSortedData.slice(0, itemsToShow);
  const totalTokens = priceData ? Object.keys(priceData).length : 0;

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
        <div style={{ fontSize: "18px", color: "#666" }}>Loading token prices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
        <div style={{ fontSize: "18px", color: "#dc2626" }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", padding: "20px", backgroundColor: "#f8fafc" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px", color: "#1f2937" }}>
        Token Price Explorer
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "20px" }}>
        Viewing {filteredAndSortedData.length} of {totalTokens} tokens
      </p>

        <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            padding: '20px', 
            marginBottom: '20px' 
        }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Search Token
                </label>
                <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by symbol..."
                style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px',
                    fontSize: '14px'
                }}
                />
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Sort By
                </label>
                <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px',
                    fontSize: '14px'
                }}
                >
                <option value="value-desc">Price: High to Low</option>
                <option value="value-asc">Price: Low to High</option>
                <option value="symbol-asc">Symbol: A to Z</option>
                <option value="symbol-desc">Symbol: Z to A</option>
                </select>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Filter By Price
                </label>
                <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                style={{ 
                    width: '100%', 
                    padding: '8px 12px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px',
                    fontSize: '14px'
                }}
                >
                <option value="all">All Tokens</option>
                <option value="major">Major (&gt;$100)</option>
                <option value="mid">Mid ($1-$100)</option>
                <option value="small">Small (&lt;$1)</option>
                </select>
            </div>
            </div>

            <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Show {itemsToShow} tokens
            </label>
            <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={itemsToShow}
                onChange={(e) => setItemsToShow(Number(e.target.value))}
                style={{ width: '100%' }}
            />
            </div>
        </div>

        <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            padding: '20px', 
            marginBottom: '20px' 
        }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
            Price Chart
            </h2>
            {displayData.length > 0 ? (
            <div style={{ width: '100%', height: '500px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayData} margin={{ top: 20, right: 30, left: 80, bottom: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                        dataKey="symbol" 
                        tick={{ fill: '#666', fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        />
                        <YAxis 
                        tick={{ fill: '#666' }}
                        label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft' }}
                        tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value.toFixed(2)}`}
                        />
                        <Tooltip 
                        formatter={(value: number) => [`$${value >= 1 ? value.toFixed(2) : value.toFixed(8)}`, 'Price']}
                        contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                        />
                        <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        minPointSize={2}
                        onClick={(data) => {
                            if (data?.payload?.id) {
                                setSelectedToken(data.payload.id);
                            }
                        }}
                        />                
                    </BarChart>
                </ResponsiveContainer>
            </div>
            ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
                No tokens match your filters
            </div>
            )}
        </div>

        <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            padding: '20px' 
        }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
            Token List
            </h2>
            <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '16px' 
            }}>
            {displayData.map((item, index) => (
                <div 
                key={item.symbol} 
                style={{ 
                    padding: '16px', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    transition: 'box-shadow 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1f2937' }}>{item.symbol}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>#{index + 1}</div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#2563eb' }}>
                    ${item.value < 1 ? item.value.toFixed(6) : item.value.toFixed(2)}
                </div>
                </div>
            ))}
            </div>
            
            {filteredAndSortedData.length > itemsToShow && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                onClick={() => setItemsToShow(prev => Math.min(prev + 20, filteredAndSortedData.length))}
                style={{ 
                    padding: '10px 24px', 
                    backgroundColor: '#2563eb', 
                    color: 'white', 
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                Load More ({filteredAndSortedData.length - itemsToShow} remaining)
                </button>
            </div>
            )}
        </div>
        <Modal show={selectedToken != null} onHide={() => setSelectedToken(null)}>
            <Modal.Header closeButton>
                <Modal.Title>Token Price Chart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TokenPriceChart id={selectedToken as string}></TokenPriceChart>
            </Modal.Body>
        </Modal>
    </div>
  );
};

export default TokenExplorer;
