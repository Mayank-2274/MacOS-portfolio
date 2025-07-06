// vite.config.ts
import { svelte } from "file:///C:/Users/Shahid/Desktop/Mayank/MacOS%20portfolio/macos-web/node_modules/.pnpm/@sveltejs+vite-plugin-svelt_b92b3976f4d2773ffc215e4270a365c1/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import UnpluginIcons from "file:///C:/Users/Shahid/Desktop/Mayank/MacOS%20portfolio/macos-web/node_modules/.pnpm/unplugin-icons@0.19.3/node_modules/unplugin-icons/dist/vite.js";
import { defineConfig } from "file:///C:/Users/Shahid/Desktop/Mayank/MacOS%20portfolio/macos-web/node_modules/.pnpm/vite@5.4.10_lightningcss@1.30.1_terser@5.43.1/node_modules/vite/dist/node/index.js";
import { imagetools } from "file:///C:/Users/Shahid/Desktop/Mayank/MacOS%20portfolio/macos-web/node_modules/.pnpm/vite-imagetools@7.1.0_rollup@2.79.2/node_modules/vite-imagetools/dist/index.js";
import { VitePWA } from "file:///C:/Users/Shahid/Desktop/Mayank/MacOS%20portfolio/macos-web/node_modules/.pnpm/vite-plugin-pwa@0.20.5_vite_0ff38dd58ab5fa590ae9e95e1d213c59/node_modules/vite-plugin-pwa/dist/index.js";
import { browserslistToTargets } from "file:///C:/Users/Shahid/Desktop/Mayank/MacOS%20portfolio/macos-web/node_modules/.pnpm/lightningcss@1.30.1/node_modules/lightningcss/node/index.mjs";
import browserslist from "file:///C:/Users/Shahid/Desktop/Mayank/MacOS%20portfolio/macos-web/node_modules/.pnpm/browserslist@4.25.1/node_modules/browserslist/index.js";
import path from "path";

