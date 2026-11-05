// Colorteam Studio MCP server (Streamable HTTP, JSON responses). One key = one workspace.
// Agents can read the brand kit and templates, make and edit draft posts, set publish dates and
// send posts for approval. They can't approve, publish or touch other workspaces.
// Auth: "Authorization: Bearer cts_..." (or ?key=cts_... for clients that only take a URL).
// Build: scripts/build-mcp.cjs inlines templates.json into index.ts for the dashboard editor.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

// Generated from templates.json by scripts/build-mcp.cjs. Edit server.ts, not this file.
const MANIFEST: { templates: any[]; sizes: Record<string, { label: string; W: number; H: number }> } = {
 "templates": [
  {
   "id": "podcast",
   "name": "Podcast guest announcement",
   "internal": false,
   "photo": true,
   "defTheme": 3,
   "sizes": [
    "post",
    "story",
    "square",
    "wide"
   ],
   "designedSizes": [
    "post",
    "story"
   ],
   "fields": [
    {
     "k": "episode",
     "label": "Episode number",
     "def": "06"
    },
    {
     "k": "guest",
     "label": "Guest name",
     "def": "Heather Winkle"
    },
    {
     "k": "role",
     "label": "Guest role",
     "def": "VP of Digital Experience, Delta Air Lines"
    },
    {
     "k": "label",
     "label": "Label",
     "def": "New episode"
    }
   ],
   "clientDefaults": {
    "episode": "01",
    "guest": "Guest Name",
    "role": "Title, Company",
    "label": "New episode"
   }
  },
  {
   "id": "quote",
   "name": "Quote card",
   "internal": false,
   "photo": true,
   "defTheme": 0,
   "sizes": [
    "post",
    "square",
    "story",
    "wide"
   ],
   "designedSizes": [
    "post",
    "square"
   ],
   "fields": [
    {
     "k": "quote",
     "label": "Quote",
     "multiline": true,
     "def": "Brand trust compounds. *Show up* every week, even when nobody is clapping."
    },
    {
     "k": "name",
     "label": "Name",
     "def": "Subomi Archibong"
    },
    {
     "k": "role",
     "label": "Role",
     "def": "Founder & CEO, Colorteam"
    }
   ],
   "clientDefaults": {
    "quote": "Say the one thing your customers *remember*.",
    "name": "Your Name",
    "role": "Founder, {brand}"
   }
  },
  {
   "id": "carousel",
   "name": "Carousel",
   "internal": false,
   "photo": false,
   "defTheme": 0,
   "sizes": [
    "post",
    "square",
    "story",
    "wide"
   ],
   "designedSizes": [
    "post",
    "square"
   ],
   "fields": [
    {
     "k": "kicker",
     "label": "Series label",
     "def": "Marketing tips"
    },
    {
     "k": "title",
     "label": "Cover title",
     "def": "*Systems* Over Speed"
    },
    {
     "k": "points",
     "label": "Slides (one per line, \"Title — detail\")",
     "multiline": true,
     "def": "Plan the month — Set three priorities and cut the rest.\nBatch the work — Write, design and schedule in one block.\nReview weekly — Keep what moved the needle."
    },
    {
     "k": "cta",
     "label": "Closing slide",
     "def": "Follow @yourcolorteam for more"
    }
   ],
   "clientDefaults": {
    "kicker": "Tips from {brand}",
    "title": "Three things we *always* do",
    "points": "Start with why - One line on why it matters.\nKeep it simple - Short, useful, easy to act on.\nSay what is next - End with one clear step.",
    "cta": "Follow {brand} for more"
   }
  },
  {
   "id": "reel",
   "name": "Reel cover",
   "internal": false,
   "photo": true,
   "defTheme": 3,
   "sizes": [
    "story",
    "post",
    "square",
    "wide"
   ],
   "designedSizes": [
    "story"
   ],
   "fields": [
    {
     "k": "series",
     "label": "Label",
     "def": "Clara Armand-Delille · Founder, ThirdEye Media"
    },
    {
     "k": "title",
     "label": "Title",
     "def": "Marketing Isn’t the Only Thing That *Builds Trust*"
    }
   ],
   "clientDefaults": {
    "series": "{brand} · Episode 1",
    "title": "The one thing we *never* skip"
   }
  },
  {
   "id": "story",
   "name": "Story",
   "internal": false,
   "photo": true,
   "defTheme": 0,
   "sizes": [
    "story",
    "post",
    "square",
    "wide"
   ],
   "designedSizes": [
    "story"
   ],
   "fields": [
    {
     "k": "headline",
     "label": "Headline",
     "def": "New Work: *NECLive* 2025"
    },
    {
     "k": "body",
     "label": "Body",
     "multiline": true,
     "def": "A scalable visual identity for the creative economy, from avatar to stage."
    },
    {
     "k": "cta",
     "label": "Call to action",
     "def": "See the case study"
    }
   ],
   "clientDefaults": {
    "headline": "New at {brand}: *something fresh*",
    "body": "One or two lines about what is new and why people will care.",
    "cta": "Find out more"
   }
  },
  {
   "id": "team",
   "name": "Team spotlight",
   "internal": false,
   "photo": true,
   "defTheme": 1,
   "sizes": [
    "post",
    "square",
    "story",
    "wide"
   ],
   "designedSizes": [
    "post"
   ],
   "fields": [
    {
     "k": "headline",
     "label": "Label",
     "def": "Meet the team"
    },
    {
     "k": "name",
     "label": "Name",
     "def": "Funmibi Samuel"
    },
    {
     "k": "role",
     "label": "Role",
     "def": "Marketing Lead, Colorteam"
    }
   ],
   "clientDefaults": {
    "headline": "Meet the team",
    "name": "Team Member",
    "role": "Role, {brand}"
   }
  },
  {
   "id": "youtube",
   "name": "YouTube thumbnail",
   "internal": false,
   "photo": true,
   "defTheme": 3,
   "sizes": [
    "yt",
    "post",
    "square",
    "story",
    "wide"
   ],
   "designedSizes": [
    "yt"
   ],
   "fields": [
    {
     "k": "label",
     "label": "Label",
     "def": "Episode 05"
    },
    {
     "k": "title",
     "label": "Title",
     "def": "The Shortcut That Kills *Startups*"
    }
   ],
   "clientDefaults": {
    "label": "Episode 01",
    "title": "The *mistake* everyone makes"
   }
  },
  {
   "id": "linkedin",
   "name": "LinkedIn banner",
   "internal": false,
   "photo": false,
   "defTheme": 0,
   "sizes": [
    "li",
    "lic"
   ],
   "designedSizes": [
    "li",
    "lic"
   ],
   "fields": [
    {
     "k": "headline",
     "label": "Headline",
     "def": "Design Beyond *Boundaries*"
    },
    {
     "k": "sub",
     "label": "Sub-line",
     "def": "Branding · Creative production · Marketing · Digital"
    }
   ],
   "clientDefaults": {
    "headline": "*{brand}*",
    "sub": "What you do · Who it is for · Where you are"
   }
  },
  {
   "id": "highlights",
   "name": "Highlight covers",
   "internal": false,
   "photo": false,
   "defTheme": 0,
   "sizes": [
    "story",
    "post",
    "square",
    "wide"
   ],
   "designedSizes": [
    "story"
   ],
   "fields": [
    {
     "k": "labels",
     "label": "Highlights (comma separated)",
     "def": "Work, Services, Podcast, Team, Reviews"
    }
   ],
   "clientDefaults": {
    "labels": "About, Services, Reviews, Team, Contact"
   }
  },
  {
   "id": "event",
   "name": "Event / webinar",
   "internal": false,
   "photo": true,
   "defTheme": 0,
   "sizes": [
    "post",
    "wide",
    "square",
    "story"
   ],
   "designedSizes": [
    "post",
    "wide"
   ],
   "fields": [
    {
     "k": "format",
     "label": "Format",
     "def": "Live webinar"
    },
    {
     "k": "title",
     "label": "Title",
     "def": "Brand Trust in the *Age of AI*"
    },
    {
     "k": "date",
     "label": "Date",
     "def": "Thu, 12 November"
    },
    {
     "k": "time",
     "label": "Time",
     "def": "4 PM WAT · 4 PM CET"
    },
    {
     "k": "speaker",
     "label": "Speaker",
     "def": "Subomi Archibong"
    },
    {
     "k": "speakerRole",
     "label": "Speaker role",
     "def": "Founder & CEO, Colorteam"
    }
   ],
   "clientDefaults": {
    "format": "Live event",
    "title": "Your event *title* here",
    "date": "Thu, 12 November",
    "time": "6 PM",
    "speaker": "Speaker Name",
    "speakerRole": "Role, {brand}"
   }
  },
  {
   "id": "hiring",
   "name": "Hiring post",
   "internal": false,
   "photo": false,
   "defTheme": 0,
   "sizes": [
    "post",
    "square",
    "story",
    "wide"
   ],
   "designedSizes": [
    "post",
    "square"
   ],
   "fields": [
    {
     "k": "headline",
     "label": "Headline",
     "def": "We’re *Hiring*"
    },
    {
     "k": "role",
     "label": "Role",
     "def": "Copywriter"
    },
    {
     "k": "details",
     "label": "Details (one per line)",
     "multiline": true,
     "def": "Remote\nWarsaw or Lagos\nFull-time"
    },
    {
     "k": "cta",
     "label": "How to apply",
     "def": "Apply at colorteam.io/careers"
    }
   ],
   "clientDefaults": {
    "role": "Job title",
    "details": "Location\nFull-time",
    "cta": "Apply at {web}"
   }
  },
  {
   "id": "case",
   "name": "Case study",
   "internal": false,
   "photo": true,
   "defTheme": 0,
   "sizes": [
    "post",
    "square",
    "story",
    "wide"
   ],
   "designedSizes": [
    "post"
   ],
   "fields": [
    {
     "k": "client",
     "label": "Client",
     "def": "Netflix Nigeria"
    },
    {
     "k": "headline",
     "label": "Headline",
     "def": "Making Netflix Feel *Nigerian*, Every Week"
    },
    {
     "k": "stat",
     "label": "Result figure",
     "def": "600K+"
    },
    {
     "k": "statLabel",
     "label": "Result label",
     "def": "Instagram followers, up from under 10K"
    }
   ],
   "clientDefaults": {
    "client": "Client name",
    "headline": "How we helped them *grow*",
    "stat": "3x",
    "statLabel": "more enquiries in six months"
   }
  },
  {
   "id": "proposal",
   "name": "Proposal",
   "internal": true,
   "photo": false,
   "defTheme": 0,
   "sizes": [
    "a4"
   ],
   "designedSizes": [
    "a4"
   ],
   "fields": [
    {
     "k": "client",
     "label": "Client name",
     "def": "Mona & Co"
    },
    {
     "k": "title",
     "label": "Proposal title",
     "def": "Sales Channel *Expansion*"
    },
    {
     "k": "subtitle",
     "label": "Summary",
     "multiline": true,
     "def": "More ways for people to buy what you make: a shop on Instagram, a gallery on Etsy, a Pinterest presence that sells, and order alerts in your pocket. Everything live by 28 November."
    },
    {
     "k": "date",
     "label": "Date",
     "def": "29 October 2026"
    },
    {
     "k": "closing",
     "label": "Closing line",
     "def": "Let’s build *together*."
    },
    {
     "k": "contact",
     "label": "Contact",
     "multiline": true,
     "def": "Subomi Archibong · Founder & CEO\nsubomi@colorteam.io · +48 722 162 814\ncolorteam.io"
    }
   ],
   "clientDefaults": null
  },
  {
   "id": "announcement",
   "name": "Announcement",
   "internal": false,
   "photo": false,
   "defTheme": 0,
   "sizes": [
    "post",
    "square",
    "story",
    "wide"
   ],
   "designedSizes": [
    "post",
    "square",
    "story"
   ],
   "fields": [
    {
     "k": "label",
     "label": "Label",
     "def": "New"
    },
    {
     "k": "title",
     "label": "Headline",
     "def": "Something *worth* announcing"
    },
    {
     "k": "body",
     "label": "Body",
     "multiline": true,
     "def": "One or two lines that say what it is and why it matters."
    },
    {
     "k": "cta",
     "label": "Call to action",
     "def": "colorteam.io"
    }
   ],
   "clientDefaults": {
    "cta": "{web}"
   }
  },
  {
   "id": "photo-quote",
   "name": "Photo quote",
   "internal": false,
   "photo": true,
   "defTheme": 0,
   "sizes": [
    "post",
    "story",
    "square",
    "wide"
   ],
   "designedSizes": [
    "post",
    "story"
   ],
   "fields": [
    {
     "k": "quote",
     "label": "Quote",
     "multiline": true,
     "def": "Design is the *quiet* part of trust."
    },
    {
     "k": "name",
     "label": "Name",
     "def": "Subomi Archibong"
    },
    {
     "k": "role",
     "label": "Role",
     "def": "Founder, Colorteam"
    }
   ],
   "clientDefaults": {
    "quote": "Good things take *time*.",
    "name": "Your Name",
    "role": "Founder, {brand}"
   }
  }
 ],
 "sizes": {
  "post": {
   "label": "Post 4:5",
   "W": 1080,
   "H": 1350
  },
  "square": {
   "label": "Square 1:1",
   "W": 1080,
   "H": 1080
  },
  "story": {
   "label": "Story 9:16",
   "W": 1080,
   "H": 1920
  },
  "yt": {
   "label": "Thumbnail 16:9",
   "W": 1280,
   "H": 720
  },
  "wide": {
   "label": "Landscape 16:9",
   "W": 1600,
   "H": 900
  },
  "li": {
   "label": "Personal banner",
   "W": 1584,
   "H": 396
  },
  "lic": {
   "label": "Company cover",
   "W": 1128,
   "H": 191
  },
  "a4": {
   "label": "A4 page",
   "W": 794,
   "H": 1123
  }
 }
};

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, mcp-session-id, mcp-protocol-version, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
const send = (b: unknown, s = 200) => new Response(b === null ? null : JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const APP = () => Deno.env.get("APP_URL") || "https://app-staging.colorteam.io/";
const link = (id: string) => APP() + "#/file/" + id;

async function sha256(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const autoTitle = (name: string, f: Record<string, unknown>) => {
  const v = Object.values(f).find((x) => typeof x === "string" && (x as string).trim()) as string || "";
  return name + " — " + v.replace(/\*/g, "").split("\n")[0].slice(0, 40);
};

const TOOLS = [
  { name: "get_workspace", description: "The workspace this key belongs to: name, plan, brand kit (colours with roles, fonts, voice, things to avoid, banned words, website) and the styles posts can use. Read this before writing copy.",
    inputSchema: { type: "object", properties: {} } },
  { name: "list_templates", description: "Templates this workspace can make posts from, with their sizes and the text fields each one takes. Wrap words in *asterisks* in a field to highlight them.",
    inputSchema: { type: "object", properties: {} } },
  { name: "list_posts", description: "Recent posts in the workspace with status (draft, pending = waiting for approval, approved, changes = changes requested), publish date and a link.",
    inputSchema: { type: "object", properties: { status: { type: "string", enum: ["draft", "pending", "approved", "changes"] }, limit: { type: "integer", minimum: 1, maximum: 50 } } } },
  { name: "create_post", description: "Make a new draft post from a template. Unspecified fields keep the template's sample text. Returns the post id and a link to open it in Colorteam Studio.",
    inputSchema: { type: "object", required: ["template"], properties: {
      template: { type: "string", description: "Template id from list_templates" },
      fields: { type: "object", additionalProperties: { type: "string" }, description: "Field key to text" },
      sizes: { type: "array", items: { type: "string" }, description: "Sizes to include, e.g. post, square, story, wide. Defaults to the template's designed sizes." },
      style: { type: ["string", "integer"], description: "Style name or index from get_workspace (e.g. Brand, Light, Accent)" },
      publish_date: { type: "string", description: "YYYY-MM-DD, shows the post on the Studio calendar" },
      title: { type: "string" } } } },
  { name: "update_post", description: "Change the text, sizes, style or publish date of a draft (or a post with changes requested).",
    inputSchema: { type: "object", required: ["post_id"], properties: {
      post_id: { type: "string" }, fields: { type: "object", additionalProperties: { type: "string" } },
      sizes: { type: "array", items: { type: "string" } }, style: { type: ["string", "integer"] }, publish_date: { type: ["string", "null"] }, title: { type: "string" } } } },
  { name: "request_approval", description: "Send a draft to the workspace's approvers. They get an email and approve or ask for changes in Colorteam Studio. Agents can't approve.",
    inputSchema: { type: "object", required: ["post_id"], properties: { post_id: { type: "string" }, note: { type: "string", description: "Note for the approver" } } } },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method === "GET") return send({ error: "This MCP server answers POST requests (no event stream)." }, 405);
  if (req.method !== "POST") return send({ error: "POST only" }, 405);

  const url = new URL(req.url);
  const key = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "") || url.searchParams.get("key") || "";
  const unauth = (m: string) => send({ jsonrpc: "2.0", id: null, error: { code: -32001, message: m } }, 401);
  if (!key.startsWith("cts_")) return unauth("Missing Colorteam Studio key (Authorization: Bearer cts_...)");

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: k } = await db.from("api_keys").select("*").eq("key_hash", await sha256(key)).maybeSingle();
  if (!k || k.revoked_at) return unauth("This key is not valid or was revoked");
  const { data: access } = await db.rpc("has_agent_access", { ws: k.workspace_id });
  if (!access) return unauth("Agent access is part of the Max plan");
  if (!k.last_used_at || Date.now() - new Date(k.last_used_at).getTime() > 5 * 60000) {
    await db.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", k.id);
  }
  const { data: ws } = await db.from("workspaces").select("id,slug,name,plan,settings").eq("id", k.workspace_id).single();
  const kit = ws?.settings?.kit || null;
  const client = ws?.slug !== "colorteam";
  const brand = String(ws?.name || "").replace(/\s*\(demo[^)]*\)\s*$/i, "");
  const web = String(kit?.website || "").replace(/^https?:\/\//, "").replace(/\/$/, "") || brand;
  const styles: string[] = client && kit ? ["Brand", "Light", "Accent", ...((kit.colors || []).some((c: any) => c.role === "accent 2") ? ["Accent 2"] : [])] : ["Night", "Stone", "Pink", "Podcast"];
  const { data: member } = await db.from("memberships").select("name").eq("workspace_id", k.workspace_id).eq("email", k.created_by).maybeSingle();
  const author = member?.name || k.created_by.split("@")[0];

  async function templates() {
    const fill = (v: string) => String(v).replace(/\{brand\}/g, brand).replace(/\{web\}/g, web);
    const builtIn = MANIFEST.templates.filter((t) => !(client && t.internal)).map((t) => ({
      id: t.id, name: t.name, photo: t.photo, defTheme: t.defTheme, sizes: t.sizes, designedSizes: t.designedSizes,
      fields: t.fields.map((f: any) => ({ key: f.k, label: f.label, multiline: !!f.multiline,
        example: client && t.clientDefaults && f.k in t.clientDefaults ? fill(t.clientDefaults[f.k]) : f.def })) }));
    const { data: rows } = await db.from("templates").select("key,name,spec,workspace_id").eq("published", true).or(`workspace_id.is.null,workspace_id.eq.${k.workspace_id}`);
    const custom = (rows || []).filter((r) => r.spec?.fields && r.spec?.sizes).map((r) => ({
      id: r.key, name: r.name, photo: !!r.spec.photo, defTheme: r.spec.defTheme || 0, sizes: r.spec.sizes, designedSizes: r.spec.sizes,
      fields: r.spec.fields.filter((f: any) => f.type !== "image").map((f: any) => ({ key: f.k, label: f.label, multiline: f.type === "area", example: f.def ?? "" })) }));
    const byId = new Map<string, any>();
    for (const t of [...builtIn, ...custom]) byId.set(t.id, t);
    return [...byId.values()];
  }
  const styleIndex = (s: unknown, fallback: number) => {
    if (s === undefined || s === null || s === "") return fallback;
    if (typeof s === "number" || /^\d+$/.test(String(s))) { const n = Number(s); if (n >= 0 && n < styles.length) return n; throw new Error("Unknown style " + s + ". Styles: " + styles.join(", ")); }
    const i = styles.findIndex((x) => x.toLowerCase() === String(s).toLowerCase());
    if (i < 0) throw new Error("Unknown style " + s + ". Styles: " + styles.join(", "));
    return i;
  };
  const checkDate = (d: unknown) => { if (d === null || d === undefined || d === "") return null; if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d))) throw new Error("publish_date must be YYYY-MM-DD"); return String(d); };
  const cleanFields = (tpl: any, given: Record<string, unknown> = {}) => {
    const keys = new Set(tpl.fields.map((f: any) => f.key));
    const unknown = Object.keys(given).filter((x) => !keys.has(x));
    if (unknown.length) throw new Error(`Unknown field(s) for ${tpl.id}: ${unknown.join(", ")}. Fields: ${[...keys].join(", ")}`);
    const out: Record<string, string> = {};
    for (const f of tpl.fields) out[f.key] = String(given[f.key] ?? f.example ?? "").slice(0, 2000);
    return out;
  };
  const checkSizes = (tpl: any, s?: string[]) => {
    if (!s || !s.length) return tpl.designedSizes.slice();
    const bad = s.filter((x) => !tpl.sizes.includes(x));
    if (bad.length) throw new Error(`Size(s) not available for ${tpl.id}: ${bad.join(", ")}. Available: ${tpl.sizes.join(", ")}`);
    return tpl.sizes.filter((x: string) => s.includes(x));
  };
  const getPost = async (id: string) => {
    if (!/^[0-9a-f-]{36}$/.test(id || "")) throw new Error("post_id looks wrong");
    const { data } = await db.from("requests").select("*").eq("id", id).eq("workspace_id", k.workspace_id).maybeSingle();
    if (!data) throw new Error("No post with that id in this workspace");
    return data;
  };
  const summary = (r: any) => ({ id: r.id, title: r.data?.title, template: r.data?.tplId, status: r.status, publish_date: r.data?.schedule || null,
    sizes: r.data?.sizes, updated_at: r.data?.updatedAt || r.at, link: link(r.id), feedback: r.status === "changes" ? r.comment || "" : undefined });

  async function call(name: string, a: any): Promise<unknown> {
    switch (name) {
      case "get_workspace":
        return { name: ws?.name, plan: ws?.plan, app: APP(), styles,
          brand_kit: kit ? { colours: kit.colors, fonts: kit.fonts, website: kit.website || null, voice: kit.voice || null, imagery: kit.imagery || null,
            avoid: kit.dont || null, banned_words: kit.banned || null } : null,
          notes: "Posts you make are drafts filed under " + author + ". A person approves them in Colorteam Studio." };
      case "list_templates": return { templates: await templates(), sizes: MANIFEST.sizes };
      case "list_posts": {
        let q = db.from("requests").select("id,status,comment,data,at").eq("workspace_id", k.workspace_id).order("at", { ascending: false }).limit(Math.min(Number(a?.limit) || 20, 50));
        if (a?.status) q = q.eq("status", a.status);
        const { data } = await q; return { posts: (data || []).map(summary) };
      }
      case "create_post": {
        const tpl = (await templates()).find((t) => t.id === a?.template);
        if (!tpl) throw new Error("Unknown template. Call list_templates for ids.");
        const fields = cleanFields(tpl, a.fields || {});
        const now = new Date().toISOString();
        const data = { tplId: tpl.id, title: String(a.title || autoTitle(tpl.name, fields)).slice(0, 120), fields, photo: null,
          sizes: checkSizes(tpl, a.sizes), theme: styleIndex(a.style, tpl.defTheme || 0), offsets: {}, schedule: checkDate(a.publish_date), versions: [],
          ownerName: author, updatedBy: author + " (agent)", updatedAt: now, madeBy: "agent: " + k.name };
        const row: Record<string, unknown> = { email: k.created_by, data, status: "draft", comment: "", workspace_id: k.workspace_id };
        if (k.created_uid) row.uid = k.created_uid;
        const { data: ins, error } = await db.from("requests").insert(row).select("*").single();
        if (error) throw new Error(error.message);
        return { ...summary(ins), message: "Draft created. Open the link to check it, or call request_approval." };
      }
      case "update_post": {
        const r = await getPost(a.post_id);
        if (!["draft", "changes"].includes(r.status)) throw new Error("Only drafts and posts with changes requested can be edited (this one is " + r.status + ")");
        const tpl = (await templates()).find((t) => t.id === r.data?.tplId);
        if (!tpl) throw new Error("This post's template is no longer available");
        const d = { ...r.data };
        if (a.fields) { const wasAuto = d.title === autoTitle(tpl.name, d.fields || {}); d.fields = cleanFields(tpl, { ...(d.fields || {}), ...a.fields }); if (wasAuto && !a.title) d.title = autoTitle(tpl.name, d.fields); }
        if (a.sizes) d.sizes = checkSizes(tpl, a.sizes);
        if (a.style !== undefined) d.theme = styleIndex(a.style, d.theme || 0);
        if ("publish_date" in (a || {})) d.schedule = checkDate(a.publish_date);
        if (a.title) d.title = String(a.title).slice(0, 120);
        d.updatedAt = new Date().toISOString(); d.updatedBy = author + " (agent)";
        const { data: up, error } = await db.from("requests").update({ data: d }).eq("id", r.id).select("*").single();
        if (error) throw new Error(error.message);
        return summary(up);
      }
      case "request_approval": {
        const r = await getPost(a.post_id);
        if (!["draft", "changes"].includes(r.status)) throw new Error("This post is " + r.status + "; only drafts can be sent for approval");
        const d = { ...r.data, note: String(a.note || "").slice(0, 500), updatedAt: new Date().toISOString(), updatedBy: author + " (agent)" };
        const { data: up, error } = await db.from("requests").update({ status: "pending", comment: "", data: d }).eq("id", r.id).select("*").single();
        if (error) throw new Error(error.message);
        // Email the approvers through the notify function, as the key's owner.
        const nf = await fetch(Deno.env.get("SUPABASE_URL") + "/functions/v1/notify", { method: "POST",
          headers: { Authorization: "Bearer " + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), "Content-Type": "application/json" },
          body: JSON.stringify({ file_id: r.id, event: "sent", actor: k.created_by }) }).then((x) => x.json()).catch(() => ({}));
        return { ...summary(up), approvers_emailed: nf?.sent ?? 0 };
      }
    }
    throw new Error("Unknown tool " + name);
  }

  async function handle(m: any) {
    const id = m?.id ?? null;
    if (m?.jsonrpc !== "2.0" || typeof m?.method !== "string") return { jsonrpc: "2.0", id, error: { code: -32600, message: "Invalid request" } };
    if (id === null || id === undefined) return null; // notification
    try {
      switch (m.method) {
        case "initialize": return { jsonrpc: "2.0", id, result: { protocolVersion: m.params?.protocolVersion || "2025-06-18",
          capabilities: { tools: { listChanged: false } }, serverInfo: { name: "colorteam-studio", version: "1.0.0" },
          instructions: `Colorteam Studio for ${ws?.name}. Read get_workspace first (brand kit, voice, banned words), pick a template from list_templates, then create_post. Posts are drafts until a person approves them.` } };
        case "ping": return { jsonrpc: "2.0", id, result: {} };
        case "tools/list": return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
        case "tools/call": {
          try {
            const out = await call(m.params?.name, m.params?.arguments || {});
            return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(out, null, 1) }], structuredContent: out } };
          } catch (e) {
            return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: (e as Error).message }], isError: true } };
          }
        }
        default: return { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found: " + m.method } };
      }
    } catch (e) {
      return { jsonrpc: "2.0", id, error: { code: -32603, message: (e as Error).message } };
    }
  }

  let body: any;
  try { body = await req.json(); } catch { return send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400); }
  if (Array.isArray(body)) {
    const out = (await Promise.all(body.map(handle))).filter(Boolean);
    return out.length ? send(out) : new Response(null, { status: 202, headers: cors });
  }
  const out = await handle(body);
  return out ? send(out) : new Response(null, { status: 202, headers: cors });
});
