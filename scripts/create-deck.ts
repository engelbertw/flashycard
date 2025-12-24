import 'dotenv/config';
import { createDeck, createCards } from '@/db/queries/decks';

const dutchCities = [
  { dutch: 'Amsterdam', english: 'Amsterdam' },
  { dutch: 'Rotterdam', english: 'Rotterdam' },
  { dutch: 'Den Haag', english: 'The Hague' },
  { dutch: 's-Gravenhage', english: 'The Hague' },
  { dutch: 'Utrecht', english: 'Utrecht' },
  { dutch: 'Eindhoven', english: 'Eindhoven' },
  { dutch: 'Groningen', english: 'Groningen' },
  { dutch: 'Tilburg', english: 'Tilburg' },
  { dutch: 'Almere', english: 'Almere' },
  { dutch: 'Breda', english: 'Breda' },
  { dutch: 'Nijmegen', english: 'Nijmegen' },
  { dutch: 'Enschede', english: 'Enschede' },
  { dutch: 'Apeldoorn', english: 'Apeldoorn' },
  { dutch: 'Haarlem', english: 'Haarlem' },
  { dutch: 'Arnhem', english: 'Arnhem' },
  { dutch: 'Zaanstad', english: 'Zaanstad' },
  { dutch: 'Amersfoort', english: 'Amersfoort' },
  { dutch: 'Hoofddorp', english: 'Hoofddorp' },
  { dutch: 'Maastricht', english: 'Maastricht' },
  { dutch: 'Leiden', english: 'Leiden' },
  { dutch: 'Dordrecht', english: 'Dordrecht' },
  { dutch: 'Zoetermeer', english: 'Zoetermeer' },
  { dutch: 'Zwolle', english: 'Zwolle' },
  { dutch: 'Deventer', english: 'Deventer' },
  { dutch: 'Delft', english: 'Delft' },
];

async function main() {
  const userId = 'user_37DaGc1kJYnJLVbtzHPXIlbW9RY';
  const deckName = 'Cities of the Netherlands';
  const deckDescription = 'Learn about major cities in the Netherlands';

  try {
    // Create the deck
    const newDeck = await createDeck(userId, deckName, deckDescription);
    console.log('✅ Deck created successfully:');
    console.log(`   ID: ${newDeck.id}`);
    console.log(`   Name: ${newDeck.name}`);
    console.log(`   Description: ${newDeck.description}`);

    // Add cards for each city
    console.log('\n📝 Creating cards...');
    const cardsData = dutchCities.map(city => ({
      front: city.dutch,
      back: city.english,
    }));

    const insertedCards = await createCards(newDeck.id, cardsData);

    console.log(`✅ Created ${insertedCards.length} cards:`);
    insertedCards.forEach(card => {
      console.log(`   ${card.front} → ${card.back}`);
    });
  } catch (error) {
    console.error('❌ Error creating deck:', error);
    process.exit(1);
  }
}

main();

