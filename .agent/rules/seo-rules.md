# SEO Rules — Search Engine Optimization

## Filosofia

O Digital Garden deve ser descoberto organicamente. SEO é jardinagem digital — plantar as sementes certas para que o conteúdo floresça nos resultados de busca.

## 1. Meta Tags Obrigatórias

Toda página DEVE ter:

- **`<title>`**: Único por página, 50-60 caracteres, keyword principal no início
- **`<meta name="description">`**: 150-160 caracteres, resumo com call-to-action
- **`<meta name="robots">`**: Controle de indexação (`index, follow` ou `noindex`)
- **`<link rel="canonical">`**: URL canônica para evitar conteúdo duplicado

## 2. Open Graph & Social Cards

Para compartilhamento rico em redes sociais:

- **`og:title`**: Título para preview (pode diferir do `<title>`)
- **`og:description`**: Descrição para preview
- **`og:image`**: Imagem de preview (1200x630px recomendado)
- **`og:type`**: `article` para posts, `website` para outras páginas
- **`og:url`**: URL canônica da página

### Twitter Cards

- Usar `twitter:card` = `summary_large_image` para posts
- `twitter:site` e `twitter:creator` se aplicável

## 3. Structured Data (JSON-LD)

Dados estruturados para rich snippets:

- **BlogPosting**: Para artigos/posts do jardim
- **BreadcrumbList**: Para navegação
- **Person/Organization**: Para autoria
- **WebSite**: Com SearchAction para busca interna

```json
{
	"@context": "https://schema.org",
	"@type": "BlogPosting",
	"headline": "Título do Post",
	"datePublished": "2026-01-14",
	"author": { "@type": "Person", "name": "Nome" }
}
```

## 4. Performance SEO (Core Web Vitals)

Métricas que afetam ranking:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Implementação

- Lazy loading de imagens abaixo do fold: `loading="lazy"`
- Preconnect para fontes externas: `<link rel="preconnect">`
- Preload de recursos críticos: `<link rel="preload">`

## 5. Content SEO

- **H1 único**: Apenas um `<h1>` por página (título principal)
- **Hierarquia lógica**: H2 → H3 → H4 sem saltar níveis
- **Alt text**: Todas as imagens com descrição contextual
- **Internal linking**: Links entre posts relacionados (backlinks)
- **URLs semânticas**: Slugs descritivos em minúsculo (`/posts/meu-artigo`)

## 6. Technical SEO

- **Sitemap XML**: Gerado automaticamente, atualizado a cada deploy
- **robots.txt**: Configurado para permitir crawlers
- **Trailing slashes**: Consistente (com ou sem, mas não ambos)
- **Redirecionamentos**: 301 para URLs antigas ou renomeadas
- **HTTPS**: Obrigatório para todo o site

## Checklist de Validação do Agente

O Agente SEO deve verificar:

- [ ] Toda página tem `<title>` e `<meta description>` únicos
- [ ] Posts têm schema BlogPosting em JSON-LD
- [ ] Imagens têm `alt` e `loading="lazy"` (exceto above-the-fold)
- [ ] `sitemap.xml` existe e inclui todas as páginas públicas
- [ ] `robots.txt` permite indexação das páginas desejadas
- [ ] URLs não têm parâmetros desnecessários ou IDs numéricos
