package brapi

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"cotacoes/internal/domain"
)

// BrapiProvider busca dados reais da API brapi.dev
type BrapiProvider struct {
	APIKey string
}

// NewBrapiProvider cria uma instância do provider
func NewBrapiProvider(apiKey string) *BrapiProvider {
	return &BrapiProvider{APIKey: apiKey}
}

// =====================
// ROTA /cotacoes
// =====================

// ListAllStocks retorna os dados da rota /cotacoes (SEM filtro de setor)
func (p *BrapiProvider) ListAllStocks(
	sector, sortBy, sortOrder string,
	page, perPage int,
) (*domain.AllStocksResponse, error) {

	baseURL := "https://brapi.dev/api/quote/list"
	params := url.Values{}

	params.Add("limit", strconv.Itoa(perPage))
	params.Add("token", p.APIKey)

	requestURL := fmt.Sprintf("%s?%s", baseURL, params.Encode())

	resp, err := http.Get(requestURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("brapi error: %s", resp.Status)
	}

	// Lê o body para debug e depois faz decode novamente
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// Log temporário para debug - remover depois
	log.Printf("🔍 BRAPI Response (primeiros 500 chars): %s", string(bodyBytes[:min(500, len(bodyBytes))]))

	// Decodifica a resposta - usando struct flexível que aceita campos alternativos
	type listItemRaw struct {
		Symbol              string  `json:"symbol"`
		Stock               string  `json:"stock"`  // Campo alternativo
		Ticker              string  `json:"ticker"` // Campo alternativo
		Name                string  `json:"shortName"`
		ShortName           string  `json:"name"` // Campo alternativo
		RegularMarketPrice  float64 `json:"regularMarketPrice"`
		Price               float64 `json:"price"`     // Campo alternativo
		Close               float64 `json:"close"`     // Campo alternativo
		LastPrice           float64 `json:"lastPrice"` // Campo alternativo
		RegularMarketChange float64 `json:"regularMarketChange"`
		Change              float64 `json:"change"`        // Campo alternativo
		ChangePercent       float64 `json:"changePercent"` // Campo alternativo
		RegularMarketVolume int64   `json:"regularMarketVolume"`
		Volume              int64   `json:"volume"` // Campo alternativo
		MarketCap           float64 `json:"marketCap"`
		MarketCapAlt        float64 `json:"market_cap"` // Campo alternativo (snake_case)
		Logo                string  `json:"logourl"`
		Logourl             string  `json:"logo"` // Campo alternativo
		Sector              string  `json:"sector"`
		Type                string  `json:"type"`
	}

	// Helper para normalizar os campos
	type listItem struct {
		Symbol    string
		Name      string
		Close     float64
		Change    float64
		Volume    int64
		MarketCap float64
		Logo      string
		Sector    string
		Type      string
	}

	normalizeItem := func(raw listItemRaw) listItem {
		// Symbol: tenta symbol, depois stock, depois ticker
		symbol := raw.Symbol
		if symbol == "" {
			symbol = raw.Stock
		}
		if symbol == "" {
			symbol = raw.Ticker
		}
		// Name: tenta shortName, depois name
		name := raw.Name
		if name == "" {
			name = raw.ShortName
		}
		// Preço: tenta regularMarketPrice, depois close, depois price, depois lastPrice
		close := raw.RegularMarketPrice
		if close == 0 && raw.Close != 0 {
			close = raw.Close
		}
		if close == 0 && raw.Price != 0 {
			close = raw.Price
		}
		if close == 0 && raw.LastPrice != 0 {
			close = raw.LastPrice
		}
		// Mudança: tenta regularMarketChange, depois change
		change := raw.RegularMarketChange
		if change == 0 && raw.Change != 0 {
			change = raw.Change
		}
		// Volume: tenta regularMarketVolume, depois volume
		volume := raw.RegularMarketVolume
		if volume == 0 && raw.Volume != 0 {
			volume = raw.Volume
		}
		// Market Cap: tenta marketCap, depois market_cap
		marketCap := raw.MarketCap
		if marketCap == 0 && raw.MarketCapAlt != 0 {
			marketCap = raw.MarketCapAlt
		}
		// Logo: tenta logourl, depois logo
		logo := raw.Logo
		if logo == "" {
			logo = raw.Logourl
		}
		return listItem{
			Symbol:    symbol,
			Name:      name,
			Close:     close,
			Change:    change,
			Volume:    volume,
			MarketCap: marketCap,
			Logo:      logo,
			Sector:    raw.Sector,
			Type:      raw.Type,
		}
	}

	// A BRAPI retorna "results" como array principal, e pode incluir metadata
	// availableSectors/availableStockTypes na resposta.
	var result struct {
		Results             []listItemRaw `json:"results"`
		Stocks              []listItemRaw `json:"stocks"`
		AvailableSectors    []string      `json:"availableSectors"`
		AvailableStockTypes []string      `json:"availableStockTypes"`
	}

	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		return nil, err
	}

	// Prioriza "results" (formato padrão da BRAPI), fallback para "stocks" se necessário
	rawItems := result.Results
	if len(rawItems) == 0 {
		rawItems = result.Stocks
	}

	log.Printf("📊 Items parseados: Results=%d, Stocks=%d, Total=%d", len(result.Results), len(result.Stocks), len(rawItems))
	if len(rawItems) > 0 {
		firstRaw := rawItems[0]
		first := normalizeItem(firstRaw)
		log.Printf("📋 Primeiro item RAW: RegularMarketPrice=%f, Price=%f, Close=%f, RegularMarketChange=%f, Change=%f, RegularMarketVolume=%d, Volume=%d, MarketCap=%f, MarketCapAlt=%f",
			firstRaw.RegularMarketPrice, firstRaw.Price, firstRaw.Close, firstRaw.RegularMarketChange, firstRaw.Change, firstRaw.RegularMarketVolume, firstRaw.Volume, firstRaw.MarketCap, firstRaw.MarketCapAlt)
		log.Printf("📋 Primeiro item NORMALIZADO: Symbol=%s, Name=%s, Close=%f, Change=%f, Volume=%d, MarketCap=%f, Sector=%s, Type=%s",
			first.Symbol, first.Name, first.Close, first.Change, first.Volume, first.MarketCap, first.Sector, first.Type)
	}

	// Normaliza os itens
	items := make([]listItem, 0, len(rawItems))
	for _, raw := range rawItems {
		items = append(items, normalizeItem(raw))
	}

	stocks := make([]domain.StockListItem, 0, len(items))
	for _, s := range items {
		stocks = append(stocks, domain.StockListItem{
			Stock:     s.Symbol,
			Name:      s.Name,
			Close:     s.Close,
			Change:    s.Change,
			Volume:    s.Volume,
			MarketCap: int64(s.MarketCap),
			Logo:      s.Logo,
			Sector:    s.Sector,
			Type:      s.Type,
		})
	}

	// Fallback: se a API não enviar metadata, derive a partir da lista.
	availableSectors := result.AvailableSectors
	if availableSectors == nil {
		set := make(map[string]struct{})
		for _, s := range stocks {
			if s.Sector != "" {
				set[s.Sector] = struct{}{}
			}
		}
		availableSectors = make([]string, 0, len(set))
		for v := range set {
			availableSectors = append(availableSectors, v)
		}
	}

	availableTypes := result.AvailableStockTypes
	if availableTypes == nil {
		set := make(map[string]struct{})
		for _, s := range stocks {
			if s.Type != "" {
				set[s.Type] = struct{}{}
			}
		}
		availableTypes = make([]string, 0, len(set))
		for v := range set {
			availableTypes = append(availableTypes, v)
		}
	}

	return &domain.AllStocksResponse{
		Stocks:              stocks,
		AvailableSectors:    availableSectors,
		AvailableStockTypes: availableTypes,
		Pagination: domain.Pagination{
			CurrentPage:  1,
			TotalPages:   1,
			ItemsPerPage: perPage,
			TotalCount:   len(stocks),
			HasNextPage:  false,
		},
	}, nil
}

