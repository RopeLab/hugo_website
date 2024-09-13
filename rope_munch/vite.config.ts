import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from "fs";
import * as path from "node:path";


const result_dir = "./result"
const static_dir = "../static/rope_munch"
const short_codes_dir = '../layouts/shortcodes'
const index_files = fs.readdirSync("./").filter((elm: string) => elm.match(/.*\.(html?)/ig));;

let rollup_input = {}
index_files.forEach((file) => {
  let name = file.replace(/\.[^/.]+$/, "")
  // @ts-ignore
  rollup_input[name] = file
})

// https://vitejs.dev/config/
export default defineConfig({
  base: '/rope_munch/',
  plugins: [
    react(),
    {
      name: 'push_to_hugo',
      closeBundle: async () => {
        fs.rmSync(static_dir, { recursive: true, force: true });
        fs.mkdirSync(static_dir)
        fs.cpSync(result_dir, static_dir, { recursive: true });

        index_files.forEach((file) => {
          fs.rmSync(path.join(static_dir, file))
          fs.cpSync(path.join(result_dir, file), path.join(short_codes_dir, file));
        })
      }
    },
  ],
  build: {
    outDir: './result',
    rollupOptions: {
      input: rollup_input
    },
  },
})