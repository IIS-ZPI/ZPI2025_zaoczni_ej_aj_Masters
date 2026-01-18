# Frontend prototype (React) – NBP exchange rate analysis

UI prototype fulfilling functional requirements:
- counting rising / falling / unchanged sessions,
- statistical measures: median, mode (or "No mode"), standard deviation, coefficient of variation,
- histogram of change distribution (12 bins) monthly / quarterly,
- automatically calculated from/to dates in `YYYY-MM-DD` format,
- currencies: PLN, EUR, USD, CNY, GBP.

## Run
```bash
docker pull donvolt777/nbp-mockup:1.0.1
docker run --rm -p 5173:80 donvolt777/nbp-mockup:latest
```

address: http://localhost:5173
