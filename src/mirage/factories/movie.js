import { Factory } from "miragejs";
import faker from "faker";

export default Factory.extend({
  poster: faker.image.abstract,
  title() {
    const movies = ["Joker", "Naruto", "Demon Slayer"];

    return faker.random.arrayElement(movies);
  },
  release: 2019,
  synopsis: faker.lorem.paragraph,
});
