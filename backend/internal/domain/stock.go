package domain

import (
	"errors"
	"time"
)

var ErrStockNotFound = errors.New("stock not found")

// Stock representa uma ação com informações completas de mercado
type Stock struct {
	Currency  string `json:"currency"`
	MarketCap int64  `json:"marketCap"`
	ShortName string `json:"shortName"`
	LongName  string `json:"longName"`
	Symbol    string `json:"symbol"`
	LogoURL   string `json:"logourl"`

	RegularMarketChange        float64   `json:"regularMarketChange"`
	RegularMarketChangePercent float64   `json:"regularMarketChangePercent"`
	RegularMarketTime          time.Time `json:"regularMarketTime"`
	RegularMarketPrice         float64   `json:"regularMarketPrice"`
	RegularMarketDayHigh       float64   `json:"regularMarketDayHigh"`
	RegularMarketDayRange      string    `json:"regularMarketDayRange"`
	RegularMarketDayLow        float64   `json:"regularMarketDayLow"`
	RegularMarketVolume        int64     `json:"regularMarketVolume"`
	RegularMarketPreviousClose float64   `json:"regularMarketPreviousClose"`
	RegularMarketOpen          float64   `json:"regularMarketOpen"`

	FiftyTwoWeekRange string  `json:"fiftyTwoWeekRange"`
	FiftyTwoWeekLow   float64 `json:"fiftyTwoWeekLow"`
	FiftyTwoWeekHigh  float64 `json:"fiftyTwoWeekHigh"`

	UsedInterval string `json:"usedInterval"`
	UsedRange    string `json:"usedRange"`

	HistoricalDataPrice []HistoricalDataPrice `json:"historicalDataPrice"`
	ValidRanges         []string              `json:"validRanges"`
	ValidIntervals      []string              `json:"validIntervals"`

	BalanceSheetHistory []BalanceSheet `json:"balanceSheetHistory"`
	SummaryProfile      SummaryProfile `json:"summaryProfile"`
	FinancialData       FinancialData  `json:"financialData"`

	PriceEarnings    float64       `json:"priceEarnings"`
	EarningsPerShare float64       `json:"earningsPerShare"`
	DividendsData    DividendsData `json:"dividendsData"`
}

type HistoricalDataPrice struct {
	Date          int64   `json:"date"`
	Open          float64 `json:"open"`
	High          float64 `json:"high"`
	Low           float64 `json:"low"`
	Close         float64 `json:"close"`
	Volume        int64   `json:"volume"`
	AdjustedClose float64 `json:"adjustedClose"`
}

type BalanceSheet struct {
	Symbol                  string `json:"symbol"`
	Type                    string `json:"type"`
	EndDate                 string `json:"endDate"`
	Cash                    int64  `json:"cash"`
	ShortTermInvestments    int64  `json:"shortTermInvestments"`
	NetReceivables          int64  `json:"netReceivables"`
	Inventory               int64  `json:"inventory"`
	OtherCurrentAssets      int64  `json:"otherCurrentAssets"`
	TotalCurrentAssets      int64  `json:"totalCurrentAssets"`
	LongTermInvestments     int64  `json:"longTermInvestments"`
	PropertyPlantEquipment  int64  `json:"propertyPlantEquipment"`
	OtherAssets             int64  `json:"otherAssets"`
	TotalAssets             int64  `json:"totalAssets"`
	AccountsPayable         int64  `json:"accountsPayable"`
	ShortLongTermDebt       int64  `json:"shortLongTermDebt"`
	OtherCurrentLiab        int64  `json:"otherCurrentLiab"`
	LongTermDebt            int64  `json:"longTermDebt"`
	OtherLiab               int64  `json:"otherLiab"`
	TotalCurrentLiabilities int64  `json:"totalCurrentLiabilities"`
	TotalLiab               int64  `json:"totalLiab"`
	CommonStock             int64  `json:"commonStock"`

	OtherStockholderEquity int64 `json:"otherStockholderEquity"`
	TotalStockholderEquity int64 `json:"totalStockholderEquity"`

	IntangibleAssets     int64 `json:"intangibleAssets"`
	DeferredLongTermLiab int64 `json:"deferredLongTermLiab"`
	MinorityInterest     int64 `json:"minorityInterest"`
	TaxesToRecover       int64 `json:"taxesToRecover"`

	UpdatedAt string `json:"updatedAt"`
}

