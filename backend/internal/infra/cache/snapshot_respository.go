package repository

import (
	"encoding/json"
	"os"
	"sync"
	"time"

	"cotacoes/internal/domain"
)

type CotacoesFileCache struct {
	mu sync.RWMutex
}

type snapshot struct {
	UpdatedAt time.Time                 `json:"updated_at"`
	Data      *domain.AllStocksResponse `json:"data"`
}

const snapshotFile = "last_snapshot.json"

func (c *CotacoesFileCache) Save(data *domain.AllStocksResponse) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	file, err := os.Create(snapshotFile)
	if err != nil {
		return err
	}
	defer file.Close()

	return json.NewEncoder(file).Encode(snapshot{
		UpdatedAt: time.Now(),
		Data:      data,
	})
}

func (c *CotacoesFileCache) Load() (*domain.AllStocksResponse, time.Time, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	file, err := os.Open(snapshotFile)
	if err != nil {
		return nil, time.Time{}, err
	}
	defer file.Close()

	var snap snapshot
	if err := json.NewDecoder(file).Decode(&snap); err != nil {
		return nil, time.Time{}, err
	}

	return snap.Data, snap.UpdatedAt, nil
}
