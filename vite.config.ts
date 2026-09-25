// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Gera a saída no formato da hospedagem detectada no build (Vercel ou Netlify).
// Em qualquer outro lugar mantém o padrão (Cloudflare Workers).
const hosting = process.env.VERCEL
  ? {
      preset: "vercel",
      output: {
        dir: ".vercel/output",
        serverDir: ".vercel/output/functions/__server.func",
        publicDir: ".vercel/output/static",
      },
    }
  : process.env.NETLIFY
    ? {
        preset: "netlify",
        output: {
          dir: ".netlify/functions-internal",
          serverDir: ".netlify/functions-internal/server",
          publicDir: "dist",
        },
      }
    : undefined;

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  ...(hosting ? { nitro: hosting } : {}),
});
