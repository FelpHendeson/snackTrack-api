import DatabaseSeeder from './seeder';

async function main() {
    if (process.argv.length > 2) {
        await import('./cli');
        return;
    }

    DatabaseSeeder.run()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

void main();