type SummaryProfile struct {
	Symbol              string `json:"symbol"`
	Address1            string `json:"address1"`
	Address2            string `json:"address2"`
	City                string `json:"city"`
	State               string `json:"state"`
	Zip                 string `json:"zip"`
	Country             string `json:"country"`
	Phone               string `json:"phone"`
	Website             string `json:"website"`
	Industry            string `json:"industry"`
	IndustryKey         string `json:"industryKey"`
	Sector              string `json:"sector"`
	LongBusinessSummary string `json:"longBusinessSummary"`
	FullTimeEmployees   int    `json:"fullTimeEmployees"`
	UpdatedAt           string `json:"updatedAt"`
}

type FinancialData struct {
	Symbol            string  `json:"symbol"`
	CurrentPrice      float64 `json:"currentPrice"`
	EBITDA            int64   `json:"ebitda"`
	QuickRatio        float64 `json:"quickRatio"`
	CurrentRatio      float64 `json:"currentRatio"`
	DebtToEquity      float64 `json:"debtToEquity"`
	RevenuePerShare   float64 `json:"revenuePerShare"`
	ReturnOnAssets    float64 `json:"returnOnAssets"`
	ReturnOnEquity    float64 `json:"returnOnEquity"`
	EarningsGrowth    float64 `json:"earningsGrowth"`
	RevenueGrowth     float64 `json:"revenueGrowth"`
	GrossMargins      float64 `json:"grossMargins"`
	EBITDAMargins     float64 `json:"ebitdaMargins"`
	OperatingMargins  float64 `json:"operatingMargins"`
	ProfitMargins     float64 `json:"profitMargins"`
	TotalCash         int64   `json:"totalCash"`
	TotalDebt         int64   `json:"totalDebt"`
	TotalRevenue      int64   `json:"totalRevenue"`
	GrossProfits      int64   `json:"grossProfits"`
	OperatingCashflow int64   `json:"operatingCashflow"`
	FreeCashflow      int64   `json:"freeCashflow"`
	FinancialCurrency string  `json:"financialCurrency"`
	Type              string  `json:"type"`
	UpdatedAt         string  `json:"updatedAt"`
}

type DividendsData struct {
	CashDividends  []CashDividend  `json:"cashDividends"`
	StockDividends []StockDividend `json:"stockDividends"`
	Subscriptions  []Subscription  `json:"subscriptions"`
}

type CashDividend struct {
	AssetIssued   string     `json:"assetIssued"`
	PaymentDate   time.Time  `json:"paymentDate"`
	Rate          float64    `json:"rate"`
	RelatedTo     string     `json:"relatedTo"`
	ApprovedOn    *time.Time `json:"approvedOn,omitempty"`
	ISINCode      string     `json:"isinCode"`
	Label         string     `json:"label"`
	LastDatePrior time.Time  `json:"lastDatePrior"`
	Remarks       string     `json:"remarks"`
}

type StockDividend struct {
	AssetIssued    string    `json:"assetIssued"`
	Factor         float64   `json:"factor"`
	CompleteFactor string    `json:"completeFactor"`
	ApprovedOn     time.Time `json:"approvedOn"`
	ISINCode       string    `json:"isinCode"`
	Label          string    `json:"label"`
	LastDatePrior  time.Time `json:"lastDatePrior"`
	Remarks        string    `json:"remarks"`
}

type Subscription struct {
	AssetIssued   string    `json:"assetIssued"`
	Factor        float64   `json:"factor"`
	ApprovedOn    time.Time `json:"approvedOn"`
	ISINCode      string    `json:"isinCode"`
	Label         string    `json:"label"`
	LastDatePrior time.Time `json:"lastDatePrior"`
	Remarks       string    `json:"remarks"`
}

type StockRepository interface {
	GetBySymbol(symbol, rangeParam, intervalParam string) (*Stock, error)
}

type CotacoesRepository interface {
	ListAllStocks(sector *string, page, perPage int) (*AllStocksResponse, error)
}
