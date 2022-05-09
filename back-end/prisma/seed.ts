import { prisma } from "../src/database.js";

async function main() {
  await prisma.recommendation.createMany({
    data: [
      {
        name: "Shakira - Hips Don't Lie",
        youtubeLink: "https://www.youtube.com/watch?v=DUT5rEU6pqM",
        score: 160,
      },
      {
        name: "Linkin Park - Numb",
        youtubeLink: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
        score: 90,
      },
      {
        name: "Olivia Rpdrigo - Traitor",
        youtubeLink: "https://www.youtube.com/watch?v=CRrf3h9vhp8",
        score: 0,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
