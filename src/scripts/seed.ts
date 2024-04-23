const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: 'Finanças' },
                { name: 'Tecnologia' },
                { name: 'Ciência da Computação' },
                { name: 'Engenharia' },
                { name: 'Música' },
            ]
        })
        console.log('Seeding completed');
    } catch (error) {
        console.log('Error while seeding', error);
    } finally {
        await database.$disconnect();
    }
}

main()