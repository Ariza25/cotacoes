import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getStockBySymbol } from '../services/stockService';
import type { Stock } from '../models/stock';
import { formatPriceBR } from '../utils';
import { FiArrowLeft, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { DividendsTable } from './DividendsTable';

const StockDetails: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('5d');

  // Calcula o intervalo apropriado baseado no período selecionado
  const getIntervalForRange = (rangeValue: string): string => {
    switch (rangeValue) {
      case '5d':
        return '1h'; // Para 5d, usar 1h para ter mais pontos ao longo dos 5 dias
      case '1mo':
      case '3mo':
      case '6mo':
        return '1d'; // 1 dia para períodos mensais
      case '1y':
      case '2y':
      case '5y':
        return '1d'; // 1 dia para períodos anuais
      default:
        return '1d';
    }
  };

  useEffect(() => {
    if (!symbol) return;

    const fetchStock = async () => {
      setLoading(true);
      setError(null);
      try {
        const interval = getIntervalForRange(range);
        const data = await getStockBySymbol(symbol, { range, interval });
        setStock(data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || 'Erro ao buscar dados da ação';
        setError(errorMessage);
        console.error('Erro ao buscar stock:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [symbol, range]);

  // Prepara dados do gráfico
  const chartData = stock?.historicalDataPrice
    ?.map((item) => ({
      date: new Date(item.date * 1000).toLocaleDateString('pt-BR'),
      timestamp: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }))
    .sort((a, b) => a.timestamp - b.timestamp) || [];

  // Calcula intervalo para labels do eixo X (mostra aproximadamente 6-8 labels)
  const calculateTickInterval = () => {
    const totalPoints = chartData.length;
    if (totalPoints <= 8) return 0; // Mostra todas se houver poucas
    return Math.floor(totalPoints / 7); // Divide em aproximadamente 7 labels
  };

  const isPositive = stock ? stock.regularMarketChange >= 0 : false;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <FiArrowLeft />
          <span>Voltar para lista</span>
        </button>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Informações principais */}
        <div className={`bg-white rounded-xl shadow-sm p-6 mb-6 ${loading ? 'opacity-60 pointer-events-none' : ''} transition-opacity duration-200`}>
          {loading && !stock ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando dados da ação...</p>
              </div>
            </div>
          ) : stock ? (
            <>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {stock.logourl ? (
                    <img
                      src={stock.logourl}
                      alt={stock.symbol}
                      className="w-16 h-16 rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                      {stock.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {stock.symbol}
                    </h1>
                    <p className="text-gray-600">{stock.shortName}</p>
                    {stock.longName && stock.longName !== stock.shortName && (
                      <p className="text-sm text-gray-500 mt-1">{stock.longName}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatPriceBR(stock.regularMarketPrice)}
                  </div>
                  <div
                    className={`flex items-center gap-2 text-lg font-semibold ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                    <span>
                      {isPositive ? '+' : ''}
                      {stock.regularMarketChangePercent.toFixed(2)}%
                    </span>
                    <span className="text-gray-600">
                      ({isPositive ? '+' : ''}
                      {formatPriceBR(stock.regularMarketChange)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Estatísticas rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Máxima do dia</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPriceBR(stock.regularMarketDayHigh)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mínima do dia</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPriceBR(stock.regularMarketDayLow)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Volume</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stock.regularMarketVolume.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPriceBR(stock.marketCap)}
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Gráfico */}
        <div className={`bg-white rounded-xl shadow-sm p-6 mb-6 ${loading ? 'opacity-60 pointer-events-none' : ''} transition-opacity duration-200`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Histórico de Preços
            </h2>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {[
                { value: '5d', label: '5d' },
                { value: '1mo', label: '1m' },
                { value: '6mo', label: '6m' },
                { value: '1y', label: '1a' },
                { value: '5y', label: '5a' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRange(option.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    range === option.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={calculateTickInterval()}
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatPriceBR(value)}
                />
                <Tooltip
                  formatter={(value: number | undefined) => 
                    value !== undefined ? formatPriceBR(value) : ''
                  }
                  labelStyle={{ color: '#374151' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Fechamento"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#10b981"
                  strokeWidth={1}
                  name="Máxima"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="#ef4444"
                  strokeWidth={1}
                  name="Mínima"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Nenhum dado histórico disponível
            </div>
          )}
        </div>

        {/* Informações financeiras */}
        <div className={`grid md:grid-cols-2 gap-6 ${loading ? 'opacity-60 pointer-events-none' : ''} transition-opacity duration-200`}>
          {/* Informações da empresa */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informações da Empresa
            </h2>
            <div className="space-y-3">
              {stock?.summaryProfile?.sector && (
                <div>
                  <p className="text-sm text-gray-500">Setor</p>
                  <p className="font-semibold text-gray-900">
                    {stock.summaryProfile.sector}
                  </p>
                </div>
              )}
              {stock?.summaryProfile?.industry && (
                <div>
                  <p className="text-sm text-gray-500">Indústria</p>
                  <p className="font-semibold text-gray-900">
                    {stock.summaryProfile.industry}
                  </p>
                </div>
              )}
              {stock?.summaryProfile?.website && (
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a
                    href={stock.summaryProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {stock.summaryProfile.website}
                  </a>
                </div>
              )}
              {stock?.summaryProfile?.fullTimeEmployees && stock.summaryProfile.fullTimeEmployees > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Funcionários</p>
                  <p className="font-semibold text-gray-900">
                    {stock.summaryProfile.fullTimeEmployees.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Indicadores financeiros */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Indicadores Financeiros
            </h2>
            <div className="space-y-3">
              {stock?.priceEarnings && stock.priceEarnings > 0 && (
                <div>
                  <p className="text-sm text-gray-500">P/L</p>
                  <p className="font-semibold text-gray-900">
                    {stock.priceEarnings.toFixed(2)}
                  </p>
                </div>
              )}
              {stock?.earningsPerShare && stock.earningsPerShare > 0 && (
                <div>
                  <p className="text-sm text-gray-500">LPA</p>
                  <p className="font-semibold text-gray-900">
                    {formatPriceBR(stock.earningsPerShare)}
                  </p>
                </div>
              )}
              {stock?.financialData?.returnOnEquity && stock.financialData.returnOnEquity > 0 && (
                <div>
                  <p className="text-sm text-gray-500">ROE</p>
                  <p className="font-semibold text-gray-900">
                    {(stock.financialData.returnOnEquity * 100).toFixed(2)}%
                  </p>
                </div>
              )}
              {stock?.financialData?.debtToEquity && stock.financialData.debtToEquity > 0 && (
                <div>
                  <p className="text-sm text-gray-500">D/E</p>
                  <p className="font-semibold text-gray-900">
                    {stock.financialData.debtToEquity.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DividendsTable data={stock?.dividendsData || { cashDividends: [], stockDividends: [] }} />
      </div>
    </div>
  );
};

export default StockDetails;
