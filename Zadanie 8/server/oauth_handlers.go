package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

// Pamiec na state (CSRF) - mapa stan -> czas utworzenia
var (
	stateStore = map[string]time.Time{}
	stateMu    sync.Mutex
)

func newState() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	s := hex.EncodeToString(b)
	stateMu.Lock()
	stateStore[s] = time.Now()
	stateMu.Unlock()
	return s
}

func consumeState(s string) bool {
	stateMu.Lock()
	defer stateMu.Unlock()
	created, ok := stateStore[s]
	if !ok {
		return false
	}
	delete(stateStore, s)
	if time.Since(created) > 10*time.Minute {
		return false
	}
	return true
}

func googleConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}
}

func githubConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GITHUB_REDIRECT_URL"),
		Scopes:       []string{"user:email", "read:user"},
		Endpoint:     github.Endpoint,
	}
}

func clientURL() string {
	v := os.Getenv("CLIENT_URL")
	if v == "" {
		v = "http://localhost:3000"
	}
	return v
}

// 4.0 - GET /auth/google -> serwer kieruje przegladarke do Google
func googleLogin(c echo.Context) error {
	cfg := googleConfig()
	if cfg.ClientID == "" {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "GOOGLE_CLIENT_ID nie skonfigurowany")
	}
	state := newState()
	u := cfg.AuthCodeURL(state, oauth2.AccessTypeOffline)
	return c.Redirect(http.StatusFound, u)
}

// 4.0 + 5.0 - return URI od Google: zapis usera, generacja WLASNEGO tokenu, redirect do React
func googleCallback(c echo.Context) error {
	state := c.QueryParam("state")
	code := c.QueryParam("code")
	if !consumeState(state) {
		return redirectWithError(c, "nieprawidlowy state")
	}
	if code == "" {
		return redirectWithError(c, "brak code")
	}

	cfg := googleConfig()
	ctx := context.Background()
	tok, err := cfg.Exchange(ctx, code)
	if err != nil {
		return redirectWithError(c, "wymiana code nie powiodla sie: "+err.Error())
	}

	httpClient := cfg.Client(ctx, tok)
	resp, err := httpClient.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return redirectWithError(c, "nie udalo sie pobrac userinfo")
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	var profile struct {
		ID      string `json:"id"`
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
	}
	if err := json.Unmarshal(body, &profile); err != nil || profile.Email == "" {
		return redirectWithError(c, "blad parsowania profilu")
	}

	user, err := upsertOAuthUser("google", profile.ID, profile.Email, profile.Name, profile.Picture, tok)
	if err != nil {
		return redirectWithError(c, "nie udalo sie zapisac uzytkownika")
	}

	jwtToken, err := generateToken(user)
	if err != nil {
		return redirectWithError(c, "blad generowania tokenu")
	}
	return c.Redirect(http.StatusFound, clientURL()+"/oauth-success?token="+url.QueryEscape(jwtToken))
}

// 4.5 - GET /auth/github
func githubLogin(c echo.Context) error {
	cfg := githubConfig()
	if cfg.ClientID == "" {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "GITHUB_CLIENT_ID nie skonfigurowany")
	}
	state := newState()
	u := cfg.AuthCodeURL(state)
	return c.Redirect(http.StatusFound, u)
}

// 4.5 + 5.0 - return URI od GitHub
func githubCallback(c echo.Context) error {
	state := c.QueryParam("state")
	code := c.QueryParam("code")
	if !consumeState(state) {
		return redirectWithError(c, "nieprawidlowy state")
	}
	if code == "" {
		return redirectWithError(c, "brak code")
	}

	cfg := githubConfig()
	ctx := context.Background()
	tok, err := cfg.Exchange(ctx, code)
	if err != nil {
		return redirectWithError(c, "wymiana code nie powiodla sie: "+err.Error())
	}

	httpClient := cfg.Client(ctx, tok)
	resp, err := httpClient.Get("https://api.github.com/user")
	if err != nil {
		return redirectWithError(c, "nie udalo sie pobrac user")
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	var profile struct {
		ID        int    `json:"id"`
		Login     string `json:"login"`
		Name      string `json:"name"`
		Email     string `json:"email"`
		AvatarURL string `json:"avatar_url"`
	}
	if err := json.Unmarshal(body, &profile); err != nil {
		return redirectWithError(c, "blad parsowania profilu")
	}

	if profile.Email == "" {
		profile.Email = fetchGithubPrimaryEmail(httpClient)
	}
	if profile.Email == "" {
		profile.Email = fmt.Sprintf("%s@users.noreply.github.com", profile.Login)
	}
	displayName := profile.Name
	if displayName == "" {
		displayName = profile.Login
	}

	user, err := upsertOAuthUser("github", strconv.Itoa(profile.ID), profile.Email, displayName, profile.AvatarURL, tok)
	if err != nil {
		return redirectWithError(c, "nie udalo sie zapisac uzytkownika")
	}

	jwtToken, err := generateToken(user)
	if err != nil {
		return redirectWithError(c, "blad generowania tokenu")
	}
	return c.Redirect(http.StatusFound, clientURL()+"/oauth-success?token="+url.QueryEscape(jwtToken))
}

func fetchGithubPrimaryEmail(httpClient *http.Client) string {
	resp, err := httpClient.Get("https://api.github.com/user/emails")
	if err != nil {
		return ""
	}
	defer resp.Body.Close()
	var emails []struct {
		Email    string `json:"email"`
		Primary  bool   `json:"primary"`
		Verified bool   `json:"verified"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&emails); err != nil {
		return ""
	}
	for _, e := range emails {
		if e.Primary && e.Verified {
			return e.Email
		}
	}
	if len(emails) > 0 {
		return emails[0].Email
	}
	return ""
}

// 5.0 - zapis usera + tokenow OAuth2 po stronie serwera w bazie
func upsertOAuthUser(provider, providerID, email, name, avatar string, tok *oauth2.Token) (*User, error) {
	var user User
	err := db.Where("provider = ? AND provider_user_id = ?", provider, providerID).First(&user).Error
	if err != nil {
		if err := db.Where("email = ?", email).First(&user).Error; err != nil {
			user = User{
				Email:          email,
				Username:       name,
				Provider:       provider,
				ProviderUserID: providerID,
				AvatarURL:      avatar,
			}
		}
	}
	user.Provider = provider
	user.ProviderUserID = providerID
	user.Email = email
	if user.Username == "" {
		user.Username = name
	}
	if avatar != "" {
		user.AvatarURL = avatar
	}
	user.ProviderToken = tok.AccessToken
	user.ProviderRefresh = tok.RefreshToken
	user.ProviderExpiresAt = tok.Expiry

	if user.ID == 0 {
		if err := db.Create(&user).Error; err != nil {
			return nil, err
		}
	} else {
		if err := db.Save(&user).Error; err != nil {
			return nil, err
		}
	}
	return &user, nil
}

func redirectWithError(c echo.Context, msg string) error {
	return c.Redirect(http.StatusFound, clientURL()+"/oauth-success?error="+url.QueryEscape(msg))
}
