package domain

// AllStocksResponse representa a resposta da rota /cotacoes
type AllStocksResponse struct {
	Indexes             []MarketIndex   `json:"indexes"`
	Stocks              []StockListItem `json:"stocks"`
	AvailableSectors    []string        `json:"availableSectors"`
	AvailableStockTypes []string        `json:"availableStockTypes"`
	Pagination          Pagination      `json:"pagination"`
}

// MarketIndex representa um índice de mercado (ex: IBOVESPA)
type MarketIndex struct {
	Stock string `json:"stock"`
	Name  string `json:"name"`
}

// StockListItem representa uma ação resumida para listagem
type StockListItem struct {
	Stock     string  `json:"stock"`
	Name      string  `json:"name"`
	Close     float64 `json:"close"`
	Change    float64 `json:"change"`
	Volume    int64   `json:"volume"`
	MarketCap int64   `json:"market_cap"`
	Logo      string  `json:"logo"`
	Sector    string  `json:"sector"`
	Type      string  `json:"type"`
}

// Pagination representa dados de paginação
type Pagination struct {
	CurrentPage  int  `json:"currentPage"`
	TotalPages   int  `json:"totalPages"`
	ItemsPerPage int  `json:"itemsPerPage"`
	TotalCount   int  `json:"totalCount"`
	HasNextPage  bool `json:"hasNextPage"`
}

type StockProvider interface {
	ListAllStocks(
		sector, sortBy, sortOrder string,
		page, perPage int,
	) (*AllStocksResponse, error)
}
