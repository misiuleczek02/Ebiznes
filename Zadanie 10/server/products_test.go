package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestFindProduct(t *testing.T) {
	products := seedProducts()

	p, ok := findProduct(products, 2)
	if !ok {
		t.Fatal("oczekiwano znalezienia produktu 2")
	}
	if p.Name != "Spodnie" {
		t.Errorf("zly produkt: %s", p.Name)
	}

	if _, ok := findProduct(products, 999); ok {
		t.Error("produkt 999 nie powinien istniec")
	}
}

func TestFilterByCategory(t *testing.T) {
	products := seedProducts()

	all := filterByCategory(products, "")
	if len(all) != 4 {
		t.Errorf("pusty filtr powinien zwrocic wszystkie, dostalem %d", len(all))
	}

	ubrania := filterByCategory(products, "Ubrania")
	if len(ubrania) != 2 {
		t.Errorf("oczekiwano 2 produktow w Ubrania, dostalem %d", len(ubrania))
	}

	none := filterByCategory(products, "Elektronika")
	if len(none) != 0 {
		t.Errorf("nieistniejaca kategoria powinna byc pusta, dostalem %d", len(none))
	}
}

func TestCategories(t *testing.T) {
	got := categories(seedProducts())
	want := []string{"Akcesoria", "Ubrania"}
	if len(got) != len(want) {
		t.Fatalf("oczekiwano %d kategorii, dostalem %d", len(want), len(got))
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("kategoria[%d] = %s, oczekiwano %s", i, got[i], want[i])
		}
	}
}

func TestCartTotal(t *testing.T) {
	products := seedProducts()
	items := []CartItem{
		{Product: products[0], Quantity: 2},
		{Product: products[2], Quantity: 1},
		{Product: products[1], Quantity: -1},
	}
	got := cartTotal(items)
	want := 138.98
	if diff := got - want; diff > 0.001 || diff < -0.001 {
		t.Errorf("cartTotal = %.2f, oczekiwano %.2f", got, want)
	}

	if cartTotal(nil) != 0 {
		t.Error("pusty koszyk powinien miec wartosc 0")
	}
}

func TestProductsHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/products", nil)
	rec := httptest.NewRecorder()
	router().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, oczekiwano 200", rec.Code)
	}
	var got []Product
	if err := json.Unmarshal(rec.Body.Bytes(), &got); err != nil {
		t.Fatalf("zly JSON: %v", err)
	}
	if len(got) != 4 {
		t.Errorf("oczekiwano 4 produktow, dostalem %d", len(got))
	}
}

func TestProductsHandlerFiltered(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/products?category=Ubrania", nil)
	rec := httptest.NewRecorder()
	router().ServeHTTP(rec, req)

	var got []Product
	_ = json.Unmarshal(rec.Body.Bytes(), &got)
	if len(got) != 2 {
		t.Errorf("oczekiwano 2 produktow w Ubrania, dostalem %d", len(got))
	}
}

func TestProductHandler(t *testing.T) {
	cases := []struct {
		path string
		code int
	}{
		{"/api/products/1", http.StatusOK},
		{"/api/products/999", http.StatusNotFound},
		{"/api/products/abc", http.StatusBadRequest},
	}
	for _, c := range cases {
		req := httptest.NewRequest(http.MethodGet, c.path, nil)
		rec := httptest.NewRecorder()
		router().ServeHTTP(rec, req)
		if rec.Code != c.code {
			t.Errorf("%s: status = %d, oczekiwano %d", c.path, rec.Code, c.code)
		}
	}
}

func TestHealthHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	rec := httptest.NewRecorder()
	router().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, oczekiwano 200", rec.Code)
	}
}

func TestCORSPreflight(t *testing.T) {
	req := httptest.NewRequest(http.MethodOptions, "/api/products", nil)
	rec := httptest.NewRecorder()
	router().ServeHTTP(rec, req)
	if rec.Code != http.StatusNoContent {
		t.Errorf("preflight status = %d, oczekiwano 204", rec.Code)
	}
	if rec.Header().Get("Access-Control-Allow-Origin") == "" {
		t.Error("brak naglowka CORS")
	}
}

func TestCategoriesHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/categories", nil)
	rec := httptest.NewRecorder()
	router().ServeHTTP(rec, req)
	var got []string
	_ = json.Unmarshal(rec.Body.Bytes(), &got)
	if len(got) != 2 {
		t.Errorf("oczekiwano 2 kategorii, dostalem %d", len(got))
	}
}
