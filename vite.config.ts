import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { generateScopedName } from './scripts/generateScopedName'

export default ({ mode }: UserConfig) => {
    return defineConfig({
        plugins: [
            react()
        ],
        define: {
            'process.env.NODE_ENV': `"${mode as string}"`
        },
        css: {
            modules: {
                generateScopedName,
                localsConvention: 'camelCase'
            },
            preprocessorOptions: {
                less: {
                    math: 'always'
                }
            }
        },
        resolve: {
            alias: [
                {
                    find: /^~/,
                    replacement: ''
                },
                { find: '@', replacement: path.resolve(__dirname, 'src') }
            ]
        },
        base: './',
        server: {
            port: 3050
        }
    })
}
