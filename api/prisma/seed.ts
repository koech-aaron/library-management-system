
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// Connect Prisma to PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create four genres
  const genreNames = [
    "Fiction",
    "Science",
    "Technology",
    "History",
  ];

  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // Map genre names to their database IDs
  const genreIds = new Map(
    genres.map((genre) => [genre.name, genre.id])
  );

  // Create sixteen books
  const books = [
    {
      title: "Things Fall Apart",
      author: "Chinua Achebe",
      isbn: "9780385474542",
      publishedYear: 1958,
      genre: "Fiction",
    },
    {
      title: "The River Between",
      author: "Ngugi wa Thiong'o",
      isbn: "9780435905484",
      publishedYear: 1965,
      genre: "Fiction",
    },
    {
      title: "Animal Farm",
      author: "George Orwell",
      isbn: "9780451526342",
      publishedYear: 1945,
      genre: "Fiction",
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      publishedYear: 1925,
      genre: "Fiction",
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "9780553380163",
      publishedYear: 1988,
      genre: "Science",
    },
    {
      title: "The Selfish Gene",
      author: "Richard Dawkins",
      isbn: "9780198788607",
      publishedYear: 1976,
      genre: "Science",
    },
    {
      title: "Cosmos",
      author: "Carl Sagan",
      isbn: "9780345539434",
      publishedYear: 1980,
      genre: "Science",
    },
    {
      title: "The Origin of Species",
      author: "Charles Darwin",
      isbn: "9780451529060",
      publishedYear: 1859,
      genre: "Science",
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      publishedYear: 2008,
      genre: "Technology",
    },
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt and David Thomas",
      isbn: "9780135957059",
      publishedYear: 1999,
      genre: "Technology",
    },
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      isbn: "9780262046305",
      publishedYear: 2022,
      genre: "Technology",
    },
    {
      title: "Design Patterns",
      author: "Erich Gamma",
      isbn: "9780201633610",
      publishedYear: 1994,
      genre: "Technology",
    },
    {
      title: "The Art of War",
      author: "Sun Tzu",
      isbn: "9781590302255",
      publishedYear: -500,
      genre: "History",
    },
    {
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      isbn: "9780553296983",
      publishedYear: 1947,
      genre: "History",
    },
    {
      title: "Long Walk to Freedom",
      author: "Nelson Mandela",
      isbn: "9780316548182",
      publishedYear: 1994,
      genre: "History",
    },
    {
      title: "The Guns of August",
      author: "Barbara W. Tuchman",
      isbn: "9780345476098",
      publishedYear: 1962,
      genre: "History",
    },
  ];

  // Insert or update books without creating duplicates
  for (const book of books) {
    const genreId = genreIds.get(book.genre);

    if (!genreId) {
      throw new Error(`Genre not found: ${book.genre}`);
    }

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        author: book.author,
        publishedYear: book.publishedYear,
        genreId,
      },
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        genreId,
      },
    });
  }

  console.log("Database seeded successfully!");
  console.log(`Genres added: ${genres.length}`);
  console.log(`Books processed: ${books.length}`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
