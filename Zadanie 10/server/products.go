package main

import "sort"

type Product struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Price    float64 `json:"price"`
}

type CartItem struct {
	Product  Product `json:"product"`
	Quantity int     `json:"quantity"`
}

func seedProducts() []Product {
	return []Product{
		{ID: 1, Name: "Koszulka", Category: "Ubrania", Price: 49.99},
		{ID: 2, Name: "Spodnie", Category: "Ubrania", Price: 129.50},
		{ID: 3, Name: "Czapka", Category: "Akcesoria", Price: 39.00},
		{ID: 4, Name: "Skarpetki", Category: "Akcesoria", Price: 14.99},
	}
}

func findProduct(products []Product, id int) (Product, bool) {
	for _, p := range products {
		if p.ID == id {
			return p, true
		}
	}
	return Product{}, false
}

func filterByCategory(products []Product, category string) []Product {
	if category == "" {
		return products
	}
	out := make([]Product, 0, len(products))
	for _, p := range products {
		if p.Category == category {
			out = append(out, p)
		}
	}
	return out
}

func categories(products []Product) []string {
	set := map[string]struct{}{}
	for _, p := range products {
		set[p.Category] = struct{}{}
	}
	out := make([]string, 0, len(set))
	for c := range set {
		out = append(out, c)
	}
	sort.Strings(out)
	return out
}

func cartTotal(items []CartItem) float64 {
	var total float64
	for _, it := range items {
		if it.Quantity <= 0 {
			continue
		}
		total += it.Product.Price * float64(it.Quantity)
	}
	return total
}
