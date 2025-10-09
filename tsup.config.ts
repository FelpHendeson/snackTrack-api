import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
    // Entradas principais
    entry: [
        'src/server.ts',
        'src/app.ts',
        'src/scripts/gitlab-commit.ts', // Atualizado para refletir a nova localização
        'src/**/*.ts' // Garante que todos os arquivos da src sejam incluídos
    ],
    
    // Configurações de saída
    outDir: 'dist/src',
    format: ['cjs'], // CommonJS para melhor compatibilidade com Node.js
    clean: true, // Limpa o diretório de saída antes de cada build
    
    // Configurações de TypeScript
    target: 'es2020', // Mantendo consistência com seu tsconfig
    skipNodeModulesBundle: true,
    splitting: false,
    sourcemap: true,
    
    // Configurações de ambiente
    platform: 'node',
    noExternal: [
        'chalk' // Importante para seu sistema de logging
    ],

    // Configuração para manter a estrutura de pastas
    treeshake: true,
    dts: true, // Gera arquivos de declaração .d.ts
    
    // Configurações de watch mode
    watch: process.env.NODE_ENV === 'development',
    
    // onSuccess: 'node dist/src/server.js' // Atualizado para refletir a nova estrutura
});