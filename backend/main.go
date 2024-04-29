package main

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/grafana/alloy/converter"
	"github.com/grafana/alloy/converter/diag"
	"github.com/rs/cors"
)

type ConversionRequest struct {
	Data string          `json:"data"`
	Type converter.Input `json:"type"`
}

type ConversionResponse struct {
	Data        string           `json:"data"`
	Diagnostics diag.Diagnostics `json:"diagnostics"`
}

func convert(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	defer func() {
		slog.InfoContext(r.Context(), "finished conversion request", "duration", time.Since(start))
	}()

	if r.Method != http.MethodPost {
		http.Error(w, "method not supported", http.StatusBadRequest)
		return
	}

	var cr ConversionRequest
	if err := json.NewDecoder(r.Body).Decode(&cr); err != nil {
		http.Error(w, fmt.Sprintf("decoding request: %s", err.Error()), http.StatusBadRequest)
		return
	}

	var extraArgs []string = nil
	if cr.Type == "static integrations-next" {
		cr.Type = "static"
		extraArgs = []string{"-enable-features", "integrations-next", "-config.expand-env"}
	}

	out, diag := converter.Convert([]byte(cr.Data), cr.Type, extraArgs)
	json.NewEncoder(w).Encode(ConversionResponse{
		Data:        string(out),
		Diagnostics: diag,
	})
}

func main() {
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stderr, nil)))
	addr := os.Getenv("LISTEN_ADDR")
	if addr == "" {
		addr = ":8080"
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/convert", convert)
	cmux := cors.Default().Handler(mux)
	slog.Info("starting server", "address", addr)
	http.ListenAndServe(addr, cmux)
}
