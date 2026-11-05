# Template format

A Studio template is data, not code. Designers build it in Figma, the importer turns it into this JSON, the app renders it with the workspace's brand kit. Nothing ships through a code release.

```json
{
  "id": "announcement",
  "name": "Announcement",
  "icon": "megaphone",
  "sizes": ["post", "square", "story"],
  "photo": false,
  "defTheme": 0,
  "fields": [
    {"k": "label", "label": "Label", "def": "New"},
    {"k": "title", "label": "Headline", "def": "Something *worth* announcing"},
    {"k": "body", "label": "Body", "type": "area", "def": "..."}
  ],
  "layouts": {
    "post": {"bg": "ground", "layers": [ ... ]},
    "story": {"layers": [ ... ]}
  }
}
```

- `sizes` come from the Studio's size list: `post` 1080×1350, `square` 1080×1080, `story` 1080×1920, `yt` 1280×720, `wide`, `li`, `lic`, `a4`.
- `fields` are what the client edits. `k` is the key layers bind to; `type: "area"` gives a multi-line box. `*asterisks*` in text mark the highlighted words.
- `photo: true` adds the photo slot in the editor; an `image` layer with no `bind` shows it.
- `layouts` has one entry per size, each with its own `layers`, in that size's pixels. Missing sizes fall back to the first one, scaled.

## Layers

Drawn in order. `x`, `y`, `w`, `h` are pixels of the size (a 1080-wide canvas for most). Colours are roles from the brand kit, or a hex:

| role | meaning |
|---|---|
| `ground` | background |
| `surface` | cards, soft panels |
| `ink` | text |
| `muted` | secondary text |
| `accent` | the one highlight |

| type | properties |
|---|---|
| `rect` | `fill`, `radius`, `opacity`, `stroke`, `strokeWidth` |
| `text` | `bind` (field key) or `text`; `font` display / body / serif; `size` number or `{"max": 120, "chars": 14}` to shrink long text; `weight`, `lineHeight`, `letterSpacing`, `color`, `align`, `valign`, `upper`, `rich` (default true: asterisks highlight) |
| `image` | the photo slot, or `bind` to a field; `radius`, `outline` |
| `logo` | the kit logo for the current theme (light or dark automatically); `w`, `h`, `align` |
| `chip` | pill with `bind` or `text`; `fill`, `color`, `size`, `upper` |
| `line` | `color`, `opacity`, `h` |

## Themes

A client's brand kit produces the Style options automatically: **Brand** (ground colour), **Light** (surface), **Accent**, and **Accent 2** if the kit has one. Text, chips and logos pick the right contrast for each. The Colorteam workspace keeps its hand-made Night / Stone / Pink / Podcast themes.

## Figma conventions for the importer

Staff use **Templates → Import from Figma**: paste a link to the frame or section (right-click → Copy link to selection) and a Figma personal access token with read access. The result opens in the template editor with a preview; nothing is saved until you press Save.


- One page per template, one frame per size, frame named like the size (`post`, `story`).
- Layer names map to the format: `text:title`, `image` (the photo slot), `logo`, `chip:label` (a frame with a fill and a text inside), `rect`, `line`. Add `area` to a text name for a multi-line box (`text:body area`). Layers with other names are skipped, and default names like "Text 7" are flagged.
- Frames can be drawn at any scale (540 wide is fine); positions and sizes are scaled to the Studio size.
- Fill colours that match a kit colour are stored as the role; anything else as hex.
- Text that should shrink with length gets a `fit:14` suffix in its name (max characters at full size).
