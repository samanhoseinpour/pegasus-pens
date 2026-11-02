# Third-party code

## Lenis (smooth scrolling)

`assets/lenis.min.js` is the unmodified browser build of **Lenis 1.3.27** (npm package `lenis`, file `dist/lenis.min.js`, fetched from jsDelivr), with a one-line license banner added at the top and the `sourceMappingURL` comment removed. It is self-hosted, so the theme makes no request to a CDN for it. `assets/pegasus-smooth.js` configures it.

Source: https://github.com/darkroomengineering/lenis

```
The MIT License

Copyright (c) 2024 darkroom.engineering

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

To update it: fetch the new `dist/lenis.min.js`, keep the banner line, and run `ixsmooth` (or re-check by hand) because `pegasus-smooth.js` relies on the `prevent` option, `autoRaf`, `stop()`/`start()`/`destroy()` and `scrollTo()`.
