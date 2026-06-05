package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

var store = seedProducts()

func clientOrigin() string {
	if v := os.Getenv("CLIENT_URL"); v != "" {
		return v
	}
	return "*"
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", clientOrigin())
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func healthHandler(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func productsHandler(w http.ResponseWriter, r *http.Request) {
	list := filterByCategory(store, r.URL.Query().Get("category"))
	writeJSON(w, http.StatusOK, list)
}

func productHandler(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/products/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
		return
	}
	p, ok := findProduct(store, id)
	if !ok {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
		return
	}
	writeJSON(w, http.StatusOK, p)
}

func categoriesHandler(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, categories(store))
}

func router() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", withCORS(healthHandler))
	mux.HandleFunc("/api/products", withCORS(productsHandler))
	mux.HandleFunc("/api/products/", withCORS(productHandler))
	mux.HandleFunc("/api/categories", withCORS(categoriesHandler))
	return mux
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("serwer Zadanie 10 startuje na :%s (CORS origin: %s)", port, clientOrigin())
	if err := http.ListenAndServe(":"+port, router()); err != nil {
		log.Fatal(err)
	}
}