// prefetch-plugin.ts
function prefetch() {
  return {
    name: "prefetch",
    enforce: "post",
    apply: "build",
    transformIndexHtml: (html, ctx) => {
      const tags = Object.keys(ctx.bundle).filter((v) => !v.toString().endsWith("webp")).map(
        (chunkName) => ({
          injectTo: "head",
          tag: "link",
          attrs: {
            rel: "prefetch",
            href: `/${chunkName}`
          }
        })
      );
      return {
        html,
        tags
      };
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "C:\\Users\\Shahid\\Desktop\\Mayank\\MacOS portfolio\\macos-web";
var vite_config_default = defineConfig({
  base: "/",
  plugins: [
    svelte(),
    prefetch(),
    UnpluginIcons({ autoInstall: true, compiler: "svelte" }),
    VitePWA({
      includeAssets: [
        "robots.txt",
        "app-icons/finder/32.png",
        "cover-image.png",
        "cursors/(normal|link|text|help)-select.svg",
        "**/*.mp3"
      ],
      manifest: {
        name: "Mac OS Monterey Svelte Web",
        short_name: "macOS Svelte",
        theme_color: "#ffffff",
        description: "Mac OS Monterey Web written in Svelte",
        icons: [
          {
            src: "app-icons/finder/128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "app-icons/finder/192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "app-icons/finder/256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "app-icons/finder/512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "app-icons/finder/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    }),
    imagetools({})
  ],
  resolve: {
    alias: {
      "\u{1F34E}": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    minify: "terser",
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks: {
          "calendar": ["./src/components/apps/Calendar/Calendar.svelte"],
          "calculator": ["./src/components/apps/Calculator/Calculator.svelte"],
          "vscode": ["./src/components/apps/VSCode/VSCode.svelte"],
          "wallpapers": ["./src/components/apps/WallpaperApp/WallpaperSelectorApp.svelte"],
          "profile": ["./src/components/apps/PurusProfile/PurusProfile.svelte"],
          "about-mac": ["./src/components/apps/AboutThisMac/AboutThisMac.svelte"],
          "appstore": ["./src/components/apps/AppStore/AppStore.svelte"]
        }
      }
    }
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: browserslistToTargets(browserslist("defaults, not IE 11, not IE_Mob 11, not dead"))
    }
  },
  optimizeDeps: {
    include: [
      "@neodrag/svelte",
      "popmotion",
      "date-fns"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicHJlZmV0Y2gtcGx1Z2luLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcU2hhaGlkXFxcXERlc2t0b3BcXFxcTWF5YW5rXFxcXE1hY09TIHBvcnRmb2xpb1xcXFxtYWNvcy13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFNoYWhpZFxcXFxEZXNrdG9wXFxcXE1heWFua1xcXFxNYWNPUyBwb3J0Zm9saW9cXFxcbWFjb3Mtd2ViXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9TaGFoaWQvRGVza3RvcC9NYXlhbmsvTWFjT1MlMjBwb3J0Zm9saW8vbWFjb3Mtd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSc7XHJcbmltcG9ydCBVbnBsdWdpbkljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHsgaW1hZ2V0b29scyB9IGZyb20gJ3ZpdGUtaW1hZ2V0b29scyc7XHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xyXG5pbXBvcnQgeyBicm93c2Vyc2xpc3RUb1RhcmdldHMgfSBmcm9tICdsaWdodG5pbmdjc3MnO1xyXG5pbXBvcnQgYnJvd3NlcnNsaXN0IGZyb20gJ2Jyb3dzZXJzbGlzdCc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuaW1wb3J0IHsgcHJlZmV0Y2ggfSBmcm9tICcuL3ByZWZldGNoLXBsdWdpbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG5cdGJhc2U6ICcvJyxcclxuXHRwbHVnaW5zOiBbXHJcblx0XHRzdmVsdGUoKSxcclxuXHRcdHByZWZldGNoKCksXHJcblxyXG5cdFx0VW5wbHVnaW5JY29ucyh7IGF1dG9JbnN0YWxsOiB0cnVlLCBjb21waWxlcjogJ3N2ZWx0ZScgfSksXHJcblx0XHRWaXRlUFdBKHtcclxuXHRcdFx0aW5jbHVkZUFzc2V0czogW1xyXG5cdFx0XHRcdCdyb2JvdHMudHh0JyxcclxuXHRcdFx0XHQnYXBwLWljb25zL2ZpbmRlci8zMi5wbmcnLFxyXG5cdFx0XHRcdCdjb3Zlci1pbWFnZS5wbmcnLFxyXG5cdFx0XHRcdCdjdXJzb3JzLyhub3JtYWx8bGlua3x0ZXh0fGhlbHApLXNlbGVjdC5zdmcnLFxyXG5cdFx0XHRcdCcqKi8qLm1wMycsXHJcblx0XHRcdF0sXHJcblx0XHRcdG1hbmlmZXN0OiB7XHJcblx0XHRcdFx0bmFtZTogJ01hYyBPUyBNb250ZXJleSBTdmVsdGUgV2ViJyxcclxuXHRcdFx0XHRzaG9ydF9uYW1lOiAnbWFjT1MgU3ZlbHRlJyxcclxuXHRcdFx0XHR0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxyXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiAnTWFjIE9TIE1vbnRlcmV5IFdlYiB3cml0dGVuIGluIFN2ZWx0ZScsXHJcblx0XHRcdFx0aWNvbnM6IFtcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c3JjOiAnYXBwLWljb25zL2ZpbmRlci8xMjgucG5nJyxcclxuXHRcdFx0XHRcdFx0c2l6ZXM6ICcxMjh4MTI4JyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ltYWdlL3BuZycsXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzcmM6ICdhcHAtaWNvbnMvZmluZGVyLzE5Mi5wbmcnLFxyXG5cdFx0XHRcdFx0XHRzaXplczogJzE5MngxOTInLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNyYzogJ2FwcC1pY29ucy9maW5kZXIvMjU2LnBuZycsXHJcblx0XHRcdFx0XHRcdHNpemVzOiAnMjU2eDI1NicsXHJcblx0XHRcdFx0XHRcdHR5cGU6ICdpbWFnZS9wbmcnLFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c3JjOiAnYXBwLWljb25zL2ZpbmRlci81MTIucG5nJyxcclxuXHRcdFx0XHRcdFx0c2l6ZXM6ICc1MTJ4NTEyJyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ2ltYWdlL3BuZycsXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzcmM6ICdhcHAtaWNvbnMvZmluZGVyLzUxMi5wbmcnLFxyXG5cdFx0XHRcdFx0XHRzaXplczogJzUxMng1MTInLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcclxuXHRcdFx0XHRcdFx0cHVycG9zZTogJ2FueSBtYXNrYWJsZScsXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdH0sXHJcblx0XHR9KSxcclxuXHRcdGltYWdldG9vbHMoe30pLFxyXG5cdF0sXHJcblx0cmVzb2x2ZToge1xyXG5cdFx0YWxpYXM6IHtcclxuXHRcdFx0J1x1RDgzQ1x1REY0RSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuXHRcdH0sXHJcblx0fSxcclxuXHRidWlsZDoge1xyXG5cdFx0bWluaWZ5OiAndGVyc2VyJyxcclxuXHRcdGNzc01pbmlmeTogJ2xpZ2h0bmluZ2NzcycsXHJcblx0XHRyb2xsdXBPcHRpb25zOiB7XHJcblx0XHRcdG91dHB1dDoge1xyXG5cdFx0XHRcdG1hbnVhbENodW5rczoge1xyXG5cdFx0XHRcdFx0J2NhbGVuZGFyJzogWycuL3NyYy9jb21wb25lbnRzL2FwcHMvQ2FsZW5kYXIvQ2FsZW5kYXIuc3ZlbHRlJ10sXHJcblx0XHRcdFx0XHQnY2FsY3VsYXRvcic6IFsnLi9zcmMvY29tcG9uZW50cy9hcHBzL0NhbGN1bGF0b3IvQ2FsY3VsYXRvci5zdmVsdGUnXSxcclxuXHRcdFx0XHRcdCd2c2NvZGUnOiBbJy4vc3JjL2NvbXBvbmVudHMvYXBwcy9WU0NvZGUvVlNDb2RlLnN2ZWx0ZSddLFxyXG5cdFx0XHRcdFx0J3dhbGxwYXBlcnMnOiBbJy4vc3JjL2NvbXBvbmVudHMvYXBwcy9XYWxscGFwZXJBcHAvV2FsbHBhcGVyU2VsZWN0b3JBcHAuc3ZlbHRlJ10sXHJcblx0XHRcdFx0XHQncHJvZmlsZSc6IFsnLi9zcmMvY29tcG9uZW50cy9hcHBzL1B1cnVzUHJvZmlsZS9QdXJ1c1Byb2ZpbGUuc3ZlbHRlJ10sXHJcblx0XHRcdFx0XHQnYWJvdXQtbWFjJzogWycuL3NyYy9jb21wb25lbnRzL2FwcHMvQWJvdXRUaGlzTWFjL0Fib3V0VGhpc01hYy5zdmVsdGUnXSxcclxuXHRcdFx0XHRcdCdhcHBzdG9yZSc6IFsnLi9zcmMvY29tcG9uZW50cy9hcHBzL0FwcFN0b3JlL0FwcFN0b3JlLnN2ZWx0ZSddLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHR9LFxyXG5cdH0sXHJcblx0Y3NzOiB7XHJcblx0XHR0cmFuc2Zvcm1lcjogJ2xpZ2h0bmluZ2NzcycsXHJcblx0XHRsaWdodG5pbmdjc3M6IHtcclxuXHRcdFx0dGFyZ2V0czogYnJvd3NlcnNsaXN0VG9UYXJnZXRzKGJyb3dzZXJzbGlzdCgnZGVmYXVsdHMsIG5vdCBJRSAxMSwgbm90IElFX01vYiAxMSwgbm90IGRlYWQnKSksXHJcblx0XHR9LFxyXG5cdH0sXHJcblx0b3B0aW1pemVEZXBzOiB7XHJcblx0XHRpbmNsdWRlOiBbXHJcblx0XHRcdCdAbmVvZHJhZy9zdmVsdGUnLFxyXG5cdFx0XHQncG9wbW90aW9uJyxcclxuXHRcdFx0J2RhdGUtZm5zJyxcclxuXHRcdF0sXHJcblx0fSxcclxufSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcU2hhaGlkXFxcXERlc2t0b3BcXFxcTWF5YW5rXFxcXE1hY09TIHBvcnRmb2xpb1xcXFxtYWNvcy13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFNoYWhpZFxcXFxEZXNrdG9wXFxcXE1heWFua1xcXFxNYWNPUyBwb3J0Zm9saW9cXFxcbWFjb3Mtd2ViXFxcXHByZWZldGNoLXBsdWdpbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvU2hhaGlkL0Rlc2t0b3AvTWF5YW5rL01hY09TJTIwcG9ydGZvbGlvL21hY29zLXdlYi9wcmVmZXRjaC1wbHVnaW4udHNcIjtpbXBvcnQgdHlwZSB7IEh0bWxUYWdEZXNjcmlwdG9yLCBQbHVnaW4gfSBmcm9tICd2aXRlJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcmVmZXRjaCgpOiBQbHVnaW4ge1xyXG5cdHJldHVybiB7XHJcblx0XHRuYW1lOiAncHJlZmV0Y2gnLFxyXG5cclxuXHRcdGVuZm9yY2U6ICdwb3N0JyxcclxuXHRcdGFwcGx5OiAnYnVpbGQnLFxyXG5cclxuXHRcdHRyYW5zZm9ybUluZGV4SHRtbDogKGh0bWwsIGN0eCkgPT4ge1xyXG5cdFx0XHRjb25zdCB0YWdzID0gT2JqZWN0LmtleXMoY3R4LmJ1bmRsZSlcclxuXHRcdFx0XHQuZmlsdGVyKCh2KSA9PiAhdi50b1N0cmluZygpLmVuZHNXaXRoKCd3ZWJwJykpXHJcblx0XHRcdFx0Lm1hcChcclxuXHRcdFx0XHRcdChjaHVua05hbWUpID0+XHJcblx0XHRcdFx0XHRcdCh7XHJcblx0XHRcdFx0XHRcdFx0aW5qZWN0VG86ICdoZWFkJyxcclxuXHRcdFx0XHRcdFx0XHR0YWc6ICdsaW5rJyxcclxuXHRcdFx0XHRcdFx0XHRhdHRyczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVsOiAncHJlZmV0Y2gnLFxyXG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogYC8ke2NodW5rTmFtZX1gLFxyXG5cdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdH0pIGFzIEh0bWxUYWdEZXNjcmlwdG9yLFxyXG5cdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGh0bWwsXHJcblx0XHRcdFx0dGFncyxcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblx0fTtcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBXLFNBQVMsY0FBYztBQUNqWSxPQUFPLG1CQUFtQjtBQUMxQixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLGVBQWU7QUFDeEIsU0FBUyw2QkFBNkI7QUFDdEMsT0FBTyxrQkFBa0I7QUFDekIsT0FBTyxVQUFVOzs7QUNMVixTQUFTLFdBQW1CO0FBQ2xDLFNBQU87QUFBQSxJQUNOLE1BQU07QUFBQSxJQUVOLFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUVQLG9CQUFvQixDQUFDLE1BQU0sUUFBUTtBQUNsQyxZQUFNLE9BQU8sT0FBTyxLQUFLLElBQUksTUFBTSxFQUNqQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsTUFBTSxDQUFDLEVBQzVDO0FBQUEsUUFDQSxDQUFDLGVBQ0M7QUFBQSxVQUNBLFVBQVU7QUFBQSxVQUNWLEtBQUs7QUFBQSxVQUNMLE9BQU87QUFBQSxZQUNOLEtBQUs7QUFBQSxZQUNMLE1BQU0sSUFBSSxTQUFTO0FBQUEsVUFDcEI7QUFBQSxRQUNEO0FBQUEsTUFDRjtBQUVELGFBQU87QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNEOzs7QUQ5QkEsSUFBTSxtQ0FBbUM7QUFXekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBRVQsY0FBYyxFQUFFLGFBQWEsTUFBTSxVQUFVLFNBQVMsQ0FBQztBQUFBLElBQ3ZELFFBQVE7QUFBQSxNQUNQLGVBQWU7QUFBQSxRQUNkO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Q7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNULE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNOO0FBQUEsWUFDQyxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNWO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFBQSxJQUNELENBQUM7QUFBQSxJQUNELFdBQVcsQ0FBQyxDQUFDO0FBQUEsRUFDZDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLE1BQ04sYUFBTSxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsRUFDRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ04sUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2QsUUFBUTtBQUFBLFFBQ1AsY0FBYztBQUFBLFVBQ2IsWUFBWSxDQUFDLGdEQUFnRDtBQUFBLFVBQzdELGNBQWMsQ0FBQyxvREFBb0Q7QUFBQSxVQUNuRSxVQUFVLENBQUMsNENBQTRDO0FBQUEsVUFDdkQsY0FBYyxDQUFDLGdFQUFnRTtBQUFBLFVBQy9FLFdBQVcsQ0FBQyx3REFBd0Q7QUFBQSxVQUNwRSxhQUFhLENBQUMsd0RBQXdEO0FBQUEsVUFDdEUsWUFBWSxDQUFDLGdEQUFnRDtBQUFBLFFBQzlEO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSixhQUFhO0FBQUEsSUFDYixjQUFjO0FBQUEsTUFDYixTQUFTLHNCQUFzQixhQUFhLDhDQUE4QyxDQUFDO0FBQUEsSUFDNUY7QUFBQSxFQUNEO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDYixTQUFTO0FBQUEsTUFDUjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
