package domain

import "time"

type SnapshotRepository interface {
	Save(data *AllStocksResponse) error
	Load() (*AllStocksResponse, time.Time, error)
}
