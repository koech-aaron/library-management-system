
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

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

  const genreIds = new Map(
    genres.map((genre) => [genre.name, genre.id])
  );

  // Add sixteen books
  const books = [
    { title: "Things Fall Apart", author: "Chinua Achebe", isbn: "9780385474542", genre: "Fiction", publishedYear: 1958 },
    { title: "The River Between", author: "Ngugi wa Thiong'o", isbn: "9780435905484", genre: "Fiction", publishedYear: 1965 },
    { title: "Half of a Yellow Sun", author: "Chimamanda Ngozi Adichie", isbn: "9780007200283", genre: "Fiction", publishedYear: 2006 },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", genre: "Fiction", publishedYear: 1925 },

    { title: "A Brief History of Time", author: "Stephen Hawking", isbn: "9780553380163", genre: "Science", publishedYear: 1988 },
    { title: "The Selfish Gene", author: "Richard Dawkins", isbn: "9780198788607", genre: "Science", publishedYear: 1976 },
    { title: "Cosmos", author: "Carl Sagan", isbn: "9780345539434", genre: "Science", publishedYear: 1980 },
    { title: "The Origin of Species", author: "Charles Darwin", isbn: "9781509827695", genre: "Science", publishedYear: 1859 },

    { title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", genre: "Technology", publishedYear: 2008 },
    { title: "The Pragmatic Programmer", author: "David Thomas", isbn: "9780135957059", genre: "Technology", publishedYear: 2019 },
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "9780262046305", genre: "Technology", publishedYear: 2022 },
    { title: "Design Patterns", author: "Erich Gamma", isbn: "9780201633610", genre: "Technology", publishedYear: 1994 },

    { title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780062316097", genre: "History", publishedYear: 2011 },
    { title: "The Art of War", author: "Sun Tzu", isbn: "9781590302255", genre: "History", publishedYear: -500 },
    { title: "Long Walk to Freedom", author: "Nelson Mandela", isbn: "9780316548182", genre: "History", publishedYear: 1994 },
    { title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "9780393354324", genre: "History", publishedYear: 1997 },
  ];

  for (const book of books) {
    const { genre, ...bookData } = book;
    const genreId = genreIds.get(genre)!;

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: { ...bookData, genreId },
      create: { ...bookData, genreId },
    });
  }

  console.log("Database seeded successfully!");
  console.log(`Genres added: ${genres.length}`);
  console.log(`Books processed: ${books.length}`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
