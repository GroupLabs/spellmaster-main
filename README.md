This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## How to add games
1. Add your game in the /games folder. The game must be contained inside a Next.js component so it can be integrated with the website developed in Next.js. If the game code are self-contained and can be run on its own as single html file, you can copy&paste code into the line `const raw_html = (the HTML code here)` in **/games/example.tsx.template** file (you will need to rename the file to .tsx afterwards). To pass word list available in Next.js to the raw HTML, you also need to identify where the raw HTML code implements the word list and replace it with `${JSON.stringify(currentList)}`. E.g. in the script section of spelling.html, there is 
```
<script>
const allWords = [
    { word: "cats", sentence: "The two _____ chased the mouse.", ending: "s" },
    { word: "boxes", sentence: "We need more _____ to pack all these books.", ending: "es" },
    { word: "dogs", sentence: "The _____ barked loudly at the mailman.", ending: "s" },
    { word: "wishes", sentence: "Make three _____ when you blow out the candles.", ending: "es" },
    { word: "trees", sentence: "The forest has many tall _____.", ending: "s" },
    { word: "dishes", sentence: "Please wash the _____ after dinner.", ending: "es" },
    { word: "cars", sentence: "The parking lot is full of _____.", ending: "s" },
    { word: "buses", sentence: "The _____ are running late due to traffic.", ending: "es" },
    { word: "flowers", sentence: "The garden is full of colorful _____.", ending: "s" },
    { word: "glasses", sentence: "I need new _____ to see better.", ending: "es" },
    { word: "phones", sentence: "All the students have their _____ in their backpacks.", ending: "s" },
    { word: "kisses", sentence: "The mother gave her children good night _____.", ending: "es" },
    { word: "tables", sentence: "The restaurant has ten _____ available.", ending: "s" },
    { word: "torches", sentence: "The explorers lit their _____ to see in the dark cave.", ending: "es" },
    { word: "books", sentence: "The library has thousands of _____.", ending: "s" },
    { word: "beaches", sentence: "Hawaii has many beautiful _____.", ending: "es" },
    { word: "apples", sentence: "I bought a bag of red _____ at the store.", ending: "s" },
    { word: "watches", sentence: "The jeweler repaired three _____ today.", ending: "es" },
    { word: "birds", sentence: "The _____ are singing in the trees.", ending: "s" },
    { word: "lunches", sentence: "The children packed their own _____ for the field trip.", ending: "es" },
    { word: "keys", sentence: "I lost my car _____ and had to call for help.", ending: "s" },
    { word: "foxes", sentence: "The _____ are known for their cunning nature.", ending: "es" },
    { word: "toys", sentence: "The children put away their _____ after playtime.", ending: "s" },
    { word: "matches", sentence: "We need some _____ to light the campfire.", ending: "es" },
    { word: "pens", sentence: "I keep several _____ in my desk drawer.", ending: "s" }
];
...
<script>
```
Replace it with 
```
<script>
const allWords = ${JSON.stringify(currentList)};
...
<script>
```

2. Register the game in /lib/games.ts. You need to first import the Next.js component from /games folder first, and then register it at end of the file. E.g.
```
import YourGame from "@/games/YourGame";
(...other code)
registerGame(
    {
        id: "an_identifier_for_your_game",
        name: "A display name for your game",
        description: "A short description for your game",
        image: "url to a thumbnail for your game"
    },
    YourGame
)
```

Now you should be able to see your game in the game selector.