// =====================
// ROTA /stocks/:ticker
// =====================

// GetBySymbol busca dados completos de uma ação pelo símbolo
func (p *BrapiProvider) GetBySymbol(symbol, rangeParam, intervalParam string) (*domain.Stock, error) {
	url := fmt.Sprintf(
		"https://brapi.dev/api/quote/%s?token=%s&fundamental=true&dividends=true&range=%s&interval=%s",
		symbol, p.APIKey, rangeParam, intervalParam,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Results []struct {
			Symbol                     string                       `json:"symbol"`
			ShortName                  string                       `json:"shortName"`
			LongName                   string                       `json:"longName"`
			Currency                   string                       `json:"currency"`
			RegularMarketPrice         float64                      `json:"regularMarketPrice"`
			RegularMarketOpen          float64                      `json:"regularMarketOpen"`
			RegularMarketDayHigh       float64                      `json:"regularMarketDayHigh"`
			RegularMarketDayLow        float64                      `json:"regularMarketDayLow"`
			RegularMarketChange        float64                      `json:"regularMarketChange"`
			RegularMarketChangePercent float64                      `json:"regularMarketChangePercent"`
			RegularMarketPreviousClose float64                      `json:"regularMarketPreviousClose"`
			RegularMarketVolume        int64                        `json:"regularMarketVolume"`
			MarketCap                  float64                      `json:"marketCap"`
			LogoURL                    string                       `json:"logourl"`
			Sector                     string                       `json:"sector"`
			FiftyTwoWeekLow            float64                      `json:"fiftyTwoWeekLow"`
			FiftyTwoWeekHigh           float64                      `json:"fiftyTwoWeekHigh"`
			FiftyTwoWeekRange          string                       `json:"fiftyTwoWeekRange"`
			ValidRanges                []string                     `json:"validRanges"`
			ValidIntervals             []string                     `json:"validIntervals"`
			PriceEarnings              float64                      `json:"priceEarnings"`
			EarningsPerShare           float64                      `json:"earningsPerShare"`
			DividendsData              domain.DividendsData         `json:"dividendsData"`
			HistoricalDataPrice        []domain.HistoricalDataPrice `json:"historicalDataPrice"` // Date como string
		} `json:"results"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if len(result.Results) == 0 {
		return nil, domain.ErrStockNotFound
	}

	r := result.Results[0]

	// --- Preencher o Stock ---
	return &domain.Stock{
		Symbol:                     r.Symbol,
		ShortName:                  r.ShortName,
		LongName:                   r.LongName,
		Currency:                   r.Currency,
		MarketCap:                  int64(r.MarketCap),
		LogoURL:                    r.LogoURL,
		RegularMarketPrice:         r.RegularMarketPrice,
		RegularMarketOpen:          r.RegularMarketOpen,
		RegularMarketDayHigh:       r.RegularMarketDayHigh,
		RegularMarketDayLow:        r.RegularMarketDayLow,
		RegularMarketChange:        r.RegularMarketChange,
		RegularMarketChangePercent: r.RegularMarketChangePercent,
		RegularMarketPreviousClose: r.RegularMarketPreviousClose,
		RegularMarketVolume:        r.RegularMarketVolume,
		FiftyTwoWeekLow:            r.FiftyTwoWeekLow,
		FiftyTwoWeekHigh:           r.FiftyTwoWeekHigh,
		FiftyTwoWeekRange:          r.FiftyTwoWeekRange,
		UsedRange:                  rangeParam,
		UsedInterval:               intervalParam,
		ValidRanges:                r.ValidRanges,
		ValidIntervals:             r.ValidIntervals,
		PriceEarnings:              r.PriceEarnings,
		EarningsPerShare:           r.EarningsPerShare,
		DividendsData:              r.DividendsData,
		HistoricalDataPrice:        r.HistoricalDataPrice,

		// Campos adicionais
		BalanceSheetHistory:   []domain.BalanceSheet{},
		SummaryProfile:        domain.SummaryProfile{},
		FinancialData:         domain.FinancialData{},
		RegularMarketTime:     time.Now(),
		RegularMarketDayRange: fmt.Sprintf("%.2f - %.2f", r.RegularMarketDayLow, r.RegularMarketDayHigh),
	}, nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
