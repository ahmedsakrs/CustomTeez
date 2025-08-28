products = [
  {
    "_id": "t-shirts",
    "name": "T-shirts",
    "image": "/images/tshirts.jpg",
    "images": ["/images/tshirts.jpg", "/images/hoodies.jpg", "/images/vinyl.jpg"],
    "description":
      "Unisex tshirts with various colors and sizes ranging from 4T to 4XL",
    "material": "100% Cotton",
    "price": 25,
    'extra_price': 5,
    "countInStock": 10,
    "colors": {
      "Blue": {
        "name": "blue",
        "front": "path/to/img",
        "back": "path/to/img",
        "rgb": "rgb(0, 0, 255)",
        "sizes_count": { "S": 10, "M": 0, "L": 10 },
      },
      "Red": {
        "name": "red",
        "front": "path/to/img",
        "back": "path/to/img",
        "rgb": "rgb(255, 0, 0)",
        "sizes_count": { "S": 10, "M": 0, "L": 10 },
      },
    },
  },
]