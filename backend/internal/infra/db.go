package infra

import (
	"sync"
	"time"

	"cotacoes/internal/domain"
)

type CacheDB struct {
	mu   sync.RWMutex
	data *domain.AllStocksResponse
	time time.Time
}

type cacheFile struct {
	UpdatedAt time.Time                 `json:"updated_at"`
	Data      *domain.AllStocksResponse `json:"data"`
}

const cacheFileName = "last_stocks.json"
