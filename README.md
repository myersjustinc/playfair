# Playfair.js

Convert your [Google Image Charts](https://developers.google.com/chart/image/)
visualizations to use the newer, non-deprecated
[Google Charts API](https://developers.google.com/chart/)!

## Work in progress

Right now, this only supports pie charts since that's what was used in the
Google Image Charts docs as a
[Hello World example](https://developers.google.com/chart/image/docs/making_charts).
More types will be added soon.

## Documentation

Open (or `<iframe>`) `dist/playfair.html` with your Google Image Charts options
in a hash string instead of in a query string; for example:
`/dist/playfair.html#cht=p&chs=640x480&chd=t:10,20,30,40&chl=Hello|World|Whats|Up`

Docs are forthcoming, probably, depending on whether someone (or I) can
contribute docs without inadvertently infringing on Google's copyright. For
now, use [theirs](https://developers.google.com/chart/image/).
