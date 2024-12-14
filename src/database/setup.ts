import { initializeSchema } from './schema';
import { seedDatabase } from './seed';

async function setupDatabase() {
  try {
    await initializeSchema();
    await seedDatabase();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();