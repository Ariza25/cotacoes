package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// Carrega o .env
	if err := godotenv.Load(); err != nil {
		log.Println("Nenhum .env encontrado")
	}

	// Pega a chave
	apiKey := os.Getenv("ALPHA_API_KEY")
	fmt.Println("Minha API Key:", apiKey)
}
