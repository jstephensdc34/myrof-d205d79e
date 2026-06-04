
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
}));
