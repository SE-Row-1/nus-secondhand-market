// Insert seed data into 'wishlist' collection
db.wishlist.insertMany([
  {
    _id: ObjectId("670f7703ad0e321f3552e02c"),
    _class: "edu.nus.market.pojo.SingleLike",
    itemId: "581cd614-27a1-4716-889d-e9a22fc27f07",
    name: "iPhone 12",
    photoUrls: ["https://example.com/iphone12.jpg"],
    price: 999.99,
    seller: {
      _id: "110",
      nickname: "Johnny",
      avatarUrl: "https://example.com/avatar.png"
    },
    status: 1,
    type: "single",
    userId: 110,
    wantedAt: ISODate("2024-10-16T08:19:15.624Z")
  },
  {
    _id: ObjectId("670f7706ad0e321f3552e02d"),
    _class: "edu.nus.market.pojo.PackLike",
    itemId: "681cd614-27a1-4716-889d-e9a22fc27f07",
    name: "Apple Device Bundle",
    price: 1999.99,
    seller: {
      _id: "seller001",
      nickname: "John's Store",
      avatarUrl: "http://example.com/avatar.jpg"
    },
    status: 1,
    type: "pack",
    userId: 110,
    wantedAt: ISODate("2024-10-16T08:19:18.582Z"),
    discount: 10
  },
  {
    _id: ObjectId("670f7707ad0e321f3552e02e"),
    _class: "edu.nus.market.pojo.SingleLike",
    itemId: "981cd614-27a1-4716-889d-e9a22fc27f07",
    name: "Samsung Galaxy S21",
    photoUrls: ["https://example.com/galaxys21.jpg"],
    price: 799.99,
    seller: {
      _id: "seller002",
      nickname: "Galaxy Shop",
      avatarUrl: "https://example.com/galaxyshop.jpg"
    },
    status: 1,
    type: "single",
    userId: 111,
    wantedAt: ISODate("2024-10-17T10:30:45.120Z")
  },
  {
    _id: ObjectId("670f7708ad0e321f3552e02f"),
    _class: "edu.nus.market.pojo.PackLike",
    itemId: "781cd614-27a1-4716-889d-e9a22fc27f07",
    name: "Smart Home Bundle",
    price: 499.99,
    seller: {
      _id: "seller003",
      nickname: "Smart Home Store",
      avatarUrl: "https://example.com/smarthome.jpg"
    },
    status: 1,
    type: "pack",
    userId: 111,
    wantedAt: ISODate("2024-10-17T11:45:32.524Z"),
    discount: 15
  },
  {
    _id: ObjectId("670f7709ad0e321f3552e030"),
    _class: "edu.nus.market.pojo.SingleLike",
    itemId: "881cd614-27a1-4716-889d-e9a22fc27f07",
    name: "PlayStation 5",
    photoUrls: ["https://example.com/ps5.jpg"],
    price: 499.99,
    seller: {
      _id: "seller004",
      nickname: "Game World",
      avatarUrl: "https://example.com/gameworld.jpg"
    },
    status: 1,
    type: "single",
    userId: 112,
    wantedAt: ISODate("2024-10-18T09:25:18.743Z")
  },
  {
    _id: ObjectId("670f7710ad0e321f3552e031"),
    _class: "edu.nus.market.pojo.PackLike",
    itemId: "881cd614-27a1-4716-889d-e9a22fc27f07",
    name: "Gamer Bundle",
    price: 1499.99,
    seller: {
      _id: "seller005",
      nickname: "Gamer's Paradise",
      avatarUrl: "https://example.com/gamersparadise.jpg"
    },
    status: 1,
    type: "pack",
    userId: 113,
    wantedAt: ISODate("2024-10-18T12:15:47.982Z"),
    discount: 20
  }
]);
