import Chance from 'chance';
const chance = new Chance();

export const specificFieldGenerator = (fieldName: string): any | undefined => {
  switch (fieldName) {
    case "name" || "username":
      return chance.name();
    case "gender":
      return chance.gender();
    case "age":
      return chance.age();
    case "animal":
      return chance.animal({ type: "zoo" });
    case "color":
      return chance.color({ format: "hex" });
    case "company":
      return chance.company();
    case "domain":
      return chance.domain();
    case "email":
      return chance.email();
    case "ip":
      return chance.ip();
    case "profession":
      return chance.profession();
    case "twitter":
      return chance.twitter();
    case "url":
      return chance.url();
    case "address":
      return chance.address();
    case "altitude":
      return chance.altitude();
    case "areacode":
      return chance.areacode();
    case "city":
      return chance.city();
    case "coordinates":
      return chance.coordinates();
    case "country":
      return chance.country({ full: true });
    case "depth":
      return chance.depth();
    case "latitude":
      return chance.latitude();
    case "longitude":
      return chance.longitude();
    case "phone":
      return chance.phone({ formatted: false });
    case "postal":
      return chance.postal();
    case "postcode":
      return chance.postcode();
    case "province":
      return chance.province({ full: true });
    case "state":
      return chance.state({ full: true });
    case "street":
      return chance.street();
    case "date":
      return chance.date({ string: true, american: false });
    case "day":
      return chance.weekday({});
    case "currency":
      return chance.currency().code;
    case "birthday":
      return chance.birthday({ string: true });
    default:
      return undefined;
  }
};
