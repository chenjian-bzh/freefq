

```yaml
  v2rayse:
    type: http
    path: proxies/v2rayse.yaml
    url: "https://cdn.jsdelivr.net/gh/song940/freefq@master/proxies/v2rayse.yaml"
    interval: 3600
    health-check:
      enable: true
      interval: 600
      url: http://www.gstatic.com/generate_204

  freefq:
    type: http
    path: proxies/freefq.yaml
    url: "https://cdn.jsdelivr.net/gh/song940/freefq@master/proxies/freefq.yaml"
    interval: 3600
    health-check:
      enable: true
      interval: 600
      url: http://www.gstatic.com/generate_204
```