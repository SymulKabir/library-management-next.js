
## Getting Started
make Sure you have installed NodeJS `v21.7.3`


### Run MySQL useing docker
```
docker run -d \
  --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=12345 \
  -e MYSQL_DATABASE=library_management \
  -e MYSQL_USER=book_hive \
  -e MYSQL_PASSWORD=12345 \
  -p 3306:3306 \
  mysql:8
```

### Installation and Run
```
npm install
```
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

### Initialize Database (if not initialize before)
```
node init_db.js
```

### Insert some books (if required some dome book)
```
node insert_books.js 
```