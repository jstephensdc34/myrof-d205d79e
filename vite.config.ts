
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Fallback used only for this project's own hosted build (it ships without
// VITE_* values). Any other deployment must supply its own connection values.
const hostedCloudUrl = "https://evvjturddlywfbcpwqsb.supabase.co";
const hostedCloudPublishableKey = "sb_publishable_8Q8Gnbc8cWybsBA7FaHJXg_WO814c2q";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Merge .env files with the shell so local .env values are honoured.
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL || hostedCloudUrl;
  const key =
    env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.SUPABASE_PUBLISHABLE_KEY ||
    hostedCloudPublishableKey;
  return {
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(url),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(key),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(key),
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add proper aliases for TipTap ProseMirror dependencies
      '@tiptap/pm/state': 'prosemirror-state',
      '@tiptap/pm/view': 'prosemirror-view',
      '@tiptap/pm/model': 'prosemirror-model',
      '@tiptap/pm/transform': 'prosemirror-transform',
      '@tiptap/pm/dropcursor': 'prosemirror-dropcursor',
      '@tiptap/pm/gapcursor': 'prosemirror-gapcursor',
      '@tiptap/pm/commands': 'prosemirror-commands',
      '@tiptap/pm/history': 'prosemirror-history',
      '@tiptap/pm/inputrules': 'prosemirror-inputrules',
      '@tiptap/pm/keymap': 'prosemirror-keymap',
      '@tiptap/pm/schema-list': 'prosemirror-schema-list',
      '@tiptap/pm/schema-basic': 'prosemirror-schema-basic'
    },
  },
  build: {
    rollupOptions: {
      // We explicitly externalize the prosemirror packages to avoid bundling issues
      external: [
        // No externals needed since we're using aliases
      ]
    }
  },
  optimizeDeps: {
    include: [
      '@tiptap/core',
      '@tiptap/starter-kit',
      '@tiptap/extension-dropcursor',
      'prosemirror-state',
      'prosemirror-view',
      'prosemirror-model',
      'prosemirror-transform',
      'prosemirror-dropcursor',
      'prosemirror-gapcursor',
      'prosemirror-commands',
      'prosemirror-history',
      'prosemirror-inputrules',
      'prosemirror-keymap',
      'prosemirror-schema-list',
      'prosemirror-schema-basic'
    ]
  },
  // Ensure the app works with any base path by setting this to '/'
  base: '/',
};
});
