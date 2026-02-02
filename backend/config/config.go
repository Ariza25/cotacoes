package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("Nenhum arquivo .env encontrado, usando variáveis de ambiente")
	}
}

// GetBrapiToken retorna o token da BRAPI.
// Mantém compatibilidade com configs antigas que usavam ALPHA_API_KEY por engano.
func GetBrapiToken() string {
	if v := os.Getenv("BRAPI_TOKEN"); v != "" {
		return v
	}
	if v := os.Getenv("BRAPI_API_KEY"); v != "" {
		return v
	}
	return os.Getenv("ALPHA_API_KEY")
}
