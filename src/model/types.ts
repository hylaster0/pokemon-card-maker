export enum CardType {
  Trainer = 'trainer',
  Pokemon = 'pokemon',
  Energy = 'energy',
}

enum Series {
  SunMoon = "Sun & Moon",
  SwordShield = "Sword & Shield"
}

type Card = CardBase & (PokemonCard | TrainerCard | EnergyCard);

interface CardBase {
  // could also be declared as `interface` instead of `type` but there arent any differences that you would actually care about
  name: string;
  image: string;
  // ...anything else that *all* cards have goes here
};

export enum PokemonType {
  Colorless = "colorless",
  Darkness = "darkness",
  Dragon = "dragon",
  Fairy = "fairy", // only XY and SunMoon
  Fighting = "fighting",
  Fire = "fire",
  Grass = "grass",
  Lightning = "lightning",
  Metal = "metal",
  Psychic = "psychic",
  Water = "water",
}

interface Attack {
  damage?: number;
  effectText?: string;
  damageSign?: string;
  name: string;
  cost: PokemonType[];
}

export interface Ability {
  name: string;
  text: string;
}

interface PokemonCardBase extends CardBase {
  cardType: CardType.Pokemon; // This is the discriminator.
  series: Series;
  pokemonType: PokemonType
  hp: number;
  weakness: string;
  resistance: string;
  retreatcost: number;
  ability?: Ability;
  attacks: Attack[];
  // anything that all pokemon cards have
}

export interface SunMoonPokemonCard extends PokemonCardBase {
  series: Series.SunMoon;
  gx: boolean; //
  tagteamgx: boolean;
  prismStar: boolean;
  ultraBeast: boolean;
  // anything specific to sun/moon cards
}

interface SwordShieldPokemonCard {

}

export type PokemonCard = SunMoonPokemonCard | SwordShieldPokemonCard;


interface TrainerCard {
  effect: string;
  cardType: CardType.Trainer
  trainerType: "Item" | "Tool" | "Stadium" | "Supporter";

}

export interface SunMoonTrainerCard extends TrainerCard {
  prismStar: boolean;

}

interface EnergyCard {
  cardType: CardType.Energy
  energyType: PokemonType
  effect: string;
}

export interface SunMoonEnergyCard extends EnergyCard {
  prismStar: boolean
}
// etc... go as many levels deep as possible
