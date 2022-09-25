import {
  URL,
  fileURLToPath,
} from 'node:url'

import {
  defineConfig,
  LibraryFormats,
} from 'vite'

const packageName = process.env.npm_package_name
const packageVersion = JSON.stringify(process.env.npm_package_version)

const external = [
  'lib0'
]
const globals = {}
const emptyOutDir = true
const formats: LibraryFormats[] = [ 'es' ]

export default defineConfig(({ mode }) => {
  const watch = 'watch' === mode ? {
    include: [
      'src/**/*'
    ],
  }: undefined

  return {
    define: {
      '__PACKAGE_NAME__': packageVersion,
      '__PACKAGE_VERSION__': packageVersion,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      emptyOutDir,
      lib: {
        name: packageName,
        entry: 'src/index.ts',
        formats,
        fileName: 'lib.es',
      },
      rollupOptions: {
        external,
        output: {
          globals,
        },
      },
      watch,
    },
  }
})