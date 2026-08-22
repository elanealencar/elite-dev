import bcrypt from "bcryptjs";
import { prisma } from "../src/database/prisma.js";

async function main() {
  const passwordHash = await bcrypt.hash("Elite@123", 10);

  const organizer = await prisma.user.upsert({
    where: {
        email: "organizer@elite.dev",
    },
    update: {
        name: "Elite Organizer",
        passwordHash,
        role: "ORGANIZER",
    },
    create: {
        name: "Elite Organizer",
        email: "organizer@elite.dev",
        passwordHash,
        role: "ORGANIZER",
    },
    });

    await prisma.user.upsert({
    where: {
        email: "customer1@elite.dev",
    },
    update: {
        name: "Customer One",
        passwordHash,
        role: "CUSTOMER",
    },
    create: {
        name: "Customer One",
        email: "customer1@elite.dev",
        passwordHash,
        role: "CUSTOMER",
    },
    });

    await prisma.user.upsert({
    where: {
        email: "customer2@elite.dev",
    },
    update: {
        name: "Customer Two",
        passwordHash,
        role: "CUSTOMER",
    },
    create: {
        name: "Customer Two",
        email: "customer2@elite.dev",
        passwordHash,
        role: "CUSTOMER",
    },
    });

    await prisma.user.upsert({
    where: {
        email: "gate@elite.dev",
    },
    update: {
        name: "Elite Gate",
        passwordHash,
        role: "GATE",
    },
    create: {
        name: "Elite Gate",
        email: "gate@elite.dev",
        passwordHash,
        role: "GATE",
    },
    });

    const rows = ["A", "B", "C", "D", "E", "F"];

    const seats = rows.flatMap((row) =>
        Array.from({ length: 8 }, (_, index) => ({
            row,
            number: index + 1,
        }))
    );

    const existingEvent = await prisma.event.findFirst({
        where: {
            organizerId: organizer.id,
            tmdbMovieId: 157336,
            room: "Sala 1",
        },
    });

    if (!existingEvent) {
        const eventDate = new Date();

        eventDate.setDate(eventDate.getDate() + 30);

        const date = eventDate.toISOString().split("T")[0];

        const eventDateBrazil = new Date(
            `${date}T20:00:00-03:00`
        );

        await prisma.event.create({
            data: {
            tmdbMovieId: 157336,
            movieTitle: "Interestelar",
            moviePosterUrl:
                "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",

            dateTime: eventDateBrazil,

            location: "Cine Elite",
            room: "Sala 1",

            price: 40,
            capacity: 48,

            status: "PUBLISHED",

            organizerId: organizer.id,

            seats: {
                create: seats,
            },
            },
        });
    }
}

main()
  .then(async () => {
    console.log("✅ Database seeded successfully.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });