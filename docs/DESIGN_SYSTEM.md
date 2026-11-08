# Design system

Direction: monochrome, industrial luxury, product obsession. Palette: `#000`, `#FFF`, carbon `#151515`, graphite `#343434`, architectural gray `#E9E9E9`. No gradients except soft stage lighting behind products.

Type: Inter Tight Variable (display, uppercase, tracking -0.045em, line-height .86), Space Mono (labels, 11px, tracked). Both SIL OFL, self-hosted via fontsource.

Primitives (globals.css): `.display`, `.label`, `.wrap`, `.btn`/`.btn-solid`, `.stage`/`.stage-dark`, `.size-btn`, `.skel`, `.hscroll`. Motion: one entrance sequence on the hero and a clip-path reveal of the hero shoe; hover scale on cards; everything disabled under `prefers-reduced-motion`.

Interaction rules: visible focus rings on everything, 44px+ targets, sold-out sizes struck through and disabled, live regions for cart/availability messages, The Vault always shows an Exit control.

Wordmark: SL monogram (`src/components/Logo.tsx`) is original; flagged for trademark clearance with the name.
