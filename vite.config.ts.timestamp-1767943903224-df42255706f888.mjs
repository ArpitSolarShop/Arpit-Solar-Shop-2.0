// vite.config.ts
import { defineConfig } from "file:///C:/Users/arpit/OneDrive/Desktop/Arpit%20Solar%20Shop%20Web%20App/Arpit-Solar-Shop/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/arpit/OneDrive/Desktop/Arpit%20Solar%20Shop%20Web%20App/Arpit-Solar-Shop/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/arpit/OneDrive/Desktop/Arpit%20Solar%20Shop%20Web%20App/Arpit-Solar-Shop/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\arpit\\OneDrive\\Desktop\\Arpit Solar Shop Web App\\Arpit-Solar-Shop";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  // ✅ ADDED: tells Vite to build into "dist" for Vercel
  build: {
    outDir: "dist"
  },
  // ✅ ADDED: ensures correct path resolution on Vercel
  base: "/",
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhcnBpdFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXEFycGl0IFNvbGFyIFNob3AgV2ViIEFwcFxcXFxBcnBpdC1Tb2xhci1TaG9wXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhcnBpdFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXEFycGl0IFNvbGFyIFNob3AgV2ViIEFwcFxcXFxBcnBpdC1Tb2xhci1TaG9wXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hcnBpdC9PbmVEcml2ZS9EZXNrdG9wL0FycGl0JTIwU29sYXIlMjBTaG9wJTIwV2ViJTIwQXBwL0FycGl0LVNvbGFyLVNob3Avdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjo6XCIsXHJcbiAgICBwb3J0OiA4MDgwLFxyXG4gIH0sXHJcblxyXG4gLy8gXHUyNzA1IEFEREVEOiB0ZWxscyBWaXRlIHRvIGJ1aWxkIGludG8gXCJkaXN0XCIgZm9yIFZlcmNlbFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6IFwiZGlzdFwiXHJcbiAgfSxcclxuXHJcbiAgLy8gXHUyNzA1IEFEREVEOiBlbnN1cmVzIGNvcnJlY3QgcGF0aCByZXNvbHV0aW9uIG9uIFZlcmNlbFxyXG4gIGJhc2U6IFwiL1wiLFxyXG5cclxuICBcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJlxyXG4gICAgY29tcG9uZW50VGFnZ2VyKCksXHJcbiAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtYSxTQUFTLG9CQUFvQjtBQUNoYyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQTtBQUFBLEVBR0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLEVBQ1Y7QUFBQTtBQUFBLEVBR0EsTUFBTTtBQUFBLEVBR04sU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFDVCxnQkFBZ0I7QUFBQSxFQUNsQixFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
